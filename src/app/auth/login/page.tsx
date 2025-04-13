// version1
// author Yxff
"use client";

import { useState, FormEvent, useEffect } from "react";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.5 } },
};

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setMessage(message);
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      remember: formData.get("remember") === "on",
      redirect: false,
    });

    if (res?.error) setError(res.error as string);

    if (res?.ok) return router.push("../dashboard");
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Error al iniciar sesión con Google");
    }
  };

  return (
    <motion.div
      className="flex min-h-screen"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Columna Izquierda - Formulario de Inicio de Sesión */}
      <div className="flex w-full lg:w-1/2 flex-col px-6 sm:px-12 md:px-20 justify-center">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button>Volver al inicio</Button>
            </Link>
            <Image
              src="/logo.png"
              alt="ETIAPC Logo"
              width={48}
              height={48}
              className="w-10 h-10"
            />
            <span className="text-xl font-semibold">ETIAPC</span>
          </div>

          {/* Formulario de Inicio de Sesión */}
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              Inicia sesión en tu cuenta
            </h1>
            <p className="text-sm text-muted-foreground">
              ¡Bienvenido de nuevo! Selecciona un método para iniciar sesión:
            </p>

            {/* Mensaje de verificación */}
            {message && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{message}</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Botones de Inicio de Sesión Social */}
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="w-full hover:bg-primary"
                onClick={handleGoogleSignIn}
              >
                <Image
                  src="/google-icon.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2 h-8 w-8"
                />
                Google
              </Button>
            </div>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  o continúa con tu correo electrónico
                </span>
              </div>
            </div>

            {/* Formulario de Correo Electrónico y Contraseña */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Recordar y Olvidé mi Contraseña */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Recuérdame
                  </label>
                </div>
              </div>

              {/* Botón de Inicio de Sesión */}
              <Button type="submit" className="w-full">
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>

            {/* Enlace para Registrarse */}
            <div className="text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:underline"
              >
                Crea una cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha - Imagen */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="relative w-full aspect-square">
            <Image
              src=""
              alt="Ilustración de inicio de sesión"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-center mt-8 space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              Conéctate con cada aplicación.
            </h2>
            <p className="text-primary-foreground/80">
              Todo lo que necesitas en un panel de control fácilmente
              personalizable.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default LoginPage;
