"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

interface UserData {
  firstName: string
  lastName: string
  email: string
  image?: string
  googleProfileImage?: string
}

export default function AdministratorProfilePage() {
  const { data: session, update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    image: "",
    googleProfileImage: ""
  })

  useEffect(() => {
    if (session?.user) {
      setFormData({
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        email: session.user.email || "",
        image: session.user.image || "",
        googleProfileImage: session.user.googleProfileImage || ""
      })
    }
  }, [session])

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil")
      }

      const updatedUser = await response.json()
      await update({
        ...session,
        user: {
          ...session?.user,
          ...updatedUser
        }
      })

      toast.success("Perfil actualizado correctamente")
      setIsEditing(false)
    } catch (error) {
      toast.error("Error al actualizar el perfil")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Perfil de Administrador</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Gestiona tu información personal y configuración
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Información Personal</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Actualiza tus datos personales
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.image || formData.googleProfileImage || ""} />
                  <AvatarFallback>{getInitials(formData.firstName, formData.lastName)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-medium">{formData.firstName} {formData.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                </div>
                <Button variant="outline" className="w-full">
                  Cambiar foto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Configuración</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Ajusta tus preferencias y configuración
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  {isEditing ? (
                    <>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar cambios"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            firstName: session?.user?.firstName || "",
                            lastName: session?.user?.lastName || "",
                            email: session?.user?.email || "",
                            image: session?.user?.image || "",
                            googleProfileImage: session?.user?.googleProfileImage || ""
                          })
                        }}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Editar perfil
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
} 