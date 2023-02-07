import { ProblemDetails } from "@tectonique/api-standards";
import { ZodError } from "zod";
import { condenseZodError } from "../Validation";

export const InternalServerProblemDetail = ProblemDetails.factory({
  status: 500,
  type: "internal-server-error",
  title: "Internal server error",
});

export const ZodInputValidationProblemDetail = ProblemDetails.factory({
  status: 400,
  type: "validation-error",
  title: "Validation error",
  generator: (zodError: ZodError) => {
    const { message, issues } = condenseZodError(zodError);
    return {
      detail: message,
      payload: issues,
    };
  },
});

export const ZodInternalValidationErrorProblemDetail = ProblemDetails.factory({
  status: 500,
  type: "internal-server-error-invalid-data",
  title: "Internal Server Error – Invalid Data",
});

export const ZodResponseSchemaValidationProblemDetail = ProblemDetails.factory({
  status: 500,
  type: "internal-server-error-invalid-response",
  title: "Internal Server Error – Invalid Response",
});
