<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Parrot House

## 1. Project Identity

Project name: **Parrot House**

Parrot House is a responsive e-commerce website for selling parrots and related parrot-type birds.

The current development target is **local development only**.

Do not deploy this project.
Do not configure production hosting.
Do not configure production payment credentials.

The main product requirements are defined in:

```text
/docs/PRD.md
```

This file is the source of truth for product behavior and scope.

---

## 2. Required Reading Before Coding

Before making any implementation decision, read:

1. `/docs/PRD.md`
2. this `AGENTS.md`
3. existing source code
4. existing database migrations
5. existing environment configuration examples

Do not start coding before understanding the current state of the repository.

If there is a conflict between assumptions and the PRD:

**follow the PRD.**

If there is a conflict between generated code and existing working architecture:

preserve working behavior unless the PRD explicitly requires a change.

---

## 3. Main Goal

Build Parrot House as a polished, maintainable, secure, and responsive e-commerce website.

The main user journey is:

```text
Explore
→ Learn
→ Trust
→ Purchase
```

Visitors must be able to browse the store without authentication.

Authentication is required when users:

- checkout;
- access account information;
- access order history;
- manage personal information.

The application has three primary user contexts:

- Visitor
- Customer
- Admin

---

## 4. Current Development Environment

Development is local only.

Expected commands:

```bash
npm install
npm run dev
```

Expected URL:

```text
http://localhost:3000
```

Do not perform deployment.

Do not configure:

- Vercel deployment;
- Netlify deployment;
- production domain;
- production CDN;
- production Midtrans credentials;
- production callback URL;
- deployment pipelines.

The project should remain deployment-ready, but deployment is outside the current scope.

---

## 5. Required Tech Stack

Use:

- Next.js with App Router
- TypeScript
- React
- Tailwind CSS
- Motion for React
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Row Level Security
- Zod
- React Hook Form
- Midtrans Snap Sandbox
- Lucide React

Do not replace the selected stack without a strong technical reason.

Do not use:

- React Native
- Firebase
- MongoDB
- Bootstrap
- Material UI
- separate Express backend unless absolutely necessary
- unnecessary state-management libraries
- unnecessary animation libraries

Prefer simple architecture.

---

## 6. Package Management

Use the package manager already present in the repository.

If no package manager is configured, use:

```text
npm
```

Do not switch package managers unnecessarily.

---

## 7. Application Architecture

Prefer this logical structure:

```text
src/
├── app/
│   ├── (store)/
│   ├── account/
│   ├── admin/
│   └── api/
│
├── components/
│   ├── layout/
│   ├── home/
│   ├── birds/
│   ├── cart/
│   ├── checkout/
│   ├── account/
│   ├── admin/
│   └── ui/
│
├── lib/
│   ├── supabase/
│   ├── midtrans/
│   ├── validation/
│   ├── auth/
│   └── utils/
│
├── types/
└── config/

supabase/
├── migrations/
└── seed.sql
```

This structure may be adjusted when necessary, but preserve clear separation of concerns.

---

## 8. Coding Principles

Write code that is:

- readable;
- maintainable;
- typed;
- reusable;
- secure;
- predictable;
- easy to debug.

Avoid:

- giant components;
- duplicated logic;
- deeply nested conditionals;
- hard-coded application data;
- magic numbers;
- unsafe type assertions;
- unnecessary abstractions;
- premature optimization.

Prefer small, focused components and functions.

---

## 9. TypeScript Rules

Use TypeScript throughout the application.

Avoid `any` unless there is no reasonable alternative.

Prefer:

- explicit domain types;
- inferred local types where clear;
- enums or unions for controlled statuses;
- reusable interfaces/types for shared domain data.

Examples of controlled values include:

```text
AVAILABLE
RESERVED
SOLD
UNAVAILABLE
```

and:

```text
PENDING
PAID
FAILED
EXPIRED
CANCELLED
REFUNDED
```

Do not represent controlled domain status values using arbitrary free-form strings.

