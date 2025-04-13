// version1
// author Yxff
import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string | null;
    role: 'teacher' | 'coordinator' | 'administrator';
    authProvider?: 'credentials' | 'google';
    isEmailVerified?: boolean;
  }

  interface Session {
    user: {
      id?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      image?: string | null;
      role: 'teacher' | 'coordinator' | 'administrator';
      authProvider?: 'credentials' | 'google';
      isEmailVerified?: boolean;
    }
  }
} 