# @devlocore/apipack

A TypeScript utility library for Express.js applications, providing Zod validation middleware, logging helpers, and project utilities.

## Installation

```bash
npm install @devlocore/apipack
```

## Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install express moment zod
```

## Modules

This package exports three modules:

- `@devlocore/apipack/zod` - Zod validation middleware for Express
- `@devlocore/apipack/helper` - Project utility helpers
- `@devlocore/apipack/log` - Logging utilities

---

## Zod Validation Middleware

Middleware functions to validate Express request body, params, and query using Zod schemas.

### Import

```typescript
import {
  validateBody,
  validateParams,
  validateQuery,
  sendErrors,
  zodSchema_Id,
  zodSchema_IdString,
  zodSchema_Name
} from '@devlocore/apipack/zod';
```

### Usage

#### Validate Request Body

```typescript
import express from 'express';
import { z } from 'zod';
import { validateBody } from '@devlocore/apipack/zod';

const app = express();
app.use(express.json());

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional()
});

app.post('/users', validateBody(userSchema), (req, res) => {
  // req.body is validated
  res.json({ message: 'User created', data: req.body });
});
```

#### Validate Request Params

```typescript
import { z } from 'zod';
import { validateParams, zodSchema_Id } from '@devlocore/apipack/zod';

// Using built-in schema
app.get('/users/:id', validateParams(zodSchema_Id), (req, res) => {
  // req.params.id is validated as a number
  res.json({ userId: req.params.id });
});

// Using custom schema
const customParamsSchema = z.object({
  userId: z.number(),
  postId: z.number()
});

app.get('/users/:userId/posts/:postId', validateParams(customParamsSchema), (req, res) => {
  res.json({ userId: req.params.userId, postId: req.params.postId });
});
```

#### Validate Query Parameters

```typescript
import { z } from 'zod';
import { validateQuery } from '@devlocore/apipack/zod';

const querySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional()
});

app.get('/users', validateQuery(querySchema), (req, res) => {
  // Access validated query via req.validatedQuery
  const { page, limit, search } = req.validatedQuery;
  res.json({ page, limit, search });
});
```

### Built-in Schemas

- `zodSchema_Id` - `{ id: z.number() }`
- `zodSchema_IdString` - `{ id: z.string() }`
- `zodSchema_Name` - `{ name: z.string() }`

### Automatic Type Conversion

The middleware automatically converts string values to their expected types:
- Strings to numbers (for params and query)
- Strings to booleans (for params and query)
- Strings to dates (for body, params, and query)

---

## Helper Utilities

Utility functions for project path resolution and environment detection.

### Import

```typescript
import {
  projectRoot,
  workingDirectory,
  isProductionEnvironment
} from '@devlocore/apipack/helper';
```

### Usage

```typescript
import { projectRoot, workingDirectory, isProductionEnvironment } from '@devlocore/apipack/helper';

// Get the project root directory (where package.json is located)
console.log('Project root:', projectRoot);

// Get the current working directory
console.log('Working directory:', workingDirectory());

// Check if running in production
if (isProductionEnvironment()) {
  console.log('Running in production mode');
} else {
  console.log('Running in development mode');
}
```

---

## Logging Utilities

Utilities for enhanced console logging with timestamps and log file redirection.

### Import

```typescript
import { logWithDatePrefix, redirectLogs } from '@devlocore/apipack/log';
```

### Usage

#### Add Timestamps to Console Output

```typescript
import { logWithDatePrefix } from '@devlocore/apipack/log';

// Enable date prefixes for all console methods
logWithDatePrefix();

console.log('Hello world');
// Output: [12/1/2025, 10:30:00 AM] Hello world

console.error('An error occurred');
// Output: [12/1/2025, 10:30:00 AM] An error occurred
```

#### Redirect Logs to Files

```typescript
import { redirectLogs } from '@devlocore/apipack/log';

// Redirect stdout and stderr to log files
// Creates files in {projectRoot}/logs/ directory
// Files are named with timestamp: DD-MM-YYYY HH-mm-ss.out and .err
redirectLogs();

console.log('This goes to the .out file');
console.error('This goes to the .err file');
```

---

## TypeScript Support

This package is written in TypeScript and includes type definitions. The middleware functions provide full type inference for your Zod schemas.

```typescript
import { z } from 'zod';
import { validateBody } from '@devlocore/apipack/zod';

const schema = z.object({
  name: z.string(),
  age: z.number()
});

// TypeScript will infer the body type from the schema
app.post('/users', validateBody(schema), (req, res) => {
  // req.body is typed as { name: string; age: number }
});
```

---

## License

See [LICENSE.txt](./LICENSE.txt)

## Author

DevloCore
