// version1
// author Yxff
import { format, parseISO, differenceInDays, differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatString = 'PPP') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: es });
};

export const formatDateTime = (date: string | Date) => {
  return formatDate(date, "PPP 'a las' p");
};

export const getTimeAgo = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  
  const daysDiff = differenceInDays(now, dateObj);
  if (daysDiff > 0) {
    return `hace ${daysDiff} ${daysDiff === 1 ? 'día' : 'días'}`;
  }
  
  const hoursDiff = differenceInHours(now, dateObj);
  if (hoursDiff > 0) {
    return `hace ${hoursDiff} ${hoursDiff === 1 ? 'hora' : 'horas'}`;
  }
  
  return 'hace unos minutos';
};