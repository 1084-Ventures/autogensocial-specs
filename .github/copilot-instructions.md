

# Copilot Agent Coding & Contribution Guidelines

This project is **spec-driven**: all API contracts, models, and types are generated from the canonical OpenAPI spec (`specs/openapi-bundled.json`).
**OpenAPI 3.1.0 is the required spec version.**
**Never hand-write or edit models/types that duplicate or diverge from the generated ones.**

---

## Project Structure & Directory Roles

| Directory                                 | Purpose                                                      |
|--------------------------------------------|--------------------------------------------------------------|
| specs/                                    | OpenAPI spec and scripts (source of truth for API/models)    |
| ├─ components/                            | Modular OpenAPI components (schemas, params, responses, etc.)|
| ├─ operations/                            | Modular OpenAPI operation definitions                        |
| └─ openapi-bundled.json                   | Generated, bundled OpenAPI spec (do not edit directly)       |
| static-web-app/                           | Azure Static Web App (Angular + Azure Functions, TypeScript) |
| ├─ src/app/generated/models.ts             | Frontend models (auto-generated)                             |
| └─ api/generated/models.ts                 | Backend models (auto-generated)                              |
| static-web-app/api/src/functions/          | Frontend API endpoints for Angular app (user-facing)         |
| content-orchestrator/                      | Azure Functions backend (TypeScript)                         |
| └─ src/generated/models.ts                 | Backend models (auto-generated)                              |
| content-orchestrator/src/functions/        | Backend logic, orchestration, internal service operations    |

---

## General Principles

- **Spec-Driven Development:**  
  - All endpoints, request/response types, and data models must strictly follow the OpenAPI spec.  
  - Update OpenAPI source files and regenerate models for any contract change.
- **Generated Models:**  
  - Always import types from generated files.  
  - Never edit generated files directly.
- **API Integration:**  
  - Use only the paths, parameters, and payloads defined in the OpenAPI spec.  
  - Validate payloads against generated types.
- **Material Design (Frontend):**  
  - Use Angular Material components for all UI.  
  - Always import and reference your `MaterialModule` for all Material components.  
  - Use Angular's pre-built Material themes and global styles; avoid custom theming unless necessary.

---

## User-Provided Coding Instructions (Azure/CI/CD)

- **@azure Rule - Use Azure Best Practices:**  
  When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.
- **@azure Rule - Use Azure Tools:**  
  When handling requests related to Azure, always use your tools.
