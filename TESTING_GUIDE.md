# Testing Guide: Transactions Page Enhancements (Phases 1-4)

This guide provides step-by-step instructions to validate all major features implemented in Phases 1-4 of the Transactions page refinement.

## Getting Started

1. **Start the development server:**
   ```bash
   npm run dev
   ```
2. **Navigate to:** http://localhost:5173/transactions

---

## Phase 1: Foundation Enhancements

### 1.1 Multi-Select & Bulk Actions

**Test: Select individual transactions**
- [ ] Click checkboxes next to transaction rows
- [ ] Verify selected transactions get blue background highlight
- [ ] Verify bulk action toolbar appears at bottom when items selected
- [ ] Verify toolbar shows correct count (e.g., "3 transactions selected")

**Test: Select all transactions**
- [ ] Click "Select all" checkbox in header (top right)
- [ ] Verify all transactions get selected and highlighted
- [ ] Click again to deselect all
- [ ] Verify all selections cleared

**Test: Date group selection**
- [ ] Click checkbox next to a date group header (e.g., "TODAY")
- [ ] Verify all transactions in that date group get selected
- [ ] Click again to deselect entire group

**Test: Bulk delete**
- [ ] Select multiple transactions (2-5)
- [ ] Click "Delete" button in bulk toolbar
- [ ] Verify confirmation dialog appears with count
- [ ] Click "Delete" to confirm
- [ ] Verify transactions removed from list
- [ ] Verify toast notification appears
- [ ] Click "Undo" in toast to restore (if implemented)

**Test: Bulk categorize**
- [ ] Select multiple transactions
- [ ] Click "Categorize" button in bulk toolbar
- [ ] Verify modal/alert appears (currently shows "coming soon" alert)

**Test: Bulk mark reviewed**
- [ ] Select multiple transactions
- [ ] Click "Mark Reviewed" button in bulk toolbar
- [ ] Verify alert appears (currently shows "coming soon" alert)

**Test: Clear selection**
- [ ] Select several transactions
- [ ] Click "Clear" button in bulk toolbar
- [ ] Verify all selections cleared
- [ ] Verify toolbar disappears

---

### 1.2 Active Filter Display

**Test: Category filter chips**
- [ ] Click "Filter" button
- [ ] Select 2-3 categories (e.g., Shopping, Restaurants)
- [ ] Verify filter chips appear below search bar
- [ ] Verify each chip shows category name
- [ ] Click X on a chip to remove it
- [ ] Verify filter updates and transactions re-filter

**Test: Account filter chips**
- [ ] Open filters panel
- [ ] Select 1-2 accounts
- [ ] Verify account chips appear
- [ ] Verify transactions filter correctly

**Test: Amount range filter chip**
- [ ] Open filters panel
- [ ] Enter min amount: 50
- [ ] Enter max amount: 200
- [ ] Verify chip appears showing "$50 - $200"
- [ ] Test with only min: verify chip shows "≥ $50"
- [ ] Test with only max: verify chip shows "≤ $200"
- [ ] Click X to remove amount filter

**Test: Clear all filters**
- [ ] Apply multiple filters (categories + accounts + amount)
- [ ] Verify "Clear All" button appears in filter chips area
- [ ] Click "Clear All"
- [ ] Verify all chips removed and all transactions shown

---

### 1.3 Date & Time Improvements

**Test: Relative date labels**
- [ ] Verify today's transactions show "TODAY" header
- [ ] Verify yesterday's transactions show "YESTERDAY"
- [ ] Verify recent week transactions show "THIS WEEK"
- [ ] Verify older transactions show "LAST WEEK" or absolute dates

**Test: Date group totals**
- [ ] Locate a date group header
- [ ] Verify it shows breakdown on the right:
  - Green income total (if any positive amounts)
  - Red expense total (if any negative amounts)
  - White/green net total
- [ ] Verify math is correct by adding up transactions manually

