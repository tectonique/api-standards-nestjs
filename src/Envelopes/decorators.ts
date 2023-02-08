import { SetMetadata } from "@nestjs/common";
import { API_STANDARDS_SKIP_ENVELOPE_WRAPPING } from "./consts";

export function SkipEnvelopeWrapping() {
  return SetMetadata(API_STANDARDS_SKIP_ENVELOPE_WRAPPING, true);
}
