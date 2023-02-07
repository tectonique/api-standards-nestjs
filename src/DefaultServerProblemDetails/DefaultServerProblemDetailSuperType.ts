import { ProblemDetails } from "@tectonique/api-standards";
import DefaultServerProblemDetailsCollection from "./DefaultServerProblemDetailsCollection";

type DefaultServerProblemDetailSuperType = ProblemDetails.infer<
  typeof DefaultServerProblemDetailsCollection
>;

export default DefaultServerProblemDetailSuperType;
