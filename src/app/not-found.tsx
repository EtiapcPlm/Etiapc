// version1
// author Yxff
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
      <p className="text-gray-600 mb-4">
        Lo sentimos, la página que estás buscando no existe.
      </p>
      <Button asChild className="bg-primary hover:bg-primary/90">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
} 