import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class ProblemDetailFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const detail =
      typeof exceptionResponse === "string"
        ? exceptionResponse
        : (exceptionResponse as any).message;

    response.status(status).json({
      type: `https://httpstatuses.com/${status}`,
      title: exception.name,
      status,
      detail: Array.isArray(detail) ? detail.join(", ") : detail,
    });
  }
}
