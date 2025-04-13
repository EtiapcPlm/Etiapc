import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AccompanimentModel from '@/models/Accompaniment'
import User from '@/models/user'
import { connectDB } from '@/lib/db/mongodb'

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Obtener los últimos 5 acompañamientos
    const accompaniments = await AccompanimentModel.find({ profesor: user._id })
      .populate('profesor', 'firstName lastName')
      .populate('coordinador', 'firstName lastName')
      .sort({ fecha: -1 })
      .limit(5)

    // Preparar los acompañamientos con la información necesaria
    const recentAccompaniments = accompaniments.map(acompanamiento => {
      const planificacion = Object.values(acompanamiento.instrumento.planificacion).reduce((a: number, b: number) => a + b, 0) / 5
      const desarrollo = Object.values(acompanamiento.instrumento.desarrollo).reduce((a: number, b: number) => a + b, 0) / 4
      const aspectosPedagogicos = Object.values(acompanamiento.instrumento.aspectosPedagogicos).reduce((a: number, b: number) => a + b, 0) / 4
      const promedio = (planificacion + desarrollo + aspectosPedagogicos) / 3

      return {
        _id: acompanamiento._id,
        fecha: acompanamiento.fecha,
        coordinador: acompanamiento.coordinador,
        promedio: promedio
      }
    })

    return NextResponse.json(recentAccompaniments)
  } catch (error) {
    console.error('Error fetching recent accompaniments:', error)
    return NextResponse.json(
      { error: 'Error al obtener los últimos acompañamientos' },
      { status: 500 }
    )
  }
} 