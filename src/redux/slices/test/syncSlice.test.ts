import syncReducer, { setSyncing, setSyncDone } from "../syncSlice";

describe("syncSlice state transitions", () => {
  it("should return the initial state", () => {
    const initialState = syncReducer(undefined, { type: "" });
    expect(initialState.status).toBe("idle");
  });

  it("should set status to syncing", () => {
    const startState = { status: "idle" } as const;  
    const nextState = syncReducer(startState, setSyncing());
    expect(nextState.status).toBe("syncing");
  });

  it("should set status to done", () => {
    const startState = { status: "syncing" } as const;  
    const nextState = syncReducer(startState, setSyncDone());
    expect(nextState.status).toBe("done");
  });
});
