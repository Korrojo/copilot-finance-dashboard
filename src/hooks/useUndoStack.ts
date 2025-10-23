import { useState, useCallback, useEffect } from 'react';

export interface UndoAction<T> {
  type: string;
  previousState: T;
  newState: T;
  description: string;
}

interface UseUndoStackOptions {
  maxStackSize?: number;
}

export function useUndoStack<T>(
  initialState: T,
  options: UseUndoStackOptions = {}
) {
  const { maxStackSize = 10 } = options;

  const [state, setState] = useState<T>(initialState);
  const [undoStack, setUndoStack] = useState<UndoAction<T>[]>([]);
  const [redoStack, setRedoStack] = useState<UndoAction<T>[]>([]);

  // Push a new action to the undo stack
  const pushAction = useCallback(
    (action: UndoAction<T>) => {
      setUndoStack((prev) => {
        const newStack = [...prev, action];
        // Keep only the last maxStackSize actions
        if (newStack.length > maxStackSize) {
          return newStack.slice(-maxStackSize);
        }
        return newStack;
      });
      // Clear redo stack when a new action is pushed
      setRedoStack([]);
      setState(action.newState);
    },
    [maxStackSize]
  );

  // Perform an action with undo support
  const performAction = useCallback(
    (type: string, newState: T, description: string) => {
      const action: UndoAction<T> = {
        type,
        previousState: state,
        newState,
        description,
      };
      pushAction(action);
    },
    [state, pushAction]
  );

  // Undo the last action
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, lastAction]);
    setState(lastAction.previousState);

    return lastAction;
  }, [undoStack]);

  // Redo the last undone action
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const lastRedoAction = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, lastRedoAction]);
    setState(lastRedoAction.newState);

    return lastRedoAction;
  }, [redoStack]);

  // Clear all stacks
  const clearStacks = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Cmd+Z or Ctrl+Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Cmd+Shift+Z or Ctrl+Shift+Z for redo
      else if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      // Cmd+Y or Ctrl+Y for redo (alternative)
      else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [undo, redo]);

  return {
    state,
    setState,
    performAction,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    undoStack,
    redoStack,
    clearStacks,
    lastAction: undoStack[undoStack.length - 1],
  };
}
