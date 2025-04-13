// version1
// author Yxff
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Descripcion() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section className="py-24 bg-muted" id="Descripcion">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <Badge className="mb-6 bg-secondary text-secondary-foreground">
              DESCRIPCION
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold mb-6 text-primary"
            variants={itemVariants}
          >
            ETIAPC busca modernizar la gestion de evaluaciones a los docentes.
          </motion.h2>
          <motion.p className="text-primary/80 mb-12" variants={itemVariants}>
            Mediante herramientas modernas buscamos mejorar la gestion y
            visualizacion de evaluaciones a docentes. Para que tanto a los
            coordinadores como a los docentes tengan una experiencia de gestion
            de evaluaciones eficiente y sencilla.
            <br />
            <br />
            <p className="font-bold text-primary">
              Buscamos mejorar la experiencia de:
            </p>
          </motion.p>
          <motion.div
            className="grid grid-cols-3 gap-8 text-center"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <div className="text-4xl font-bold mb-2 text-secondary">2</div>
              <div className="text-sm text-primary/80">
                Ciclos del nivel secundario
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-4xl font-bold mb-2 text-secondary">25+</div>
              <div className="text-sm text-primary/80">
                Maestros de Primer Ciclo
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-4xl font-bold mb-2 text-secondary">29+</div>
              <div className="text-sm text-primary/80">
                Maestros de Segundo Ciclo
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
