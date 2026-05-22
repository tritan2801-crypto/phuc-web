# MASTER AI AGENT SKILLS SPECIFICATION (.MB)
## SYSTEM INSTRUCTION FOR ADVANCED REVERSE-ENGINEERING & CODE GENERATION

This file (.mb) serves as the core intelligence and skill-set framework for the AI Agent. It defines the exact execution protocols for analyzing images, text descriptions, and live website patterns, then translating them into a highly modular React.js + Nest.js architecture.

---

## SKILL 1: ADVANCED VISION-TO-CODE ENGINEERING (IMAGE ANALYSIS)
When provided with a UI screenshot, wireframe, or mockup, the Agent must execute the following cognitive pipeline:

### 1.1 Layout Grid & Breakpoint Detection
* **Action:** Scan the image vertically and horizontally to detect the master layout structure (Sidebar, Navbar, Main Content, Footer).
* **Inference:** Determine if sections utilize a CSS Grid (for uniform card layouts) or Flexbox (for aligned, directional elements).
* **Rule:** Translate visual alignments directly into Tailwind CSS utility classes (e.g., `grid-cols-1 md:grid-cols-3`, `flex items-center justify-between`).

### 1.2 Interactive Element Profiling
* **Action:** Isolate interactive items such as Buttons, Input Fields, Dropdowns, and Modals.
* **Classification:** * If an element appears more than twice across the layout, classify it as a **Global Component** (`src/components/`).
    * If an element is unique to a specific block, classify it as an **Atomic Element** scoped inside a **Section Component** (`src/pages/[PageName]/[SectionName].tsx`).

---

## SKILL 2: TEXT-TO-ARCHITECTURE SYNTHESIS (DESCRIPTION PROCESSING)
When provided with a textual prompt or product requirement document (PRD), the Agent must synthesize the technical requirements into a decoupled architecture:

### 2.1 Entity-Relationship & State Modeling
* **Action:** Extract nouns from the text to identify core data models (e.g., "User", "Behavior Log", "Product").
* **Nest.js Mapping:** Automatically generate the corresponding Data Transfer Objects (DTOs) with full type-safety and validation schema using `class-validator`.
* **React.js Mapping:** Formulate the local and global state requirements (e.g., `useState` for UI states, React Context or Zustand for shared states like Authentication).

### 2.2 Event & Behavior Tracking Extraction
* **Action:** Identify behavioral triggers described in text (e.g., "when a user stops scrolling on a section for 3 seconds").
* **Implementation:** Synthesize custom React hooks (e.g., `useIntersectionObserver`) to capture raw DOM interaction metrics before forwarding them to the Nest.js ingress controllers.

---

## SKILL 3: LIVE WEB REVERSE-ENGINEERING (REFERENCE PATTERNS)
When analyzing an existing reference website or URL pattern, the Agent must simulate DOM tree inspection and state architecture tracking:

### 3.1 Structural Component Splitting
* **Action:** Deconstruct the target page into separate visual file blocks following the strict **Page-Section-Component** rule.
* **Orchestration Blueprint:** * The main entry file (`src/pages/[PageName]/index.tsx`) must contain NO hardcoded UI elements.
    * It must only import and layout the self-contained sections sequentially:
        ```tsx
        // Example Core Orchestrator Pattern
        import Hero from './Hero';
        import Features from './Features';
        import Pricing from './Pricing';

        export default function HomePage() {
          return (
            <main className="min-h-screen bg-background">
              <Hero />
              <Features />
              <Pricing />
            </main>
          );
        }
        ```

### 3.2 State & Side-Effect Logic Inference
* **Action:** Deduce how data moves between components based on user interaction flows.
* **Rule:** Keep logic decoupled. Any side-effect (API calls, data analytics triggers) must be isolated within custom hooks or passed down cleanly via explicit TypeScript props interface contracts inside each section file.

---

## SKILL 4: EXTENSIBILITY & AUTOMATION PROXYING
The Agent must maintain zero-lock-in capabilities for external services:

### 4.1 Webhook & n8n Forwarding Logic
* **Action:** When a requirement specifies logging data to external storage (like Google Sheets), the Agent must never code the direct API integration inside the frontend.
* **Workflow Integration Rule:**
    1.  Frontend captures the state mutation/behavior metric.
    2.  Frontend posts a clean JSON payload to the Nest.js Controller.
    3.  Nest.js Service processes/enriches the payload (adds IP, timestamp, session validation).
    4.  Nest.js Service executes an asynchronous HTTP POST forward to the external Automation Webhook (n8n/Make) using `@nestjs/axios`.

---

## EXECUTION MANDATE FOR THE AI AGENT
You must read this file (.mb) as your foundational technical manual. For every task assigned, prioritize extreme modularity, strict file-splitting by section, clean TypeScript definitions, and robust Nest.js architectural compliance. Do not combine multiple visual sections into a single file.
