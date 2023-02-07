import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import { ZodError } from "zod";
import { ZodInternalValidationErrorProblemDetail } from "../DefaultServerProblemDetails";
import { condenseZodError } from "./functions";

export default class ZodErrorToProblemDetailInterceptor
  implements NestInterceptor
{
  private readonly logger = new Logger(ZodErrorToProblemDetailInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((originalError) => {
        if (originalError instanceof ZodError) {
          const condensedError = condenseZodError(originalError);

          const message =
            "Unknown internal zod validation error has been caught:\n" +
            `- Controller = ${context.getClass().name}\n` +
            `- Handler = ${context.getHandler().name}\n\n` +
            `Zod error:\n${JSON.stringify(condensedError, null, 4)}`;

          this.logger.error(message, "");

          throw ZodInternalValidationErrorProblemDetail();
        }

        throw originalError;
      })
    );
  }
}