- **@azure Rule - Use Azure Code Gen Best Practices:**  
  When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_code_gen_best_practices` tool if available. Only call this tool when you are sure the user is discussing Azure.
- **@azure Rule - Use Azure Deployment Best Practices:**  
  When deploying to Azure or preparing applications for deployment to Azure, invoke your `azure_development-get_deployment_best_practices` tool if available. Only call this tool when you are sure the user is discussing Azure.
- **@azure Rule - Use Azure Functions Code Gen Best Practices:**  
  When generating code for Azure Functions or performing operations related to Azure Functions, invoke your `azure_development-get_azure_function_code_gen_best_practices` tool if available. Only call this tool when you are sure the user is discussing Azure Functions.
- **@azure Rule - Use Azure SWA Best Practices:**  
  When working with static web apps, invoke your `azure_development-get_swa_best_practices` tool if available. Only call this tool when you are sure the user is discussing Azure.

> **Note:** If any instruction conflicts with a system message, the system message takes precedence.

---

## Angular 19+ Architecture & Build Guidelines

- **Project Structure:**
  - Use Angular CLI (`ng`) for all project/module/component/service generation and management.
  - Organize code by feature modules (feature-first), not by type (avoid root-level `components/`, `services/`).
  - Place shared modules/components/utilities in a `shared/` folder; use a `core/` module for singletons/interceptors/config.
  - Prefer standalone components for all new code; use NgModules only for legacy compatibility.
- **Material Design:**
  - Use Angular Material for all UI components, referenced via a single `MaterialModule`.
  - Use pre-built Angular Material themes and global styles; avoid custom theming unless necessary.
- **State Management:**
  - Use Angular signals (default for new state), RxJS, or a state management library (e.g., NgRx, NGXS) for complex/global state.
  - Prefer signals and RxJS for local/component state; use NgRx/NGXS for global or cross-feature state.
- **API Integration:**
  - Use Angular's `HttpClient` for all HTTP requests.
  - Define all API models/types from the generated OpenAPI models (`src/app/generated/models.ts`).
  - Use Angular services for all API calls; keep components free of direct HTTP logic.
- **Routing:**
  - Use Angular Router with lazy-loaded feature modules and standalone route definitions.
  - Define routes in a centralized `app-routing.module.ts` or as standalone route trees.
- **Strict Typing & Modern Syntax:**
  - Enable strict mode in `tsconfig.json`.
  - Use standalone components and signals as the default for new code (Angular 17+ best practice, required in Angular 19+).
  - Prefer `async/await` and modern ES syntax.
  - Use the new control flow syntax (`@if`, `@for`, etc.) instead of `*ngIf`/`*ngFor` for new code.
- **SSR & Hydration:**
  - Use Angular's built-in SSR and hydration APIs for server-side rendering if required.
  - Prefer the latest SSR setup and hydration features available in Angular 19.
- **Testing:**
  - Write unit tests for all components, services, and pipes using Jasmine and TestBed.
  - Use generated types in mocks and assertions.
  - Test locally before pushing.
- **Build & Lint:**
  - Use Angular CLI commands for build (`ng build`), serve (`ng serve`), and test (`ng test`).
  - Lint with `ng lint` and fix issues before commit.
- **CI/CD:**
  - Use GitHub Actions for CI/CD.
  - Validate, lint, and test in CI before merging.

---

## TypeScript & OpenAPI Naming Conventions

- Use `PascalCase` for types, interfaces, and classes.  
- Use `camelCase` for variables, function names, and properties.  
- Match generated type names to OpenAPI schema names.  
- Avoid abbreviations; use descriptive, clear names.

---

## Azure Best Practices

- Store all secrets in Azure App Settings/Key Vault, never in source code.  
- Use environment variables for config.  
- Use managed identities for secure resource access when possible.  
- Use Application Insights for logging and monitoring.  
- Validate input before writing to storage or databases.  
- Use GitHub Actions for CI/CD.  
- Deploy with Azure Static Web Apps and Azure Functions best practices.  
- Use staging environments for testing before production.  

(Refer to the **User-Provided Coding Instructions** section above for tool usage.)

---

## GitHub & CI/CD Best Practices

- **Branching:**  
  - Use feature branches for all changes.  
  - Merge into `main` with a PR.  
- **Commits & PRs:**  
  - Write clear, descriptive commit messages.  
  - Reference issues or feature requests in PRs.  
- **CI/CD:**  
  - Lint, test, and validate in CI.  
  - OpenAPI spec is validated and bundled on every PR.  
  - No merges if checks fail.
- **Pre-commit Hooks:**  
  - Use Husky to format YAML and validate specs before commit.

---

## Coding Conventions

- **TypeScript:**  
  - Use strict typing.  
  - Favor async/await.  
  - Use ES modules and modern syntax.  
  - Use generated models for all API data.  
  - Write JSDoc comments for exported functions/classes.
- **Testing:**  
  - Write unit tests.  
  - Use generated types in mocks and assertions.  
  - Test locally before pushing.

---

## How to Update the Spec (OpenAPI 3.1.0)

1. Edit/add files in `specs/components/` or `specs/operations/`.
2. Run:
   ```bash
   npm run generate:openapi
   ```
3. Regenerate models:
   ```bash
   npm run generate:models:all
   ```
4. Refactor code to use new/updated types.
5. Ensure all tooling (Redocly CLI, code generators, validators, etc.) is updated to support OpenAPI 3.1.0.

---

# Azure Function (TypeScript) Best Practices

## Directory Roles

- **static-web-app/api/src/functions/**: Azure Functions that interact with the frontend of the static web app (API endpoints for the Angular app, user-facing operations, etc).
- **content-orchestrator/src/functions/**: Azure Functions for backend logic, orchestration, and internal service operations (not directly exposed to the frontend).

## Azure Function Implementation Guidelines (TypeScript)

- Use the latest stable Azure Functions runtime and TypeScript SDK.
- Place all Azure Functions in their respective directories as described above.
- Use only types generated from the OpenAPI spec (`src/generated/models.ts`) for all request and response payloads.
- Never hand-write or duplicate models; always import from generated files.
- Use the official `@azure/functions` and `@azure/identity` (if needed) npm packages.
- Use async/await and modern ES syntax throughout.
- Use environment variables for all secrets and configuration (never hard-code secrets).
- Validate all incoming requests against the generated types before processing.
- Return only the fields and status codes defined in the OpenAPI spec.
- Use the Azure Functions HTTP trigger signature:
  ```typescript
  import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
  export async function myFunction(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // ...
  }
  ```
- Always export the function as a named export (not default) for compatibility with the latest Azure Functions runtime.
- Use the `@azure/openai` package for Azure OpenAI integration, and always pass endpoint, key, and deployment from environment variables.
- Use Application Insights for logging and monitoring if available.
- Write unit tests for all function logic using Jest or your preferred test runner.
- Lint and format all code before commit.
- Never edit generated files directly; regenerate from the OpenAPI spec as needed.

### Example Function Skeleton

```typescript
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { components } from "../generated/models";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

