"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/stat-card"
import { Users, ShieldCheck, FileText, Settings } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

// version1
// author Yxff

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function AdministratorDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    teachers: 0,
    coordinators: 0,
    admins: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  const quickLinks = [
    {
      title: "Usuarios",
      description: "Gestiona los usuarios del sistema",
      icon: Users,
      href: "/dashboard/administrator/users",
    },
    {
      title: "Reportes",
      description: "Visualiza reportes del sistema",
      icon: FileText,
      href: "/dashboard/administrator/reports",
    },
    {
      title: "Configuración",
      description: "Ajusta la configuración del sistema",
      icon: Settings,
      href: "/dashboard/administrator/settings",
    },
  ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 sm:p-6 max-w-7xl mx-auto"
    >
      <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Panel de Administración</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Bienvenido al panel de administración. Aquí tienes un resumen del sistema.
        </p>
      </motion.div>

      <motion.div 
        className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8" 
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Usuarios"
            value={stats.totalUsers}
            description="Usuarios registrados"
            icon={Users}
            color="primary"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Profesores"
            value={stats.teachers}
            description="Profesores activos"
            icon={Users}
            color="secondary"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Coordinadores"
            value={stats.coordinators}
            description="Coordinadores activos"
            icon={Users}
            color="default"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Administradores"
            value={stats.admins}
            description="Administradores del sistema"
            icon={Users}
            color="destructive"
          />
        </motion.div>
      </motion.div>

      <motion.div 
        className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
        variants={containerVariants}
      >
        {quickLinks.map((link, index) => (
          <motion.div key={link.title} variants={itemVariants}>
            <Link href={link.href}>
              <Card className="hover:bg-accent/50 dark:hover:bg-accent/30 transition-colors h-full border-2 hover:border-primary/50 dark:border-border/40 bg-card dark:bg-card/90">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                      <link.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg text-card-foreground">{link.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm sm:text-base mt-2 text-muted-foreground">{link.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}