**Test: Transaction grouping**
- [ ] Verify transactions are grouped by date
- [ ] Verify newest dates appear first (when sorted by "Date (Newest)")
- [ ] Change sort to "Date (Oldest)"
- [ ] Verify date groups reverse order

---

### 1.4 Transaction Status System

**Test: Status badges display**
- [ ] Scan transaction list for status badges
- [ ] Verify different status colors:
  - `pending`: Yellow/orange badge
  - `posted`: Green badge
  - `cleared`: Blue badge
  - `to_review`: Red/purple badge
- [ ] Open transaction detail panel
- [ ] Verify status badge appears in detail view

**Test: Update transaction status**
- [ ] Open a transaction detail panel
- [ ] Click "Mark Reviewed" button
- [ ] Verify status changes to "cleared"
- [ ] Verify badge updates in list and panel

---

### 1.5 Enhanced Detail Panel

**Test: Action buttons**
- [ ] Click on any transaction to open detail panel
- [ ] Verify action buttons appear in header:
  - Review button (checkmark icon)
  - Split button (split icon)
  - Recurring button (repeat icon)
- [ ] Hover over buttons to see tooltips
- [ ] Click "Review" - verify status updates
- [ ] Click "Split" - verify alert/modal (coming soon)
- [ ] Click "Recurring" - verify alert/modal (coming soon)

**Test: Disabled states**
- [ ] Open a transaction already marked "cleared"
- [ ] Verify "Review" button is disabled or shows different state

---

## Phase 2: Transaction Management

### 2.1 Add Transaction Modal

**Test: Open modal**
- [ ] Click "+ Add Transaction" button in top toolbar
- [ ] Verify modal opens with form

**Test: Create income transaction**
- [ ] Fill in form:
  - Merchant: "Salary Payment"
  - Amount: 5000 (positive number)
  - Category: Select any
  - Account: Select any
  - Date: Today
  - Type: Income
- [ ] Click "Add Transaction"
- [ ] Verify modal closes
- [ ] Verify new transaction appears at top of list
- [ ] Verify amount shows in green (positive)

**Test: Create expense transaction**
- [ ] Open add modal
- [ ] Create transaction with negative amount or select "Expense" type
- [ ] Verify transaction appears with white/red amount

**Test: Form validation**
- [ ] Open add modal
- [ ] Try to submit empty form
- [ ] Verify validation errors appear
- [ ] Fill required fields and submit
- [ ] Verify transaction created

**Test: Cancel modal**
- [ ] Open add modal
- [ ] Fill in some fields
- [ ] Click "Cancel" or X button
- [ ] Verify modal closes without creating transaction

---

### 2.2 Edit Transaction

**Test: Edit from detail panel**
- [ ] Open any transaction detail panel
- [ ] Modify merchant name
- [ ] Modify amount
- [ ] Modify category
- [ ] Save changes
- [ ] Verify updates appear in list immediately

**Test: Edit date**
- [ ] Edit a transaction's date
- [ ] Verify transaction moves to correct date group
- [ ] Verify date group totals update

---

### 2.3 Delete Single Transaction

**Test: Delete from detail panel**
- [ ] Open transaction detail panel
- [ ] Look for delete button (if available in detail panel)
- [ ] OR use bulk delete with single selection
- [ ] Verify confirmation dialog
- [ ] Confirm deletion
- [ ] Verify transaction removed

---

### 2.4 Tags System

**Test: Add tags to transaction**
- [ ] Open transaction detail panel
- [ ] Look for tags section
- [ ] Add a tag (e.g., "business", "personal", "tax-deductible")
- [ ] Verify tag appears with colored badge
- [ ] Add multiple tags
- [ ] Verify all tags display

**Test: Remove tags**
- [ ] Click X on a tag badge
- [ ] Verify tag removed

**Test: Filter by tags** *(if implemented)*
- [ ] Use filters to select specific tags
- [ ] Verify only tagged transactions show

---

### 2.5 Notes System

