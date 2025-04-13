"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccompanimentForm } from "@/components/accompaniment/AccompanimentForm";
import axios from "axios";

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  subjects?: string[];
}

export default function NewAccompanimentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teacherId = searchParams.get("teacherId");

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeacher = useCallback(async () => {
    if (!teacherId) return;
    
    try {
      const response = await axios.get(`/api/teachers/${teacherId}`);
      setTeacher(response.data);
    } catch (error) {
      setError("Error al cargar los datos del profesor");
      console.error("Error fetching teacher:", error);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchTeacher();
  }, [fetchTeacher]);

  const handleSubmit = async (data: any) => {
    try {
      await axios.post("/api/accompaniments", {
        ...data,
        profesor: teacherId,
        coordinador: "current-user-id", // Esto debería ser reemplazado por el ID del usuario actual
      });
      router.push("/dashboard/coordinator/accompaniments");
    } catch (error) {
      setError("Error al guardar el acompañamiento");
      console.error("Error saving accompaniment:", error);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!teacher) {
    return <div>No se encontró el profesor</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Acompañamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Profesor: {teacher.firstName} {teacher.lastName}
            </h2>
            <p className="text-sm text-gray-500">{teacher.email}</p>
          </div>
          <AccompanimentForm
            accompaniment={{
              fecha: new Date(),
              tipo: "presencial",
              instrumento: {
                planificacion: {
                  objetivos: 1,
                  contenidos: 1,
                  metodologia: 1,
                  recursos: 1,
                  evaluacion: 1,
                },
                desarrollo: {
                  inicio: 1,
                  desarrollo: 1,
                  cierre: 1,
                  tiempo: 1,
                },
                aspectosPedagogicos: {
                  dominio: 1,
                  comunicacion: 1,
                  interaccion: 1,
                  clima: 1,
                },
              },
              observaciones: "",
              fortalezas: "",
              sugerencias: "",
            }}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
} 