// version1
// author Yxff
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session, DefaultSession } from "next-auth";

type UserRole = "teacher" | "coordinator" | "administrator";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  }
}

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
          throw new Error("Invalid credentials");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role as UserRole
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
              isEmailVerified: true,
            });

            user.role = newUser.role as UserRole;
            user.firstName = newUser.firstName;
            user.lastName = newUser.lastName;
            user.authProvider = newUser.authProvider;
            user.isEmailVerified = true;
          } else {
            user.role = existingUser.role as UserRole;
            user.firstName = existingUser.firstName;
            user.lastName = existingUser.lastName;
            user.authProvider = existingUser.authProvider;
            user.isEmailVerified = existingUser.isEmailVerified;
            
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
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            email: token.email as string,
            name: token.name as string,
            role: token.role as UserRole
          }
        };
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