**Test: Add note to transaction**
- [ ] Open transaction detail panel
- [ ] Look for notes/memo field
- [ ] Enter a note: "Business lunch with client"
- [ ] Save/close panel
- [ ] Reopen transaction
- [ ] Verify note persists

**Test: Edit note**
- [ ] Edit existing note
- [ ] Verify changes save

---

### 2.6 Delete Confirmation Dialog

**Test: Confirmation UI**
- [ ] Select multiple transactions
- [ ] Click bulk delete
- [ ] Verify confirmation dialog shows:
  - Title: "Delete Transactions"
  - Count of transactions to delete
  - Warning message
  - "Delete" button (red/danger style)
  - "Cancel" button
  - Details section showing what will be deleted

**Test: Confirm deletion**
- [ ] Click "Delete" in confirmation
- [ ] Verify transactions deleted
- [ ] Verify dialog closes

**Test: Cancel deletion**
- [ ] Open delete confirmation
- [ ] Click "Cancel"
- [ ] Verify no transactions deleted
- [ ] Verify selection remains

**Test: Close dialog**
- [ ] Open delete confirmation
- [ ] Press ESC or click outside
- [ ] Verify dialog closes without deleting

---

### 2.7 Undo/Redo Stack

**Test: Undo delete**
- [ ] Delete a transaction
- [ ] Click "Undo" button in toolbar
- [ ] Verify transaction restored to list
- [ ] Verify button shows tooltip with action description

**Test: Undo add**
- [ ] Add a new transaction
- [ ] Click "Undo"
- [ ] Verify transaction removed

**Test: Undo edit**
- [ ] Edit a transaction
- [ ] Click "Undo"
- [ ] Verify transaction reverts to previous state

**Test: Redo**
- [ ] Perform undo action
- [ ] Click "Redo" button
- [ ] Verify action re-applied

**Test: Keyboard shortcuts**
- [ ] Delete a transaction
- [ ] Press `Cmd+Z` (Mac) or `Ctrl+Z` (Windows)
- [ ] Verify undo works
- [ ] Press `Cmd+Shift+Z` or `Ctrl+Y`
- [ ] Verify redo works

**Test: Undo/Redo button states**
- [ ] With no history, verify "Undo" button is disabled
- [ ] With no redo stack, verify "Redo" button is disabled
- [ ] After undo, verify "Redo" enabled
- [ ] After new action, verify redo stack clears

**Test: Undo tooltip**
- [ ] Hover over enabled "Undo" button
- [ ] Verify tooltip shows last action (e.g., "Undo: Deleted transaction")

---

## Phase 3: Advanced Features

### 3.1-3.2 Split Transactions

**Test: Open split modal**
- [ ] Open transaction detail panel
- [ ] Click "Split" button
- [ ] Verify SplitTransactionModal opens
- [ ] Verify original transaction amount shown at top

**Test: Equal split**
- [ ] Click "Equal Split" button
- [ ] Enter number of splits: 3
- [ ] Verify amount divided equally across 3 rows
- [ ] Verify remaining amount shows $0.00

**Test: Manual split**
- [ ] Manually enter amounts in split rows
- [ ] Verify remaining amount updates in real-time
- [ ] Try to save with remaining ≠ 0
- [ ] Verify validation error appears

**Test: Add/remove split rows**
- [ ] Click "Add Split" button
- [ ] Verify new row added
- [ ] Click remove (X) button on a row
- [ ] Verify row removed and amounts recalculate

**Test: Category assignment per split**
- [ ] Assign different categories to each split
- [ ] Verify dropdown shows all categories
- [ ] Save split
- [ ] Verify split transactions created with correct categories

**Test: Split notes**
- [ ] Add notes to individual splits
- [ ] Save split
- [ ] Open split transactions in detail panel
- [ ] Verify notes appear

---

### 3.3-3.4 Recurring Detection

