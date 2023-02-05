import { INestApplication } from "@nestjs/common";
import ZodValidationPipeline from "./ZodValidationPipeline";
import ZodErrorToProblemDetailInterceptor from "./ZodErrorToProblemDetailInterceptor";

export * from "./types";
export * from "./defaultProblemDetail";
export * from "./functions";
export { default as ZodErrorToProblemDetailInterceptor } from "./ZodErrorToProblemDetailInterceptor";
export { default as ZodValidationPipeline } from "./ZodValidationPipeline";

export function useZodValidationAndErrorHandling(app: INestApplication) {
  app.useGlobalInterceptors(new ZodErrorToProblemDetailInterceptor());
  app.useGlobalPipes(new ZodValidationPipeline());
}
