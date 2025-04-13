"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Loader2, Search, User } from "lucide-react"
import axios from "axios"

interface Accompaniment {
  _id: string
  fecha: string
  profesor: {
    _id: string
    firstName: string
    lastName: string
  }
  estado: string
  tipo: string
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

export default function CoordinatorAccompanimentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const teacherId = searchParams.get("teacherId")
  
  const [loading, setLoading] = useState(true)
  const [accompaniments, setAccompaniments] = useState<Accompaniment[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchAccompaniments()
  }, [teacherId])

  const fetchAccompaniments = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/accompaniments")
      setAccompaniments(response.data)
    } catch (error) {
      console.error("Error fetching accompaniments:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAccompaniments = accompaniments.filter((accompaniment) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      accompaniment.profesor.firstName.toLowerCase().includes(searchLower) ||
      accompaniment.profesor.lastName.toLowerCase().includes(searchLower) ||
      accompaniment.estado.toLowerCase().includes(searchLower) ||
      accompaniment.tipo.toLowerCase().includes(searchLower)
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "realizado":
        return "bg-green-100 text-green-800"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "presencial":
        return "bg-blue-100 text-blue-800"
      case "virtual":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateAverage = (section: Record<string, number>) => {
    const values = Object.values(section);
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(1);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Calendar className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Acompañamientos</h1>
            <p className="text-muted-foreground">
              {teacherId
                ? "Acompañamientos del profesor seleccionado"
                : "Todos los acompañamientos"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, estado o tipo..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredAccompaniments.map((accompaniment) => (
            <Card key={accompaniment._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {accompaniment.profesor.firstName} {accompaniment.profesor.lastName}
                    </CardTitle>
                    <CardDescription>
                      {new Date(accompaniment.fecha).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(accompaniment.estado)}>
                      {accompaniment.estado}
                    </Badge>
                    <Badge className={getTypeColor(accompaniment.tipo)}>
                      {accompaniment.tipo}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Planificación
                      </h3>
                      <p className="text-2xl font-bold">
                        {calculateAverage(accompaniment.instrumento.planificacion)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Desarrollo
                      </h3>
                      <p className="text-2xl font-bold">
                        {calculateAverage(accompaniment.instrumento.desarrollo)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Aspectos Pedagógicos
                      </h3>
                      <p className="text-2xl font-bold">
                        {calculateAverage(accompaniment.instrumento.aspectosPedagogicos)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="text-sm font-medium">Observaciones</h3>
                    <p className="text-sm text-muted-foreground">
                      {accompaniment.observaciones || "Sin observaciones"}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="text-sm font-medium">Fortalezas</h3>
                    <p className="text-sm text-muted-foreground">
                      {accompaniment.fortalezas || "Sin fortalezas identificadas"}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="text-sm font-medium">Sugerencias</h3>
                    <p className="text-sm text-muted-foreground">
                      {accompaniment.sugerencias || "Sin sugerencias"}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/dashboard/coordinator/accompaniments/${accompaniment._id}`
                        )
                      }
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 