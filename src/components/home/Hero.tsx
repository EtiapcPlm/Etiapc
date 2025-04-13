// version1
// author Yxff
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Hero() {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold leading-tight text-primary"
              variants={itemVariants}
            >
              Bienvenido a
              <br />
              ETIAPC.
            </motion.h1>
            <motion.p
              className="text-lg text-primary/80"
              variants={itemVariants}
            >
              Estrategia Tecnológica de Innovación y Acompañamiento Pedagógico
              Continuo.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <Button size="lg" variant="secondary">
                Ingresar
              </Button>
              <Link href="#Objetivos">
                <Button size="lg" variant="outline">
                  Leer más
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="flex gap-6 pt-8 ml-4"
              variants={itemVariants}
            >
              {["Capchase"].map((partner) => (
                <motion.div key={partner} variants={itemVariants}>
                  {/* <Image src="/logo-poli.png" alt={partner} width={125} height={50} className="h-12 w-auto" /> */}
                  <img
                    src="/logo-poli.png"
                    alt={partner}
                    width={125}
                    height={50}
                    className="h-12 w-auto"
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            className="relative"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-6">
              {/* <Image
                src="/demos-home.png"
                alt="Product Features"
                width={600}
                height={400}
                className="rounded-lg w-full"
              /> */}
              <img
                src="/demos-home.png"
                alt="Product Features"
                width={600}
                height={400}
                className="rounded-lg w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