---

## 10. Server and Client Components

Use React Server Components by default.

Only add:

```tsx
"use client"
```

when a component genuinely requires:

- browser APIs;
- state;
- event handlers;
- client-side animation;
- interactive forms;
- dynamic user interactions.

Do not make entire pages client components without need.

Keep the client bundle as small as practical.

---

## 11. Data Source Rules

Do not hard-code product catalog data in UI components.

The following must come from Supabase:

- bird categories;
- bird listings;
- availability;
- prices;
- inventory;
- articles;
- FAQs;
- shipping zones;
- content settings.

The initial bird categories are:

1. Parkit Lokal
2. Parkit Australia
3. Lovebird
4. Nuri Ambon
5. Sun Conure
6. Green Cheek Conure
7. Pineapple Green Cheek Conure
8. Turquoise Green Cheek Conure
9. Monk Blue

These should be inserted through database seed/migration data.

Do not duplicate category definitions across components.

---

## 12. Product Inventory Rules

Support two inventory types:

```text
INDIVIDUAL
QUANTITY
```

### INDIVIDUAL

A listing represents one specific bird.

Maximum cart quantity:

```text
1
```

Allowed lifecycle:

```text
AVAILABLE
→ RESERVED
→ SOLD
```

If transaction fails, expires, or is cancelled:

```text
RESERVED
→ AVAILABLE
```

### QUANTITY

A listing may have stock greater than one.

Stock must always be validated server-side before order creation.

Never trust stock information sent from the browser.

---

## 13. Authentication

Use Supabase Auth.

Supported features:

- register;
- login;
- logout;
- forgot password;
- reset password.

User roles:

```text
CUSTOMER
ADMIN
```

Do not infer authorization purely from frontend UI state.

Admin routes must be protected server-side.

A user manually typing:

```text
/admin
```

must not gain access unless the user has the correct role.

---

## 14. Authorization and RLS

Enable Supabase Row Level Security on exposed tables.

Public visitors may read only publicly available content.

Customers may access only their own:

- profile;
- addresses;
- cart;
- orders.

Customers must not be able to:

- modify bird prices;
- modify inventory;
- modify payment status;
- access another customer's order;
- access admin functions.

Admin permissions must be explicitly controlled.

Never expose the Supabase service role key to the browser.

---

## 15. Forms and Validation

Use:

- React Hook Form
- Zod

All important data must be validated server-side.

Client validation improves UX but is not a security boundary.

Validation errors should be understandable by normal users.

Avoid technical error messages such as:

```text
Invalid Zod union at path 2
```

Prefer messages such as:

```text
Nomor WhatsApp wajib diisi.
```

---

## 16. Cart Rules

Visitors may use the cart before login.

Guest cart may use local browser persistence.

When a visitor proceeds to checkout:

- require authentication;
- preserve cart state;
- continue the checkout process after login where practical.

For `INDIVIDUAL` inventory:

quantity must never exceed 1.

Do not trust cart prices from local storage.

Final prices must always be fetched from the database by the server.

---

## 17. Checkout Rules

Checkout flow:

```text
Cart
→ Authentication
→ Customer Information
→ Shipping Address
→ Shipping Method
→ Review Order
→ Payment
```

Before creating an order, the server must:

1. validate the authenticated user;
2. validate request data;
3. fetch current products from database;
4. validate availability;
5. validate stock;
6. fetch trusted prices;
7. calculate subtotal;
8. determine shipping;
9. calculate total.

Never accept final transaction totals from the client.

---

## 18. Shipping Rules

Parrot House sells live birds.

Do not assume normal parcel shipping behavior.

Shipping data must be database-driven.

Shipping zones may include:

- province;
- city;
- area;
- method;
- fee;
- availability;
- notes.

If shipping is not supported for a destination:

do not fabricate a price.

Display:

```text
Contact Parrot House for shipping availability.
```

Provide a WhatsApp action.

---

## 19. Midtrans Rules

