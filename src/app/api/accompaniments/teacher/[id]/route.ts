import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AccompanimentModel } from '@/models/Accompaniment'
import { connectDB } from '@/lib/db/mongodb'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = request.nextUrl.pathname.split('/').pop()
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const accompaniments = await AccompanimentModel.find({ profesor: id })
      .sort({ fecha: -1 })
      .populate('profesor', 'firstName lastName')
      .populate('coordinador', 'firstName lastName')

    const totalAcompanamientos = accompaniments.length
    const realizados = accompaniments.filter(a => a.estado === 'realizado')

    const promedioGeneral = realizados.length > 0
      ? realizados.reduce((acc, curr) => {
          const promPlanificacion = calcularPromedioSeccion(curr.instrumento.planificacion)
          const promDesarrollo = calcularPromedioSeccion(curr.instrumento.desarrollo)
          const promAspectosPedagogicos = calcularPromedioSeccion(curr.instrumento.aspectosPedagogicos)
          return acc + (promPlanificacion + promDesarrollo + promAspectosPedagogicos) / 3
        }, 0) / realizados.length
      : 0

    const promedioPlanificacion = realizados.length > 0
      ? realizados.reduce((acc, curr) => acc + calcularPromedioSeccion(curr.instrumento.planificacion), 0) / realizados.length
      : 0

    const promedioDesarrollo = realizados.length > 0
      ? realizados.reduce((acc, curr) => acc + calcularPromedioSeccion(curr.instrumento.desarrollo), 0) / realizados.length
      : 0

    const promedioAspectosPedagogicos = realizados.length > 0
      ? realizados.reduce((acc, curr) => acc + calcularPromedioSeccion(curr.instrumento.aspectosPedagogicos), 0) / realizados.length
      : 0

    const evolucion = realizados.map(a => {
      const promPlanificacion = calcularPromedioSeccion(a.instrumento.planificacion)
      const promDesarrollo = calcularPromedioSeccion(a.instrumento.desarrollo)
      const promAspectosPedagogicos = calcularPromedioSeccion(a.instrumento.aspectosPedagogicos)

      return {
        fecha: a.fecha,
        puntaje: (promPlanificacion + promDesarrollo + promAspectosPedagogicos) / 3
      }
    })

    const ultimosAcompanamientos = realizados.slice(0, 5)

    return NextResponse.json({
      totalAcompanamientos,
      promedioGeneral,
      promedioPlanificacion,
      promedioDesarrollo,
      promedioAspectosPedagogicos,
      evolucion,
      ultimosAcompanamientos
    })
  } catch (error) {
    console.error('Error fetching teacher accompaniments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function calcularPromedioSeccion(seccion: Record<string, number>): number {
  const valores = Object.values(seccion)
  if (valores.length === 0) return 0
  const suma = valores.reduce((a, b) => a + b, 0)
  return suma / valores.length
}
