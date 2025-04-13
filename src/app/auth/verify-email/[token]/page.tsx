// version1
// author Yxff
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function VerifyEmail({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verificando tu correo electrónico...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email/${params.token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("¡Correo electrónico verificado exitosamente!");
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Error al verificar el correo electrónico");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Error al verificar el correo electrónico");
      }
    };

    verifyEmail();
  }, [params.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="ETIAPC Logo"
              width={150}
              height={150}
              className="h-12 w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verificación de Correo Electrónico
          </h2>
        </div>
        <div className="mt-8">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="text-center">
              {status === "loading" && (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              {status === "success" && (
                <div className="text-green-600">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {status === "error" && (
                <div className="text-red-600">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
              <p className="mt-2 text-sm text-gray-600">{message}</p>
              {status === "success" && (
                <p className="mt-2 text-sm text-gray-600">
                  Serás redirigido al inicio de sesión en unos segundos...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 