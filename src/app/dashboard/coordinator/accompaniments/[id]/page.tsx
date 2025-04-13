"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccompanimentForm } from "@/components/accompaniment/AccompanimentForm";
import axios from "axios";
import { IAccompaniment } from "@/models/Accompaniment";

export default function AccompanimentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [accompaniment, setAccompaniment] = useState<IAccompaniment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccompaniment = useCallback(async () => {
    try {
      const response = await axios.get(`/api/accompaniments/${params.id}`);
      setAccompaniment(response.data);
    } catch (error) {
      setError("Error al cargar el acompañamiento");
      console.error("Error fetching accompaniment:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchAccompaniment();
  }, [fetchAccompaniment]);

  const handleSubmit = async (data: IAccompaniment) => {
    try {
      await axios.put(`/api/accompaniments/${params.id}`, data);
      router.push("/dashboard/coordinator/accompaniments");
    } catch (error) {
      setError("Error al actualizar el acompañamiento");
      console.error("Error updating accompaniment:", error);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!accompaniment) {
    return <div>No se encontró el acompañamiento</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Acompañamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <AccompanimentForm
            accompaniment={accompaniment}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
} 