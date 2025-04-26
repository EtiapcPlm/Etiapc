import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  params: {
    token: string;
  };
}

async function verifyEmail(token: string) {
  const response = await fetch(`/api/auth/verify-email/${token}`);
  const data = await response.json();
  return { success: response.ok, message: data.message || data.error };
}

export default async function VerifyEmailPage({ params }: PageProps) {
  const result = await verifyEmail(params.token);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {result.success ? "Correo Verificado" : "Error de Verificación"}
          </CardTitle>
          <CardDescription>
            {result.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <Link href="/auth/login">
                <Button className="w-full">
                  {result.success ? "Ir al inicio de sesión" : "Volver al inicio de sesión"}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 

