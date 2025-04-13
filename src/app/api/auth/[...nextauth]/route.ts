// version1
// author Yxff
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { compare } from "bcryptjs";

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
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role
        };
      }
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
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.image = token.image;
        session.user.authProvider = token.authProvider;
        session.user.isEmailVerified = token.isEmailVerified;
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