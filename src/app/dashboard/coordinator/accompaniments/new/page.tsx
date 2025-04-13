"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Loader2, Save, User } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  
  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    fecha: "",
    tipo: "presencial",
    estado: "pendiente",
    instrumento: {
      planificacion: {
        objetivos: 0,
        contenidos: 0,
        metodologia: 0,
        recursos: 0,
        evaluacion: 0
      },
      desarrollo: {
        inicio: 0,
        desarrollo: 0,
        cierre: 0,
        tiempo: 0
      },
      aspectosPedagogicos: {
        dominio: 0,
        comunicacion: 0,
        interaccion: 0,
        clima: 0
      }
    },
    observaciones: "",
    fortalezas: "",
    sugerencias: ""
  });

  useEffect(() => {
    if (teacherId) {
      fetchTeacher();
    } else {
      router.push("/dashboard/coordinator/teachers");
    }
  }, [teacherId, router]);

  const fetchTeacher = async () => {
    try {
      console.log("Fetching teacher with ID:", teacherId);
      const response = await axios.get(`/api/users/${teacherId}`);
      console.log("Teacher data:", response.data);
      setTeacher(response.data);
    } catch (error) {
      console.error("Error fetching teacher:", error);
      router.push("/dashboard/coordinator/teachers");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting form with data:", {
        ...formData,
        profesor: teacherId,
      });
      
      const response = await axios.post("/api/accompaniments", {
        ...formData,
        profesor: teacherId,
      });
      
      console.log("Response:", response.data);
      
      router.push(`/dashboard/coordinator/accompaniments?teacherId=${teacherId}`);
    } catch (error) {
      console.error("Error creating accompaniment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInstrumentChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      instrumento: {
        ...prev.instrumento,
        [section]: {
          ...prev.instrumento[section],
          [field]: parseFloat(value)
        }
      }
    }));
  };

  if (!teacher) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <User className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Nuevo Acompañamiento</h1>
            <p className="text-muted-foreground">
              Profesor: {teacher.firstName} {teacher.lastName}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fecha">Fecha y Hora</Label>
                  <Input
                    id="fecha"
                    name="fecha"
                    type="datetime-local"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Acompañamiento</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, tipo: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planificación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(formData.instrumento.planificacion).map(([key, value]) => (
                  <div key={key} className="grid gap-2">
                    <Label htmlFor={`planificacion-${key}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} (0-5)
                    </Label>
                    <Input
                      id={`planificacion-${key}`}
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={value}
                      onChange={(e) => handleInstrumentChange('planificacion', key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desarrollo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(formData.instrumento.desarrollo).map(([key, value]) => (
                  <div key={key} className="grid gap-2">
                    <Label htmlFor={`desarrollo-${key}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} (0-5)
                    </Label>
                    <Input
                      id={`desarrollo-${key}`}
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={value}
                      onChange={(e) => handleInstrumentChange('desarrollo', key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aspectos Pedagógicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(formData.instrumento.aspectosPedagogicos).map(([key, value]) => (
                  <div key={key} className="grid gap-2">
                    <Label htmlFor={`aspectosPedagogicos-${key}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} (0-5)
                    </Label>
                    <Input
                      id={`aspectosPedagogicos-${key}`}
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={value}
                      onChange={(e) => handleInstrumentChange('aspectosPedagogicos', key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observaciones y Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    placeholder="Describe las observaciones realizadas durante el acompañamiento..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fortalezas">Fortalezas</Label>
                  <Textarea
                    id="fortalezas"
                    name="fortalezas"
                    value={formData.fortalezas}
                    onChange={handleChange}
                    placeholder="Identifica las fortalezas observadas en la práctica docente..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sugerencias">Sugerencias</Label>
                  <Textarea
                    id="sugerencias"
                    name="sugerencias"
                    value={formData.sugerencias}
                    onChange={handleChange}
                    placeholder="Proporciona sugerencias para mejorar la práctica docente..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Acompañamiento
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 