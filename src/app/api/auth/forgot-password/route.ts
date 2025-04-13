// version1
// author Yxff
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "El correo electrónico es requerido" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "No existe una cuenta con este correo electrónico" },
        { status: 404 }
      );
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    // Actualizar solo los campos de recuperación de contraseña
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetExpires,
        },
      }
    );

    // Enviar correo electrónico
    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json(
      { message: "Se ha enviado un enlace de recuperación a tu correo electrónico" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json(
      { message: "Ocurrió un error al procesar tu solicitud" },
      { status: 500 }
    );
  }
} 