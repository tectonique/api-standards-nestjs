import { ZodType } from "zod";

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
