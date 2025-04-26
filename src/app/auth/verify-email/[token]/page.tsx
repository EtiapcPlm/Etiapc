"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

interface PageProps {
  params: {
    token: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function VerifyEmailPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.post(`/api/auth/verify-email/${params.token}`);
        setVerified(true);
        setTimeout(() => {
          router.push("/auth/login?message=Email verified successfully");
        }, 3000);
      } catch (err) {
        console.error("Email verification failed:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [params.token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <p>Verificando correo electrónico...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {verified ? "Correo Verificado" : "Error de Verificación"}
          </CardTitle>
          <CardDescription>
            {verified
              ? "Tu correo electrónico ha sido verificado exitosamente."
              : "No se pudo verificar tu correo electrónico."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              {verified ? (
                <p>Serás redirigido al inicio de sesión...</p>
              ) : (
                <Link href="/auth/login">
                  <Button className="w-full">Volver al inicio de sesión</Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 

