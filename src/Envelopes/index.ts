import { INestApplication } from "@nestjs/common";
import ProblemDetailHandlingExceptionFilter from "./ProblemDetailHandlingExceptionFilter";
import { HttpAdapterHost } from "@nestjs/core";
import ResponseEnvelopeWrappingInterceptor from "./ResponseEnvelopeWrappingInterceptor";

export * from "./consts";
export * from "./decorators";
export { default as ProblemDetailHandlingExceptionFilter } from "./ProblemDetailHandlingExceptionFilter";
export { default as ResponseEnvelopeWrappingInterceptor } from "./ResponseEnvelopeWrappingInterceptor";

export function useEnvelopeAndProblemDetailHandlers(app: INestApplication) {
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new ProblemDetailHandlingExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new ResponseEnvelopeWrappingInterceptor());
}