Use Midtrans Snap in Sandbox mode.

Current environment:

```text
MIDTRANS_IS_PRODUCTION=false
```

Never expose:

```text
MIDTRANS_SERVER_KEY
```

to the browser.

Correct flow:

```text
Customer
→ Next.js Server
→ Validate Order
→ Create Local Order
→ Reserve Inventory
→ Create Midtrans Transaction
→ Return Snap Token
→ Customer Pays
→ Midtrans Notification
→ Server Verification
→ Update Payment
→ Update Order
→ Update Inventory
```

Do not mark an order as paid based only on:

- frontend callback;
- redirect URL;
- query string;
- client-side state.

Backend-verified payment status is the source of truth.

---

## 20. Midtrans Webhook

Create a secure webhook endpoint.

The handler must be:

- server-side;
- idempotent;
- validated;
- safe against duplicate notifications.

Repeated webhook calls must not:

- duplicate orders;
- reduce stock multiple times;
- create duplicate payments;
- repeatedly transition a sold bird.

Because the application currently runs locally, the webhook may later be tested using a temporary development tunnel.

Do not configure production hosting.

---

## 21. Payment Status

Use controlled payment states:

```text
PENDING
PAID
FAILED
EXPIRED
CANCELLED
REFUNDED
```

Keep payment status separate from order fulfillment status.

---

## 22. Order Status

Use:

```text
WAITING_PAYMENT
PAID
PROCESSING
READY_TO_SHIP
SHIPPED
DELIVERED
COMPLETED
CANCELLED
```

Do not mix shipping status, payment status, and order status into one ambiguous field.

---

## 23. Order Snapshots

Historical orders must not depend on current product data.

Store snapshots inside order data.

At minimum preserve:

- bird name;
- category;
- price;
- quantity;
- shipping address.

If the admin changes a product later, an old order must remain unchanged.

---

## 24. WhatsApp Integration

WhatsApp is a communication channel.

Do not use WhatsApp as payment verification.

After verified payment, provide a CTA such as:

```text
Confirm via WhatsApp
```

The generated message may include:

- order number;
- customer name;
- total;
- payment status.

Keep the message concise and human-readable.

---

## 25. Admin Rules

Admin pages prioritize:

- usability;
- clarity;
- fast data entry;
- readable status;
- predictable actions.

Do not over-animate admin screens.

Admin can manage:

- birds;
- categories;
- orders;
- shipping;
- articles;
- website content;
- customers;
- settings.

Payment status originating from Midtrans should not be casually editable by admin.

---

## 26. Image Handling

Use Supabase Storage for uploaded application images.

Use Next.js image optimization when displaying images.

Provide:

- meaningful alt text;
- responsive sizing;
- lazy loading when appropriate.

Do not serve unnecessarily huge source images directly.

---

## 27. Design Direction

Parrot House should feel:

- natural;
- warm;
- premium;
- friendly;
- organic;
- trustworthy;
- editorial;
- modern.

It should not look like:

- generic SaaS;
- AI-generated landing page;
- crypto website;
- generic dashboard;
- generic Tailwind starter.

Bird photography is the main visual focus.

---

## 28. Design Tokens

Starting palette:

```text
Soft Green      #A8C686
Deep Forest     #315C45
Warm Cream      #F5F0E4
Soft Background #FAF8F2
Warm Gold       #C99A5B
Main Text       #243229
Muted Text      #70786F
```

Use CSS variables/design tokens rather than scattering hex values throughout components.

Adjust shades when necessary for contrast/accessibility.

---

## 29. Typography

Use:

```text
Heading: Newsreader
Body/UI: Plus Jakarta Sans
```

Prefer `next/font`.

Typography should feel editorial and intentional.

Avoid oversized extra-bold headings on every section.

---

## 30. Iconography

Use Lucide React.

Do not use emoji as interface icons.

Do not place every icon inside a rounded square or circle.

Use icons only where they improve comprehension.

---

## 31. UI Composition Rules

