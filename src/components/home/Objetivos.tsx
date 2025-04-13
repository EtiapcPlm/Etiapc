// version1
// author Yxff
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const objetivos = [
  {
    title: "Rapidez",
    desc: "Brindar una plataforma rapida y sencilla para la gestion de las evaluaciones.",
  },
  {
    title: "Eficiencia",
    desc: "Brindar eficiencia para que la gestion de las evaluaciones sea sencilla.",
  },
  {
    title: "Intuitividad",
    desc: "Brindar una experiencia de gestion de evaluaciones intuitiva y facil de usar.",
  },
  {
    title: "Seguridad",
    desc: "Brindar seguridad en los datos de cada evaluacion.",
  },
  {
    title: "Facilidad de uso",
    desc: "Brindar una experiencia donde registrar una evaluacion sea mas fácil que nunca.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Objetivos() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section
      className="bg-primary text-primary-foreground py-24"
      id="Objetivos"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Objetivos de ETIAPC</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Buscamos mejorar la experiencia en la gestion de evaluaciones a los
            docentes y como principales objetivos tenemos:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {objetivos.map((objetivo, index) => {
            const [cardRef, cardInView] = useInView({ triggerOnce: true });
            const cardControls = useAnimation();

            useEffect(() => {
              if (cardInView) {
                cardControls.start("visible");
              }
            }, [cardControls, cardInView]);

            return (
              <motion.div
                key={objetivo.title}
                ref={cardRef}
                initial="hidden"
                animate={cardControls}
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-primary-foreground text-primary hover:bg-secondary hover:text-secondary-foreground transition-colors">
                  <CardHeader>
                    <CardTitle>{objetivo.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{objetivo.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
