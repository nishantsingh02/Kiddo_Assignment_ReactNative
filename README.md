# 🧸 Kiddo — Server-Driven UI (SDUI) Homepage Renderer

Welcome to **Kiddo**, a premium Q-commerce mobile application for kids and baby essentials. This project implements a highly performant, production-ready, configuration-driven homepage renderer utilizing **Server-Driven UI (SDUI)** architecture in React Native (Expo). 

The mobile homepage is designed to be fully dynamic and volatile, allowing live marketing campaigns and layout updates with **zero App Store / Play Store release cycles**. The client acts as a "dumb" rendering engine that parses a structured JSON payload, dynamically constructs the screen tree, injects runtime themes, overlays animated campaigns, and dispatches actions to local execution blocks.

---

## 📋 The Technical Assignment

This codebase is a complete, successful implementation of the **Kiddo Technical Assignment** outlined in [Kiddo_Assignment_tech.md](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/Kiddo_Assignment_tech.md). Below is a summary of the core and advanced requirements specified in the challenge, and how they have been addressed:

### 1. Core Requirements
*   **The Component Registry & Factory Pattern:** A dynamic registry mapping server-defined JSON node types to active client component layouts (`BANNER_HERO`, `PRODUCT_GRID_2X2`, `DYNAMIC_COLLECTION`).
*   **System Defensive Resilience (Unmapped Component Graceful Failure):** A strict rule that the client must fail gracefully, drop unrecognized component nodes (such as `NEW_COMPONENT_V2` or corrupted inputs) quietly, and maintain absolute stability of the surrounding interface tree.
*   **Dynamic Collections & Virtualization Boundaries:** instantiating a horizontal scrolling carousel layout container nested inside the master vertical feed without causing vertical scroll velocity drops, stutters, or memory leaks under heavy scrolling.
*   **Universal Action Dispatcher:** Standardized event handling schema (e.g. `ADD_TO_CART`, `DEEP_LINK`) routed through a centralized dispatcher. Decoupled layout components containing no hardcoded business logic.
*   **High Frame-Rate Optimization:** Streaming the entire layout cleanly inside a single, singular vertical list structure (`@shopify/flash-list`), utilizing strict index stability mapping (`keyExtractor`) and React memoization boundaries.

### 2. Advanced Deliverables (Campaigns & State)
*   **Remote Overlay Contexts (The Campaign Engine):** Instant support for three distinct, theme-swappable live marketing campaigns:
    1.  *Back to School Mega-Sale:* Yellow/blue high-contrast skin, overlay Lottie animations (flying pencils/airplanes), custom row for Lunchboxes & Bags.
    2.  *Summer Playhouse Festival:* Ocean blue theme palette, dynamic floating bubbles overlay, custom booking cards for Petting Zoo Tickets.
    3.  *Mystery Gift Carnival:* Carnival red theme, burst-confetti Lottie overlay, special `APPLY_MYSTERY_GIFT_COUPON` interactive macro action.
*   **Touch-Transparent Overlay Constraint:** Overlay graphics must cover the screen using `pointerEvents="none"`, allowing users to fully interact, scroll, and tap elements underneath the animation.
*   **Over-The-Air (OTA) Runtime Theme Injection:** Standardized server-driven style injection mapping colors dynamically into a React Context Provider, repainting the client application instantaneously.
*   **Local State Collocation (The Rendering Cycle Challenge):** Mutating the cart quantity or pressing "+ Add" on one product card **must NOT** trigger re-renders down the other 30+ layout blocks mounted in the vertical feed.

---

## 🛠️ Architecture & Core Design Patterns

The engine is engineered around standard architectural design patterns to ensure decoupling, robustness, and performance:

```
                  ┌──────────────────────────────┐
                  │      Backend JSON Payload     │
                  └──────────────┬───────────────┘
                                 │ Ingest
                                 ▼
                  ┌──────────────────────────────┐
                  │    Campaign Selector / Parser│
                  └──────────────┬───────────────┘
                                 │ Theme & Overlay Context
                                 ▼
                  ┌──────────────────────────────┐
                  │   ThemeContext & Provider    │
                  └──────────────┬───────────────┘
                                 │ Theme Styles
                                 ▼
                  ┌──────────────────────────────┐
                  │  HomeFeedRenderer (List)     │
                  └──────────────┬───────────────┘
                                 │ Maps each node via
                                 ▼
                  ┌──────────────────────────────┐
                  │ ComponentRegistry (Factory)  │
                  └──────────────┬───────────────┘
                                 │ Renders Components
                                 ▼
      ┌──────────────────────────┼──────────────────────────┐
      ▼                          ▼                          ▼
┌───────────┐              ┌───────────┐              ┌───────────┐
│BannerHero │              │ProductGrid│              │DynamicColl│
└─────┬─────┘              └─────┬─────┘              └─────┬─────┘
      │                          │                          │
      └──────────────────────────┼──────────────────────────┘
                                 │ Emits declarative actions
                                 ▼
                  ┌──────────────────────────────┐
                  │  Universal Action Dispatcher  │
                  └──────────────────────────────┘
                                 │ Resolves side effects
                                 ▼
                    [Cart / Deep-linking / Booking]
```

