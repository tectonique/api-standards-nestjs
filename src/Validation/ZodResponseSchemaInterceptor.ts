import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Reflector } from "@nestjs/core";
import { API_STANDARDS_RESPONSE_ZOD_SCHEMA_METADATA_KEY } from "./consts";
import { ZodType } from "zod";
import { condenseZodError } from "./functions";
import { ZodResponseSchemaValidationProblemDetail } from "../DefaultServerProblemDetails";

export default class ZodResponseSchemaInterceptor implements NestInterceptor {
  private readonly reflector = new Reflector();
  private readonly logger = new Logger(ZodResponseSchemaInterceptor.name);

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
            const condensedError = condenseZodError(parseResult.error);

            const message =
              "@ResponseSchema() validation failed:\n" +
              `- Controller = ${context.getClass().name}\n` +
              `- Handler = ${context.getHandler().name}\n\n` +
              `Zod error:\n${JSON.stringify(condensedError, null, 4)}`;

            this.logger.error(message, "");

            throw ZodResponseSchemaValidationProblemDetail();
          }

          // We return the transformed/sanitized data.
          return parseResult.data;
        })
      );
    }

    return next.handle();
  }
}
