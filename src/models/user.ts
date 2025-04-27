import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Esquema de validación con Zod
export const UserSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().optional(),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  role: z.enum(['teacher', 'coordinator', 'administrator']),
  status: z.enum(['active', 'inactive']).default('active'),
  loginAttempts: z.number().default(0),
  lockUntil: z.date().nullable().default(null),
  googleProfileImage: z.string().nullable().default(null),
  image: z.string().nullable().default(null),
  authProvider: z.enum(['local', 'google']).default('local'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type UserType = z.infer<typeof UserSchema>;

// Interfaz de Mongoose
interface IUser extends Document, UserType {
  validateSchema(): z.SafeParseReturnType<UserType, UserType>;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, "El nombre es requerido"],
    trim: true,
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es requerido"],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: function(this: IUser) {
      return this.authProvider === 'local';
    },
    minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
  },
  role: {
    type: String,
    enum: ["teacher", "coordinator", "administrator"],
    default: "teacher",
    required: true,
  },
  status: { 
    type: String, 
    default: 'active',
    enum: ['active', 'inactive']
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    default: null,
  },
  googleProfileImage: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
  }
});

// Índices para mejorar el rendimiento de las consultas
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Middleware para actualizar updatedAt
userSchema.pre('save', function(this: IUser, next) {
  this.updatedAt = new Date();
  next();
});

// Método para validar el esquema
userSchema.methods.validateSchema = function(this: IUser) {
  return UserSchema.safeParse(this.toObject());
};

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