### 1. The Component Factory
*   **Implementation:** [ComponentRegistry.ts](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/src/registry/ComponentRegistry.ts) & [RegistryRenderer.tsx](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/src/registry/RegistryRenderer.tsx)
*   Instead of fragile, massive conditional switch-blocks, the registry maps backend component types to React layout definitions via a clean, read-only hash map.
*   If the server pushes an unmapped component, [RegistryRenderer.tsx](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/src/registry/RegistryRenderer.tsx) handles it defensively: logs a developer warning in `__DEV__` mode, returns `null` silently in production, and isolates the failure to ensure the rest of the homepage renders flawlessly.

### 2. Universal Action Dispatcher
*   **Implementation:** [ActionDispatcher.ts](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/src/dispatcher/ActionDispatcher.ts)
*   Decoupled components do not manage side-effects. When clicked, components emit standard action payload objects to `handleAction(actionObj)`.
*   The dispatcher intercepts the action and executes corresponding side-effects (e.g. navigation via Expo Router, incrementing cart stores, applying gift coupon states, or launching location location prompts).

### 3. OTA Theming Engine
*   **Implementation:** [ThemeContext.tsx](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/src/context/ThemeContext.tsx)
*   A global `ThemeProvider` wraps the application root. It ingests the theme payload (`primary`, `primaryLight`, `accent`, `background`, `surface`, `textPrimary`, etc.) and distributes the styled tokens.
*   Nested components consume the `useTheme()` hook to dynamically override local stylesheets at runtime without needing a compiled binary release.

### 4. High-Performance List Virtualization
*   **Implementation:** [HomeFeedRenderer.tsx](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/src/engine/HomeFeedRenderer.tsx)
*   The homepage is rendered inside a single `@shopify/flash-list`. This preserves the recycling of native views and eliminates frame drops (jank) during heavy scrolling.
*   To keep vertical momentum unaffected by the horizontal carousels, [DynamicCollection.tsx](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/src/components/DynamicCollection/DynamicCollection.tsx) configures the horizontal FlatList with explicit `getItemLayout`, `decelerationRate="fast"`, and scroll-locking properties.

### 5. Local State Collocation (Cart Isolation)
*   **Implementation:** [CartContext.tsx](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/src/context/CartContext.tsx) & [ProductCard.tsx](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/src/components/ProductGrid2x2/ProductCard.tsx)
*   To bypass the global re-render tree problem, state management leverages a custom Zustand store wrapping the React Context.
*   In [ProductCard.tsx](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/src/components/ProductGrid2x2/ProductCard.tsx), cart subscription is isolated: `const quantity = useCart((state) => state.quantities[product.id] ?? 0)`.
*   Because we subscribe strictly to the individual item quantity ID using Zustand selector logic and wrap the components in `React.memo`, adding a product to the cart **only** re-renders that specific product card. The other 30+ blocks on the screen remain untouched, keeping frame rates at a sustained 60 FPS.

---

## 📁 Folder Structure & Code Map

The source code directory is structured as follows:

