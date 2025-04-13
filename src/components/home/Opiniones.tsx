// version1
// author Yxff
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const opiniones = [
  {
    photo: "/logo-poli.png",
    name: "Lorenzo Mercado",
    role: "Ciencias Sociales",
    ciclo: "Primer Ciclo",
    content:
      '"We have been using SnapCall for a little while and it works wonders. We use SnapCall with Zendesk and the integration is seamless."',
  },
  {
    photo: "/logo-poli.png",
    name: "Francisco Garcia",
    role: "Informática - Base de Datos",
    ciclo: "Segundo Ciclo",
    content:
      '"A really useful extension to connect with your customers from your website. We add it and we\'re enjoying it every day, talking with our leads."',
  },
  {
    photo: "/logo-poli.png",
    name: "Maria Rodriguez",
    role: "Educación Artistica",
    ciclo: "Segundo Ciclo",
    content:
      '"A really useful extension to connect with your customers from your website. We add it and we\'re enjoying it every day, talking with our leads."',
  },
  {
    photo: "/logo-poli.png",
    name: "Pedro Matias",
    role: "Lenguas Extranjeras",
    ciclo: "Primer Ciclo",
    content:
      '"A really useful extension to connect with your customers from your website. We add it and we\'re enjoying it every day, talking with our leads."',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Opiniones() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section className="py-24 bg-white" id="Opiniones">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 text-primary">
          ETIAPC demuestra su calidad no solo en la plataforma,
          <br />
          sino tambien con la opinion de la mano de nuestros docentes:
        </h2>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
          className="grid md:grid-cols-2 gap-8"
        >
          {opiniones.map((opinion, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="p-6 bg-muted">
                <CardContent className="space-y-4">
                  <p className="text-lg text-primary">{opinion.content}</p>
                  <div className="flex items-center gap-4">
                    <Image
                      src={opinion.photo}
                      alt={opinion.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-primary">
                        {opinion.name}
                      </div>
                      <div className="text-sm text-primary/80">
                        {opinion.role}
                      </div>
                      <div className="text-sm text-primary/60">
                        {opinion.ciclo}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
