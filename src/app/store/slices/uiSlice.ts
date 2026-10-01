import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  sidebarOpen: boolean;
  activeThemeMode: 'dark' | 'light';
  commandPaletteOpen: boolean;
  activeModalId: string | null;
  toastNotification: { message: string; type: 'info' | 'success' | 'warning' | 'error' } | null;
}

const initialState: UiState = {
  sidebarOpen: true,
  activeThemeMode: 'dark',
  commandPaletteOpen: false,
  activeModalId: null,
  toastNotification: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.activeThemeMode = action.payload;
    },
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.commandPaletteOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModalId = action.payload;
    },
    closeModal: (state) => {
      state.activeModalId = null;
    },
    setToast: (state, action: PayloadAction<{ message: string; type: 'info' | 'success' | 'warning' | 'error' } | null>) => {
      state.toastNotification = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setThemeMode,
  setCommandPaletteOpen,
  openModal,
  closeModal,
  setToast,
} = uiSlice.actions;

export default uiSlice.reducer;
