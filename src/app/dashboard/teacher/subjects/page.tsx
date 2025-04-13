"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Clock, Calendar } from "lucide-react"

export default function TeacherSubjectsPage() {
  // Datos simulados de asignaturas
  const subjects = [
    {
      id: 1,
      name: "Matemáticas Avanzadas",
      code: "MAT-101",
      students: 25,
      schedule: "Lunes y Miércoles 10:00 - 12:00",
      semester: "2024-1",
      status: "active",
    },
    {
      id: 2,
      name: "Física General",
      code: "FIS-201",
      students: 30,
      schedule: "Martes y Jueves 14:00 - 16:00",
      semester: "2024-1",
      status: "active",
    },
    {
      id: 3,
      name: "Cálculo Diferencial",
      code: "CAL-301",
      students: 28,
      schedule: "Viernes 08:00 - 12:00",
      semester: "2024-1",
      status: "active",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Mis Asignaturas</h1>
        <p className="text-muted-foreground">
          Lista de asignaturas que impartes en el semestre actual.
        </p>
      </div>

      <div className="grid gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">{subject.name}</CardTitle>
                  <CardDescription>Código: {subject.code}</CardDescription>
                </div>
                <Badge variant={subject.status === "active" ? "default" : "secondary"}>
                  {subject.status === "active" ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      <span className="font-medium">Estudiantes:</span> {subject.students}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      <span className="font-medium">Horario:</span> {subject.schedule}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      <span className="font-medium">Semestre:</span> {subject.semester}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      <span className="font-medium">Estado:</span>{" "}
                      {subject.status === "active" ? "En curso" : "Finalizada"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    Ver estudiantes
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver materiales
                  </Button>
                  <Button size="sm">
                    Ver detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 