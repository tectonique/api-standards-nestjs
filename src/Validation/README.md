# 💎 Zod powered data validation and transformation

This module
- allows you to validate incoming data (query parameters, request bodies)
- by defining and using Zod schemas
- and additionally strips unwanted attributes away respectively transforms your data as per your Zod schemas.

# 📖 Table of contents

<!-- TOC -->
* [💎 Zod powered data validation and transformation](#-zod-powered-data-validation-and-transformation)
* [📖 Table of contents](#-table-of-contents)
* [💾 Installation](#-installation)
  * [🎶 As part of bundle](#-as-part-of-bundle)
  * [🎵 Only this module](#-only-this-module)
* [🧑‍🏫 Tutorial](#-tutorial)
  * [🔎 Validated query parameters](#-validated-query-parameters)
  * [🏋️‍♀️ Validated request bodies](#-validated-request-bodies)
<!-- TOC -->

# 💾 Installation

## 🎶 As part of bundle

```typescript
import { useApiStandards } from '@tectonique/api-standards-nestjs';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Register all NestJS API standards components.
    useApiStandards(app, () => {
        return InternalServerProblemDetail();
    });
    
    await app.listen(8080);
}

bootstrap();
```

## 🎵 Only this module

```typescript
import { useApiStandards } from '@tectonique/api-standards-nestjs';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Register just the validation module.
    useZodValidationAndErrorHandling(app);
    
    await app.listen(8080);
}

bootstrap();
```

# 🧑‍🏫 Tutorial

You will learn, how to use Zod schemas for query parameter or request body validation.

## 🔎 Validated query parameters
You need to
- define a Zod object schema that represents the query parameters,
- create a DTO class using `createDtoFromZodSchema(zodType)`
- and use that DTO for `@Query()`.

Here is an example:

```typescript
import {UserNotFoundProblemDetail} from "@myProblemDetails"
import {z} from "zod"
import {createDtoFromZodSchema} from "./functions";

const API_GetUser_Query_Schema = z.object({
  email: z.string().email()
})

const API_GetUser_Query_DTO = createDtoFromZodSchema(API_GetUser_Query_Schema)

type API_GetUser_Response = {
  email: string,
  name: string
}

@Controller("users")
export class UserController {
  @Get(":email")
  public getUser(
      @Query() query: API_GetUser_Query_DTO
  ): API_GetUser_Response {
    if (query.email === "theo@testing.com") {
      return {
        "email": "theo@testing.com",
        "name": "Theo Tester"
      }
    }

    throw UserNotFoundProblemDetail()
  }
}
```

## 🏋️‍♀️ Validated request bodies
It's very similar to the approach for validated query parameters.

You need to
- define a Zod object schema that represents the request body,
- create a DTO class using `createDtoFromZodSchema(zodType)`
- and use that DTO for `@Body()`.

Here is an example:

```typescript
import {UserNotFoundProblemDetail} from "@myProblemDetails"
import {z} from "zod"
import {createDtoFromZodSchema} from "./functions";

const API_CreateUser_Request_Schema = z.object({
  email: z.string().email().trim(),
  name: z.string().min(1).trim()
})

const API_CreateUser_Request_DTO = createDtoFromZodSchema(API_CreateUser_Request_Schema)

const users : { email: string, name: string }[] = []

@Controller("users")
export class UserController {
  @Post()
  public createUser(
      @Body() body: API_CreateUser_Request_DTO
  ) {
    users.push(body)
  }
}
```

As you can see, we have also used `trim()`.

The validation system will not only validate your incoming data, it also applies
data stripping and data transformation that you define explicitly or 
implicitly with your ZOD schemas.