Avoid:

- every section being a card;
- excessive `rounded-3xl`;
- every section centered;
- excessive pill buttons;
- excessive badges;
- glassmorphism everywhere;
- neon gradients;
- fake testimonials;
- fake statistics;
- repeated three-card layouts;
- decorative elements with no purpose.

Prefer:

- editorial composition;
- asymmetrical layouts;
- intentional whitespace;
- varied image proportions;
- visual hierarchy;
- natural spacing;
- high-quality photography;
- subtle interactions.

---

## 32. Animation Rules

Use Motion for React when animation needs:

- scroll reveal;
- stagger;
- layout transition;
- mobile navigation;
- drawer animation;
- gallery transitions;
- meaningful microinteractions.

Use CSS transitions for simpler interactions.

Prefer:

- transform;
- opacity.

Avoid:

- constant looping motion;
- extreme parallax;
- animations that delay interaction;
- animation on every element.

Respect:

```css
prefers-reduced-motion
```

Performance is more important than decorative movement.

---

## 33. Responsive Rules

Design intentionally for:

```text
375px
430px
768px
1024px
1440px+
```

Mobile must not simply be a compressed desktop layout.

Pay special attention to:

- navigation;
- product grid;
- filters;
- cart;
- gallery;
- checkout;
- forms;
- admin tables.

---

## 34. Accessibility

Use:

- semantic HTML;
- labels;
- keyboard navigation;
- visible focus states;
- appropriate ARIA only where necessary;
- sufficient contrast;
- usable touch targets;
- meaningful alt text.

Do not sacrifice accessibility for animation.

---

## 35. SEO

Implement appropriate SEO structure even during local development.

Use:

- page metadata;
- dynamic bird metadata;
- semantic headings;
- Open Graph preparation;
- sitemap;
- robots.txt;
- readable URLs.

Example:

```text
/birds/rio-sun-conure
```

Avoid:

```text
/product?id=123
```

---

## 36. UI States

Every dynamic feature must consider:

- loading;
- empty;
- error;
- success;
- disabled.

Examples:

- no birds found;
- empty cart;
- no order history;
- payment pending;
- payment failed;
- shipping unavailable;
- upload in progress.

Never leave users with blank unexplained screens.

---

## 37. Content Rules

Do not invent business claims.

Do not generate fake:

- reviews;
- customer counts;
- sales counts;
- certifications;
- awards;
- guarantees.

Seed/demo content must be clearly development content.

Do not invent scientific names or legal classification for bird categories.

---

## 38. Legal Data Handling

Provide data fields for:

- source information;
- ring/identification;
- documentation references;
- legal notes.

Do not programmatically claim that a bird species is legally tradeable without verified business data.

The owner/admin is responsible for validating actual trade and shipping requirements.

---

## 39. Environment Variables

Maintain a `.env.example`.

Expected local environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

Never commit actual secrets.

Never print secrets into browser logs.

Never include secrets in screenshots, README examples, or generated seed content.

---

## 40. Database Migrations

Schema changes must be represented through migration files.

Do not manually modify production-like database structure without reflecting the change in project migrations.

Maintain seed data separately where practical.

Seed data should include initial bird categories.

---

## 41. Error Handling

Handle expected failures gracefully.

Examples:

- Supabase unavailable;
- failed image upload;
- invalid login;
- unavailable inventory;
- duplicate checkout;
- payment initialization error;
- unsupported shipping destination.

Do not swallow errors silently.

Avoid exposing internal stack traces to users.

Log server-side errors appropriately during development.

---

## 42. Development Workflow

Work incrementally.

Do not attempt to implement the entire application in one uncontrolled change.

Recommended order:

### Phase 1 — Foundation

- project setup;
- dependencies;
- fonts;
- design tokens;
- global styles;
- shared layout;
- navigation;
- footer.

### Phase 2 — Public Website

- homepage;
- about;
- FAQ;
- contact;
- how to order;
- shipping information;
- journal layout.

