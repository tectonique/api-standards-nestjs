import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { ValidatableZodDto } from "./types";

export default class ZodValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const zodDto = metadata.metatype as ValidatableZodDto<any>;

    if (zodDto.__zodType) {
      const parseResult = zodDto.__zodType.safeParse(value);

      if (!parseResult.success) {
        throw parseResult.error;
      }

      return parseResult.data;
    }

    return value;
  }
}
