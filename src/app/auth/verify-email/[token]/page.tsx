// src/app/auth/verify-email/[token]/page.tsx

import { Suspense } from "react";
import VerifyEmailClient from "./client-component";

// Eliminamos la definición manual de PageProps y usamos los tipos generados por Next.js
interface Params {
  token: string;
}

export default function VerifyEmailPage({ params }: { params: Params }) {
  const { token } = params;
  
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <VerifyEmailClient token={token} />
    </Suspense>
  );
}