### Phase 3 — Catalog

- category data;
- bird listing;
- search;
- filters;
- sorting;
- bird detail.

### Phase 4 — Supabase

- schema;
- migrations;
- seeds;
- auth;
- storage;
- RLS.

### Phase 5 — Account and Cart

- login/register;
- profile;
- addresses;
- cart;
- guest cart handling.

### Phase 6 — Checkout

- customer information;
- shipping;
- server validation;
- order creation.

### Phase 7 — Payments

- Midtrans Sandbox;
- Snap token;
- payment result UI;
- webhook implementation;
- inventory reservation/release.

### Phase 8 — Orders

- customer orders;
- order detail;
- timeline;
- WhatsApp CTA.

### Phase 9 — Admin

- dashboard;
- bird CRUD;
- category CRUD;
- orders;
- shipping;
- articles;
- content.

### Phase 10 — Polish

- motion;
- responsive refinement;
- empty states;
- loading states;
- accessibility.

### Phase 11 — Quality Audit

- security;
- RLS;
- SEO;
- performance;
- responsive;
- accessibility.

Deployment is not part of these phases.

---

## 43. Validation After Major Changes

After significant implementation phases, run the relevant checks.

At minimum before considering work stable:

```bash
npm run lint
npm run build
```

If the project defines a separate typecheck script, run it as well:

```bash
npm run typecheck
```

Fix errors before moving to the next major phase.

Do not ignore TypeScript or lint errors just to finish faster.

---

## 44. Do Not Break Existing Working Features

Before editing existing code:

- inspect related files;
- understand current implementation;
- preserve working behavior.

Do not rewrite entire modules unless necessary.

Prefer targeted improvements.

Do not remove functionality merely because a different implementation seems cleaner.

---

## 45. When Requirements Are Unclear

First inspect:

- `/docs/PRD.md`;
- existing code;
- database schema;
- existing patterns.

Choose the implementation most consistent with the existing project and PRD.

Do not invent major new product features.

Do not add scope such as:

- wishlist;
- loyalty;
- AI chatbot;
- marketplace;
- auction;
- subscriptions;

unless explicitly requested.

---

## 46. Current Out-of-Scope Work

Do not implement or configure:

- production hosting;
- deployment;
- custom domain;
- production Midtrans;
- production secrets;
- production callback;
- CI/CD deployment;
- mobile native app;
- multi-vendor marketplace;
- automatic courier API;
- AI recommendations;
- loyalty program;
- community forum.

Keep architecture reasonable so these can be considered later.

---

## 47. Definition of Done — Local Development

The local-development phase is considered complete when:

- application runs with `npm run dev`;
- application opens at `http://localhost:3000`;
- public pages work without authentication;
- responsive navigation works;
- catalog loads from database;
- categories load from database;
- search/filter work;
- bird detail works;
- register/login work;
- role-based admin access works;
- cart works;
- checkout validates server-side;
- shipping rules work;
- Midtrans Sandbox transaction creation works;
- webhook endpoint is implemented;
- payment state updates correctly when webhook is tested;
- inventory reservation works;
- order history works;
- admin bird/category CRUD works;
- admin order processing works;
- images work through Supabase Storage;
- RLS policies are applied;
- sensitive keys remain server-side;
- desktop/mobile layouts are polished;
- loading/error/empty states exist;
- lint passes;
- TypeScript checks pass;
- production build passes.

Hosting and production deployment are explicitly excluded.

---

## 48. Final Instruction to Codex

Always prioritize:

1. correctness;
2. data integrity;
3. security;
4. maintainability;
5. user experience;
6. visual polish;
7. animation.

Never sacrifice payment, authorization, inventory, or order correctness for visual effects.

The final website should feel like a carefully designed boutique parrot store rather than a generic e-commerce template.

Before beginning a major task, read the relevant section of `/docs/PRD.md`.

When implementation and PRD disagree, update the implementation to match the PRD unless the user explicitly changes the requirement.
