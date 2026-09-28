import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type MeetingLayoutMode = 'grid' | 'speaker' | 'presentation' | 'sidebar';

export interface MeetingUiState {
  layoutMode: MeetingLayoutMode;
  chatDrawerOpen: boolean;
  participantsDrawerOpen: boolean;
  whiteboardOpen: boolean;
  codeEditorOpen: boolean;
  settingsModalOpen: boolean;
  activeFocusedParticipantId: string | null;
}

const initialState: MeetingUiState = {
  layoutMode: 'grid',
  chatDrawerOpen: false,
  participantsDrawerOpen: false,
  whiteboardOpen: false,
  codeEditorOpen: false,
  settingsModalOpen: false,
  activeFocusedParticipantId: null,
};

export const meetingUiSlice = createSlice({
  name: 'meetingUi',
  initialState,
  reducers: {
    setLayoutMode: (state, action: PayloadAction<MeetingLayoutMode>) => {
      state.layoutMode = action.payload;
    },
    toggleChatDrawer: (state) => {
      state.chatDrawerOpen = !state.chatDrawerOpen;
      if (state.chatDrawerOpen) state.participantsDrawerOpen = false;
    },
    toggleParticipantsDrawer: (state) => {
      state.participantsDrawerOpen = !state.participantsDrawerOpen;
      if (state.participantsDrawerOpen) state.chatDrawerOpen = false;
    },
    toggleWhiteboard: (state) => {
      state.whiteboardOpen = !state.whiteboardOpen;
    },
    toggleCodeEditor: (state) => {
      state.codeEditorOpen = !state.codeEditorOpen;
    },
    setSettingsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.settingsModalOpen = action.payload;
    },
    setFocusedParticipant: (state, action: PayloadAction<string | null>) => {
      state.activeFocusedParticipantId = action.payload;
    },
    resetMeetingUiState: () => initialState,
  },
});

export const {
  setLayoutMode,
  toggleChatDrawer,
  toggleParticipantsDrawer,
  toggleWhiteboard,
  toggleCodeEditor,
  setSettingsModalOpen,
  setFocusedParticipant,
  resetMeetingUiState,
} = meetingUiSlice.actions;

export default meetingUiSlice.reducer;
