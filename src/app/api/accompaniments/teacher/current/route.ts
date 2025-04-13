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

    console.log("Session user:", session.user)

    // Buscar el usuario por email
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log("Found user:", user)

    const accompaniments = await AccompanimentModel.find({ profesor: user._id })
      .populate('profesor', 'firstName lastName')
      .populate('coordinador', 'firstName lastName')
      .sort({ fecha: -1 })

    console.log("Found accompaniments:", accompaniments)

    if (!accompaniments.length) {
      return NextResponse.json({
        totalAcompanamientos: 0,
        promedioGeneral: 0,
        promedioPlanificacion: 0,
        promedioDesarrollo: 0,
        promedioAspectosPedagogicos: 0,
        evolucion: [],
        ultimosAcompanamientos: []
      })
    }

    // Calcular promedios
    const promedios = accompaniments.reduce((acc, curr) => {
      const planificacion = Object.values(curr.instrumento.planificacion).reduce((a, b) => a + b, 0) / 5
      const desarrollo = Object.values(curr.instrumento.desarrollo).reduce((a, b) => a + b, 0) / 4
      const aspectosPedagogicos = Object.values(curr.instrumento.aspectosPedagogicos).reduce((a, b) => a + b, 0) / 4
      
      return {
        planificacion: acc.planificacion + planificacion,
        desarrollo: acc.desarrollo + desarrollo,
        aspectosPedagogicos: acc.aspectosPedagogicos + aspectosPedagogicos,
        total: acc.total + 1
      }
    }, { planificacion: 0, desarrollo: 0, aspectosPedagogicos: 0, total: 0 })

    const promedioPlanificacion = promedios.planificacion / promedios.total
    const promedioDesarrollo = promedios.desarrollo / promedios.total
    const promedioAspectosPedagogicos = promedios.aspectosPedagogicos / promedios.total
    const promedioGeneral = (promedioPlanificacion + promedioDesarrollo + promedioAspectosPedagogicos) / 3

    // Preparar datos de evolución
    const evolucion = accompaniments.map(acompanamiento => {
      const planificacion = Object.values(acompanamiento.instrumento.planificacion).reduce((a, b) => a + b, 0) / 5
      const desarrollo = Object.values(acompanamiento.instrumento.desarrollo).reduce((a, b) => a + b, 0) / 4
      const aspectosPedagogicos = Object.values(acompanamiento.instrumento.aspectosPedagogicos).reduce((a, b) => a + b, 0) / 4
      const promedio = (planificacion + desarrollo + aspectosPedagogicos) / 3

      return {
        fecha: acompanamiento.fecha,
        promedio: promedio
      }
    }).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

    // Preparar últimos acompañamientos con toda la información necesaria
    const ultimosAcompanamientos = accompaniments.map(acompanamiento => ({
      _id: acompanamiento._id,
      fecha: acompanamiento.fecha,
      profesor: acompanamiento.profesor,
      coordinador: acompanamiento.coordinador,
      tipo: acompanamiento.tipo,
      instrumento: acompanamiento.instrumento,
      observaciones: acompanamiento.observaciones,
      fortalezas: acompanamiento.fortalezas,
      sugerencias: acompanamiento.sugerencias
    }))

    return NextResponse.json({
      totalAcompanamientos: accompaniments.length,
      promedioGeneral,
      promedioPlanificacion,
      promedioDesarrollo,
      promedioAspectosPedagogicos,
      evolucion,
      ultimosAcompanamientos
    })
  } catch (error) {
    console.error('Error fetching teacher statistics:', error)
    return NextResponse.json(
      { error: 'Error al obtener las estadísticas' },
      { status: 500 }
    )
  }
} 