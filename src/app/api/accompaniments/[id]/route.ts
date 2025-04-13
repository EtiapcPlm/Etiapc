import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AccompanimentModel from '@/models/Accompaniment'
import { connectDB } from '@/lib/db/mongodb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accompaniment = await AccompanimentModel.findById(params.id)
      .populate('profesor', 'firstName lastName')
      .populate('coordinador', 'firstName lastName')

    if (!accompaniment) {
      return NextResponse.json({ error: 'Acompañamiento no encontrado' }, { status: 404 })
    }

    return NextResponse.json(accompaniment)
  } catch (error) {
    console.error('Error fetching accompaniment:', error)
    return NextResponse.json({ error: 'Error al obtener el acompañamiento' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const accompaniment = await AccompanimentModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    )
      .populate('profesor', 'firstName lastName')
      .populate('coordinador', 'firstName lastName')

    if (!accompaniment) {
      return NextResponse.json({ error: 'Acompañamiento no encontrado' }, { status: 404 })
    }

    return NextResponse.json(accompaniment)
  } catch (error) {
    console.error('Error updating accompaniment:', error)
    return NextResponse.json({ error: 'Error al actualizar el acompañamiento' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accompaniment = await AccompanimentModel.findByIdAndDelete(params.id)

    if (!accompaniment) {
      return NextResponse.json({ error: 'Accompaniment not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Accompaniment deleted successfully' })
  } catch (error) {
    console.error('Error deleting accompaniment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 