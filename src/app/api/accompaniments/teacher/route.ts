import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongodb"
import { ObjectId } from "mongodb"

interface Accompaniment {
  _id: ObjectId
  date: string
  time: string
  coordinator: {
    firstName: string
    lastName: string
  }
  subject: string
  status: "pending" | "completed" | "cancelled"
  feedback?: string
  rating?: number
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const mongoose = await connectDB()
    const Accompaniment = mongoose.model("Accompaniment")
    
    const accompaniments = await Accompaniment.find({ teacherId: new ObjectId(session.user.id) })
      .sort({ date: -1 })
      .lean()

    // Transform the data to match the expected format
    const formattedAccompaniments = accompaniments.map((accompaniment: Accompaniment) => ({
      _id: accompaniment._id.toString(),
      date: accompaniment.date,
      time: accompaniment.time,
      coordinator: {
        firstName: accompaniment.coordinator.firstName,
        lastName: accompaniment.coordinator.lastName
      },
      subject: accompaniment.subject,
      status: accompaniment.status,
      feedback: accompaniment.feedback,
      rating: accompaniment.rating
    }))

    return NextResponse.json(formattedAccompaniments)
  } catch (error) {
    console.error("Error al obtener acompañamientos:", error)
    return NextResponse.json(
      { error: "Error al obtener los acompañamientos" },
      { status: 500 }
    )
  }
} 