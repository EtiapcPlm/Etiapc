"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search } from "lucide-react"
import { useState } from "react"
import { EditUserModal } from "./EditUserModal"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { getInitials } from "@/utils/getInitials"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

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
  lastLogin?: string
  googleProfileImage?: string
}

interface UsersTableProps {
  users: User[]
  onUserUpdated: () => void
  onUserDeleted: (userId: string) => void
}

type SortField = "firstName" | "lastName" | "email" | "role" | "createdAt"
type SortDirection = "asc" | "desc"

export function UsersTable({ users, onUserUpdated, onUserDeleted }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "verified" && user.isEmailVerified) ||
      (statusFilter === "pending" && !user.isEmailVerified)

    return matchesSearch && matchesRole && matchesStatus
  })

  // Ordenar usuarios
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDelete = (userId: string) => {
    setUserToDelete(users.find(u => u._id === userId) || null)
  }

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onUserDeleted(userToDelete._id)
      setUserToDelete(null)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "administrator":
        return "destructive"
      case "coordinator":
        return "default"
      case "teacher":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "administrator":
        return "Administrador"
      case "coordinator":
        return "Coordinador"
      case "teacher":
        return "Profesor"
      default:
        return role
    }
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <div className="min-w-[800px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b">
          <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="teacher">Profesores</SelectItem>
                <SelectItem value="coordinator">Coordinadores</SelectItem>
                <SelectItem value="administrator">Administradores</SelectItem>
          </SelectContent>
        </Select>
          </div>
      </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No se encontraron usuarios</p>
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead className="w-[200px]">Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
                <TableHead>Último acceso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || user.googleProfileImage || ""} />
                        <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                      </Avatar>
                    <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                  <TableCell className="max-w-[200px] truncate">{user.email}</TableCell>
                <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                    {user.isEmailVerified ? "Verificado" : "Pendiente"}
                  </Badge>
                </TableCell>
                <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Nunca"}
                </TableCell>
                  <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                        Editar
                      </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(user._id)}>
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

      <EditUserModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        onUserUpdated={onUserUpdated}
      />

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar a {userToDelete?.firstName} {userToDelete?.lastName}? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 