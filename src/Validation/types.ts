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

export type ApiQueryType<ZOD_TYPE extends ZodType> = z.input<ZOD_TYPE>;

export type ApiBodyType<ZOD_TYPE extends ZodType> = z.input<ZOD_TYPE>;

export type InternalEndpointResponseType<ZOD_TYPE extends ZodType> =
  z.input<ZOD_TYPE>;
