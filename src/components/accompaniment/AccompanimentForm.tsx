"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IAccompaniment } from "@/models/Accompaniment"

interface AccompanimentFormProps {
  accompaniment: Partial<IAccompaniment>
  onSubmit: (data: IAccompaniment) => void
}

export function AccompanimentForm({ accompaniment, onSubmit }: AccompanimentFormProps) {
  const [formData, setFormData] = useState<Partial<IAccompaniment>>(accompaniment)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData as IAccompaniment)
  }

  const handleChange = (section: string, field: string, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      instrumento: {
        ...prev.instrumento,
        [section]: {
          ...prev.instrumento?.[section],
          [field]: value
        }
      }
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Planificación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Objetivos</Label>
              <Select
                value={formData.instrumento?.planificacion?.objetivos?.toString()}
                onValueChange={(value) => handleChange("planificacion", "objetivos", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona puntuación" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contenidos</Label>
              <Select
                value={formData.instrumento?.planificacion?.contenidos?.toString()}
                onValueChange={(value) => handleChange("planificacion", "contenidos", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona puntuación" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desarrollo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Inicio</Label>
              <Select
                value={formData.instrumento?.desarrollo?.inicio?.toString()}
                onValueChange={(value) => handleChange("desarrollo", "inicio", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona puntuación" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  )
} 