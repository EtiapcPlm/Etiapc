"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download, Calendar, BarChart, PieChart, LineChart, Users, MoreHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdministratorReportsPage() {
  // Datos simulados de reportes
  const reports = [
    {
      id: 1,
      title: "Estadísticas Generales",
      description: "Resumen de métricas del sistema",
      type: "Análisis",
      date: "15/03/2024",
      status: "completed",
      format: "PDF",
      category: "General",
    },
    {
      id: 2,
      title: "Usuarios Activos",
      description: "Reporte de usuarios por rol",
      type: "Usuarios",
      date: "14/03/2024",
      status: "completed",
      format: "Excel",
      category: "Usuarios",
    },
    {
      id: 3,
      title: "Evaluaciones del Mes",
      description: "Análisis de evaluaciones realizadas",
      type: "Evaluación",
      date: "10/03/2024",
      status: "processing",
      format: "PDF",
      category: "Evaluaciones",
    },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Reportes</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Visualiza y gestiona los reportes del sistema
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Reportes Totales</CardTitle>
            <CardDescription className="text-sm sm:text-base">Total de reportes generados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Reportes Pendientes</CardTitle>
            <CardDescription className="text-sm sm:text-base">Reportes por revisar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {reports.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Reportes Completados</CardTitle>
            <CardDescription className="text-sm sm:text-base">Reportes finalizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {reports.filter(r => r.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Reportes Rechazados</CardTitle>
            <CardDescription className="text-sm sm:text-base">Reportes no aprobados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {reports.filter(r => r.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base sm:text-lg">Lista de Reportes</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Gestiona los reportes del sistema
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Input
              placeholder="Buscar reportes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[200px]"
              />
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="rejected">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto rounded-lg border">
            <div className="min-w-[800px]">
              {filteredReports.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No se encontraron reportes</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Título</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{report.description}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(report.status)}>
                            {getStatusLabel(report.status)}
                </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(report.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(report)}>
                  Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(report)}>
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(report.id)}>
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
              </div>
            </CardContent>
          </Card>
    </div>
  )
} 