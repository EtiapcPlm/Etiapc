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

    const accompaniments = await AccompanimentModel.find({ coordinador: id })
      .sort({ fecha: -1 })
      .populate('profesor', 'firstName lastName')
      .populate('coordinador', 'firstName lastName')

    const totalAcompanamientos = accompaniments.length
    const realizados = accompaniments.filter(a => a.estado === 'realizado')
    const pendientes = accompaniments.filter(a => a.estado === 'pendiente')
    const cancelados = accompaniments.filter(a => a.estado === 'cancelado')

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

    return NextResponse.json({
      totalAcompanamientos,
      realizados: realizados.length,
      pendientes: pendientes.length,
      cancelados: cancelados.length,
      promedioGeneral,
      promedioPlanificacion,
      promedioDesarrollo,
      promedioAspectosPedagogicos
    })
  } catch (error) {
    console.error('Error fetching coordinator accompaniments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function calcularPromedioSeccion(seccion: Record<string, number>): number {
  const valores = Object.values(seccion)
  if (valores.length === 0) return 0
  const suma = valores.reduce((a, b) => a + b, 0)
  return suma / valores.length
}
