// version1
// author Yxff
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EstadisticasProfesor } from "@/types/accompaniment"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TeacherStatsProps {
  stats: EstadisticasProfesor
}

export function TeacherStats({ stats }: TeacherStatsProps) {
  const data = stats.evolucion.map(item => ({
    fecha: new Date(item.fecha).toLocaleDateString(),
    puntuacion: item.puntuacion
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Puntuación Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.promedioGeneral.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground">de 5.0 puntos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planificación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.promedioPorCategoria.planificacion.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground">de 5.0 puntos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desarrollo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.promedioPorCategoria.desarrollo.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground">de 5.0 puntos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolución de Puntuaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="puntuacion" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Acompañamientos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.ultimosAcompanamientos.map((acompanamiento) => (
              <div key={acompanamiento.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{acompanamiento.profesor.materia}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(acompanamiento.fecha).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {(
                      (acompanamiento.instrumento.planificacion.objetivos +
                        acompanamiento.instrumento.planificacion.contenidos +
                        acompanamiento.instrumento.desarrollo.inicio +
                        acompanamiento.instrumento.desarrollo.desarrollo +
                        acompanamiento.instrumento.aspectosPedagogicos.dominio +
                        acompanamiento.instrumento.aspectosPedagogicos.comunicacion) /
                      6
                    ).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">puntos</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 