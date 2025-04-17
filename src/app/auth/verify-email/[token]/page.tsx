import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function VerifyEmailPage({ params }: { params: { token: string } }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email/${params.token}`, {
      method: "GET",
    });

    if (res.ok) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Correo Verificado</CardTitle>
              <CardDescription>Tu correo electrónico ha sido verificado exitosamente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p>Redirigiéndote al login...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      throw new Error("Token inválido");
    }
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error de Verificación</CardTitle>
            <CardDescription>No se pudo verificar tu correo electrónico.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login">
              <Button className="w-full">Volver al inicio de sesión</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
}
