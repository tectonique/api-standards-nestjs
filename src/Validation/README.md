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
  * [🔎 Query parameters schema](#-query-parameters-schema)
  * [🏋️‍♀️ Request body schema](#-request-body-schema)
  * [📬 Response schema](#-response-schema)
  * [🤖 Data transformation](#-data-transformation)
  * [🧽 Data sanitization](#-data-sanitization)
  * [⛓ Strict mode](#-strict-mode)
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
    useZodPoweredDataValidationAndTransformation(app);
    
    await app.listen(8080);
}

bootstrap();
```

# 🧑‍🏫 Tutorial

You will learn, how to use Zod schemas for query parameter or request body validation.

## 🔎 Query parameters schema
You need to
- define a Zod object schema that represents the query parameters,
- create a DTO class using `createDtoFromZodSchema(zodType)`
- and use that DTO for `@Query()`.

Here is an example:

```typescript
import {UserNotFoundProblemDetail} from "@myProblemDetails"
import {z} from "zod"
import {createDtoFromZodSchema, QueryType} from "@tectonique/api-standards-nestjs";

const API_GetUser_Query_Schema = z.object({
  email: z.string().email()
})

class API_GetUser_Query_DTO extends createDtoFromZodSchema(API_GetUser_Query_Schema) {
}

// Can be used on the frontend side.
type API_GetUser_Query_Type = QueryType<typeof API_GetUser_Query_Schema>

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

## 🏋️‍♀️ Request body schema
It's very similar to the approach for validated query parameters.

You need to
- define a Zod object schema that represents the request body,
- create a DTO class using `createDtoFromZodSchema(zodType)`
- and use that DTO for `@Body()`.

Here is an example:

```typescript
import {UserNotFoundProblemDetail} from "@myProblemDetails"
import {z} from "zod"
import {createDtoFromZodSchema, BodyType} from "@tectonique/api-standards-nestjs";

const API_CreateUser_Request_Schema = z.object({
  email: z.string().email().trim(),
  name: z.string().min(1).trim()
})

const API_CreateUser_Request_DTO = createDtoFromZodSchema(API_CreateUser_Request_Schema)

// Can be used on the frontend side.
type API_CreateUser_Request_Type = BodyType<typeof API_CreateUser_Request_Schema>

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

## 📬 Response schema
You can also **define and apply** Zod schemas for API endpoints.

Again
- define a Zod object schema that represents the response body,
- infer the TypeScript type using `z.infer<typeof schema>` to use it as the method return type
- and add the decorator `@ResponseSchema(schema)` to your endpoint handler.

Here is an example:

```typescript
import {ResponseSchema, ResponseType} from "@tectonique/api-standards-nestjs";

const API_GetUsers_Schema = z.array(
  z.object({
    email: z.string().email(),
    name: z.string().min(1)
  })
)

type API_GetUsers_Response = ResponseType<typeof API_GetUsers_Schema>

@Controller("users")
export class UserController {
  @Get()
  @ResponseSchema(API_GetUsers_Schema)
  public getUsers(): API_GetUsers_Response {
    return [
      {
        email: "theo@testing.com",
        name: "Theo Tester"
      },
      // ...
    ]
  }
}
```

That's it. The cool thing here is – yes besides the data being validated – that you can 
Zod schemas here to transform data and sanitize internal data (e.g. coming from the database).

More on that in the next sections!

## 🤖 Data transformation
When using Zod, you don't just define _the schema_, you actually
**_define two schema_** implicitly or explicitly (if you know about it).

You define an **input** and an **output** schema.

We can use that to transform data very easily. The best use case – in our opinion – is 
sending Date objects back as ISO strings.

Check out the following basic example:
```typescript
const schema = z.object({
  title: z.string(),
  createdAt: z.date().transform((date) => date.toISOString())
})

console.log(
  schema.parse({
    title: "Hello World",
    createdAt: new Date()
  })
)
```

The following will be printed:
```json
{
  "title": "Hello World",
  "createdAt": "2023-02-06T07:10:07.471Z" 
}
```

You can make use of that in your controllers as well! The data transformation works for:
- incoming query parameters (`@Query()`)
- incoming request bodies (`@Body()`)
- responses (`@ResponseSchema()`)

## 🧽 Data sanitization
Zod also allows you to wipe "non whitelisted" attributes. By default, Zod drops every attribute
that has no Zod definition in the Zod schema.

```typescript
const schema = z.object({
  title: z.string(),
  createdAt: z.date().transform((date) => date.toISOString())
})

console.log(
  schema.parse({
    title: "Hello World",
    createdAt: new Date(),
    secretPassword: "0a9s8d70amsd9a8"
  })
)
```

The above will print out:
```json
{
  "title": "Hello World",
  "createdAt": "2023-02-06T07:10:07.471Z" 
}
```

_As you can see, `secretPassword` has been wiped!_

**Again:** You can make use of that in your controllers as well! The data sanitization works for:
- incoming query parameters (`@Query()`)
- incoming request bodies (`@Body()`)
- responses (`@ResponseSchema()`)

## ⛓ Strict mode
This relates to data sanitization as well.

If you don't want Zod to wipe unknown attributes, but instead throw an error, you need
to make your Zod schema by appending `.strict()` to your schema:

```typescript
const schema = z.object({
  title: z.string(),
  createdAt: z.date().transform((date) => date.toISOString())
}).strict()

console.log(
  schema.parse({
    title: "Hello World",
    createdAt: new Date(),
    
    // Will make `parse` fail.
    secretPassword: "0a9s8d70amsd9a8"
  })
)
```

The code above will result in an error such as:
```
ZodError: [
  {
    "code": "unrecognized_keys",
    "keys": [
      "secretPassword"
    ],
    "path": [],
    "message": "Unrecognized key(s) in object: 'secretPassword'"
  }
]
```

**Again:** You can make use of that in your controllers as well! The strict mode works for:
- incoming query parameters (`@Query()`)
- incoming request bodies (`@Body()`)
- responses (`@ResponseSchema()`)

_But no worries:_ The module will take care of such an error and return a Problem Detail! 😎