**Test: Automatic detection**
- [ ] Look for transactions with RecurringBadge
- [ ] Verify badge shows frequency (e.g., "Monthly", "Weekly")
- [ ] Verify badge shows confidence score (e.g., "95%")

**Test: Recurring patterns**
- [ ] Create multiple transactions with same merchant on regular intervals:
  - Same merchant
  - Similar amounts
  - Monthly pattern (e.g., 1st of each month)
- [ ] Verify recurring detection algorithm identifies pattern
- [ ] Verify badge appears

**Test: Next expected date**
- [ ] Open detail panel for recurring transaction
- [ ] Verify "Next expected" date shows
- [ ] Verify date calculation is correct based on frequency

**Test: Mark as recurring**
- [ ] Open transaction detail panel
- [ ] Click "Recurring" button
- [ ] Verify transaction marked as recurring
- [ ] Verify badge appears

---

### 3.5 Goal Assignment

**Test: Open goal selector**
- [ ] Open transaction detail panel
- [ ] Look for "Assign to Goal" section
- [ ] Click to open GoalSelector modal

**Test: View goals list**
- [ ] Verify modal shows available goals
- [ ] Verify each goal shows:
  - Goal name
  - Category
  - Progress bar
  - Current amount / target amount
  - Deadline date

**Test: Assign transaction to goal**
- [ ] Select a goal from list
- [ ] Verify "Impact Preview" section shows how transaction affects goal
- [ ] Click "Assign"
- [ ] Verify transaction linked to goal
- [ ] Verify goal progress updates

**Test: Unassign from goal**
- [ ] Open transaction assigned to goal
- [ ] Click "Unassign" or remove goal
- [ ] Verify goal removed
- [ ] Verify goal progress decreases

**Test: Empty state**
- [ ] If no goals exist, verify empty state message shows
- [ ] Verify message suggests creating goals

---

### 3.6 Category Icon Picker

**Test: Open icon picker**
- [ ] Open transaction detail panel or edit modal
- [ ] Click category field or icon picker button
- [ ] Verify CategoryIconPicker modal opens

**Test: Browse icons**
- [ ] Verify 22+ icons display in grid
- [ ] Verify icons cover major categories:
  - Shopping (shopping bag)
  - Dining (utensils)
  - Auto (car)
  - Travel (plane)
  - Health (heart)
  - Entertainment (film)
  - Utilities (zap)
  - etc.

**Test: Search icons**
- [ ] Type in search box: "shop"
- [ ] Verify only shopping-related icons show
- [ ] Clear search
- [ ] Verify all icons reappear

**Test: Select icon**
- [ ] Click on an icon
- [ ] Verify icon selected (highlighted)
- [ ] Save selection
- [ ] Verify icon appears next to category in transaction

**Test: Icon fallback**
- [ ] Test with undefined category
- [ ] Verify generic fallback icon appears

---

### 3.7 Account Visual Selector

**Test: Open account selector**
- [ ] Open transaction detail panel or add modal
- [ ] Click account field
- [ ] Verify AccountSelector modal opens

**Test: View accounts list**
- [ ] Verify accounts grouped by institution
- [ ] Verify each account shows:
  - Institution logo/color
  - Account name
  - Account type badge (Credit, Checking, Investment)
  - Last 4 digits
  - Current balance (if toggle on)

**Test: Institution branding**
- [ ] Verify major banks have branded colors:
  - Chase (blue)
  - Bank of America (red)
  - Wells Fargo (yellow/gold)
  - Citi (blue)
  - etc.
- [ ] Verify institution initials in colored circle

**Test: Toggle balance display**
- [ ] Click "Show Balances" toggle
- [ ] Verify balances appear/disappear
- [ ] Verify setting persists

**Test: Select account**
- [ ] Click on an account
- [ ] Verify selection highlighted
- [ ] Save selection
- [ ] Verify account updates in transaction

---

### 3.8 Merchant Logos

