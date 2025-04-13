"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from "axios"
import { useState, useEffect } from "react"
import { UsersTable } from "@/components/dashboard/administrator/UsersTable"
import { FileDown } from "lucide-react"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isEmailVerified: boolean
  loginAttempts: number
  createdAt: string
  image: string | null
  authProvider: string
}

export default function AdministratorUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users")
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Error al cargar los usuarios")
    } finally {
      setLoading(false)
    }
  }

  const handleUserDeleted = async (userId: string) => {
    try {
      const response = await axios.delete(`/api/users/${userId}`)
      if (response.status === 200) {
        toast.success("Usuario eliminado exitosamente")
        fetchUsers()
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Error al eliminar el usuario")
    }
  }

  const handleExportUsers = () => {
    // Convertir usuarios a CSV
    const headers = ["Nombre", "Email", "Rol", "Estado", "Fecha de registro"]
    const csvContent = [
      headers.join(","),
      ...users.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.role,
        user.isEmailVerified ? "Verificado" : "Pendiente",
        new Date(user.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n")

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `usuarios_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Gestión de Usuarios</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button onClick={handleExportUsers} className="w-full sm:w-auto">
          <FileDown className="h-4 w-4 mr-2" />
          Exportar Usuarios
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <UsersTable
            users={users}
            onUserUpdated={fetchUsers}
            onUserDeleted={handleUserDeleted}
          />
        </CardContent>
      </Card>
    </div>
  )
} 