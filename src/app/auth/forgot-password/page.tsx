// version1
// author Yxff
"use client";

import { useState, FormEvent } from "react";
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

function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email,
      });

      setSuccess(response.data.message);
      setEmail("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Ocurrió un error al enviar el correo de recuperación"
        );
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

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
              Recuperar contraseña
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 text-white p-3 rounded-md text-sm">
              {success}
              </div>
          )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                name="email"
                    type="email"
                placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
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
              src="/forgot-password.svg"
              alt="Ilustración de recuperación de contraseña"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-center mt-8 space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              Recupera tu acceso
            </h2>
            <p className="text-primary-foreground/80">
              No te preocupes, te ayudaremos a recuperar tu contraseña
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ForgotPasswordPage;
