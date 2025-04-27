// version1
// author Yxff
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/user";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    await connectDB();
    
    const user = await User.findOne({
      emailVerificationToken: params.token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Email verificado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en verificación de email:", error);
    return NextResponse.json(
      { error: "Error al verificar el email" },
      { status: 500 }
    );
  }
} 