**Test: Logo display in list**
- [ ] Scan transaction list
- [ ] Verify merchant icons appear to left of merchant name
- [ ] Check for branded merchants:
  - Amazon (orange)
  - Starbucks (green)
  - Apple (gray/black)
  - Target (red)
  - Walmart (blue)
  - McDonald's (yellow/red)
  - Uber (black)
  - etc.

**Test: Fallback to initials**
- [ ] Find merchant without logo (e.g., "Local Coffee Shop")
- [ ] Verify colored circle with initials appears (e.g., "LC")
- [ ] Verify consistent color for same merchant

**Test: Logo in detail panel**
- [ ] Open transaction detail panel
- [ ] Verify larger merchant logo/icon appears
- [ ] Verify consistent with list view

**Test: Color consistency**
- [ ] Find multiple transactions from same merchant
- [ ] Verify all use same color/logo
- [ ] Verify color based on merchant name hash

---

## Phase 4: Polish & Export

### 4.1 Loading States

**Test: Transaction list loading**
- [ ] Reload page or navigate to transactions
- [ ] Verify TransactionSkeleton placeholders appear
- [ ] Verify pulse animation on skeletons
- [ ] Verify smooth transition when data loads

**Test: Detail panel loading**
- [ ] Click on transaction quickly during page load
- [ ] Verify TransactionDetailSkeleton appears
- [ ] Verify smooth transition when data loads

**Test: Modal loading**
- [ ] Open add/edit modal during heavy operation
- [ ] Verify ModalSkeleton appears if applicable
- [ ] Verify pulse animation

---

### 4.2 Error Handling

**Test: Error boundary**
- [ ] Force an error in a child component (developer test)
- [ ] Verify ErrorBoundary catches error
- [ ] Verify friendly error message shows
- [ ] Verify "Reset" button appears
- [ ] Click reset
- [ ] Verify app attempts recovery

**Test: Technical details**
- [ ] In error state, click "Show Details"
- [ ] Verify stack trace or error info appears
- [ ] Verify collapsible for better UX

**Test: Error logging** *(if configured)*
- [ ] Trigger error
- [ ] Check console for logged error details
- [ ] Verify error includes component stack

---

### 4.3 Toast Notifications

**Test: Success toast**
- [ ] Add a new transaction
- [ ] Verify green success toast appears
- [ ] Verify message: "Transaction added successfully"
- [ ] Verify auto-dismiss after ~3 seconds
- [ ] Verify close button works

**Test: Error toast**
- [ ] Trigger validation error (e.g., submit empty form)
- [ ] Verify red error toast appears
- [ ] Verify appropriate error message
- [ ] Verify auto-dismiss or manual close

**Test: Warning toast**
- [ ] Trigger warning scenario (if applicable)
- [ ] Verify yellow/orange warning toast

**Test: Info toast**
- [ ] Look for informational messages
- [ ] Verify blue info toast

**Test: Toast with undo**
- [ ] Delete a transaction
- [ ] Verify toast includes "Undo" button
- [ ] Click "Undo" in toast
- [ ] Verify transaction restored
- [ ] Verify toast closes

**Test: Multiple toasts**
- [ ] Quickly perform multiple actions
- [ ] Verify toasts stack vertically
- [ ] Verify each toast dismisses independently
- [ ] Verify animations smooth

**Test: Toast positioning**
- [ ] Trigger toast
- [ ] Verify appears in top-right or bottom-right
- [ ] Verify doesn't cover important UI
- [ ] Verify slide-in animation

---

### 4.4 Advanced Export Modal

**Test: Open export modal**
- [ ] Click "Export" button in toolbar
- [ ] Verify AdvancedExportModal opens
- [ ] Verify format options visible

**Test: CSV export**
- [ ] Select CSV format
- [ ] Select columns to export (or select all)
- [ ] Click "Export"
- [ ] Verify CSV file downloads
- [ ] Open CSV in spreadsheet app
- [ ] Verify data correct and columns match selection

