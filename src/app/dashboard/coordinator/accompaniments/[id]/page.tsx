"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

interface Accompaniment {
  _id: string;
  fecha: string;
  profesor: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  coordinador: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  tipo: 'presencial' | 'virtual';
  instrumento: {
    planificacion: {
      objetivos: number;
      contenidos: number;
      metodologia: number;
      recursos: number;
      evaluacion: number;
    };
    desarrollo: {
      inicio: number;
      desarrollo: number;
      cierre: number;
      tiempo: number;
    };
    aspectosPedagogicos: {
      dominio: number;
      comunicacion: number;
      interaccion: number;
      clima: number;
    };
  };
  observaciones: string;
  fortalezas: string;
  sugerencias: string;
}

export default function CoordinatorAccompanimentDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const [accompaniment, setAccompaniment] = useState<Accompaniment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchAccompaniment();
  }, [params.id]);

  const fetchAccompaniment = async () => {
    try {
      const response = await axios.get(`/api/accompaniments/${params.id}`);
      setAccompaniment(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching accompaniment:", error);
      toast.error("Error al cargar el acompañamiento");
      router.push("/dashboard/coordinator/accompaniments");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInstrumentoChange = (section: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      instrumento: {
        ...prev.instrumento,
        [section]: {
          ...prev.instrumento[section],
          [field]: parseInt(value)
        }
      }
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/accompaniments/${params.id}`, formData);
      toast.success("Acompañamiento actualizado correctamente");
      setIsEditing(false);
      fetchAccompaniment();
    } catch (error) {
      console.error("Error updating accompaniment:", error);
      toast.error("Error al actualizar el acompañamiento");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Cargando detalles...</p>
      </div>
    );
  }

  if (!accompaniment) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Detalles del Acompañamiento</h1>
            <p className="text-muted-foreground">
              Información detallada del acompañamiento
            </p>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? "Guardar Cambios" : "Editar"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">
                Acompañamiento {accompaniment.tipo}
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Fecha:</span>{" "}
                  {new Date(accompaniment.fecha).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Profesor:</span>{" "}
                  {`${accompaniment.profesor.firstName} ${accompaniment.profesor.lastName}`}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Evaluación</h4>
              <div className="grid gap-4">
                <div>
                  <h5 className="text-sm font-medium mb-2">Planificación</h5>
                  <div className="grid gap-2">
                    {Object.entries(accompaniment.instrumento.planificacion).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <Label className="capitalize">{key}:</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={formData.instrumento?.planificacion[key]}
                            onChange={(e) => handleInstrumentoChange('planificacion', key, e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          <span>{value}/5</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">Desarrollo</h5>
                  <div className="grid gap-2">
                    {Object.entries(accompaniment.instrumento.desarrollo).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <Label className="capitalize">{key}:</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={formData.instrumento?.desarrollo[key]}
                            onChange={(e) => handleInstrumentoChange('desarrollo', key, e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          <span>{value}/5</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">Aspectos Pedagógicos</h5>
                  <div className="grid gap-2">
                    {Object.entries(accompaniment.instrumento.aspectosPedagogicos).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <Label className="capitalize">{key}:</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={formData.instrumento?.aspectosPedagogicos[key]}
                            onChange={(e) => handleInstrumentoChange('aspectosPedagogicos', key, e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          <span>{value}/5</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-medium">Observaciones</h4>
                {isEditing ? (
                  <Input
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {accompaniment.observaciones}
                  </p>
                )}
              </div>
              <div>
                <h4 className="font-medium">Fortalezas</h4>
                {isEditing ? (
                  <Input
                    name="fortalezas"
                    value={formData.fortalezas}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {accompaniment.fortalezas}
                  </p>
                )}
              </div>
              <div>
                <h4 className="font-medium">Sugerencias</h4>
                {isEditing ? (
                  <Input
                    name="sugerencias"
                    value={formData.sugerencias}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {accompaniment.sugerencias}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 