import { INestApplication } from "@nestjs/common";
import { FallbackInternalServerProblemDetailGenerator } from "../types";
import ProblemDetailHandlingExceptionFilter from "./ProblemDetailHandlingExceptionFilter";
import { HttpAdapterHost } from "@nestjs/core";
import ResponseEnvelopeWrappingInterceptor from "./ResponseEnvelopeWrappingInterceptor";

export { default as ProblemDetailHandlingExceptionFilter } from "./ProblemDetailHandlingExceptionFilter";
export { default as ResponseEnvelopeWrappingInterceptor } from "./ResponseEnvelopeWrappingInterceptor";

export function useEnvelopeAndProblemDetailHandlers(
  app: INestApplication,
  fallbackInternalServerProblemDetailGenerator: FallbackInternalServerProblemDetailGenerator
) {
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new ProblemDetailHandlingExceptionFilter(
      httpAdapter,
      fallbackInternalServerProblemDetailGenerator
    )
  );

  app.useGlobalInterceptors(new ResponseEnvelopeWrappingInterceptor());
}