import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useOnlineStatus } from "./useOnlineStatus";

describe("useOnlineStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return initial online status from navigator.onLine", () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(navigator.onLine);
  });

  it("should update status to true when online event fires", async () => {
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: false,
    });

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(false);

    const event = new Event("online");
    window.dispatchEvent(event);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("should update status to false when offline event fires", async () => {
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: true,
    });

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);

    const event = new Event("offline");
    window.dispatchEvent(event);

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("should clean up event listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useOnlineStatus());

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