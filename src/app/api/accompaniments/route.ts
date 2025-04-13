// version1
// author Yxff
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AccompanimentModel from '@/models/Accompaniment'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/models/user'

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accompaniments = await AccompanimentModel.find()
      .populate('profesor', 'firstName lastName')
      .populate('coordinador', 'firstName lastName')
      .sort({ fecha: -1 })

    return NextResponse.json(accompaniments)
  } catch (error) {
    console.error('Error fetching accompaniments:', error)
    return NextResponse.json({ error: 'Error al obtener los acompañamientos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const coordinator = await User.findOne({ email: session.user.email })

    if (!coordinator) {
      return NextResponse.json({ error: 'Coordinator not found' }, { status: 404 })
    }

    const accompaniment = new AccompanimentModel({
      ...body,
      coordinador: coordinator._id,
      fecha: new Date(),
    })

    await accompaniment.save()

    return NextResponse.json(accompaniment, { status: 201 })
  } catch (error) {
    console.error('Error creating accompaniment:', error)
    return NextResponse.json({ error: 'Error al crear el acompañamiento' }, { status: 500 })
  }
} 