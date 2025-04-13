// version1
// author Yxff
import { AxiosError } from 'axios';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    const statusCode = error.response?.status || 500;
    const data = error.response?.data;
    
    throw new APIError(message, statusCode, data);
  }
  
  if (error instanceof Error) {
    throw new APIError(error.message, 500);
  }
  
  throw new APIError('Error desconocido', 500);
};

export const formatApiResponse = <T>(data: T, message?: string) => {
  return {
    success: true,
    message: message || 'Operación exitosa',
    data
  };
};