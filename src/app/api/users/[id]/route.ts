import { connectDB } from "@/lib/db/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import User from "@/models/user"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const mongoose = await connectDB()
    
    if (!mongoose.connection.db) {
      throw new Error("No database connection available")
    }

    const db = mongoose.connection.db
    const usersCollection = db.collection("users")
    
    if (!usersCollection) {
      throw new Error("Users collection not found")
    }

    const { firstName, lastName, email, role } = await request.json()

    // Verificar si el email ya existe para otro usuario
    const existingUser = await usersCollection.findOne({
      email,
      _id: { $ne: new mongoose.Types.ObjectId(params.id) }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "El correo electrónico ya está en uso" },
        { status: 400 }
      )
    }

    const result = await usersCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(params.id) },
      {
        $set: {
          firstName,
          lastName,
          email,
          role,
        }
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Verificar que el ID sea válido
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    // Intentar eliminar el usuario usando el modelo
    const result = await User.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Usuario eliminado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Error al eliminar el usuario" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(params.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 