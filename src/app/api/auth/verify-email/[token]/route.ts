// version1
// author Yxff
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/user";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { message: "Token de verificación requerido" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token de verificación inválido o expirado" },
        { status: 400 }
      );
    }

    // Marcar correo como verificado
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Correo electrónico verificado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en verify-email-token:", error);
    return NextResponse.json(
      { message: "Ocurrió un error al verificar el correo electrónico" },
      { status: 500 }
    );
  }
} 