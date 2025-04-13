"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Statistics {
  averageGrades: Array<{
    subject: string
    average: number
  }>
  gradeDistribution: Array<{
    range: string
    count: number
  }>
  subjectPerformance: Array<{
    subject: string
    performance: number
  }>
  attendance: Array<{
    month: string
    rate: number
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function TeacherStatisticsPage() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("current")

  useEffect(() => {
    fetchStatistics()
  }, [selectedPeriod])

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/statistics/teacher?period=${selectedPeriod}`)
      if (!response.ok) throw new Error("Error al cargar las estadísticas")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error(error)
      toast.error("Error al cargar las estadísticas")
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
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Estadísticas</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Análisis y seguimiento del rendimiento académico
        </p>
      </div>

      <div className="flex justify-end">
        <Select
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Período actual</SelectItem>
            <SelectItem value="last">Período anterior</SelectItem>
            <SelectItem value="year">Año completo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Promedios por Materia</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.averageGrades}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            </CardContent>
          </Card>

          <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Distribución de Calificaciones</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            </CardContent>
          </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Rendimiento por Materia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="performance" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Asistencia Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.attendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 