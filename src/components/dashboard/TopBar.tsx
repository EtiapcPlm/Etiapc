"use client"
import { Bell, ChevronDown, Menu, User, Settings, LogOut, Sun, Moon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

// version1
// author Yxff

// Simulación de rol de usuario - en una aplicación real, esto vendría de tu sistema de autenticación
type UserRole = "teacher" | "coordinator" | "administrator"

interface TopBarProps {
  userRole?: UserRole
  className?: string
  isSidebarOpen: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function TopBar({ 
  userRole = "teacher", 
  className = "", 
  isSidebarOpen, 
  setIsSidebarOpen 
}: TopBarProps) {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()

  const getDashboardTitle = (role: UserRole) => {
    switch (role) {
      case "administrator":
        return "Panel de Administrador"
      case "coordinator":
        return "Panel de Coordinador"
      default:
        return "Panel de Profesor"
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const userName = session?.user?.firstName || "Usuario"
  const userEmail = session?.user?.email || "usuario@ejemplo.com"
  const userImage = session?.user?.image || ""

  return (
    <header className={`sticky top-0 z-40 w-full border-b bg-background dark:bg-background/95 dark:border-border/40 ${className}`}>
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-accent dark:hover:bg-accent/50"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">
              {getDashboardTitle(userRole)}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground dark:text-muted-foreground/80" />
              <Switch 
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
              <Moon className="h-4 w-4 text-muted-foreground dark:text-muted-foreground/80" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-accent dark:hover:bg-accent/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userImage} alt={userName} />
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${userRole}/profile`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${userRole}/settings`} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/login" })} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
} 