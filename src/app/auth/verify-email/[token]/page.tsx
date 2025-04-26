// src/app/auth/verify-email/[token]/page.tsx
import { Suspense } from "react";
import VerifyEmailClient from "./client-component";

interface PageProps {
  params: {
    token: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function VerifyEmailPage({ params }: PageProps) {
  const { token } = params;
  
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <VerifyEmailClient token={token} />
    </Suspense>
  );
}
