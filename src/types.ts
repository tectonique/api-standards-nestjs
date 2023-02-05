import { ProblemDetails } from "@tectonique/api-standards";

export type FallbackInternalServerProblemDetailGenerator =
  () => ProblemDetails.ProblemDetail<any, any, any>;
