// version1
// author Yxff
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password, firstName, lastName } = await request.json();

    if (password < 6)
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );

    const userFound = await User.findOne({ email });

    if (userFound)
      return NextResponse.json(
        {
          message: "El correo electrónico ya existe",
        },
        {
          status: 409,
        }
      );

    // Generar token de verificación
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    const savedUser = await user.save();

    // Enviar correo de verificación
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico.",
        email,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
    console.error("Error en signup:", error);
    return NextResponse.json(
      { message: "Ocurrió un error al registrar el usuario" },
      { status: 500 }
    );
  }
}