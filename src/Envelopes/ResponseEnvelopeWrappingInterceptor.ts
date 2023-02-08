import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { Response } from "express";
import { ResponseEnvelopes } from "@tectonique/api-standards";
import { Reflector } from "@nestjs/core";
import { API_STANDARDS_SKIP_ENVELOPE_WRAPPING } from "./consts";

export default class ResponseEnvelopeWrappingInterceptor
  implements NestInterceptor
{
  private readonly reflector = new Reflector();

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const skipEnvelopeWrapping: boolean =
      this.reflector.get<boolean>(
        API_STANDARDS_SKIP_ENVELOPE_WRAPPING,
        context.getHandler()
      ) ??
      this.reflector.get<boolean>(
        API_STANDARDS_SKIP_ENVELOPE_WRAPPING,
        context.getClass()
      ) ??
      false;

    if (skipEnvelopeWrapping) {
      return next.handle();
    }

    return next.handle().pipe(
      map((handlerResponse) => {
        if (
          context.getType() === "http" &&
          !ResponseEnvelopes.isOne(handlerResponse)
        ) {
          const httpContext = context.switchToHttp();
          const httpResponse = httpContext.getResponse() as Response;

          return ResponseEnvelopes.success<any>(
            httpResponse.statusCode,
            handlerResponse !== null && handlerResponse !== undefined
              ? handlerResponse
              : undefined
          );
        }

        return handlerResponse;
      })
    );
  }
}
