import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import User from "@/models/user"

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.pathname.split("/").pop()

    if (!token) {
      return NextResponse.json(
        { message: "Token de verificación requerido" },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json(
        { message: "Token de verificación inválido o expirado" },
        { status: 400 }
      )
    }

    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    return NextResponse.json(
      { message: "Correo electrónico verificado exitosamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error en verify-email-token:", error)
    return NextResponse.json(
      { message: "Ocurrió un error al verificar el correo electrónico" },
      { status: 500 }
    )
  }
}
