# Implementation Plan: Admin Sidebar Toggle

## Overview

Single-file implementation: modify `src/app/admin/layout.tsx` to add a boolean `sidebarOpen` state, a toggle button in the Top Bar, and conditional rendering for sidebar elements based on that state. Then set up Vitest + React Testing Library + fast-check and write unit and property-based tests for all 6 correctness properties.

## Tasks

- [x] 1. Set up test infrastructure
  - Install Vitest, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, and `fast-check` as dev dependencies
  - Create `vitest.config.ts` at the project root, configure the React plugin, jsdom environment, and `@testing-library/jest-dom` setup file
  - Create `src/test/setup.ts` that imports `@testing-library/jest-dom`
  - Add `"test": "vitest --run"` script to `package.json`
  - _Requirements: testing prerequisites for all requirements_

- [x] 2. Implement the sidebar toggle feature
  - [x] 2.1 Add state, imports, and toggle button to `layout.tsx`
    - Add `useState` import from `react`
    - Add `PanelLeftClose`, `PanelLeftOpen` imports from `lucide-react`
    - Add `Tooltip, TooltipContent, TooltipProvider, TooltipTrigger` imports from `@radix-ui/react-tooltip`
    - Declare `const [sidebarOpen, setSidebarOpen] = useState(true)` inside `AdminLayout`
    - Add the toggle `<button>` in the Top Bar to the left of the page-title block, with `aria-label`, `onClick={() => setSidebarOpen(!sidebarOpen)}`, and conditional `PanelLeftClose` / `PanelLeftOpen` icon
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.2, 6.3, 6.4_

  - [x] 2.2 Implement conditional sidebar width and layout classes
    - Replace static `className="w-64 ..."` on `<aside>` with a dynamic class: `w-64` when `sidebarOpen`, `w-16` when collapsed
    - Add `transition-all duration-200 overflow-hidden` to `<aside>`
    - Center the logo icon with `mx-auto` when collapsed
    - _Requirements: 2.1, 3.3, 4.1, 4.2, 4.3, 4.4, 7.2_

  - [x] 2.3 Implement conditional rendering for sidebar text elements
    - Wrap `<h1>SeblakRR</h1>` and `<p>Admin Panel</p>` in `{sidebarOpen && (...)}` so they hide when collapsed
    - Wrap the footer `<Link>Lihat Halaman User</Link>` and copyright `<p>` in `{sidebarOpen && (...)}` so they hide when collapsed
    - _Requirements: 2.2, 2.4, 3.1, 3.4, 7.1_

  - [x] 2.4 Implement icon-only nav items with Tooltip support
    - Wrap all nav items in `<TooltipProvider delayDuration={0}>` and each item in `<Tooltip>`
    - Apply `{sidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'}` padding to each `<Link>` so collapsed items have ≥ 44px click area
    - Wrap each nav item's text block (`item.name`, `item.desc`, `ChevronRight`) in `{sidebarOpen && (...)}` so only icons remain when collapsed
    - Render `<TooltipContent side="right">` with `item.name` only when `!sidebarOpen`
    - _Requirements: 2.3, 2.5, 3.1, 3.2, 3.5, 5.1, 5.2, 5.3, 5.4, 7.1_

- [x] 3. Checkpoint — verify implementation compiles and renders
  - Ensure all TypeScript errors are resolved (run `npx tsc --noEmit`)
  - Ensure all tests pass, ask the user if questions arise

- [x] 4. Write unit tests for the toggle feature
  - [x] 4.1 Create `src/app/admin/__tests__/layout.unit.test.tsx`
    - Write example-based unit tests covering: initial render (`w-64`, `PanelLeftClose`), single click (`w-16`, `PanelLeftOpen`), double click (back to `w-64`), toggle button position (before title in DOM), expanded logo/footer visible, collapsed logo/footer hidden, sticky Top Bar class, transition class on `<aside>`
    - _Requirements: 1.1, 1.4, 1.5, 2.2, 2.4, 3.3, 3.4, 4.4, 7.4_

  - [ ]* 4.2 Write property test — Property 1: Toggle round-trip
    - **Property 1: Toggle adalah round-trip (idempotent-double-click)**
    - Use `fc.boolean()` to vary initial `sidebarOpen`; assert that two consecutive clicks return sidebar to its original width class
    - **Validates: Requirements 1.2, 1.3, 4.1**

  - [ ]* 4.3 Write property test — Property 2: Expanded state nav items
    - **Property 2: Expanded state — semua nav item menampilkan name dan desc**
    - Use `fc.array(fc.record({name, desc, href, icon}))` with `sidebarOpen = true`; assert every `item.name` and `item.desc` is visible in render output
    - **Validates: Requirements 2.3**

  - [ ]* 4.4 Write property test — Property 3: Collapsed state nav items
    - **Property 3: Collapsed state — hanya ikon yang tampil, teks tersembunyi**
    - Use `fc.array(fc.record({name, desc, href, icon}))` with `sidebarOpen = false`; assert no `item.name` / `item.desc` text is visible, but nav `<a>` elements equal `navItems.length`
    - **Validates: Requirements 3.1, 3.2**

  - [ ]* 4.5 Write property test — Property 4: Active item styling consistency
    - **Property 4: Active item styling konsisten di kedua kondisi sidebar**
    - Use `fc.constantFrom('/admin', '/admin/orders', '/admin/menu', '/admin/other')` × `fc.boolean()` for `sidebarOpen`; assert exactly one link has `bg-orange-600` when pathname matches a nav item, zero links have it otherwise
    - **Validates: Requirements 2.5, 5.3, 5.4**

  - [ ]* 4.6 Write property test — Property 5: Nav links clickable when collapsed
    - **Property 5: Nav links tetap ada dan dapat diklik saat collapsed**
    - Use `fc.array(fc.record({name, href, icon, desc}))` with `sidebarOpen = false`; assert each `<a>` exists in DOM with the correct `href`
    - **Validates: Requirements 5.1, 5.2**

  - [ ]* 4.7 Write property test — Property 6: Existing elements preserved
    - **Property 6: Semua elemen existing tetap hadir di semua kondisi sidebar**
    - Use `fc.boolean()` for `sidebarOpen`; assert logo SR, 3 nav links, Top Bar sticky element, "Simulasi Aktif" badge, and `{children}` are all present in DOM regardless of sidebar state
    - **Validates: Requirements 7.1, 7.5**

- [x] 5. Final checkpoint — Ensure all tests pass
  - Run `npm test` (executes `vitest --run`) and confirm all unit tests and property tests pass
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The entire feature is a single-file change to `src/app/admin/layout.tsx`
- `@radix-ui/react-tooltip` is already installed — no new runtime dependencies needed
- Tooltip `delayDuration={0}` satisfies the ≤ 300ms requirement (Requirement 3.5)
- Property tests use minimum 100 runs (`numRuns: 100`) as specified in the design
- Each property test file must include a comment referencing its property number and the feature name

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["2.4"] },
    { "id": 4, "tasks": ["4.1"] },
    { "id": 5, "tasks": ["4.2", "4.3", "4.4", "4.5", "4.6", "4.7"] }
  ]
}
```
