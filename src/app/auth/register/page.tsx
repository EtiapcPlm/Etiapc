// version1
// author Yxff
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { motion } from "framer-motion";

// Axios
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.5 } },
};

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const signupResponse = await axios.post("../api/auth/signup", {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
      });
      
      // Redirigir al login después del registro exitoso
      router.push("/auth/login?message=Por favor, verifica tu correo electrónico para continuar");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
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
      {/* Columna Izquierda - Formulario de Registro */}
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

          {/* Formulario de Registro */}
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              Crea una cuenta
            </h1>
            <p className="text-sm text-muted-foreground">
              Comienza con tu cuenta gratuita
            </p>

            {/* Botones de Registro Social */}
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

            {/* Formulario de Registro */}
            {error && (
              <div className="bg-red-500 text-white p-2 rounded-md">
                {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Tu nombre"
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Tu apellido"
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Introduce tu correo electrónico"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crea una contraseña"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Términos y Condiciones */}
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Acepto los{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    términos del servicio
                  </Link>{" "}
                  y la{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    política de privacidad
                  </Link>
                </label>
              </div>

              {/* Botón de Registro */}
              <Button type="submit" className="w-full">
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            {/* Enlace para Iniciar Sesión */}
            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Inicia sesión
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
              alt="Ilustración de registro"
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

export default RegisterPage;