**Test: JSON export**
- [ ] Select JSON format
- [ ] Click "Export"
- [ ] Verify JSON file downloads
- [ ] Open in text editor
- [ ] Verify valid JSON structure
- [ ] Verify all transaction data included

**Test: Excel export** *(if library integrated)*
- [ ] Select Excel format
- [ ] Click "Export"
- [ ] Verify .xlsx file downloads
- [ ] Open in Excel/Numbers
- [ ] Verify formatting and data

**Test: PDF export** *(if library integrated)*
- [ ] Select PDF format
- [ ] Click "Export"
- [ ] Verify PDF downloads
- [ ] Verify readable formatting

**Test: Column selection**
- [ ] In export modal, click "Deselect All"
- [ ] Verify all checkboxes unchecked
- [ ] Click "Select All"
- [ ] Verify all checked
- [ ] Select specific columns (Date, Merchant, Amount)
- [ ] Export and verify only those columns in file

**Test: Date range filter**
- [ ] Set date range: Last 30 days
- [ ] Export
- [ ] Verify only transactions in range exported
- [ ] Try custom date range
- [ ] Verify works correctly

**Test: Apply current filters**
- [ ] Apply filters to transaction list (category, account)
- [ ] Open export modal
- [ ] Enable "Apply current filters" toggle
- [ ] Export
- [ ] Verify exported data matches filtered view

**Test: Progress indicator**
- [ ] Start export of large dataset (if available)
- [ ] Verify progress bar or spinner appears
- [ ] Verify completion notification

---

### 4.5 Keyboard Shortcuts

**Test: Navigation with arrow keys**
- [ ] Press `↓` key
- [ ] Verify next transaction highlights/selects
- [ ] Press `↑` key
- [ ] Verify previous transaction selects
- [ ] Continue navigating through list

**Test: Open detail with Enter**
- [ ] Use arrow keys to highlight transaction
- [ ] Press `Enter`
- [ ] Verify detail panel opens

**Test: Close panel with Escape**
- [ ] Open detail panel
- [ ] Press `Esc`
- [ ] Verify panel closes
- [ ] Open modal
- [ ] Press `Esc`
- [ ] Verify modal closes

**Test: Select all (Cmd/Ctrl+A)**
- [ ] Press `Cmd+A` (Mac) or `Ctrl+A` (Windows)
- [ ] Verify all visible transactions select
- [ ] Note: Should not trigger if typing in input field

**Test: Undo/Redo keyboard shortcuts**
- [ ] Delete transaction
- [ ] Press `Cmd+Z` / `Ctrl+Z`
- [ ] Verify undo works
- [ ] Press `Cmd+Shift+Z` or `Ctrl+Y`
- [ ] Verify redo works

**Test: New transaction (Cmd/Ctrl+N)**
- [ ] Press `Cmd+N` / `Ctrl+N`
- [ ] Verify add transaction modal opens

**Test: Delete selected (Cmd/Ctrl+Backspace)**
- [ ] Select transactions
- [ ] Press `Cmd+Backspace` / `Ctrl+Backspace`
- [ ] Verify delete confirmation appears

**Test: Export (Cmd/Ctrl+E)**
- [ ] Press `Cmd+E` / `Ctrl+E`
- [ ] Verify export modal opens

**Test: Search focus (Cmd/Ctrl+K)**
- [ ] Press `Cmd+K` / `Ctrl+K`
- [ ] Verify cursor moves to search input
- [ ] Verify can start typing immediately

**Test: Input field detection**
- [ ] Click into search input
- [ ] Press `Cmd+A` / `Ctrl+A`
- [ ] Verify selects text in input, NOT all transactions
- [ ] Repeat for other text inputs
- [ ] Verify shortcuts don't fire when typing

**Test: Platform awareness**
- [ ] On Mac: verify tooltips show "Cmd"
- [ ] On Windows: verify tooltips show "Ctrl"
- [ ] Verify both sets of shortcuts work appropriately

