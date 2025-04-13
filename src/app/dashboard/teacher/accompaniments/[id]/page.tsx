"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, BookOpen, BarChart } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"

interface Accompaniment {
  _id: string
  fecha: string
  profesor: {
    _id: string
    firstName: string
    lastName: string
  }
  coordinador: {
    _id: string
    firstName: string
    lastName: string
  }
  tipo: 'presencial' | 'virtual'
  instrumento: {
    planificacion: {
      objetivos: number
      contenidos: number
      metodologia: number
      recursos: number
      evaluacion: number
    }
    desarrollo: {
      inicio: number
      desarrollo: number
      cierre: number
      tiempo: number
    }
    aspectosPedagogicos: {
      dominio: number
      comunicacion: number
      interaccion: number
      clima: number
    }
  }
  observaciones: string
  fortalezas: string
  sugerencias: string
}

export default function TeacherAccompanimentDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [accompaniment, setAccompaniment] = useState<Accompaniment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccompaniment()
  }, [params.id])

  const fetchAccompaniment = async () => {
    try {
      const response = await axios.get(`/api/accompaniments/${params.id}`)
      setAccompaniment(response.data)
    } catch (error) {
      console.error("Error fetching accompaniment:", error)
      toast.error("Error al cargar el acompañamiento")
      router.push("/dashboard/teacher/accompaniments")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Cargando detalles...</p>
      </div>
    )
  }

  if (!accompaniment) {
    return null
  }

  const calculateAverage = (section: any) => {
    const values = Object.values(section)
    const sum = values.reduce((a: number, b: number) => a + b, 0)
    return (sum / values.length).toFixed(1)
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Detalles del Acompañamiento</h1>
            <p className="text-muted-foreground">
              Información detallada del acompañamiento
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">
                Acompañamiento {accompaniment.tipo}
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Fecha:</span>{" "}
                  {new Date(accompaniment.fecha).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Coordinador:</span>{" "}
                  {`${accompaniment.coordinador.firstName} ${accompaniment.coordinador.lastName}`}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-4">Evaluación</h4>
              <div className="grid gap-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <h5 className="text-sm font-medium">Planificación</h5>
                  </div>
                  <div className="grid gap-2">
                    {Object.entries(accompaniment.instrumento.planificacion).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{key}:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(value / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{value}/5</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                      <span className="text-sm font-medium">Promedio:</span>
                      <span className="text-sm font-medium">
                        {calculateAverage(accompaniment.instrumento.planificacion)}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <h5 className="text-sm font-medium">Desarrollo</h5>
                  </div>
                  <div className="grid gap-2">
                    {Object.entries(accompaniment.instrumento.desarrollo).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{key}:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(value / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{value}/5</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                      <span className="text-sm font-medium">Promedio:</span>
                      <span className="text-sm font-medium">
                        {calculateAverage(accompaniment.instrumento.desarrollo)}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <h5 className="text-sm font-medium">Aspectos Pedagógicos</h5>
                  </div>
                  <div className="grid gap-2">
                    {Object.entries(accompaniment.instrumento.aspectosPedagogicos).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{key}:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(value / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{value}/5</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                      <span className="text-sm font-medium">Promedio:</span>
                      <span className="text-sm font-medium">
                        {calculateAverage(accompaniment.instrumento.aspectosPedagogicos)}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Observaciones</h4>
                <p className="text-sm text-muted-foreground">
                  {accompaniment.observaciones}
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Fortalezas</h4>
                <p className="text-sm text-muted-foreground">
                  {accompaniment.fortalezas}
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Sugerencias</h4>
                <p className="text-sm text-muted-foreground">
                  {accompaniment.sugerencias}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 