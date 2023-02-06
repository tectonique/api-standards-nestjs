import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Reflector } from "@nestjs/core";
import { API_STANDARDS_RESPONSE_ZOD_SCHEMA_METADATA_KEY } from "./consts";
import { ZodType } from "zod";

export default class ZodResponseSchemaInterceptor implements NestInterceptor {
  private readonly reflector = new Reflector();

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const zodResponseSchema = this.reflector.get<ZodType>(
      API_STANDARDS_RESPONSE_ZOD_SCHEMA_METADATA_KEY,
      context.getHandler()
    );

    if (zodResponseSchema) {
      return next.handle().pipe(
        map((handlerResponse) => {
          const parseResult = zodResponseSchema.safeParse(handlerResponse);

          // The ZodErrorToProblemDetailInterceptor will take of that.
          if (!parseResult.success) {
            throw parseResult.error;
          }

          // We return the transformed/sanitized data.
          return parseResult.data;
        })
      );
    }

    return next.handle();
  }
}
