// version1
// author Yxff
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.5 } },
};

function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Token inválido o expirado");
        return;
      }

      try {
        await axios.get(`/api/auth/validate-reset-token?token=${token}`);
        setValidToken(true);
      } catch (error) {
        setError("Token inválido o expirado");
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData(event.currentTarget);
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        setLoading(false);
        return;
      }

      await axios.post("/api/auth/reset-password", {
        token,
        password,
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || 
          "Ocurrió un error al restablecer la contraseña"
        );
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Token inválido o expirado
          </h1>
          <p className="text-sm text-muted-foreground">
            El enlace de recuperación de contraseña no es válido o ha expirado.
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            Solicitar un nuevo enlace
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              Restablecer contraseña
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tu nueva contraseña
            </p>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 text-white p-3 rounded-md text-sm">
              Contraseña actualizada correctamente. Serás redirigido al inicio de sesión...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Ingresa tu nueva contraseña"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirma tu nueva contraseña"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </Button>

            <div className="text-center text-sm">
              <Link
                href="/auth/login"
                className="text-primary hover:underline"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="relative w-full aspect-square">
            <Image
              src="/reset-password.svg"
              alt="Ilustración de restablecimiento de contraseña"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-center mt-8 space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              Crea una nueva contraseña
            </h2>
            <p className="text-primary-foreground/80">
              Asegúrate de elegir una contraseña segura
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ResetPasswordPage;
