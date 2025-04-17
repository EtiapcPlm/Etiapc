import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AccompanimentModel from '@/models/Accompaniment'
import { connectDB } from '@/lib/db/mongodb'

function getIdFromRequest(request: NextRequest): string | null {
  const id = request.nextUrl.pathname.split('/').pop()
  return id || null
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = getIdFromRequest(request)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const accompaniment = await AccompanimentModel.findById(id)
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

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = getIdFromRequest(request)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const body = await request.json()
    const accompaniment = await AccompanimentModel.findByIdAndUpdate(
      id,
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

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = getIdFromRequest(request)
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const accompaniment = await AccompanimentModel.findByIdAndDelete(id)

    if (!accompaniment) {
      return NextResponse.json({ error: 'Acompañamiento no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Acompañamiento eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting accompaniment:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
