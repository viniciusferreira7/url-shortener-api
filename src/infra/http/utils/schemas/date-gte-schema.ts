import z from 'zod';

export const dateGteSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format. Use yyyy-mm-dd')
  .refine((value) => {
    const [y, m, d] = value.split('-').map(Number);
    const date = new Date(y, m - 1, d);

    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    );
  }, 'Invalid date')
  .transform((val) => new Date(val));
