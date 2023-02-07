import { z, ZodType } from "zod";

export type CondensedZodIssue = {
  path: string;
  message: string;
};

export type CondensedZodError = {
  issues: CondensedZodIssue[];
  message: string;
};

export type ValidatableZodDto<DATA> = {
  new (): DATA;
  __zodType: ZodType;
};

export type QueryType<ZOD_TYPE extends ZodType> = z.infer<ZOD_TYPE>;

export type BodyType<ZOD_TYPE extends ZodType> = z.infer<ZOD_TYPE>;

export type ResponseType<ZOD_TYPE extends ZodType> = z.input<ZOD_TYPE>;
