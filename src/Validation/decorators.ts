import { SetMetadata } from "@nestjs/common";
import { ZodType } from "zod";
import { API_STANDARDS_RESPONSE_ZOD_SCHEMA_METADATA_KEY } from "./consts";

export function ResponseSchema(zodSchema: ZodType) {
  return SetMetadata(API_STANDARDS_RESPONSE_ZOD_SCHEMA_METADATA_KEY, zodSchema);
}
