# 📜 Changelog

# 📖 Table of contents

<!-- TOC -->
* [📜 Changelog](#-changelog)
* [📖 Table of contents](#-table-of-contents)
* [0.x.y](#0xy)
  * [0.0.20](#0020)
  * [0.0.19](#0019)
  * [0.0.18](#0018)
  * [0.0.17](#0017)
  * [0.0.16](#0016)
  * [0.0.15](#0015)
  * [0.0.14](#0014)
  * [0.0.13](#0013)
  * [0.0.12](#0012)
  * [0.0.11](#0011)
  * [0.0.10](#0010)
  * [0.0.9](#009)
  * [0.0.8](#008)
  * [0.0.7](#007)
  * [0.0.6](#006)
  * [0.0.5](#005)
  * [0.0.4](#004)
  * [0.0.3](#003)
  * [0.0.2](#002)
  * [0.0.1](#001)
<!-- TOC -->

# 0.x.y

## 0.0.20
- Fixed changelog

## 0.0.19
- Bumped version of `@tectonique/api-standards` to `^1.0.0`

## 0.0.18
- Set correct content type for problem details ("application/json+problem").

## 0.0.17
- Added decorator to skip envelope wrapping.

## 0.0.16
- Correct dist/

## 0.0.15
- Improved error logging.

## 0.0.14
- Added `ApiResponseType`
- Renamed `InternalEndpointResponseType` to `EndpointResponseType`

## 0.0.13
- Changed body and query utility type to use z.input.
- Changed names of utility types to be more explicit.

## 0.0.12
- Correct dist/

## 0.0.11
- Fixed export of `DefaultServerProblemDetailSuperType`.

## 0.0.10
- Added utility types for correctly getting query, body and response types:
  - `QueryType<ZOD_TYPE>`
  - `BodyType<ZOD_TYPE>`
  - `ResponseType<ZOD_TYPE>`

## 0.0.9
- Created default problem details collection.
  - Exports ZodValidationProblemDetail.
  - Exports InternalServerErrorProblemDetail.
  - Exports DefaultServerProblemDetailsCollection.
  - Exports DefaultServerProblemDetailSuperType.
- `useApiStandards(app)` does not require fallback internal server problem detail generator anymore.
- `ZodValidation` now directly throws `ZodInputValidationProblemDetail` (only one that exposes error messages).
- `@ResponseSchema()` validation failures now cause a separate `ResponseSchemaValidationProblemDetail` to be thrown.
- All other ZodErrors now cause a `ZodInternalValidationErrorProblemDetail` to be thrown.

## 0.0.8
- Changed `@ResponseSchema(schema)` check to sync one for now.

## 0.0.7
- Added logging capabilities to ProblemDetailHandlingExceptionFilter > 5xx errors are now logged.

## 0.0.6
- Response schema powered data validation and transformation
- Extended validation docs

## 0.0.5
- Docs typos

## 0.0.4
- Extended index README
- Docs for envelope and problem detail system 
- Docs for validation system

## 0.0.3
- Validation folder reexported

## 0.0.2
- Zod based validation system
- ZodError to ProblemDetail system

## 0.0.1
- Initial release.
- Envelope interceptor.
- ProblemDetail exception filter.