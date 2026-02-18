import { describe, it, expect, vi, beforeEach } from "vitest";
import { useQuery } from "@tanstack/react-query";
import { useExpenses } from "./useExpenses";
import { fetchExpenses } from "../expenseOperations";

vi.mock("@tanstack/react-query");
vi.mock("../expenseOperations");

describe("useExpenses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with correct queryKey", () => {
    useExpenses();
    
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["expenses"],
      })
    );
  });

  it("should call useQuery with fetchExpenses as queryFn", () => {
    useExpenses();
    
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryFn: fetchExpenses,
      })
    );
  });

  it("should set staleTime to 5 minutes", () => {
    useExpenses();
    
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        staleTime: 1000 * 60 * 5,
      })
    );
  });

  it("should set retry to 3", () => {
    useExpenses();
    
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        retry: 3,
      })
    );
  });

  it("should calculate retryDelay exponentially with max 5 seconds", () => {
    useExpenses();
    
    const call = vi.mocked(useQuery).mock.calls[0][0];
    const retryDelay = call.retryDelay as (attemptIndex: number) => number;
    expect(retryDelay(0)).toBe(1000);
    expect(retryDelay(1)).toBe(2000);
    expect(retryDelay(2)).toBe(4000);
    expect(retryDelay(3)).toBe(5000);
    expect(retryDelay(4)).toBe(5000);
  });

  it("should return the result of useQuery", () => {
    const mockQueryResult = { data: [], isLoading: false };
    vi.mocked(useQuery).mockReturnValue(mockQueryResult as any);
    
    const result = useExpenses();
    
    expect(result).toEqual(mockQueryResult);
  });
});