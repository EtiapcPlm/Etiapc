"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, Mail, Phone, MessageSquare, BookOpen, Shield } from "lucide-react"

export default function HelpPage() {
  const faqs = [
    {
      question: "¿Cómo puedo actualizar mi perfil?",
      answer: "Ve a la sección 'Mi Perfil' en el menú lateral. Allí podrás actualizar tu información personal y profesional.",
    },
    {
      question: "¿Cómo cambio mi contraseña?",
      answer: "En la sección 'Mi Perfil', encontrarás una pestaña de 'Seguridad' donde podrás cambiar tu contraseña.",
    },
    {
      question: "¿Cómo veo mis evaluaciones?",
      answer: "Accede a la sección 'Mis Evaluaciones' en el menú lateral para ver el historial de tus evaluaciones.",
    },
    {
      question: "¿Cómo contacto al soporte técnico?",
      answer: "Puedes enviar un ticket de soporte desde esta misma página o contactarnos por correo electrónico.",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Centro de Ayuda</h1>
        <p className="text-muted-foreground">
          Encuentra respuestas a tus preguntas y obtén soporte técnico.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Preguntas Frecuentes</CardTitle>
            <CardDescription>
              Respuestas a las preguntas más comunes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
            <CardDescription>
              ¿Necesitas ayuda? Contáctanos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>soporte@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+51 123 456 789</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Asunto</Label>
                <Input id="subject" placeholder="Ingresa el asunto de tu consulta" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  placeholder="Describe tu consulta en detalle"
                  className="min-h-[100px]"
                />
              </div>

              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar mensaje
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recursos Adicionales</CardTitle>
            <CardDescription>
              Documentación y guías útiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2 p-4 border rounded-lg">
                <BookOpen className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Guía de Usuario</h3>
                  <p className="text-sm text-muted-foreground">Manual completo del sistema</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 border rounded-lg">
                <Shield className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Seguridad</h3>
                  <p className="text-sm text-muted-foreground">Guía de buenas prácticas</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 border rounded-lg">
                <HelpCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Tutoriales</h3>
                  <p className="text-sm text-muted-foreground">Videos y guías paso a paso</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 