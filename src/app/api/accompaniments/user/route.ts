import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Accompaniment from '@/models/Accompaniment'
import { connectToDatabase } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const userId = session.user.id

    let query = {}
    if (role === 'teacher') {
      query = { 'profesor.id': userId }
    } else if (role === 'coordinator') {
      query = { 'coordinador.id': userId }
    } else {
      return NextResponse.json(
        { error: 'Rol no válido' },
        { status: 400 }
      )
    }

    const accompaniments = await Accompaniment.find(query)
      .sort({ fecha: -1 })
      .limit(10)

    return NextResponse.json(accompaniments)
  } catch (error) {
    console.error('Error al obtener acompañamientos:', error)
    return NextResponse.json(
      { error: 'Error al obtener acompañamientos' },
      { status: 500 }
    )
  }
} 