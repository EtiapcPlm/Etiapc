import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Evaluation {
  id: string;
  title: string;
  date: Date;
  status: 'pending' | 'completed';
  score?: number;
}

interface RecentEvaluationsProps {
  evaluations: Evaluation[];
  onViewDetails?: (id: string) => void;
  role: 'teacher' | 'coordinator' | 'administrator';
}

export default function RecentEvaluations({ 
  evaluations, 
  onViewDetails,
  role 
}: RecentEvaluationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluaciones Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{evaluation.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(evaluation.date, "PPP", { locale: es })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${
                  evaluation.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {evaluation.status === 'completed' ? 'Completada' : 'Pendiente'}
                </span>
                {evaluation.score && (
                  <span className="text-sm font-medium">
                    {evaluation.score}/5
                  </span>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails?.(evaluation.id)}
                >
                  Ver Detalles
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 