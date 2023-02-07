import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  Logger,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { ProblemDetails } from "@tectonique/api-standards";
import { InternalServerProblemDetail } from "../DefaultServerProblemDetails";

function problemDetailToHttpException<
  STATUS extends number,
  TYPE extends string,
  PAYLOAD = undefined
>(problemDetail: ProblemDetails.ProblemDetail<STATUS, TYPE, PAYLOAD>) {
  return new HttpException(problemDetail, problemDetail.status);
}

function is5xx<STATUS extends number, TYPE extends string, PAYLOAD = undefined>(
  problemDetail: ProblemDetails.ProblemDetail<STATUS, TYPE, PAYLOAD>
) {
  return problemDetail.status >= 500 && problemDetail.status < 600;
}

@Catch()
export default class ProblemDetailHandlingExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(
    ProblemDetailHandlingExceptionFilter.name
  );

  constructor(applicationRef: HttpServer) {
    super(applicationRef);
  }

  catch(exception: any, host: ArgumentsHost) {
    const problemDetail = this.toProblemDetail(exception);

    this.logProblemDetail(problemDetail, exception);

    return super.catch(problemDetailToHttpException(problemDetail), host);
  }

  private toProblemDetail(
    exception: any
  ): ProblemDetails.ProblemDetail<any, any, any> {
    const isProblemDetail = ProblemDetails.isOne(exception);

    if (isProblemDetail) {
      return exception as ProblemDetails.ProblemDetail<any, any, any>;
    }

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();

      return ProblemDetails.create({
        status: exception.getStatus(),
        type: "unknown-legacy-error",
        title: "Unknown legacy error",
        detail: exception.message ?? "Unknown legacy error",
        payload: payload as any,
      });
    }

    return InternalServerProblemDetail();
  }

  private logProblemDetail<
    STATUS extends number,
    TYPE extends string,
    PAYLOAD = undefined
  >(
    problemDetail: ProblemDetails.ProblemDetail<STATUS, TYPE, PAYLOAD>,
    cause?: any
  ) {
    if (is5xx(problemDetail)) {
      let message = "5xx Problem Detail occurred:\n\n";
      message += JSON.stringify(problemDetail, null, 4);

      if (cause && !cause.stack && cause !== problemDetail) {
        message += "\n\nCause:\n\n";
        message +=
          typeof cause.toString === "function" ? cause.toString() : cause;
      }

      this.logger.error(message, cause.stack ?? "");
    }
  }
}
