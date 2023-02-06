import { INestApplication } from "@nestjs/common";
import { FallbackInternalServerProblemDetailGenerator } from "./types";
import { useEnvelopeAndProblemDetailHandlers } from "./Envelopes";
import { useZodPoweredDataValidationAndTransformation } from "./Validation";

export * from "./types";
export * from "./Envelopes";
export * from "./Validation";

export function useApiStandards(
  app: INestApplication,
  fallbackInternalServerProblemDetailGenerator: FallbackInternalServerProblemDetailGenerator
) {
  useEnvelopeAndProblemDetailHandlers(
    app,
    fallbackInternalServerProblemDetailGenerator
  );

  useZodPoweredDataValidationAndTransformation(app);
}
