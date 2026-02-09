import { createError } from 'h3';

// Convenience constructors
export const BadRequestError = (msg: string) => createError({ statusCode: 400, message: msg });
export const UnauthorizedError = (msg: string) => createError({ statusCode: 401, message: msg });
export const ForbiddenError = (msg: string) => createError({ statusCode: 403, message: msg });
export const NotFoundError = (msg: string) => createError({ statusCode: 404, message: msg });
