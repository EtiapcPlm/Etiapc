import { connectDB } from "@/lib/db/mongodb"
import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import User from "@/models/user"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET: Obtener usuario
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = req.nextUrl.pathname.split("/").pop()

    const user = await User.findById(id).select("-password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT: Actualizar usuario
export async function PUT(req: NextRequest) {
  try {
    const mongoose = await connectDB()
    if (!mongoose.connection.db) {
      throw new Error("No database connection available")
    }

    const id = req.nextUrl.pathname.split("/").pop()
    const db = mongoose.connection.db
    const usersCollection = db.collection("users")

    const { firstName, lastName, email, role } = await req.json()

    const existingUser = await usersCollection.findOne({
      email,
      _id: { $ne: new mongoose.Types.ObjectId(id) }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "El correo electrónico ya está en uso" },
        { status: 400 }
      )
    }

    const result = await usersCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: { firstName, lastName, email, role }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Usuario actualizado exitosamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      {
        message: "Error al actualizar el usuario",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar usuario
export async function DELETE(req: NextRequest) {
  try {
    await connectDB()

    const id = req.nextUrl.pathname.split("/").pop()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 })
    }

    const result = await User.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Usuario eliminado exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Error al eliminar el usuario" }, { status: 500 })
  }
}
