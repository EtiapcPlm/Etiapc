"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import {
  GraduationCap,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import axios from "axios";

// version1
// author Yxff

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function CoordinatorDashboard() {
  const [stats, setStats] = useState({
    teachers: 0,
    completedAccompaniments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);
  // // Datos simulados para el dashboard del coordinador
  // const stats = {
  //   totalTeachers: 25,
  //   pendingEvaluations: 5,
  //   completedEvaluations: 42,
  //   totalSubjects: 8,
  // }

  const quickLinks = [
    {
      title: "Gestión de Profesores",
      description: "Administrar profesores",
      icon: GraduationCap,
      href: "/dashboard/coordinator/teachers",
    },
    {
      title: "Acompañamientos",
      description: "Gestionar acompañamientos",
      icon: Calendar,
      href: "/dashboard/coordinator/accompaniments",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground dark:text-foreground">Panel de Coordinador</h1>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Gestión y seguimiento de acompañamientos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Total de Profesores"
          value={stats.teachers}
          icon={GraduationCap}
          description="Profesores registrados"
          color="primary"
        />
        <StatCard
          title="Acompañamientos Realizados"
          value={stats.completedAccompaniments}
          icon={Calendar}
          description="Total de acompañamientos"
          color="secondary"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quickLinks.map((link, index) => (
          <motion.div
            key={link.title}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link href={link.href}>
              <Card className="h-full hover:bg-accent/50 dark:hover:bg-accent/30 transition-colors duration-200 bg-card dark:bg-card/90 border-border dark:border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <link.icon className="h-5 w-5 text-muted-foreground dark:text-muted-foreground/80" />
                    <CardTitle className="text-lg text-card-foreground dark:text-card-foreground">{link.title}</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground dark:text-muted-foreground/80">{link.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
