// version1
// author Yxff
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Algo salió mal!</h2>
      <p className="text-gray-600 mb-4">
        {error.message || 'Ocurrió un error inesperado'}
      </p>
      <Button
        onClick={() => reset()}
        className="bg-primary hover:bg-primary/90"
      >
        Intentar de nuevo
      </Button>
    </div>
  );
}