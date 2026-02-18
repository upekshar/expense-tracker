import { createSlice } from "@reduxjs/toolkit";

interface SyncState {
  status: "idle" | "syncing" | "done";
}

const initialState: SyncState = {
  status: "idle",
};

const syncSlice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    setSyncing: (state) => {
      state.status = "syncing";
    },
    setSyncDone: (state) => {
      state.status = "done";
    },
    setSyncIdle: (state) => {
      state.status = "idle";
    },
  },
});

export const { setSyncing, setSyncDone, setSyncIdle } = syncSlice.actions;
export default syncSlice.reducer;
