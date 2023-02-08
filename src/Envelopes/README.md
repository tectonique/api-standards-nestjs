# 📨 Envelopes and ⚠️ Problem Details

This module makes your NestJS application always return
- API response envelopes
- or Problem Details (an error envelope).

This module implements the envelope and error handling system
advocated by the base library [tectonique/api-standards 🔗](https://github.com/tectonique/api-standards).

# 📖 Table of contents

<!-- TOC -->
* [📨 Envelopes and ⚠️ Problem Details](#-envelopes-and--problem-details)
* [📖 Table of contents](#-table-of-contents)
* [💾 Installation](#-installation)
  * [🎶 As part of bundle](#-as-part-of-bundle)
  * [🎵 Only this module](#-only-this-module)
* [🧑‍🏫 Tutorial](#-tutorial)
  * [✅ Success envelopes](#-success-envelopes)
  * [⚠️ Problem Detail responses](#-problem-detail-responses)
  * [💠 Type safe API calls](#-type-safe-api-calls)
  * [✋ Disable envelope wrapping](#-disable-envelope-wrapping)
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

    // Register just the envelope and problem detail module.
    useEnvelopeAndProblemDetailHandlers(app, () => {
        return InternalServerProblemDetail();
    });
    
    await app.listen(8080);
}

bootstrap();
```

# 🧑‍🏫 Tutorial

## ✅ Success envelopes
You do not need to do anything special. The installed module will take care of everything.

Just
- create controllers,
- create endpoints
- and call them as usual.

Here is an example controller:
```typescript
type API_GetUsers_Response = {
  email: string,
  name: string
}[]

@Controller("users")
export class UserController {
  @Get()
  public getUsers() : API_GetUsers_Response {
    return [
      {
        email: "theo@testing.com",
        name: "Theo Tester"
      }
    ]
  }
}
```

A `GET` call to `/users` will now result in the following JSON response body:

```json
{
  "success": true,
  "status": 200,
  "payload": [
    {
      "email": "theo@testing.com",
      "name": "Theo Tester"
    }
  ]
}
```

## ⚠️ Problem Detail responses
What happens, if we throw a Problem Detail?

Here is an example Problem Detail:
```typescript
import {ProblemDetails} from "@tectonique/api-standards";

export const UserNotFoundProblemDetail = ProblemDetails.factory({
  status: 404,
  type: "user-not-found",
  title: "User not found"
})
```

And here an extended controller example:
```typescript
import { UserNotFoundProblemDetail } from "@myProblemDetails"

// ...

type API_GetUser_Response = {
  email: string,
  name: string
}

@Controller("users")
export class UserController {
  // ...
  
  @Get(":email")
  public getUser(@Param("email") email: string) : API_GetUser_Response {
    if ( email === "theo@testing.com" ) {
      return {
        "email": "theo@testing.com",
        "name": "Theo Tester"
      }
    }
    
    throw UserNotFoundProblemDetail()
  }
}
```

A `GET` call to `/users/theo@testing.com` will result in:
```json
{
  "success": true,
  "status": 200,
  "payload": {
    "email": "theo@testing.com",
    "name": "Theo Tester"
  }
}
```

**BUT,** a `GET` call to `/users/unknown@never.com` will result in:

```json
{
  "success": false,
  "status": 400,
  "type": "user-not-found",
  "title": "User not found",
  "detail": "User not found",
  "instance": "urn:uuid:9asd8..."
}
```

Very cool! 😎

## 💠 Type safe API calls

You can now perform type safe calls like it's described in [tectonique/api-standards 🔗](https://github.com/tectonique/api-standards).

Here is an example:
```typescript
import { ResponseEnvelopes } from "@tectonique/api-standards"

import { ProblemDetailSuperType } from "@backend/myProblemDetails"
import { API_GetUser_Response } from "@backend/modules/users/UserController"

const data = await axios.get("/users/theo@testing.com")
  .then((response) => response.data)
  .catch((error) => error.response.data)

if ( ResponseEnvelopes.isEnvelope(data) ) {
  const envelope = data as ResponseEnvelopes.Envelope<
    ProblemDetailSuperType,
    API_GetUser_Response
  >
  
  if ( envelope.success ) {
    console.log("User data:", evelope.payload)
    
  } else if ( envelope.type === "user-not-found" ) {
    alert("User does not exist.")
    
  } else {
    alert("Unknown error occurred: " + envelope.type)  
  }
}
```

Isn't that fantastic? 😍

## ✋ Disable envelope wrapping
You may need an endpoint that renders a Handlebars view. In this case you don't want to get an envelope.

In order to disable envelope wrapping, just decorate your controller class
or endpoint method with `@SkipEnvelopeWrapping()`.