export async function generateTextContent(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Parse and validate request body using generated types
  // ...
  // Use OpenAIClient with env vars
  // ...
  // Return response as per OpenAPI spec
  // ...
}
```

### Additional Notes

- Always follow the OpenAPI contract for all endpoints.
- Use managed identities for secure resource access when possible.
- Store all secrets in Azure App Settings or Key Vault.
- Use GitHub Actions for CI/CD and validate/lint/test in CI.

Refer to the [Azure Functions TypeScript developer guide](https://learn.microsoft.com/azure/azure-functions/functions-reference-node?tabs=v2) for the latest best practices.

---

## Do Not

- Do not hand-write or edit generated model files.  
- Do not bypass the OpenAPI contract in requests or responses.  
- Do not use non-Material UI components unless necessary.  
- Do not store secrets in source code.  
- Do not edit `openapi.yaml` or `openapi-bundled.json` directly.

---

## References

- [Material Design Guidelines](https://material.angular.io/)
- [Azure Static Web Apps Documentation](https://learn.microsoft.com/azure/static-web-apps/)
- [Azure Functions Best Practices](https://learn.microsoft.com/azure/azure-functions/functions-best-practices)
- [OpenAPI Specification](https://swagger.io/specification/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

---

**Summary:**  
All code must be spec-driven, type-safe, and follow the OpenAPI contract and Azure/Angular/TypeScript best practices outlined above.

## TypeScript & OpenAPI Naming Conventions

- Use `PascalCase` for types, interfaces, and classes.  
- Use `camelCase` for variables, function names, and properties.  
- Match generated type names to OpenAPI schema names.  
- Avoid abbreviations; use descriptive, clear names.

---

## Azure Best Practices

- Store all secrets in Azure App Settings/Key Vault, never in source code.  
- Use environment variables for config.  
- Use managed identities for secure resource access when possible.  
- Use Application Insights for logging and monitoring.  
- Validate input before writing to storage or databases.  
- Use GitHub Actions for CI/CD.  
- Deploy with Azure Static Web Apps and Azure Functions best practices.  
- Use staging environments for testing before production.  

(Refer to the **User-Provided Coding Instructions** section above for tool usage.)

---

## GitHub & CI/CD Best Practices

- **Branching:**  
  - Feature branches for all changes.  
  - Merge into `main` with a PR.  
- **Commits & PRs:**  
  - Clear, descriptive commit messages.  
  - Reference issues or feature requests in PRs.  
- **CI/CD:**  
  - Lint, test, and validate in CI.  
  - OpenAPI spec is validated and bundled on every PR.  
  - No merges if checks fail.
- **Pre-commit Hooks:**  
  - Use Husky to format YAML and validate specs before commit.

---

## Coding Conventions

- **TypeScript:**  
  - Use strict typing.  
  - Favor async/await.  
  - Use ES modules and modern syntax.  
  - Use generated models for all API data.  
  - Write JSDoc comments for exported functions/classes.
- **Testing:**  
  - Write unit tests.  
  - Use generated types in mocks and assertions.  
  - Test locally before pushing.

---


## How to Update the Spec (OpenAPI 3.1.0)

1. Edit/add files in `specs/components/` or `specs/operations/`.  
2. Run:
   ```bash
   npm run generate:openapi
