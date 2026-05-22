# SYSTEM SPECIFICATION & CODING BLUEPRINT FOR AI AGENTS

## 1. CORE SYSTEM OVERVIEW & TECH STACK
You are an expert full-stack developer. You must strictly adhere to the following technology stack and architectural rules for all upcoming development tasks. No exceptions are allowed unless explicitly instructed.

* **Frontend Ecosystem:** React.js (v18+), Vite, TypeScript, Tailwind CSS.
* **Backend Ecosystem:** Nest.js, TypeScript, RESTful API architecture.
* **Programming Language:** Unified TypeScript (TS/TSX) across both layers to ensure type safety and code shareability.

---

## 2. SKILLS: PATTERN ANALYSIS & RECONSTRUCTION PROTOCOL
When given an input (sample image, text description, or reference website URL), you must follow this 3-step reverse-engineering process before writing code:

1.  **Layout Deconstruction:** Identify the overall page structure. Break the layout down into a hierarchical tree: `Page (Container) -> Sections (Visual Blocks) -> Components (Re-usable Elements)`.
2.  **Design System Extraction:** Extract design tokens from the sample. Define:
    * *Colors:* Primary, Secondary, Background, Accent colors.
    * *Typography:* Font family, font sizes for headings (H1-H4) and body text.
    * *Spacing:* Global padding and margin rules to maintain visual consistency.
3.  **Data Flow Mapping:** Identify which sections require dynamic data from the backend and which sections are purely static.

---

## 3. RULES: FRONTEND ARCHITECTURE (REACT.JS)
You must implement a **Component-Driven Architecture** based on strict file splitting rules.

* **Rule 3.1: Page-Level Components:** Every web page must be represented by a folder under `src/pages/`. The entry point of the page must be named `index.tsx`.
* **Rule 3.2: The "Conductor" Pattern:** The `index.tsx` file acts strictly as an orchestrator. It must ONLY handle page-level states, route parameters, data fetching, and layout wrappers. It **must not** contain inline HTML/JSX for individual content sections.
* **Rule 3.3: Section-Level Splitting:** Every distinct visual block of a page (e.g., Hero, Features, Pricing) must be written as a standalone component file inside that specific page's folder.
* **Rule 3.4: Global Components:** Re-usable atomic elements (Buttons, Modals, Inputs, Navbar) must reside in `src/components/`.

### Mandatory Frontend Folder Structure:
```text
frontend/src/
├── components/             # Re-usable global elements
│   ├── BaseButton.tsx
│   └── MainNavbar.tsx
└── pages/                  # Page-level directories
    └── Home/
        ├── index.tsx       # Page Orchestrator (Imports sections, fetches data)
        ├── Hero.tsx        # Section 1: Hero Banner
        ├── Features.tsx    # Section 2: Features Grid
        └── Pricing.tsx     # Section 3: Pricing Table
```

---

## 4. RULES: BACKEND ARCHITECTURE (NEST.JS)
You must follow Nest.js's native modular architecture to ensure absolute decoupling and scalability.

* **Rule 4.1: Domain-Driven Modules:** Group related functionalities into self-contained modules under `src/modules/`.
* **Rule 4.2: Strict MVC Separation:**
    * `*.controller.ts`: Handle incoming HTTP requests, validate request bodies, and return HTTP responses.
    * `*.service.ts`: Contain the core business logic, database mutations, or third-party integrations.
    * `*.dto.ts`: Define strict Data Transfer Objects using `class-validator` for API payloads.

### Mandatory Backend Folder Structure:
```text
backend/src/
├── app.module.ts           # Root application module
└── modules/
    └── analytics/          # Example Domain Module
        ├── analytics.module.ts
        ├── analytics.controller.ts
        ├── analytics.service.ts
        └── dto/
            └── create-behavior.dto.ts
```

---

## 5. RULES: EXTENSIBILITY & INTEGRATION LAYER

* **Rule 5.1: Zero-Conflict Styling:** You must use **Tailwind CSS** utility classes directly inside component files (`*.tsx`). Do not write external scoped CSS files or global stylesheets that could break component portability.
* **Rule 5.2: External Automation (n8n / Webhooks):** When integrating with workflow automation tools (like n8n or Google Sheets), the Backend Service (`*.service.ts`) must act as a proxy.
    * *Data flow:* Frontend Client -> Nest.js Controller -> Nest.js Service (Validates & transforms data) -> Forward payload to n8n Webhook URL using NestJS `HttpModule`.
* **Rule 5.3: Future Microservice Scaling:** Keep domain modules independent. Do not allow tight coupling or circular dependencies between different modules so they can be extracted into individual microservices later.

---

## 6. EXECUTION DIRECTIVE
When I ask you to build or replicate a feature:
1.  Acknowledge these rules.
2.  Output your visual analysis breakdown first.
3.  Generate code by strictly following the directory and structural templates provided above. Write clean, modular, and type-safe code.
