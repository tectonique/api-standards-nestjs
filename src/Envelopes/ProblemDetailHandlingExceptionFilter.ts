import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { ProblemDetails } from "@tectonique/api-standards";
import { FallbackInternalServerProblemDetailGenerator } from "../types";

function problemDetailToHttpException<
  STATUS extends number,
  TYPE extends string,
  PAYLOAD = undefined
>(problemDetail: ProblemDetails.ProblemDetail<STATUS, TYPE, PAYLOAD>) {
  return new HttpException(problemDetail, problemDetail.status);
}

@Catch()
export default class ProblemDetailHandlingExceptionFilter extends BaseExceptionFilter {
  constructor(
    applicationRef: HttpServer,
    private readonly fallbackInternalServerProblemDetailGenerator: FallbackInternalServerProblemDetailGenerator
  ) {
    super(applicationRef);
  }

  catch(exception: any, host: ArgumentsHost) {
    const isProblemDetail = ProblemDetails.isOne(exception);

    if (isProblemDetail) {
      const problemDetail = exception as ProblemDetails.ProblemDetail<
        any,
        any,
        any
      >;

      return super.catch(problemDetailToHttpException(problemDetail), host);
    }

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();

      const problemDetail = ProblemDetails.create({
        status: exception.getStatus(),
        type: "unknown-legacy-error",
        title: "Unknown legacy error",
        detail: "",
        payload: payload as any,
      });

      return super.catch(problemDetailToHttpException(problemDetail), host);
    }

    return super.catch(
      problemDetailToHttpException(
        this.fallbackInternalServerProblemDetailGenerator()
      ),
      host
    );
  }
}
