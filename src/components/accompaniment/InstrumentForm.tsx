// version1
// author Yxff
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Acompanamiento } from "@/types/accompaniment"

interface InstrumentFormProps {
  acompanamiento: Partial<Acompanamiento>
  onSubmit: (data: Acompanamiento) => void
}

export function InstrumentForm({ acompanamiento, onSubmit }: InstrumentFormProps) {
  const [formData, setFormData] = useState<Partial<Acompanamiento>>(acompanamiento)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData as Acompanamiento)
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
            <div className="space-y-2">
              <Label>Desarrollo</Label>
              <Select
                value={formData.instrumento?.desarrollo?.desarrollo?.toString()}
                onValueChange={(value) => handleChange("desarrollo", "desarrollo", parseInt(value))}
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
          <CardTitle>Aspectos Pedagógicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dominio del Contenido</Label>
              <Select
                value={formData.instrumento?.aspectosPedagogicos?.dominio?.toString()}
                onValueChange={(value) => handleChange("aspectosPedagogicos", "dominio", parseInt(value))}
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
              <Label>Comunicación</Label>
              <Select
                value={formData.instrumento?.aspectosPedagogicos?.comunicacion?.toString()}
                onValueChange={(value) => handleChange("aspectosPedagogicos", "comunicacion", parseInt(value))}
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
          <CardTitle>Observaciones y Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Observaciones</Label>
            <Textarea
              value={formData.instrumento?.observaciones}
              onChange={(e) => handleChange("instrumento", "observaciones", e.target.value)}
              placeholder="Escribe tus observaciones aquí..."
            />
          </div>
          <div className="space-y-2">
            <Label>Fortalezas</Label>
            <Textarea
              value={formData.instrumento?.fortalezas}
              onChange={(e) => handleChange("instrumento", "fortalezas", e.target.value)}
              placeholder="Escribe las fortalezas identificadas..."
            />
          </div>
          <div className="space-y-2">
            <Label>Sugerencias</Label>
            <Textarea
              value={formData.instrumento?.sugerencias}
              onChange={(e) => handleChange("instrumento", "sugerencias", e.target.value)}
              placeholder="Escribe las sugerencias de mejora..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Guardar Acompañamiento</Button>
      </div>
    </form>
  )
} 