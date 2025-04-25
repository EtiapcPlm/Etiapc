import mongoose, { Schema, Document, model } from 'mongoose'

// version1
// author Yxff

export interface IAccompaniment extends Document {
  _id: string
  fecha: Date
  profesor: mongoose.Types.ObjectId
  coordinador: mongoose.Types.ObjectId
  tipo: 'presencial' | 'virtual'
  instrumento: {
    planificacion: {
      objetivos: number
      contenidos: number
      metodologia: number
      recursos: number
      evaluacion: number
    }
    desarrollo: {
      inicio: number
      desarrollo: number
      cierre: number
      tiempo: number
    }
    aspectosPedagogicos: {
      dominio: number
      comunicacion: number
      interaccion: number
      clima: number
    }
  }
  observaciones: string
  fortalezas: string
  sugerencias: string
  estado: 'realizado' | 'pendiente' | 'cancelado'
  createdAt: Date
  updatedAt: Date
}

const AccompanimentSchema = new Schema<IAccompaniment>(
  {
    fecha: { type: Date, required: true },
    profesor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coordinador: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tipo: { type: String, enum: ['presencial', 'virtual'], required: true },
    instrumento: {
      planificacion: {
        objetivos: { type: Number, required: true, min: 1, max: 5 },
        contenidos: { type: Number, required: true, min: 1, max: 5 },
        metodologia: { type: Number, required: true, min: 1, max: 5 },
        recursos: { type: Number, required: true, min: 1, max: 5 },
        evaluacion: { type: Number, required: true, min: 1, max: 5 }
      },
      desarrollo: {
        inicio: { type: Number, required: true, min: 1, max: 5 },
        desarrollo: { type: Number, required: true, min: 1, max: 5 },
        cierre: { type: Number, required: true, min: 1, max: 5 },
        tiempo: { type: Number, required: true, min: 1, max: 5 }
      },
      aspectosPedagogicos: {
        dominio: { type: Number, required: true, min: 1, max: 5 },
        comunicacion: { type: Number, required: true, min: 1, max: 5 },
        interaccion: { type: Number, required: true, min: 1, max: 5 },
        clima: { type: Number, required: true, min: 1, max: 5 }
      }
    },
    observaciones: { type: String, required: true },
    fortalezas: { type: String, required: true },
    sugerencias: { type: String, required: true },
    estado: { type: String, enum: ['realizado', 'pendiente', 'cancelado'], required: true }
  },
  { timestamps: true }
)

const AccompanimentModel = model<IAccompaniment>('Accompaniment', AccompanimentSchema)

export default AccompanimentModel 
