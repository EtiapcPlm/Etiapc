"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Users, Clock, Calendar, GraduationCap } from "lucide-react"

export default function CoordinatorSubjectsPage() {
  // Datos simulados de asignaturas
  const subjects = [
    {
      id: 1,
      name: "Matemáticas Avanzadas",
      code: "MAT-101",
      teacher: "Juan Pérez",
      students: 25,
      schedule: "Lunes y Miércoles 10:00 - 12:00",
      semester: "2024-1",
      status: "active",
      credits: 4,
    },
    {
      id: 2,
      name: "Física General",
      code: "FIS-201",
      teacher: "María García",
      students: 30,
      schedule: "Martes y Jueves 14:00 - 16:00",
      semester: "2024-1",
      status: "active",
      credits: 4,
    },
    {
      id: 3,
      name: "Química Orgánica",
      code: "QUI-301",
      teacher: "Carlos López",
      students: 28,
      schedule: "Viernes 08:00 - 12:00",
      semester: "2024-1",
      status: "inactive",
      credits: 3,
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Asignaturas</h1>
            <p className="text-muted-foreground">
              Administra las asignaturas y sus asignaciones
            </p>
          </div>
          <Button>
            <BookOpen className="h-4 w-4 mr-2" />
            Nueva Asignatura
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar asignaturas..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{subject.name}</h3>
                    <Badge variant="outline">{subject.code}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Profesor: {subject.teacher}</p>
                </div>
                <Badge variant={subject.status === "active" ? "default" : "secondary"}>
                  {subject.status === "active" ? "Activa" : "Inactiva"}
                </Badge>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Estudiantes:</span> {subject.students}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Horario:</span> {subject.schedule}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Semestre:</span> {subject.semester}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Créditos:</span> {subject.credits}
                </span>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Ver estudiantes
                </Button>
                <Button variant="outline" size="sm">
                  Asignar profesor
                </Button>
                <Button size="sm">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 