"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/lib/theme-provider";

// version1
// author Yxff

interface Props {
  children: React.ReactNode;
}

function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange={true}
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

export default Providers;
