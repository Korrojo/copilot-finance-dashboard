# Known Defects - Transactions Page

## Critical Issues (Not Fixed)

### Detail Panel
- [ ] Category dropdown in detail panel doesn't update main list
- [ ] Status dropdown in detail panel doesn't sync
- [ ] Account dropdown changes don't reflect
- [ ] Split transaction button submits but nothing happens in UI
- [ ] After split attempt, cannot open detail panel until refresh
- [ ] Recurring button not functioning properly

### Bulk Actions
- [ ] Categorize modal opens but changes may not apply correctly
- [ ] Mark reviewed may not work consistently

### General
- [ ] State synchronization issues between detail panel and main list
- [ ] React state updates not propagating correctly
- [ ] Possible issues with useUndoStack integration

## Status
**Deferred** - Moving to next view as requested.

## Notes
These issues require deeper investigation into:
- React state management flow
- useUndoStack hook behavior
- Component re-render cycles
- Event propagation

Will revisit after completing other views.
