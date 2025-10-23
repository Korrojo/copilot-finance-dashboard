import { useEffect, useCallback } from 'react';

export interface KeyboardShortcutHandlers {
  onNavigateUp?: () => void;
  onNavigateDown?: () => void;
  onOpenDetail?: () => void;
  onClose?: () => void;
  onSelectAll?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onNewTransaction?: () => void;
  onDeleteSelected?: () => void;
  onExport?: () => void;
  onSearch?: () => void;
}

/**
 * Custom hook for managing keyboard shortcuts in the transactions page
 */
export function useTransactionKeyboard(
  handlers: KeyboardShortcutHandlers,
  enabled: boolean = true
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape to work even in inputs
        if (e.key !== 'Escape') return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Arrow Up - Navigate up in list
      if (e.key === 'ArrowUp' && !modifier && !e.shiftKey) {
        e.preventDefault();
        handlers.onNavigateUp?.();
      }

      // Arrow Down - Navigate down in list
      else if (e.key === 'ArrowDown' && !modifier && !e.shiftKey) {
        e.preventDefault();
        handlers.onNavigateDown?.();
      }

      // Enter - Open detail panel
      else if (e.key === 'Enter' && !modifier) {
        e.preventDefault();
        handlers.onOpenDetail?.();
      }

      // Escape - Close panels/modals
      else if (e.key === 'Escape') {
        e.preventDefault();
        handlers.onClose?.();
      }

      // Cmd/Ctrl + A - Select all
      else if (e.key === 'a' && modifier && !e.shiftKey) {
        e.preventDefault();
        handlers.onSelectAll?.();
      }

      // Cmd/Ctrl + Z - Undo
      else if (e.key === 'z' && modifier && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo?.();
      }

      // Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y - Redo
      else if ((e.key === 'z' && modifier && e.shiftKey) || (e.key === 'y' && modifier)) {
        e.preventDefault();
        handlers.onRedo?.();
      }

      // Cmd/Ctrl + N - New transaction
      else if (e.key === 'n' && modifier) {
        e.preventDefault();
        handlers.onNewTransaction?.();
      }

      // Cmd/Ctrl + Backspace or Delete - Delete selected
      else if ((e.key === 'Backspace' || e.key === 'Delete') && modifier) {
        e.preventDefault();
        handlers.onDeleteSelected?.();
      }

      // Cmd/Ctrl + E - Export
      else if (e.key === 'e' && modifier) {
        e.preventDefault();
        handlers.onExport?.();
      }

      // Cmd/Ctrl + K or Cmd/Ctrl + F - Search/Filter
      else if ((e.key === 'k' || e.key === 'f') && modifier) {
        e.preventDefault();
        handlers.onSearch?.();
      }
    },
    [enabled, handlers]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);
}

/**
 * Get keyboard shortcut display string for current platform
 */
export function getShortcutKey(key: string): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifier = isMac ? '⌘' : 'Ctrl';

  const shortcuts: Record<string, string> = {
    undo: `${modifier}+Z`,
    redo: isMac ? `${modifier}+Shift+Z` : `${modifier}+Y`,
    newTransaction: `${modifier}+N`,
    selectAll: `${modifier}+A`,
    delete: `${modifier}+Backspace`,
    export: `${modifier}+E`,
    search: `${modifier}+K`,
    close: 'Esc',
    navigateUp: '↑',
    navigateDown: '↓',
    openDetail: 'Enter',
  };

  return shortcuts[key] || key;
}

/**
 * Hook to display keyboard shortcuts help
 */
export function useKeyboardShortcutsHelp() {
  const shortcuts = [
    { key: 'navigateUp', label: 'Navigate up' },
    { key: 'navigateDown', label: 'Navigate down' },
    { key: 'openDetail', label: 'Open transaction details' },
    { key: 'close', label: 'Close panel/modal' },
    { key: 'selectAll', label: 'Select all transactions' },
    { key: 'undo', label: 'Undo last action' },
    { key: 'redo', label: 'Redo action' },
    { key: 'newTransaction', label: 'New transaction' },
    { key: 'delete', label: 'Delete selected' },
    { key: 'export', label: 'Export transactions' },
    { key: 'search', label: 'Focus search' },
  ];

  return shortcuts.map(({ key, label }) => ({
    key: getShortcutKey(key),
    label,
  }));
}
