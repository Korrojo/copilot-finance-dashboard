import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if no input is focused and Cmd/Ctrl is pressed
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const isCmdOrCtrl = event.metaKey || event.ctrlKey;

      // Navigation shortcuts (Cmd/Ctrl + number)
      if (isCmdOrCtrl) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            navigate('/');
            break;
          case '2':
            event.preventDefault();
            navigate('/transactions');
            break;
          case '3':
            event.preventDefault();
            navigate('/cash-flow');
            break;
          case '4':
            event.preventDefault();
            navigate('/categories');
            break;
          case '5':
            event.preventDefault();
            navigate('/budgets');
            break;
          case '6':
            event.preventDefault();
            navigate('/recurrings');
            break;
          case '7':
            event.preventDefault();
            navigate('/accounts');
            break;
          case '8':
            event.preventDefault();
            navigate('/investments');
            break;
          case 'k':
            // Future: Open command palette/search
            event.preventDefault();
            break;
        }
      }

      // Single key shortcuts (only when not in input)
      if (!isCmdOrCtrl && !event.shiftKey && !event.altKey) {
        switch (event.key) {
          case '?':
            // Future: Show keyboard shortcuts help
            event.preventDefault();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
}

export const KEYBOARD_SHORTCUTS = [
  { key: 'Cmd/Ctrl + 1', description: 'Go to Dashboard' },
  { key: 'Cmd/Ctrl + 2', description: 'Go to Transactions' },
  { key: 'Cmd/Ctrl + 3', description: 'Go to Cash Flow' },
  { key: 'Cmd/Ctrl + 4', description: 'Go to Categories' },
  { key: 'Cmd/Ctrl + 5', description: 'Go to Budgets' },
  { key: 'Cmd/Ctrl + 6', description: 'Go to Recurrings' },
  { key: 'Cmd/Ctrl + 7', description: 'Go to Accounts' },
  { key: 'Cmd/Ctrl + 8', description: 'Go to Investments' },
  { key: 'Cmd/Ctrl + K', description: 'Open search (coming soon)' },
  { key: '?', description: 'Show shortcuts (coming soon)' },
];
