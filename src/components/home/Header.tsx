// version1
// author Yxff
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          {/* <Image src="/Logo.png" alt="Etiapc logo" width={32} height={32} /> */}
          <img src="/Logo.png" alt="Etiapc logo" width={32} height={32} />
          <Link href="/" className="text-2xl font-bold">
            ETIAPC
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="#Objetivos"
            className="text-sm font-medium hover:text-secondary"
          >
            Objetivos
          </Link>
          <Link
            href="#Descripcion"
            className="text-sm font-medium hover:text-secondary"
          >
            Descripcion
          </Link>
          <Link
            href="#Opiniones"
            className="text-sm font-medium hover:text-secondary"
          >
            Opiniones
          </Link>
        </div>
        <Button variant="secondary">
          <Link href={"/auth/login"}>Ingresar</Link>
        </Button>
      </nav>
    </header>
  );
}
