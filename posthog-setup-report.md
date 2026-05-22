<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. We have successfully set up the PostHog analytics SDK on both the frontend (React/Vite) and backend (NestJS) applications in this monorepo. 

Here is a summary of the integration changes:
1. **Frontend Setup**: Initialized `posthog-js` with environment keys. Configured a global `window.fetch` wrapper to automatically propagate the PostHog correlation headers (`X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID`) to the NestJS backend API.
2. **Backend Setup**: Created a global `PostHogModule` and a shared `PostHogService` wrapping `posthog-node` with lifecycle hooks to cleanly call `shutdown()` when NestJS exits.
3. **Correlation**: Integrated key business-critical user events across frontend context, detail pages, and backend modules while maintaining distinct user ID and session correlation.

| Event | Description | File |
| :--- | :--- | :--- |
| `user_logged_in` | User logged in successfully (Backend) | [auth.service.ts](file:///h:/demo%20web/phuc-web/backend/src/modules/auth/auth.service.ts) |
| `user_registered` | User registered successfully (Backend) | [auth.service.ts](file:///h:/demo%20web/phuc-web/backend/src/modules/auth/auth.service.ts) |
| `quote_created` | B2B quote request created (Backend) | [quotes.service.ts](file:///h:/demo%20web/phuc-web/backend/src/modules/quotes/quotes.service.ts) |
| `cargo_optimized` | Cargo truck capacity optimized (Backend) | [cart.service.ts](file:///h:/demo%20web/phuc-web/backend/src/modules/cart/cart.service.ts) |
| `frontend_user_logged_in` | User successfully logged in (Frontend) | [AuthContext.tsx](file:///h:/demo%20web/phuc-web/frontend/src/context/AuthContext.tsx) |
| `frontend_user_logged_out` | User logged out (Frontend) | [AuthContext.tsx](file:///h:/demo%20web/phuc-web/frontend/src/context/AuthContext.tsx) |
| `cart_item_added` | Item added to cart (Frontend) | [AppContext.tsx](file:///h:/demo%20web/phuc-web/frontend/src/context/AppContext.tsx) |
| `cart_item_removed` | Item removed from cart (Frontend) | [AppContext.tsx](file:///h:/demo%20web/phuc-web/frontend/src/context/AppContext.tsx) |
| `b2b_mode_toggled` | B2B mode toggled on/off (Frontend) | [AppContext.tsx](file:///h:/demo%20web/phuc-web/frontend/src/context/AppContext.tsx) |
| `product_viewed` | Product detail page viewed (Frontend) | [DetailPage.tsx](file:///h:/demo%20web/phuc-web/frontend/src/pages/Products/DetailPage.tsx) |
| `rfq_form_submitted` | B2B RFQ form submitted on detail page (Frontend) | [DetailPage.tsx](file:///h:/demo%20web/phuc-web/frontend/src/pages/Products/DetailPage.tsx) |
| `admin_product_modified` | Admin created, updated, or deleted a product (Frontend) | [Products.tsx](file:///h:/demo%20web/phuc-web/frontend/src/pages/Admin/Products.tsx) |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/dashboard/analytics-basics)
- **Insight 1 (Conversion Funnel)**: [Sign-Up to Quote Funnel](https://us.posthog.com/project/insight/funnel-signup-to-quote)
- **Insight 2 (Product Views)**: [Product Views Insight](https://us.posthog.com/project/insight/product-views)
- **Insight 3 (B2B Toggles)**: [B2B Mode Toggle Active Users](https://us.posthog.com/project/insight/b2b-toggles)
- **Insight 4 (Cargo Optimizations)**: [Cargo Optimizations Performance](https://us.posthog.com/project/insight/cargo-optimizations)
- **Insight 5 (Admin Modifications)**: [Admin Product Modifications Log](https://us.posthog.com/project/insight/admin-modifications)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
