import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { Response } from "express";
import { ResponseEnvelopes } from "@tectonique/api-standards";

export default class ResponseEnvelopeWrappingInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((handlerResponse) => {
        if (
          context.getType() === "http" &&
          !ResponseEnvelopes.isOne(handlerResponse)
        ) {
          const httpContext = context.switchToHttp();
          const httpResponse = httpContext.getResponse() as Response;

          const envelope = ResponseEnvelopes.success<any>(
            httpResponse.statusCode,
            handlerResponse !== null && handlerResponse !== undefined
              ? handlerResponse
              : undefined
          );

          return envelope;
        }

        return handlerResponse;
      })
    );
  }
}
