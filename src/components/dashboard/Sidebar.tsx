"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Home,
  User,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  Users,
  ShieldCheck,
  GraduationCap,
  BarChart,
  Calendar,
  ClipboardList,
  Menu,
  X,
  FileText,
  LayoutDashboard,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

// version1
// author Yxff

// Tipo de rol basado en el modelo de usuario
type UserRole = "teacher" | "coordinator" | "administrator"

interface SidebarProps {
  userRole?: UserRole
  className?: string
}

export function Sidebar({ userRole = "teacher", className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Cerrar el sidebar cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isActive = (path: string) => {
    // Si es la ruta principal del dashboard
    if (path === `/dashboard/${userRole}`) {
      return pathname === path
    }
    // Para subrutas, verificar si la ruta actual comienza con la ruta del menú
    return pathname.startsWith(path)
  }

  // Menú para profesores
  const teacherMenuItems = [
    {
      label: "Inicio",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "Acompañamientos",
      href: "/dashboard/teacher/accompaniments",
      icon: Users,
    },
    {
      label: "Perfil",
      href: "/dashboard/teacher/profile",
      icon: User,
    },
  ]

  // Menú para coordinadores
  const coordinatorMenuItems = [
    {
      href: "/dashboard",
      label: "Inicio",
      icon: Home
    },
    {
      href: "/dashboard/coordinator/teachers",
      label: "Profesores",
      icon: Users
    },
    {
      href: "/dashboard/coordinator/accompaniments",
      label: "Acompañamientos",
      icon: ClipboardList
    },
    {
      href: "/dashboard/coordinator/profile",
      label: "Mi Perfil",
      icon: User
    }
  ]

  // Menú para administradores
  const adminMenuItems = [
    {
      href: "/dashboard",
      label: "Inicio",
      icon: Home
    },
    {
      href: "/dashboard/administrator/users",
      label: "Usuarios",
      icon: Users
    },
    {
      href: "/dashboard/administrator/reports",
      label: "Reportes",
      icon: FileText
    },
    {
      href: "/dashboard/administrator/settings",
      label: "Configuración",
      icon: Settings
    },
    {
      href: "/dashboard/administrator/profile",
      label: "Mi Perfil",
      icon: User
    }
  ]

  // Seleccionar el menú según el rol
  const menuItems = userRole === "administrator" ? adminMenuItems : userRole === "coordinator" ? coordinatorMenuItems : teacherMenuItems

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <aside className="h-full bg-primary text-primary-foreground dark:bg-primary/90">
      <div className="flex flex-col h-full">
        {/* Logo and Title */}
        <div className="flex items-center justify-between p-4 border-b border-primary-foreground/10 dark:border-primary-foreground/20">
          <Link href={`/dashboard/${userRole}`} className="flex items-center gap-2">
            <img
              src="/Logo.png"
              alt="Logo ETIAPC"
              className="h-12 w-auto"
            />
            <span className="text-xl font-bold">ETIAPC</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    pathname === item.href
                      ? "bg-primary-foreground/10 text-primary-foreground dark:bg-primary-foreground/20"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground dark:text-primary-foreground/80 dark:hover:bg-primary-foreground/10"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Help and Logout */}
        <div className="border-t border-primary-foreground/10 dark:border-primary-foreground/20 p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard/help"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground dark:text-primary-foreground/80 dark:hover:bg-primary-foreground/10 transition-colors"
              >
                <HelpCircle className="h-5 w-5" />
                <span>Ayuda</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground dark:text-primary-foreground/80 dark:hover:bg-primary-foreground/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  )
} 