"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import axios from "axios"
import { Camera } from "lucide-react"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  role: string
  avatar: string
}

export default function CoordinatorProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatar: ""
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/user/profile")
      setProfile(response.data)
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        avatar: response.data.avatar || ""
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Error al cargar el perfil")
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      setFormData(prev => ({
        ...prev,
        avatar: response.data.url
      }))
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Error al subir la imagen")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.put("/api/user/profile", formData)
      setProfile({
        ...profile!,
        ...formData
      })
      setIsEditing(false)
      toast.success("Perfil actualizado correctamente")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Error al actualizar el perfil")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">No se pudo cargar el perfil</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {profile.firstName[0]}{profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label
                    htmlFor="avatar"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{profile.role}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Input
                value={profile.role}
                disabled
              />
            </div>
            <div className="flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        email: profile.email,
                        avatar: profile.avatar || ""
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Cambios</Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Editar Perfil
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 