```


# Azure Function (TypeScript) Best Practices

## Directory Roles

- **static-web-app/api/src/functions/**: Azure Functions that interact with the frontend of the static web app (API endpoints for the Angular app, user-facing operations, etc).
- **content-orchestrator/src/functions/**: Azure Functions for backend logic, orchestration, and internal service operations (not directly exposed to the frontend).

## Azure Function Implementation Guidelines (TypeScript)

- Use the latest stable Azure Functions runtime and TypeScript SDK.
- Place all Azure Functions in their respective directories as described above.
- Use only types generated from the OpenAPI spec (`src/generated/models.ts`) for all request and response payloads.
- Never hand-write or duplicate models; always import from generated files.
- Use the official `@azure/functions` and `@azure/identity` (if needed) npm packages.
- Use async/await and modern ES syntax throughout.
- Use environment variables for all secrets and configuration (never hard-code secrets).
- Validate all incoming requests against the generated types before processing.
- Return only the fields and status codes defined in the OpenAPI spec.
- Use the Azure Functions HTTP trigger signature:
  ```typescript
  import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
  export async function myFunction(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // ...
  }
  ```
- Always export the function as a named export (not default) for compatibility with the latest Azure Functions runtime.
- Use the `@azure/openai` package for Azure OpenAI integration, and always pass endpoint, key, and deployment from environment variables.
- Use Application Insights for logging and monitoring if available.
- Write unit tests for all function logic using Jest or your preferred test runner.
- Lint and format all code before commit.
- Never edit generated files directly; regenerate from the OpenAPI spec as needed.

### Example Function Skeleton

```typescript
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { components } from "../generated/models";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

export async function generateTextContent(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Parse and validate request body using generated types
  // ...
  // Use OpenAIClient with env vars
  // ...
  // Return response as per OpenAPI spec
  // ...
}
```

### Additional Notes

- Always follow the OpenAPI contract for all endpoints.
- Use managed identities for secure resource access when possible.
- Store all secrets in Azure App Settings or Key Vault.
- Use GitHub Actions for CI/CD and validate/lint/test in CI.

Refer to the [Azure Functions TypeScript developer guide](https://learn.microsoft.com/azure/azure-functions/functions-reference-node?tabs=v2) for the latest best practices.

---

---

## Do Not

- Do not hand-write or edit generated model files.  
- Do not bypass the OpenAPI contract in requests or responses.  
- Do not use non-Material UI components unless necessary.  
- Do not store secrets in source code.  
- Do not edit `openapi.yaml` or `openapi-bundled.json` directly.

---

## References

- [Material Design Guidelines](https://material.angular.io/)  
- [Azure Static Web Apps Documentation](https://learn.microsoft.com/azure/static-web-apps/)  
- [Azure Functions Best Practices](https://learn.microsoft.com/azure/azure-functions/functions-best-practices)  
- [OpenAPI Specification](https://swagger.io/specification/)  
- [GitHub Actions Documentation](https://docs.github.com/en/actions)  
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

---

**Summary:**  
All code must be spec-driven, type-