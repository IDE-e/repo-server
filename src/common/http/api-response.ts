import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from "@nestjs/common";
import type { Response } from "express";
import { map } from "rxjs/operators";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

function isApiResponse(x: unknown): x is { success: boolean } {
  return !!x && typeof x === "object" && "success" in (x as any);
}

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(_context: ExecutionContext, next: CallHandler<T>) {
    return next.handle().pipe(
      map((data) => {
        // 이미 {success:...} 형태면 그대로 둠 (혹시 특정 핸들러에서 직접 리턴할 때)
        if (isApiResponse(data)) return data as any;
        return { success: true, data };
      })
    );
  }
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error = this.extractMessage(exception);

    res.status(status).json({ success: false, error } satisfies ApiError);
  }

  private extractMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const r = exception.getResponse() as any;
      const msg = typeof r === "string" ? r : (r?.message ?? exception.message);
      if (Array.isArray(msg)) return msg.join(", ");
      return String(msg);
    }
    if (
      exception &&
      typeof exception === "object" &&
      "message" in (exception as any)
    ) {
      return String((exception as any).message);
    }
    return "Internal server error";
  }
}
