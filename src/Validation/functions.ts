import { z, ZodError, ZodType } from "zod";
import { CondensedZodError, ValidatableZodDto } from "./types";

export function condenseZodError(error: ZodError): CondensedZodError {
  const issues = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  const message = `Validation failed: ${issues
    .map((issue) => `[${issue.path}]: ${issue.message}`)
    .join(", ")}`;

  return {
    issues,
    message,
  };
}

export function createDtoFromZodSchema<
  ZOD_TYPE extends ZodType,
  DATA = z.infer<ZOD_TYPE>
>(zodType: ZOD_TYPE): ValidatableZodDto<DATA> {
  const newClass = class NewZodDtoClass {} as ValidatableZodDto<DATA>;
  newClass.__zodType = zodType;

  return newClass;
}
