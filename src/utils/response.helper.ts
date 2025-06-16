import { ResponseType } from './response.type';
export function successResponse<T>(
  data: T,
  message = 'Success',
  code = 200,
): ResponseType {
  return {
    success: true,
    code,
    message,
    data,
  };
}
