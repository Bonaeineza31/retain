// the API documentation shown on the Swagger page

const needsToken = [{ bearerAuth: [] }];

const idParam = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string" },
};

const monthParam = {
  name: "month",
  in: "query",
  required: true,
  description: "written like 2026-10",
  schema: { type: "string", example: "2026-10" },
};

// a request body that is JSON
const body = (name) => ({
  required: true,
  content: {
    "application/json": { schema: { $ref: `#/components/schemas/${name}` } },
  },
});

// a good reply. the description says what is inside data
const ok = (description) => ({
  description,
  content: {
    "application/json": { schema: { $ref: "#/components/schemas/Reply" } },
  },
});

// an error reply, defined once below
const fail = (name) => ({ $ref: `#/components/responses/${name}` });

const errorReply = (description) => ({
  description,
  content: {
    "application/json": { schema: { $ref: "#/components/schemas/ErrorReply" } },
  },
});

const paths = {
  "/api/health": {
    get: {
      tags: ["Health"],
      summary: "Check that the server and the database work",
      responses: { 200: ok("data: { database }") },
    },
  },

  "/api/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Create an account and sign in",
      requestBody: body("RegisterInput"),
      responses: {
        201: ok("data: { user, token }"),
        400: fail("ValidationError"),
        409: errorReply("Email already used (EMAIL_TAKEN)"),
      },
    },
  },
  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Sign in",
      requestBody: body("LoginInput"),
      responses: {
        200: ok("data: { user, token }"),
        400: fail("ValidationError"),
        401: errorReply("Wrong email or password (INVALID_CREDENTIALS)"),
      },
    },
  },
  "/api/auth/me": {
    get: {
      tags: ["Auth"],
      summary: "Who is signed in",
      security: needsToken,
      responses: { 200: ok("data: the user"), 401: fail("Unauthorized") },
    },
  },

  "/api/categories": {
    get: {
      tags: ["Categories"],
      summary: "List the categories",
      security: needsToken,
      responses: {
        200: ok("data: a list of categories"),
        401: fail("Unauthorized"),
      },
    },
    post: {
      tags: ["Categories"],
      summary: "Create a category (admin only)",
      security: needsToken,
      requestBody: body("CategoryInput"),
      responses: {
        201: ok("data: the category"),
        400: fail("ValidationError"),
        401: fail("Unauthorized"),
        403: fail("Forbidden"),
        409: errorReply("Name already used (CATEGORY_EXISTS)"),
      },
    },
  },
  "/api/categories/{id}": {
    put: {
      tags: ["Categories"],
      summary: "Rename a category (admin only)",
      description: "The default category (Uncategorized) cannot be renamed.",
      security: needsToken,
      parameters: [idParam],
      requestBody: body("CategoryInput"),
      responses: {
        200: ok("data: the category"),
        400: fail("ValidationError"),
        401: fail("Unauthorized"),
        403: fail("Forbidden"),
        404: fail("NotFound"),
        409: errorReply("Name already used (CATEGORY_EXISTS)"),
      },
    },
    delete: {
      tags: ["Categories"],
      summary: "Delete a category (admin only)",
      description:
        "Its expenses move to Uncategorized. The default category cannot be deleted.",
      security: needsToken,
      parameters: [idParam],
      responses: {
        200: ok("data: { movedExpenses }"),
        400: errorReply("This is the default category (DEFAULT_CATEGORY)"),
        401: fail("Unauthorized"),
        403: fail("Forbidden"),
        404: fail("NotFound"),
      },
    },
  },

  "/api/expenses": {
    get: {
      tags: ["Expenses"],
      summary: "List my expenses, with search, filters, sorting and paging",
      description:
        "Every part of the address is optional. Only your own expenses are returned.",
      security: needsToken,
      parameters: [
        {
          name: "search",
          in: "query",
          description: "looks in the title and notes",
          schema: { type: "string" },
        },
        { name: "categoryId", in: "query", schema: { type: "string" } },
        {
          name: "paymentMethod",
          in: "query",
          schema: {
            type: "string",
            enum: ["cash", "mobile money", "card", "bank transfer"],
          },
        },
        {
          name: "dateFrom",
          in: "query",
          description: "like 2026-10-01",
          schema: { type: "string" },
        },
        {
          name: "dateTo",
          in: "query",
          description: "like 2026-10-31",
          schema: { type: "string" },
        },
        { name: "minAmount", in: "query", schema: { type: "integer" } },
        { name: "maxAmount", in: "query", schema: { type: "integer" } },
        {
          name: "sortBy",
          in: "query",
          schema: { type: "string", enum: ["date", "amount"], default: "date" },
        },
        {
          name: "sortOrder",
          in: "query",
          schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
        },
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        {
          name: "pageSize",
          in: "query",
          description: "1 to 100",
          schema: { type: "integer", default: 10 },
        },
      ],
      responses: {
        200: ok("data: { items, total, page, pageSize }"),
        400: fail("ValidationError"),
        401: fail("Unauthorized"),
      },
    },
    post: {
      tags: ["Expenses"],
      summary: "Create an expense",
      security: needsToken,
      requestBody: body("ExpenseInput"),
      responses: {
        201: ok("data: the expense"),
        400: fail("ValidationError"),
        401: fail("Unauthorized"),
      },
    },
  },
  "/api/expenses/{id}": {
    get: {
      tags: ["Expenses"],
      summary: "Get one expense",
      description:
        "Someone else's expense answers 404, like one that does not exist.",
      security: needsToken,
      parameters: [idParam],
      responses: {
        200: ok("data: the expense"),
        401: fail("Unauthorized"),
        404: fail("NotFound"),
      },
    },
    put: {
      tags: ["Expenses"],
      summary: "Change an expense",
      security: needsToken,
      parameters: [idParam],
      requestBody: body("ExpenseInput"),
      responses: {
        200: ok("data: the expense"),
        400: fail("ValidationError"),
        401: fail("Unauthorized"),
        404: fail("NotFound"),
      },
    },
    delete: {
      tags: ["Expenses"],
      summary: "Delete an expense",
      security: needsToken,
      parameters: [idParam],
      responses: {
        200: ok("data: empty"),
        401: fail("Unauthorized"),
        404: fail("NotFound"),
      },
    },
  },

  "/api/budgets": {
    put: {
      tags: ["Budgets"],
      summary: "Set the budget of a month",
      description:
        "Creates it (201), or changes it if the month already has one (200).",
      security: needsToken,
      requestBody: body("BudgetInput"),
      responses: {
        200: ok("data: the budget (it was changed)"),
        201: ok("data: the budget (it was created)"),
        400: fail("ValidationError"),
        401: fail("Unauthorized"),
      },
    },
  },
  "/api/budgets/summary": {
    get: {
      tags: ["Budgets"],
      summary: "Budget, spent, remaining and status of a month",
      description:
        "The status is within, approaching (from 80% spent) or over (above 100%).",
      security: needsToken,
      parameters: [monthParam],
      responses: {
        200: ok("data: { budget, spent, remaining, status }"),
        400: fail("ValidationError"),
        401: fail("Unauthorized"),
      },
    },
  },

  "/api/dashboard": {
    get: {
      tags: ["Dashboard"],
      summary: "Everything the user dashboard shows for a month",
      security: needsToken,
      parameters: [monthParam],
      responses: {
        200: ok(
          "data: { summary, highestExpense, spendingByCategory, recentExpenses }",
        ),
        400: fail("ValidationError"),
        401: fail("Unauthorized"),
      },
    },
  },

  "/api/admin/insights": {
    get: {
      tags: ["Admin"],
      summary: "Platform numbers for the admin dashboard (admin only)",
      security: needsToken,
      responses: {
        200: ok(
          "data: { totalUsers, totalExpenses, totalValue, expensesThisMonth, spendingPerCategory, topCategories, bottomCategories, recentExpenses, recentUsers }",
        ),
        401: fail("Unauthorized"),
        403: fail("Forbidden"),
      },
    },
  },
};

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Retain API",
    version: "1.0.0",
    description: [
      "The API of Retain, a personal expense and budget manager. Amounts are in RWF.",
      "",
      "**To try it:** register or log in, copy the `token` from the reply, press **Authorize** and paste it.",
      "",
      "**Every reply has the same shape.** A good reply is `{ success: true, message, data, meta }`. An error is `{ success: false, error: { code, message, fields? }, meta }`.",
    ].join("\n"),
  },
  // a relative address, so "Try it out" calls the same server that shows this page
  servers: [{ url: "/" }],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    {
      name: "Categories",
      description:
        "Everyone signed in can read them, only admins can change them",
    },
    { name: "Expenses", description: "A user's own expenses" },
    { name: "Budgets" },
    { name: "Dashboard" },
    { name: "Admin", description: "Admins only" },
  ],
  paths,
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      // what the API receives
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Aline Uwase" },
          email: { type: "string", example: "aline@retain.rw" },
          password: {
            type: "string",
            description: "8 to 64 characters, with a letter and a number",
            example: "Secret123",
          },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "aline@retain.rw" },
          password: { type: "string", example: "Secret123" },
        },
      },
      CategoryInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            description: "2 to 30 characters",
            example: "Gym",
          },
        },
      },
      ExpenseInput: {
        type: "object",
        required: ["title", "amount", "categoryId", "date", "paymentMethod"],
        properties: {
          title: {
            type: "string",
            description: "2 to 80 characters",
            example: "Market vegetables",
          },
          amount: {
            type: "integer",
            description: "a whole number of RWF above 0",
            example: 12500,
          },
          categoryId: { type: "string", description: "the _id of a category" },
          date: {
            type: "string",
            description: "a real date like 2026-10-02, not in the future",
            example: "2026-10-02",
          },
          paymentMethod: {
            type: "string",
            enum: ["cash", "mobile money", "card", "bank transfer"],
          },
          notes: {
            type: "string",
            description: "optional, up to 300 characters",
          },
        },
      },
      BudgetInput: {
        type: "object",
        required: ["month", "amount"],
        properties: {
          month: {
            type: "string",
            description: "like 2026-10",
            example: "2026-10",
          },
          amount: {
            type: "integer",
            description: "a whole number of RWF above 0",
            example: 300000,
          },
        },
      },

      // what the API sends back
      Reply: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: {
            description:
              "different for each endpoint, see its reply description",
          },
          meta: {
            type: "object",
            properties: { timestamp: { type: "string" } },
          },
        },
      },
      ErrorReply: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "VALIDATION_ERROR" },
              message: { type: "string", example: "Please fix the errors" },
              fields: {
                type: "object",
                description:
                  "only for form errors: a message for each wrong field",
                example: { email: "Email can only contain one @" },
              },
            },
          },
          meta: {
            type: "object",
            properties: { timestamp: { type: "string" } },
          },
        },
      },
    },
    responses: {
      ValidationError: errorReply(
        "Something sent is not valid (VALIDATION_ERROR). The fields say what",
      ),
      Unauthorized: errorReply(
        "No token, or it is not valid or has expired (UNAUTHORIZED)",
      ),
      Forbidden: errorReply("Only admins can do this (FORBIDDEN)"),
      NotFound: errorReply(
        "It does not exist, or it belongs to someone else (NOT_FOUND)",
      ),
    },
  },
};
