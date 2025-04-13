"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import axios from "axios"
import { toast } from "sonner"
import { Calendar, BookOpen, BarChart as BarChartIcon, User } from "lucide-react"

// version1
// author Yxff

interface DashboardStats {
  totalAcompanamientos: number
  promedioGeneral: number
  promedioPlanificacion: number
  promedioDesarrollo: number
  promedioAspectosPedagogicos: number
  evolucion: Array<{
    fecha: string
    promedio: number
  }>
}

interface RecentAccompaniment {
  _id: string
  fecha: string
  coordinador: {
    firstName: string
    lastName: string
  }
  promedio: number
}

export function TeacherDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentAccompaniments, setRecentAccompaniments] = useState<RecentAccompaniment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchRecentAccompaniments()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/accompaniments/teacher/current")
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      toast.error("Error al cargar las estadísticas")
    }
  }

  const fetchRecentAccompaniments = async () => {
    try {
      const response = await axios.get("/api/accompaniments/teacher/recent")
      setRecentAccompaniments(response.data)
    } catch (error) {
      console.error("Error fetching recent accompaniments:", error)
      toast.error("Error al cargar los últimos acompañamientos")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Cargando estadísticas...</p>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Bienvenido a tu panel de control
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card dark:bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Total Acompañamientos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stats.totalAcompanamientos}</div>
          </CardContent>
        </Card>

        <Card className="bg-card dark:bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Promedio General
            </CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stats.promedioGeneral.toFixed(1)}/5</div>
          </CardContent>
        </Card>

        <Card className="bg-card dark:bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Promedio Planificación
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stats.promedioPlanificacion.toFixed(1)}/5</div>
          </CardContent>
        </Card>

        <Card className="bg-card dark:bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Promedio Desarrollo
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stats.promedioDesarrollo.toFixed(1)}/5</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="bg-card dark:bg-card/90">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg text-card-foreground">Evolución de Calificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.evolucion}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="fecha" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    stroke="hsl(var(--foreground))"
                  />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [`${value}/5`, 'Calificación']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="promedio" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card dark:bg-card/90">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg text-card-foreground">Últimos Acompañamientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAccompaniments.map((acompanamiento) => (
                <div
                  key={acompanamiento._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg gap-2"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(acompanamiento.fecha).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {acompanamiento.coordinador.firstName} {acompanamiento.coordinador.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="w-24 h-2 bg-muted rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(acompanamiento.promedio / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {acompanamiento.promedio.toFixed(1)}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

