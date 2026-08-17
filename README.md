# 🎁 Donation Dashboard — Senior Frontend Engineer Assignment

A donation tracking dashboard for fundraising campaigns, built with **Angular 17+ (Standalone)**, **@ngrx/signals**, **Reactive Forms**, and **Jest**.

> **Note:** Developer testing tools (error simulation) are available at the bottom of the dashboard and can be hidden in production builds.

## 📋 Quick Navigation

[Quick Start](#-quick-start) • [Quick Test](#-quick-test-guide) • [Features](#features) • [Architecture](#architecture--design-decisions) • [Testing](#testing) • [Improvements](#future-improvements) • [Time](#time-investment)

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm v9+

### Installation & Run

```bash
npm install
npm start
```

Open **http://localhost:4200/**

### Tests

```bash
npm run test  # Run Jest tests
```

---

## 🧪 Quick Test Guide

### 1. Campaign Loading & Error Handling

**Test Campaign Data Loading + Error Recovery**

1. Open app → Campaign card shows **loading spinner**
2. Campaign data loads → Displays metrics (goal, total raised, donor count, average, progress %)
3. **Enable Error Mode:** Check "Simulate Campaign API Error" checkbox
4. Campaign card shows **error message** + **"Retry" button**
5. Click **Retry** → Error clears, data reloads successfully
6. **Uncheck** error checkbox for next test

**What Happens:** Mock API simulates 500 error; store catches it and displays user-friendly error. Retry calls `store.retryFetchCampaign()` again.

---

### 2. Donation Table - Pagination, Sorting & Errors

**Test Table Features + Error Handling**

1. Donation table shows 10 items per page with **loading spinner**
2. **Pagination:** Click next/previous → Page updates, new donations load
3. **Sorting:** Click column headers (Date, Amount, Donor Name, Payment Method) → Table re-sorts ascending/descending
4. **Enable Error Mode:** Check "Simulate Donation API Error" checkbox
5. Donation table shows error message + "Retry" button
6. Click **Retry** → Donations reload for current page
7. **Uncheck** error checkbox for next test

**What Happens:** Mock API simulates 500 error; store catches it and displays user-friendly error. Retry calls `store.retryFetchDonations()` again.

---

### 3. Add Donation Form - Validation & Error Handling

**Test Form Submission + Error Recovery**

1. Click **"+ Add Donation"** button → Modal form opens
2. **Form Validation:** Leave fields empty → Submit button **disabled**; form shows validation errors
3. **Fill Valid Form:**
   - Donor Name: "John Doe" (2-100 chars)
   - Email: "john@example.com" (valid email)
   - Amount: 50 (EUR, 1-999,999)
   - Payment Method: card/paypal/sepa
4. Click **Submit** → Form disables, shows loading state, donation added to table, modal closes
5. **Test Error Handling:**
   - Check **"Simulate Create Donation API Error"** checkbox
   - Click **"+ Add Donation"** again
   - Fill form with valid data
   - Click **Submit** → Form disables, attempts submission
   - **Error message appears in modal** (no automatic retry button)
   - **Fix:** Uncheck error checkbox in dev area
   - Fill form with valid data
   - Click **Submit** again → Succeeds, donation added, modal closes
6. **Uncheck** error checkbox after testing

**Key Difference:** Unlike Campaign & Donations, form has **NO retry button**. User must manually fix the error (uncheck dev checkbox) and re-submit. This is by design, form validation errors vs. API errors need different UX.

---

## ✨ Features

- **Campaign Metrics:** Real-time progress, total raised (EUR), donor count, average donation
- **Paginated Donations:** 10 items/page, sortable columns, responsive table
- **Table Features:** Sort by date/amount/name/payment method; expandable for future enhancements (go-to-page input, custom page size)
- **Add Donation Modal:** Reactive form with validation (EUR currency)
- **Error Handling:** Graceful error states with retry buttons
- **Loading States:** Spinners
- **Responsive Design:** Desktop + mobile optimized

---

## Project Structure

**Core Layers:**

- **`core/`** - Business logic (services, state management, API models, mock interceptor)
- **`shared/`** - Presentational components (campaign-card, generic-table, add-donation-modal)
- **`app.component`** - Smart component orchestrating store and data flow

**Key Files:**

- `donation.store.ts` - @ngrx/signals SignalStore (state + methods + computed values)
- `donation.service.ts` - HTTP client wrapper for GET/POST donations
- `campaign.service.ts` - Campaign API calls
- `mock-api.interceptor.ts` - Mock backend (1000 donations, 300ms delay, error simulation)
- `generic-table.component.ts` - Reusable paginated table with sorting

---

## 🏗️ Architecture & Design Decisions

### Component Architecture

- **Container/Presenter Pattern:** `AppComponent` (smart) orchestrates store; child components (presentational) receive data via `@Input()` and emit events via `@Output()`
- **Standalone Components:** Each component self-contained with its own imports
- **Layered Architecture:** Core (services, store) → Shared (components) → App (orchestrator)

### State Management: @ngrx/signals

- **Why?** Less boilerplate than traditional NgRx; fine-grained reactivity without action creators
- **Structure:** `withState()` + `withComputed()` + `withMethods()` in a single SignalStore
- **Data Flow:** User action → Store method (rxMethod) → HTTP request → `patchState()` → Signal updates → Component re-renders

### API Integration

- **Services:** `CampaignService`, `DonationService` (thin wrappers around HttpClient)
- **Mock API Interceptor:** Simulates backend with 1000 donations + network delay (300ms)
- **Error Handling:** Caught in store methods; error message displayed in UI with retry buttons
- **No Caching:** Fresh fetch on pagination/sort (can be optimized later)

### Forms: Reactive with Custom Validators

- **Form Fields:** Donor name (2-100 chars), email (valid pattern), amount (1-999999), payment method
- **Validation:** Real-time feedback; submit button disabled until valid
- **Error Display:** Field-level messages beneath each input

---

## 🎨 Components

### AppComponent (Smart/Container)

- **Role:** Orchestrates store, handles user actions, manages modal state
- **Key Methods:** `onAddDonation()`
- **Lifecycle:** Initializes store with `loadCampaign()` and `loadDonations()` on startup; table pagination/sorting is delegated directly to the `DonationStore`

### CampaignCard (Presentational)

- **Displays:** Campaign name, goal, total raised, progress %, donor count, average donation, dates
- **Props:** `campaign`, `loading`, `progressPercentage`, `averageDonation`, `error`
- **Interactions:** Retry button on error

### GenericTable (Presentational)

- **Features:** Sortable columns, pagination (prev/next), custom cell rendering
- **Props:** `data`, `columns`, `page`, `totalPages`, `sort`, `order`, `loading`, `error`
- **Dynamic:** Column config via `ColumnDef<T>` interface allows sorting by any property
- **Extensible:** Ready for future enhancements (go-to-page input, custom page size selector, export buttons)

### AddDonationModal (Presentational)

- **Form Fields:** Donor name, email, amount (EUR), payment method (card/paypal/sepa)
- **Validation:** Real-time with error messages (name: 2-100 chars, email: valid format, amount: 1-999,999)
- **Props:** `isSubmitting`, `errorMessage`
- **Events:** `submitDonation`, `modalClosed`
- **Note:** Currency is hardcoded to EUR per spec; easily configurable for future multi-currency support

---

## 🗄️ State Management (@ngrx/signals)

**Store Interface:**

```typescript
interface DonationState {
  campaign: Campaign | null;
  donations: Donation[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sort: string;
  order: "asc" | "desc";
  isCampaignLoading: boolean;
  isDonationsLoading: boolean;
  isSubmittingDonation: boolean;
  campaignError: string | null;
  donationsError: string | null;
  createDonationError: string | null;
}
```

**Key Store Methods:**

- `fetchCampaign()` → Loads campaign with loading/error states
- `fetchDonations()` → Fetches paginated donations
- `createDonation(dto)` → Posts new donation; updates store immediately
- `setPage(page)` → Updates pagination; triggers refetch
- `setSorting(sort, order)` → Updates sort; triggers refetch
- `toggleCampaignError()` / `toggleDonationsError()` → Dev tools for testing error states

**Computed Values:**

- `progressPercentage` → Math.min((totalRaised / goal) \* 100, 100)
- `averageDonation` → Math.round(totalRaised / donorCount)

**Data Flow:** User action → Store method (rxMethod) → HTTP → patchState() → Computed values recalculate → UI updates via signal subscriptions

---

## ✅ Testing

- **Framework:** Jest with `jest-preset-angular`
- **Coverage:** Component creation tests, HTTP interceptor setup, service layer mocks
- **Current Tests:** App component smoke test, donation service test and add-donation-modal component test
- **Known Limitation:** In the current implementation, a failed donation fetch swaps the full table for a focused error banner. This keeps the retry flow simple, but it hides the last successful dataset from the user during the error state.
- **To Expand:**
  - Store state mutations & computed value calculations
  - Service API calls & error scenarios
  - Form validation & submission flows
  - Retry + pagination state preservation after failure

### Tradeoffs / Limitations

I prioritized a fast, clear recovery flow over perfect continuity during failed reads:

- **Current behavior:** when the donations API fails, the table is replaced by an error panel instead of keeping the last successful dataset visible in the background.
- **Why:** this keeps the retry control obvious and avoids stale or partially mixed rows on a broken page state.
- **Cost:** the user loses immediate visual context of the last successful table while the error is active.
- **Expected next improvement:** keep the last successful table data visible underneath the error state, or show a lightweight “last synced” indicator while retry is pending.
- **Product decision:** this is acceptable for a short delivery window, but not the ideal UX for a production analytics dashboard where users expect continuity during transient failures.

**Testing note:** the current implementation is intentionally focused on functional recovery rather than full UX fidelity during failed reads. A more mature version should also assert that page/sort state remains stable after retry and that previous data is optionally preserved while the error banner is shown.

- **Run:** `npm run test`

## ⚡ Performance

- **Signal-based Reactivity:** Fine-grained updates, no unnecessary re-renders
- **Pagination:** 10 items/page reduces DOM rendering
- **Server-side Sorting:** Backend handles large datasets
- **Computed Values:** Automatically memoized (progressPercentage, averageDonation)
- **Handles 1000+ Donations:** Paginated; could add virtual scrolling or infinite scroll for more

---

## 📱 Responsive Design

- **Breakpoints:** Desktop (1024px+), Mobile (<768px)
- **Mobile First:** Table horizontal scroll, stacked campaign card
- **CSS Media Queries:** No frameworks; native CSS with flexible spacing

## 🔄 Production Considerations

**Current:** Manual refresh (on pagination/sort). For live updates:

- **WebSockets:** Real-time donation notifications & campaign metrics
- **Polling Interval:** Periodic campaign updates (every 30-60 seconds)
- **Optimistic Updates:** New donations added instantly; revert on error

**Deployment Checklist:**

- Real API endpoints
- Authentication
- Error logging & monitoring (Sentry, LogRocket)
- Environment config (dev/staging/prod)
- Docker containerization
- CI/CD pipeline (GitHub Actions)

## 🎯 Key Decisions & Trade-offs

| Decision         | Chosen         | Why                                                 |
| ---------------- | -------------- | --------------------------------------------------- |
| State Management | @ngrx/signals  | Less boilerplate than NgRx; fine-grained reactivity |
| Styling          | Native CSS     | No libraries allowed; shows CSS skills              |
| Testing          | Jest           | Better DX than Jasmine                              |
| Forms            | Reactive Forms | Type-safe, testable                                 |
| Updates          | Pessimistic    | Simpler; data consistency guaranteed                |

## 🚀 Future Improvements

**High Priority:**

- Search/filter by donor name or email
- Export donations to CSV
- Multi-language support (i18n)
- Multi-currency support
- Go-to-page input in pagination (jump to page X)
- Donation status tracking (completed, refunded, pending)

**Medium Priority:**

- Donation edit & refund workflow (for cancellations/amendments)
- Charts (donations over time, payment methods, top donors)
- Infinite scroll / virtual scrolling (CDK)
- Toast notifications for actions
- Accessibility improvements
- Docker & CI/CD pipeline
- Error monitoring & logging (Sentry)
- E2E tests (Cypress/Playwright)

**Low Priority:**

- PWA support (offline mode)
- Advanced campaign analytics
- Donor management panel
- Bulk donation import

---

## 🎓 Learning Outcomes

### Skills Developed

- ✅ Angular 17+ Standalone Components & Modern Control Flow
- ✅ @ngrx/signals for type-safe state management
- ✅ Angular Signals and computed values
- ✅ Reactive Forms with custom validation
- ✅ RxJS operators (switchMap, tap, catchError)
- ✅ HTTP interceptors for mock APIs
- ✅ Jest testing setup and unit tests
- ✅ Component architecture and separation of concerns
- ✅ Responsive CSS design (no frameworks)
- ✅ Error handling and edge cases

### Key Takeaways

1. **State Management is Critical:** Chose @ngrx/signals for its simplicity without sacrificing structure
2. **Presentational Components Are Reusable:** Generic table works for any data model
3. **Strong Types Prevent Bugs:** TypeScript strict mode caught many potential issues
4. **Testing Matters:** Even basic smoke tests catch component setup issues, of course tests should cover most of the app
5. **Performance is a Feature:** Pagination handles 1000+ donations smoothly
6. **Error States Are Features:** Every request needs error, loading, and success states

---

## 📈 Time Investment Breakdown

## ⏱️ Time Investment

**Total: ~20 hours (including React → Angular learning curve)**

Breakdown: Architecture & setup, state management (@ngrx/signals), services & API integration, component development (campaign card, table, modal, form validation), CSS & responsive design, Jest testing, bug fixes & refinements.

## ✅ Requirements Met

**Core Features:**

- ✅ Campaign metrics & progress
- ✅ Paginated donations (10 per page)
- ✅ Sortable columns
- ✅ Add donation form
- ✅ Error handling with retries
- ✅ Loading states
- ✅ Responsive design

**Technical:**

- ✅ Angular 17+ standalone
- ✅ TypeScript strict mode
- ✅ @ngrx/signals state management
- ✅ Reactive forms
- ✅ Jest testing
- ✅ Clean architecture

**Bonus:**

- ✅ Error simulation tools
- ✅ API service abstraction
- ✅ Comprehensive README

## 📞 Summary

This implementation balances:

- **Clarity** over cleverness
- **Type safety** with strict mode
- **Reusable components** for scale
- **Error resilience** for production
- **Reasonable trade-offs** for time

**Coming from React:** This is a clean Angular implementation following modern best practices (standalone components, signals, reactive forms). The architecture is modular and maintainable, with clear separation between smart (container) and presentational components.

**Developer Testing Tools:** At the bottom of the dashboard, there are checkboxes to simulate API errors for testing error states and recovery. These can be hidden in production builds via environment configuration.

Built to extend; future features are straightforward to add.
