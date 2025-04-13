import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ClipboardCheck, 
  AlertCircle, 
  BarChart,
  Activity,
  Shield
} from "lucide-react";

interface OverviewCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  color?: string;
}

interface OverviewProps {
  cards: OverviewCard[];
  role: 'teacher' | 'coordinator' | 'administrator';
}

export default function Overview({ cards, role }: OverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color || 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 