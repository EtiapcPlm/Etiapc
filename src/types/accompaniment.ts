// version1
// author Yxff

export interface Acompanamiento {
  id: string;
  fecha: Date;
  profesor: {
    id: string;
    nombre: string;
    materia: string;
  };
  coordinador: {
    id: string;
    nombre: string;
  };
  estado: 'programado' | 'realizado' | 'cancelado';
  tipo: 'regular' | 'especial';
  instrumento: {
    planificacion: {
      objetivos: number;
      contenidos: number;
      metodologia: number;
      recursos: number;
      evaluacion: number;
    };
    desarrollo: {
      inicio: number;
      desarrollo: number;
      cierre: number;
      tiempo: number;
    };
    aspectosPedagogicos: {
      dominio: number;
      comunicacion: number;
      interaccion: number;
      clima: number;
    };
    observaciones: string;
    fortalezas: string;
    sugerencias: string;
  };
}

export interface EstadisticasProfesor {
  promedioGeneral: number;
  promedioPorCategoria: {
    planificacion: number;
    desarrollo: number;
    aspectosPedagogicos: number;
  };
  evolucion: {
    fecha: Date;
    puntuacion: number;
  }[];
  ultimosAcompanamientos: Acompanamiento[];
} 