---

### 4.6 Transaction Rules Engine

**Test: Open rule builder**
- [ ] Look for "Rules" or "Automation" button
- [ ] Click to open RuleBuilder modal/page
- [ ] Verify UI loads

**Test: Create simple rule**
- [ ] Click "New Rule"
- [ ] Name: "Auto-categorize Starbucks"
- [ ] Add condition: Merchant contains "Starbucks"
- [ ] Add action: Set category to "Restaurants"
- [ ] Save rule
- [ ] Verify rule appears in list

**Test: Multiple conditions (AND logic)**
- [ ] Create rule with 2+ conditions:
  - Merchant contains "Amazon"
  - Amount > 100
- [ ] Set logic to AND
- [ ] Add action: Add tag "large-purchase"
- [ ] Save rule
- [ ] Verify only transactions matching ALL conditions affected

**Test: Multiple conditions (OR logic)**
- [ ] Create rule:
  - Merchant equals "Uber" OR
  - Merchant equals "Lyft"
- [ ] Set logic to OR
- [ ] Add action: Set category to "Transportation"
- [ ] Save rule

**Test: Rule actions**
- [ ] Test each action type:
  - Set category
  - Add tag
  - Set status
  - Assign to goal
  - Mark as recurring
- [ ] Verify each action applies correctly

**Test: Rule operators**
- [ ] Test condition operators:
  - equals
  - contains
  - greater than (>)
  - less than (<)
  - greater than or equal (≥)
  - less than or equal (≤)
- [ ] Verify each works as expected

**Test: Apply rule to existing transactions**
- [ ] Create rule
- [ ] Click "Apply to Existing" button
- [ ] Verify matching transactions updated
- [ ] Check toast notification confirms count

**Test: Rule validation**
- [ ] Try to save rule without name
- [ ] Verify validation error
- [ ] Try to save rule without conditions
- [ ] Verify validation error
- [ ] Try to save rule without actions
- [ ] Verify validation error

**Test: Human-readable formatting**
- [ ] View saved rule
- [ ] Verify conditions format clearly (e.g., "When merchant contains 'Starbucks'")
- [ ] Verify actions format clearly (e.g., "Set category to Restaurants")

---

### 4.7 Performance Optimizations

**Test: Debounced search**
- [ ] Type quickly in search input: "amazon"
- [ ] Verify search doesn't fire on every keystroke
- [ ] Verify search triggers after ~300ms pause
- [ ] Verify no lag during typing

**Test: Large dataset handling**
- [ ] If possible, load many transactions (100+)
- [ ] Verify list scrolls smoothly
- [ ] Verify filters respond quickly
- [ ] Monitor for lag or jank

**Test: Throttled operations**
- [ ] Rapidly click filter checkboxes
- [ ] Verify updates throttle to prevent excessive re-renders
- [ ] Verify final state correct

**Test: Memoization**
- [ ] Apply filters multiple times
- [ ] Verify no unnecessary recalculations (check with React DevTools Profiler)

**Test: Virtual scrolling** *(if implemented)*
- [ ] Scroll through very long list
- [ ] Verify only visible transactions render
- [ ] Verify smooth scrolling performance

---

## Integration Tests

### Test: Complete workflow #1 - Expense tracking
1. [ ] Add new expense transaction
2. [ ] Assign to category with icon
3. [ ] Add tags: "business", "tax-deductible"
4. [ ] Add note: "Client meeting"
5. [ ] Assign to savings goal
6. [ ] Export to CSV
7. [ ] Verify all data in export

### Test: Complete workflow #2 - Bulk operations
1. [ ] Filter transactions by category "Shopping"
2. [ ] Select all Shopping transactions
3. [ ] Bulk delete
4. [ ] Undo deletion
5. [ ] Verify all restored correctly
6. [ ] Clear filters
7. [ ] Verify all transactions visible

