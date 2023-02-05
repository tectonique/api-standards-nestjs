import { INestApplication } from "@nestjs/common";
import { FallbackInternalServerProblemDetailGenerator } from "./types";
import { useEnvelopeAndProblemDetailHandlers } from "./Envelopes";
import { useZodValidationAndErrorHandling } from "./Validation";

export * from "./types";
export * from "./Envelopes";

export function useApiStandards(
  app: INestApplication,
  fallbackInternalServerProblemDetailGenerator: FallbackInternalServerProblemDetailGenerator
) {
  useEnvelopeAndProblemDetailHandlers(
    app,
    fallbackInternalServerProblemDetailGenerator
  );

  useZodValidationAndErrorHandling(app);
}
