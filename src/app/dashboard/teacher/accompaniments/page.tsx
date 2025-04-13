"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, User } from "lucide-react"
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

export default function TeacherAccompanimentsPage() {
  const router = useRouter()
  const [accompaniments, setAccompaniments] = useState<Accompaniment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchAccompaniments()
  }, [])

  const fetchAccompaniments = async () => {
    try {
      console.log("Fetching accompaniments...")
      const response = await axios.get("/api/accompaniments/teacher/current")
      console.log("Response data:", response.data)
      
      // La API devuelve los acompañamientos en ultimosAcompanamientos
      if (response.data.ultimosAcompanamientos) {
        setAccompaniments(response.data.ultimosAcompanamientos)
      } else {
        setAccompaniments([])
      }
    } catch (error) {
      console.error("Error fetching accompaniments:", error)
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data)
        toast.error(error.response?.data?.error || "Error al cargar los acompañamientos")
      } else {
        toast.error("Error al cargar los acompañamientos")
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredAccompaniments = accompaniments.filter((accompaniment) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      accompaniment.coordinador.firstName.toLowerCase().includes(searchLower) ||
      accompaniment.coordinador.lastName.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Cargando acompañamientos...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Mis Acompañamientos</h1>
            <p className="text-muted-foreground">
              Lista de todos tus acompañamientos
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Buscar por coordinador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6">
        {filteredAccompaniments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No se encontraron acompañamientos
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAccompaniments.map((accompaniment) => (
            <Card key={accompaniment._id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      Acompañamiento {accompaniment.tipo}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(accompaniment.fecha).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/teacher/accompaniments/${accompaniment._id}`)
                    }
                  >
                    Ver Detalles
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Coordinador:</span>{" "}
                      {`${accompaniment.coordinador.firstName} ${accompaniment.coordinador.lastName}`}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Resumen de Evaluación</h4>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span>Planificación:</span>
                      <span>
                        {(
                          Object.values(accompaniment.instrumento.planificacion).reduce(
                            (a, b) => a + b,
                            0
                          ) / 5
                        ).toFixed(1)}
                        /5
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desarrollo:</span>
                      <span>
                        {(
                          Object.values(accompaniment.instrumento.desarrollo).reduce(
                            (a, b) => a + b,
                            0
                          ) / 4
                        ).toFixed(1)}
                        /5
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aspectos Pedagógicos:</span>
                      <span>
                        {(
                          Object.values(accompaniment.instrumento.aspectosPedagogicos).reduce(
                            (a, b) => a + b,
                            0
                          ) / 4
                        ).toFixed(1)}
                        /5
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 