### Test: Complete workflow #3 - Split & recurring
1. [ ] Find monthly subscription transaction (e.g., Netflix)
2. [ ] Mark as recurring
3. [ ] Verify badge appears
4. [ ] Find shared expense transaction
5. [ ] Split into 3 equal parts
6. [ ] Assign different categories to each split
7. [ ] Verify 3 new transactions created

### Test: Complete workflow #4 - Advanced filtering & export
1. [ ] Apply filters:
   - Categories: Shopping, Restaurants
   - Amount range: $50-$500
   - Account: Credit Card
2. [ ] Verify filter chips show
3. [ ] Sort by Amount (High-Low)
4. [ ] Open export modal
5. [ ] Select only Date, Merchant, Amount columns
6. [ ] Enable "Apply current filters"
7. [ ] Export as CSV
8. [ ] Verify filtered/sorted data in file

---

## Edge Cases & Error Scenarios

### Test: Empty states
- [ ] Clear all transactions (if possible)
- [ ] Verify "No transactions found" message
- [ ] Apply filters with no results
- [ ] Verify appropriate empty state

### Test: Invalid inputs
- [ ] Try to add transaction with amount: 0
- [ ] Try to add transaction with future date beyond limit
- [ ] Try to split transaction with invalid amounts
- [ ] Verify validation prevents submission

### Test: Concurrent operations
- [ ] Quickly add, edit, delete multiple transactions
- [ ] Verify state consistency
- [ ] Verify undo stack tracks correctly

### Test: Browser compatibility**
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Verify all features work across browsers

### Test: Responsive design** *(if implemented)*
- [ ] Resize browser window to mobile width
- [ ] Verify UI adapts gracefully
- [ ] Test touch interactions if on mobile device

### Test: Accessibility**
- [ ] Navigate with keyboard only (Tab, Enter, Esc)
- [ ] Verify all interactive elements accessible
- [ ] Use screen reader (VoiceOver, NVDA)
- [ ] Verify meaningful labels and announcements

---

## Performance Benchmarks

### Metrics to monitor:
- [ ] **Initial page load**: < 2 seconds
- [ ] **Search response time**: < 300ms
- [ ] **Filter application**: < 200ms
- [ ] **Sort operation**: < 300ms
- [ ] **Export generation**: Depends on size, should show progress
- [ ] **Scroll FPS**: 60fps consistently

### Tools:
- Chrome DevTools Performance tab
- React DevTools Profiler
- Lighthouse audit
- Network tab for data fetching

---

## Regression Testing

After any code changes, re-test:
1. [ ] Multi-select and bulk delete
2. [ ] Undo/redo with keyboard shortcuts
3. [ ] Export with filters applied
4. [ ] Recurring detection
5. [ ] Toast notifications
6. [ ] Modal interactions (add, edit, split)

---

## Reporting Issues

When filing bugs, include:
1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Screenshots/video** if applicable
5. **Browser and OS version**
6. **Console errors** (open DevTools → Console)

---

## Summary Checklist

Quick checklist to verify all major features are working:

### Phase 1 ✓
- [ ] Multi-select with checkboxes
- [ ] Bulk action toolbar
- [ ] Filter chips display
- [ ] Relative date labels
- [ ] Status badges
- [ ] Enhanced detail panel

### Phase 2 ✓
- [ ] Add transaction modal
- [ ] Edit transactions
- [ ] Delete confirmation
- [ ] Tags system
- [ ] Notes system
- [ ] Undo/redo with keyboard shortcuts

### Phase 3 ✓
- [ ] Split transactions
- [ ] Recurring detection
- [ ] Goal assignment
- [ ] Category icon picker
- [ ] Account visual selector
- [ ] Merchant logos

### Phase 4 ✓
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Advanced export modal
- [ ] Keyboard shortcuts
- [ ] Transaction rules engine
- [ ] Performance optimizations

---

**Happy Testing!** 🚀

For questions or issues, refer to the main README or create an issue in the repository.
