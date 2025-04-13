// version1
// author Yxff
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

const MAX_LOGIN_ATTEMPTS = 10;
const LOCK_TIME = 30 * 60 * 1000; // 30 minutos en milisegundos

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember", type: "checkbox" },
      },
      async authorize(credentials) {
        try {
          await connectDB();
          const userFound = await User.findOne({
            email: credentials?.email,
          }).select("+password");

          if (!userFound) throw new Error("Credenciales incorrectas");

          // Verificar si la cuenta está bloqueada
          if (userFound.lockUntil && userFound.lockUntil > Date.now()) {
            const remainingTime = Math.ceil((userFound.lockUntil.getTime() - Date.now()) / 1000 / 60);
            throw new Error(`Tu cuenta está bloqueada. Intenta nuevamente en ${remainingTime} minutos.`);
          }

          const passwordMatch = await bcrypt.compare(
            credentials!.password,
            userFound.password
          );

          if (!passwordMatch) {
            // Incrementar intentos fallidos
            userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

            // Si excede el máximo de intentos, bloquear la cuenta
            if (userFound.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
              userFound.lockUntil = new Date(Date.now() + LOCK_TIME);
            }

            await userFound.save();
            throw new Error("Credenciales incorrectas");
          }

          // Resetear intentos fallidos si el login es exitoso
          if (userFound.loginAttempts > 0 || userFound.lockUntil) {
            userFound.loginAttempts = 0;
            userFound.lockUntil = null;
            await userFound.save();
          }

          return {
            id: userFound._id.toString(),
            email: userFound.email,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            role: userFound.role,
            image: userFound.image,
            authProvider: userFound.authProvider,
          };
        } catch (error: any) {
          throw new Error(error.message || "Error en la autenticación");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Dividir el nombre completo en firstName y lastName
            const [firstName = "", ...lastNameParts] = (user.name || "").split(" ");
            const lastName = lastNameParts.join(" ");

            const newUser = await User.create({
              email: user.email,
              firstName,
              lastName,
              role: "teacher",
              password: await bcrypt.hash(Math.random().toString(36), 10),
              authProvider: "google",
              image: user.image,
              isEmailVerified: true, // Marcar como verificado automáticamente para usuarios de Google
            });

            user.role = newUser.role;
            user.firstName = newUser.firstName;
            user.lastName = newUser.lastName;
            user.authProvider = newUser.authProvider;
            user.isEmailVerified = true;
          } else {
            user.role = existingUser.role;
            user.firstName = existingUser.firstName;
            user.lastName = existingUser.lastName;
            user.authProvider = existingUser.authProvider;
            user.isEmailVerified = existingUser.isEmailVerified;
            
            // Actualizar la imagen de perfil si es un usuario de Google
            if (user.image && existingUser.authProvider === "google") {
              await User.findByIdAndUpdate(existingUser._id, {
                image: user.image
              });
            }
            user.image = existingUser.image || user.image;
          }
        } catch (error) {
          console.error("Error en signIn:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.image = user.image;
        token.authProvider = user.authProvider;
        token.isEmailVerified = user.isEmailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "teacher" | "coordinator" | "administrator";
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.image = token.image as string | null;
        session.user.authProvider = token.authProvider as "credentials" | "google";
        session.user.isEmailVerified = token.isEmailVerified as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };