# Implementation Plan

## Overview

Rencana implementasi ini mengikuti alur bugfix exploratory: eksplorasi bug terlebih dahulu dengan tes sebelum melakukan perbaikan, lalu terapkan fix pada dua file yang teridentifikasi, dan validasi bahwa semua perilaku yang ada tetap terjaga.

## Tasks

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Duplicate statusMap & localStorage Dashboard
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior — it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate both bugs exist
  - **Scoped PBT Approach**: Scope the property to the two concrete failing cases — (1) `statusMap["DITERIMA"] === statusMap["MASUK"]` and (2) `loadData()` reads from `localStorage` instead of calling fetch API
  - **Bug 1 — statusMap duplicate values:**
    - Read the current `statusMap` object from `src/components/SeblakRR/MenuMarketplace.tsx` (~line 114)
    - Write a property-based test that asserts all values in `statusMap` are unique and strictly increasing in the order `MASUK < DITERIMA < DIMASAK < SIAP < SELESAI`
    - Run on UNFIXED code — test FAILS because `statusMap["MASUK"] === statusMap["DITERIMA"] === 0`
    - Document the counterexample: `statusMap["DITERIMA"] = 0` but expected `= 1`
  - **Bug 2 — Dashboard reads localStorage:**
    - Mock `localStorage.getItem` to return `null` for both `seblakrr_orders` and `seblakrr_menu`
    - Call `loadData()` from `src/app/admin/page.tsx`
    - Assert that `fetch` was called with `/api/seblak/orders` — test FAILS because `loadData()` never calls `fetch`
    - Also assert `statusLabel["MASUK"]` is defined — test FAILS because `statusLabel` uses old English enum keys
    - Document the counterexample: `loadData()` returns empty state even when MongoDB has orders
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct — it proves both bugs exist)
  - Document counterexamples found to understand root cause
  - Mark task complete when test is written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Checkout Flow, Polling, and Admin Orders Page
  - **IMPORTANT**: Follow observation-first methodology
  - **Observe on UNFIXED code** for non-buggy inputs (statuses other than DITERIMA, and dashboard interactions that do not involve loadData):
    - Observe: `statusMap["DIMASAK"]` = `1`, `statusMap["SIAP"]` = `2`, `statusMap["SELESAI"]` = `3`, `statusMap["DITOLAK"]` = `3` on unfixed code
    - Observe: `confirmOrder()` POST request to `/api/seblak/orders` is unaffected by statusMap changes
    - Observe: polling `useEffect` fires every 5 seconds and calls `GET /api/seblak/orders?id=`
    - Observe: halaman `/admin/orders` fetches from MongoDB API and allows status updates — unaffected by dashboard changes
  - Write property-based tests capturing observed behavior:
    - **Property 2a**: For all status values in `["DIMASAK", "SIAP", "SELESAI", "DITOLAK"]`, the fixed `statusMap` value equals the original value plus the shift offset introduced by inserting `DITERIMA: 1` (i.e., each shifts up by 1 except where already documented)
    - **Property 2b**: For any checkout items array with non-zero items, `confirmOrder()` always sends a POST to `/api/seblak/orders` with the correct `grandTotal` and `items` fields — unchanged by the fix
    - **Property 2c**: For any orderId in tracking state, the polling interval always calls `fetch("/api/seblak/orders?id=" + orderId)` — unchanged by the dashboard fix
    - **Property 2d**: For any order with `status === "SELESAI"`, `dispatch(tambahPoin(poinDari))` is called — the actual poin awarding logic is unchanged
  - Verify all preservation tests PASS on UNFIXED code before implementing the fix
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 3. Fix for order status admin sync — statusMap duplicate & dashboard localStorage

  - [ ] 3.1 Fix `statusMap` in `src/components/SeblakRR/MenuMarketplace.tsx`
    - Locate the `statusMap` object inside the polling `useEffect` (~line 114)
    - Change `DITERIMA: 0` to `DITERIMA: 1`, shift `DIMASAK` to `2`, `SIAP` to `3`, `SELESAI` to `4`, `DITOLAK` to `4`
    - Updated object: `{ MASUK: 0, DITERIMA: 1, DIMASAK: 2, SIAP: 3, SELESAI: 4, DITOLAK: 4 }`
    - Update the loyalty points banner condition from `trackingState === 3` to `trackingState === 4` (Tracking Modal, ~line 350)
    - Note: the actual poin-awarding logic `if (order.status === 'SELESAI')` is already correct — do NOT change it
    - _Bug_Condition: `statusMap["DITERIMA"] === statusMap["MASUK"]` (both = 0), causing trackingState to never advance past 0 when admin sets status to DITERIMA_
    - _Expected_Behavior: Each status in `["MASUK", "DITERIMA", "DIMASAK", "SIAP", "SELESAI"]` maps to a unique, strictly increasing integer (0, 1, 2, 3, 4)_
    - _Preservation: Only statusMap values are changed; polling interval, fetch call, poin dispatch, checkout flow, and all other UI interactions remain identical_
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 3.2 Fix `statusLabel`, `loadData()`, `completedOrders` filter, and imports in `src/app/admin/page.tsx`
    - Add `Bell` and `XCircle` to the lucide-react import line alongside the existing imports
    - Replace `statusLabel` keys `RECEIVED`, `COOKING`, `READY`, `COMPLETED` with MongoDB keys `MASUK`, `DITERIMA`, `DIMASAK`, `SIAP`, `SELESAI`, `DITOLAK` — update labels, colors, and icons accordingly (Bell for MASUK, Clock for DITERIMA, ChefHat for DIMASAK, ShoppingBag for SIAP, CheckCircle for SELESAI, XCircle for DITOLAK)
    - Replace `loadData()` with an async version that calls `Promise.all([fetch("/api/seblak/orders"), fetch("/api/seblak/menu")])` and sets state from the JSON responses
    - Change `completedOrders` filter from `status === 'COMPLETED'` to `status === 'SELESAI'`
    - The `useEffect` structure (setMounted, loadData call, setInterval, clearInterval) does not need structural changes
    - _Bug_Condition: `loadData()` calls `localStorage.getItem('seblakrr_orders')` which is always null because the customer checkout flow writes to MongoDB, never to localStorage_
    - _Expected_Behavior: `loadData()` calls `fetch("/api/seblak/orders")` and `fetch("/api/seblak/menu")` and populates state from the JSON responses_
    - _Preservation: UI layout, stat cards, navigation links, "Pesanan Terbaru" table structure, Status Breakdown chart, Quick Actions, and auto-refresh interval remain identical_
    - _Requirements: 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ] 3.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Unique statusMap Mapping & API-backed Dashboard
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - The test from task 1 encodes the expected behavior for both bugs
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES — confirms `statusMap` has unique strictly-increasing values and `loadData()` calls fetch API
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6_

  - [ ] 3.4 Verify preservation tests still pass
    - **Property 2: Preservation** - Checkout Flow, Polling, and Admin Orders Page
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run all preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS — confirms no regressions in checkout flow, polling, poin awarding, or admin orders page
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4. Checkpoint — Ensure all tests pass
  - Run the full test suite to confirm all tests pass
  - Verify no TypeScript compile errors in `MenuMarketplace.tsx` and `admin/page.tsx`
  - Manually verify (or via integration test) the end-to-end flow: customer checkout → admin sets status to `DITERIMA` → customer tracking modal advances to step 2
  - Manually verify (or via integration test): admin dashboard loads and shows real order counts and revenue from MongoDB
  - Manually verify: badge for a `MASUK` order shows "Masuk" label with correct styling
  - Ensure all tests pass; ask the user if questions arise.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2"] },
    { "wave": 3, "tasks": ["3.1", "3.2"] },
    { "wave": 4, "tasks": ["3.3", "3.4"] },
    { "wave": 5, "tasks": ["4"] }
  ]
}
```

Tasks 3.1 and 3.2 are independent of each other and can be done in either order or in parallel. Tasks 3.3 and 3.4 both depend on 3.1 and 3.2 being complete.

## Notes

- Tasks 1 and 2 MUST be run on the **unfixed** code before any implementation changes are made.
- Task 1 is expected to FAIL on unfixed code — this is intentional and confirms the bug exists.
- Task 2 is expected to PASS on unfixed code — this establishes the preservation baseline.
- The `trackingState === 3` → `trackingState === 4` change in the banner condition (task 3.1) is a necessary side effect of correcting the `SELESAI` mapping from `3` to `4`. The actual poin dispatch (`if (order.status === 'SELESAI')`) is already correct and must not be modified.
- The `useEffect` interval structure in `admin/page.tsx` does not need to change — `setInterval` works correctly with async callbacks.
- Only two source files are modified by this bugfix: `src/components/SeblakRR/MenuMarketplace.tsx` and `src/app/admin/page.tsx`.
