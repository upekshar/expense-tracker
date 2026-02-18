import { describe, it, expect, beforeEach, vi } from "vitest";
import { useExpenseMutations } from "./useExpenseMutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

vi.mock("@tanstack/react-query");
vi.mock("../expenseOperations");

describe("useExpenseMutations", () => {
  let mockQueryClient: any;

  beforeEach(() => {
    mockQueryClient = {
      cancelQueries: vi.fn(),
      getQueryData: vi.fn(),
      setQueryData: vi.fn(),
      invalidateQueries: vi.fn(),
    };

    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
    vi.mock("@tanstack/react-query");
    vi.mock("../expenseOperations");

    vi.mocked(useMutation).mockImplementation(({ mutationFn }) => ({
      mutate: vi.fn(),
      mutateAsync: mutationFn || vi.fn(),
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
      status: "idle",
      reset: vi.fn(),
    } as any));
  });

  it("should return add, update, and remove mutations", () => {
    const mutations = useExpenseMutations();
    expect(mutations).toHaveProperty("add");
    expect(mutations).toHaveProperty("update");
    expect(mutations).toHaveProperty("remove");
  });

  it("should have all mutations callable", () => {
    const mutations = useExpenseMutations();
    expect(typeof mutations.add).toBe("object");
    expect(typeof mutations.update).toBe("object");
    expect(typeof mutations.remove).toBe("object");
  });
});