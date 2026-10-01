import { describe, it, expect } from 'vitest';
import uiReducer, {
  toggleSidebar,
  setSidebarOpen,
  setThemeMode,
  setCommandPaletteOpen,
  openModal,
  closeModal,
  setToast,
  type UiState,
} from '../../src/app/store/slices/uiSlice';

describe('uiSlice Redux Store Unit Tests', () => {
  const initialState: UiState = {
    sidebarOpen: true,
    activeThemeMode: 'dark',
    commandPaletteOpen: false,
    activeModalId: null,
    toastNotification: null,
  };

  it('should return initial state when called with undefined', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle toggleSidebar and setSidebarOpen', () => {
    const toggled = uiReducer(initialState, toggleSidebar());
    expect(toggled.sidebarOpen).toBe(false);

    const explicit = uiReducer(toggled, setSidebarOpen(true));
    expect(explicit.sidebarOpen).toBe(true);
  });

  it('should handle setThemeMode', () => {
    const nextState = uiReducer(initialState, setThemeMode('light'));
    expect(nextState.activeThemeMode).toBe('light');
  });

  it('should handle openModal and closeModal', () => {
    const opened = uiReducer(initialState, openModal('auth-modal'));
    expect(opened.activeModalId).toBe('auth-modal');

    const closed = uiReducer(opened, closeModal());
    expect(closed.activeModalId).toBeNull();
  });

  it('should handle setToast notification', () => {
    const toast = { message: 'Meeting scheduled successfully', type: 'success' as const };
    const nextState = uiReducer(initialState, setToast(toast));
    expect(nextState.toastNotification).toEqual(toast);

    const cleared = uiReducer(nextState, setToast(null));
    expect(cleared.toastNotification).toBeNull();
  });
});
