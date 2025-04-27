"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccompanimentForm } from "@/components/accompaniment/AccompanimentForm";
import axios from "axios";
import { IAccompaniment } from "@/models/Accompaniment";

interface AccompanimentClientProps {
  initialAccompaniment: IAccompaniment;
  id: string;
}

export function AccompanimentClient({ initialAccompaniment, id }: AccompanimentClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: IAccompaniment) => {
    try {
      await axios.put(`/api/accompaniments/${id}`, data);
      router.push("/dashboard/coordinator/accompaniments");
    } catch (error) {
      setError("Error al actualizar el acompañamiento");
      console.error("Error updating accompaniment:", error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Acompañamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <AccompanimentForm
            accompaniment={initialAccompaniment}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
