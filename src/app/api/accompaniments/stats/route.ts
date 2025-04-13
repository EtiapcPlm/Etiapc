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
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 })
    }

    const accompaniments = await Accompaniment.find({ 'profesor.id': userId })
      .sort({ fecha: -1 })

    if (accompaniments.length === 0) {
      return NextResponse.json({
        promedioGeneral: 0,
        promedioPorCategoria: {
          planificacion: 0,
          desarrollo: 0,
          aspectosPedagogicos: 0
        },
        evolucion: [],
        ultimosAcompanamientos: []
      })
    }

    // Calcular promedios
    const promedios = accompaniments.reduce((acc, curr) => {
      const planificacion = (
        curr.instrumento.planificacion.objetivos +
        curr.instrumento.planificacion.contenidos +
        curr.instrumento.planificacion.metodologia +
        curr.instrumento.planificacion.recursos +
        curr.instrumento.planificacion.evaluacion
      ) / 5

      const desarrollo = (
        curr.instrumento.desarrollo.inicio +
        curr.instrumento.desarrollo.desarrollo +
        curr.instrumento.desarrollo.cierre +
        curr.instrumento.desarrollo.tiempo
      ) / 4

      const aspectosPedagogicos = (
        curr.instrumento.aspectosPedagogicos.dominio +
        curr.instrumento.aspectosPedagogicos.comunicacion +
        curr.instrumento.aspectosPedagogicos.interaccion +
        curr.instrumento.aspectosPedagogicos.clima
      ) / 4

      return {
        planificacion: acc.planificacion + planificacion,
        desarrollo: acc.desarrollo + desarrollo,
        aspectosPedagogicos: acc.aspectosPedagogicos + aspectosPedagogicos
      }
    }, { planificacion: 0, desarrollo: 0, aspectosPedagogicos: 0 })

    const totalAcompanamientos = accompaniments.length
    const promedioGeneral = (
      promedios.planificacion +
      promedios.desarrollo +
      promedios.aspectosPedagogicos
    ) / (3 * totalAcompanamientos)

    // Preparar datos de evolución
    const evolucion = accompaniments.map(acompanamiento => ({
      fecha: acompanamiento.fecha,
      puntuacion: (
        (acompanamiento.instrumento.planificacion.objetivos +
          acompanamiento.instrumento.planificacion.contenidos +
          acompanamiento.instrumento.desarrollo.inicio +
          acompanamiento.instrumento.desarrollo.desarrollo +
          acompanamiento.instrumento.aspectosPedagogicos.dominio +
          acompanamiento.instrumento.aspectosPedagogicos.comunicacion) /
        6
      )
    }))

    return NextResponse.json({
      promedioGeneral,
      promedioPorCategoria: {
        planificacion: promedios.planificacion / totalAcompanamientos,
        desarrollo: promedios.desarrollo / totalAcompanamientos,
        aspectosPedagogicos: promedios.aspectosPedagogicos / totalAcompanamientos
      },
      evolucion,
      ultimosAcompanamientos: accompaniments.slice(0, 5)
    })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
} 