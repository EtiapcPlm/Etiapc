// version1
// author Yxff
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

type UserRole = 'teacher' | 'coordinator' | 'administrator';

export const authOptions: NextAuthOptions = {
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
          throw new Error("Credenciales inválidas");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        console.log('Usuario encontrado:', user);

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Crear nuevo usuario con rol por defecto y datos de Google
          const newUser = await User.create({
            email: user.email,
            firstName: user.name?.split(' ')[0] || '',
            lastName: user.name?.split(' ').slice(1).join(' ') || '',
            role: "teacher",
            authProvider: "google",
            image: user.image,
          });
          user.role = newUser.role;
          user.image = newUser.image;
        } else {
          user.role = existingUser.role;
          // Actualizar la imagen de perfil si el usuario ya existe
          if (user.image && existingUser.authProvider === "google") {
            await User.findByIdAndUpdate(existingUser._id, {
              image: user.image
            });
          }
          user.image = existingUser.image || user.image;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        console.log('Token con datos:', token);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        console.log('Session con datos:', session);
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
}; 