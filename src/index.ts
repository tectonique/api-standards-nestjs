import { INestApplication } from "@nestjs/common";
import { useEnvelopeAndProblemDetailHandlers } from "./Envelopes";
import { useZodPoweredDataValidationAndTransformation } from "./Validation";

export * from "./DefaultServerProblemDetails";
export * from "./Envelopes";
export * from "./Validation";

export function useApiStandards(app: INestApplication) {
  useEnvelopeAndProblemDetailHandlers(app);
  useZodPoweredDataValidationAndTransformation(app);
}
