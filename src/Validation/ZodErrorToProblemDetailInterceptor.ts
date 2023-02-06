import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import { ZodError } from "zod";
import { ZodValidationProblemDetail } from "./defaults";

export default class ZodErrorToProblemDetailInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((originalError) => {
        if (originalError instanceof ZodError) {
          throw ZodValidationProblemDetail(originalError);
        }

        throw originalError;
      })
    );
  }
}
