import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useOfflineSync } from "./useOfflineSync";
import { useDispatch } from "react-redux";
import type { Dispatch, UnknownAction } from "redux";

vi.mock("react-redux");

describe("useOfflineSync", () => {
  let mockDispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockDispatch = vi.fn();
    vi.mocked(useDispatch).mockReturnValue(mockDispatch as Dispatch<UnknownAction>)
    
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial online status from navigator.onLine", () => {
    const { result } = renderHook(() => useOfflineSync());
    expect(result.current).toBe(true);
  });

  it("should dispatch sync action on mount when online", () => {
    renderHook(() => useOfflineSync());
    expect(mockDispatch).toHaveBeenCalledWith({ type: "sync/triggerSync" });
  });


  it("should cleanup event listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useOfflineSync());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "online",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "offline",
      expect.any(Function)
    );
  });
});