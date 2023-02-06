import { ZodError } from "zod";
import { condenseZodError } from "./functions";
import { ProblemDetails } from "@tectonique/api-standards";

export const ZodValidationProblemDetail = ProblemDetails.factory({
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
