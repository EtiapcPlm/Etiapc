// version1
// author Yxff
"use client";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Objetivos from "@/components/home/Objetivos";
import Descripcion from "@/components/home/Descripcion";
import Opiniones from "@/components/home/Opiniones";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <Objetivos />
      <Descripcion />
      <Opiniones />
      <Footer />
    </main>
  )
}

