import { INestApplication } from "@nestjs/common";
import ZodValidationPipe from "./ZodValidationPipe";
import ZodErrorToProblemDetailInterceptor from "./ZodErrorToProblemDetailInterceptor";
import ZodResponseSchemaInterceptor from "./ZodResponseSchemaInterceptor";

export * from "./consts";
export * from "./decorators";
export * from "./defaults";
export * from "./functions";
export * from "./types";

export { default as ZodErrorToProblemDetailInterceptor } from "./ZodErrorToProblemDetailInterceptor";
export { default as ZodValidationPipe } from "./ZodValidationPipe";
export { default as ZodResponseSchemaInterceptor } from "./ZodResponseSchemaInterceptor";

export function useZodPoweredDataValidationAndTransformation(
  app: INestApplication
) {
  app.useGlobalInterceptors(new ZodErrorToProblemDetailInterceptor());
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new ZodResponseSchemaInterceptor());
}
