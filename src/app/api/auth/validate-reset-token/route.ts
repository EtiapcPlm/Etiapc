// version1
// author Yxff
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Obtener el token de la URL
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token no proporcionado" },
        { status: 400 }
      );
    }

    // Buscar usuario con el token y verificar que no haya expirado
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token inválido o expirado" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Token válido" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al validar token:", error);
    return NextResponse.json(
      { message: "Error al validar el token" },
      { status: 500 }
    );
  }
} 