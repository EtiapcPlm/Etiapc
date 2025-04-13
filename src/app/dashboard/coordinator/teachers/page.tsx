"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Mail,
  Phone,
  GraduationCap,
  Star,
  Calendar,
  Loader2,
  BookOpen,
  BarChart,
  User,
  PieChart,
} from "lucide-react";
import { useRouter } from "next/navigation";

// React
import { useState, useEffect } from "react";

// Conexion de la Base de datos
import { connectDB } from "@/lib/db/mongodb";
import axios from "axios";

// Interfaz de los datos de los profesores
interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  loginAttempts: number;
  createdAt: string;
  googleProfileImage: string;
  authProvider: string;
  subjects?: string[];
}

const roleLabels: Record<string, string> = {
  teacher: "Profesor",
};

export default function CoordinatorTeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users?role=teacher");
      console.log("Teachers fetched:", response.data);
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfile = (teacherId: string) => {
    router.push(`/dashboard/coordinator/teachers/${teacherId}`);
  };

  const handleNewAccompaniment = (teacherId: string) => {
    console.log("Creating new accompaniment for teacher ID:", teacherId);
    router.push(`/dashboard/coordinator/accompaniments/new?teacherId=${teacherId}`);
  };

  const handleEvaluations = (teacherId: string) => {
    router.push(`/dashboard/coordinator/accompaniments?teacherId=${teacherId}`);
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <User className="h-6 w-6 sm:h-8 sm:w-8" />
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Profesores</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona la información de tus profesores
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar profesores..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher._id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={teacher.googleProfileImage} />
                        <AvatarFallback>
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-base sm:text-lg font-medium">
                          {teacher.firstName} {teacher.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {teacher.email}
                        </p>
                      </div>
                    </div>
                    {teacher.subjects && teacher.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => handleProfile(teacher._id)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Perfil
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => handleEvaluations(teacher._id)}
                    >
                      <PieChart className="h-4 w-4 mr-2" />
                      Ver Acompañamientos
                    </Button>
                    <Button
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => handleNewAccompaniment(teacher._id)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Nuevo Acompañamiento
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTeachers.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">
                No se encontraron profesores que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
