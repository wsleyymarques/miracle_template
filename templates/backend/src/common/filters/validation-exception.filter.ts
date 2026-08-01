import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ApiResponse } from '../responses/api-response';

@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.BAD_REQUEST;
    let mensagem = 'Dados inválidos informados';
    let errors: Record<string, string[]> = {};

    if (exception instanceof Array && exception[0] instanceof ValidationError) {
      const validationErrors = exception as ValidationError[];
      errors = this.formatErrors(validationErrors);
      mensagem = 'Erro de validação nos dados enviados';
    }

    const errorResponse = new ApiResponse(mensagem, null);
    errorResponse.sucesso = false;
    errorResponse.dados = { errors };
    errorResponse.statusCode = status;

    response.status(status).json(errorResponse);
  }

  private formatErrors(errors: ValidationError[]): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};

    errors.forEach((error) => {
      if (error.constraints) {
        formatted[error.property] = Object.values(error.constraints);
      }
      if (error.children && error.children.length > 0) {
        const childErrors = this.formatErrors(error.children);
        Object.assign(formatted, childErrors);
      }
    });

    return formatted;
  }
}