```
src/
├── app/                                 # File-based navigation routes (Expo Router)
│   ├── _layout.tsx                      # Injects contexts (Theme, Campaign, Cart) and paints bottom tab bar
│   ├── index.tsx                        # Master screen container: contains the campaign simulator floating bar
│   ├── basket.tsx                       # Interactive Q-Commerce Cart screen
│   ├── category.tsx                     # Deep-linked Category landing page
│   └── ticket.tsx                       # Dynamic event booking ticket verification
│
├── registry/                            # SDUI Component Factory
│   ├── ComponentRegistry.ts             # Hash-map Registry mapping type tags to layout components
│   └── RegistryRenderer.tsx             # Defensive wrapper that handles unknown components gracefully
│
├── engine/                              # Core rendering loop
│   └── HomeFeedRenderer.tsx             # Main Shopify FlashList renderer managing index stability
│
├── dispatcher/                          # Action routing
│   └── ActionDispatcher.ts              # Global interceptor for client deep-linking, basket actions, etc.
│
├── components/                          # SDUI Atomic Components
│   ├── BannerHero/                      # Fluid full-width promotional graphic card
│   ├── ProductGrid2x2/                  # Standard 2x2 grid layout
│   │   ├── ProductGrid2x2.tsx           # Grid wrapper
│   │   └── ProductCard.tsx              # Collocated card with Zustand subscription & React.memo
│   ├── DynamicCollection/               # Horizontal scrolling carousel row
│   │   ├── DynamicCollection.tsx        # Horizontal FlatList container
│   │   └── CollectionItem.tsx           # Carousel card
│   ├── Header/                          # App Header displaying location, cart quantities
│   ├── SearchBar/                       # Location-aware pill-shaped search input
│   └── FilterChips/                     # Horizontal dynamic tag selectors
│
├── context/                             # Global Provider contexts
│   ├── ThemeContext.tsx                 # Dynamic client coloring styles
│   ├── CampaignContext.tsx              # Remote campaign payload controller
│   └── CartContext.tsx                  # Performance-optimized Zustand Cart Store
│
├── campaigns/                           # Live Campaign simulator assets
│   ├── CampaignOverlay.tsx              # Full-screen touch-transparent Lottie animations layer
│   └── payloads/                        # Local mock JSON files representing production payloads
│       ├── defaultFeed.json             # Baseline configuration
│       ├── backToSchool.json            # Back to School Mega-Sale Campaign
│       ├── summerPlayhouse.json         # Summer Playhouse Festival Campaign
│       └── mysteryCarnival.json         # Mystery Gift Carnival Campaign
│
├── styles/                              # Design Tokens
│   └── spacing.ts                       # Standard paddings, margins, border radius
│
└── types/                               # TypeScript strict configurations
    ├── payload.types.ts                 # Full SDUI JSON Schema declarations
    ├── action.types.ts                  # Declarative event dispatch contracts
    └── campaign.types.ts                # Campaign layout types
```

---

## 🎨 Campaign Environments In Action

The project allows testing and switching between 4 different Server-Driven payloads (representing live campaigns) instantly using the **SDUI Demo Switcher FAB** on the bottom right of the screen.

| Campaign Context | Visual Skin Theme | Special Node & Animations | Unique Action Fired |
| :--- | :--- | :--- | :--- |
| **Default Q-Commerce** | `#008080` (Teal) + `#E4B8AD` (Blush) | Default grid nodes, no overlay | standard `ADD_TO_CART` & `DEEP_LINK` |
| **Back to School Mega-Sale** | `#1565C0` (Blue) + `#FDD835` (Yellow) | Remote Lottie asset overlay showing falling pencils / paper airplanes | Focuses on horizontal collection 'Lunchboxes & Bags' |
| **Summer Playhouse** | `#0097A7` (Ocean) + `#FFD54F` (Aqua Accent) | Animated floating water bubbles overlay | Event booking for 'Petting Zoo Tickets' (custom ticket route) |
| **Mystery Gift Carnival** | `#C62828` (Carnival Red) + `#FFD600` (Gold) | Bursting confetti animations overlay | Specialty interaction `APPLY_MYSTERY_GIFT_COUPON` |

*Touch-Transparency:* For all active campaigns, the Lottie overlay fills the viewport, but utilizes `pointerEvents="none"` to guarantee that click events fall through to the product cards and tabs below.

---

## 🚀 Setting Up and Running the Project

Follow these steps to run the application on your machine:

### 1. Prerequisites
Ensure you have Node.js (version 18 or higher recommended) and npm installed.

### 2. Installation
Navigate to the root directory and install project dependencies:
```bash
npm install
```

### 3. Start the Development Server
Run the Expo CLI developer tools:
```bash
npx expo start
```

### 4. Running on Platforms
Select one of the following commands or use the shortcut options inside the terminal interface:
*   **Run on Web:** Press `w` in the Expo CLI terminal or execute:
    ```bash
    npm run web
    ```
*   **Run on Android Emulator:** Press `a` in the terminal or execute:
    ```bash
    npm run android
    ```
*   **Run on iOS Simulator:** Press `i` in the terminal or execute:
    ```bash
    npm run ios
    ```

---

## 📈 Performance & Quality Checklist

*   **TypeScript Strict Mode:** Fully configured in [tsconfig.json](file:///C:/Users/nraj1/Desktop/My%20Project/Kiddos/tsconfig.json) with strict null-checking, function types, and checking against index accesses.
*   **Zero Global Re-renders:** Confirmed by console telemetry log cycles. Changing cart state affects strictly the respective `ProductCard` / `CollectionItem` and the header/tab count.
*   **Lottie Animation Optimization:** Bundled campaign overlays load asynchronously with optimized render configurations.
*   **Aspect Ratio Stability:** Banners and grids use deterministic proportions relative to the screen dimensions to prevent layout shifts (CLS) when loading remote assets.
