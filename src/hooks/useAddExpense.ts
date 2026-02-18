import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {  queueAdd } from "../redux/slices/expenseSlice";
import { Expense } from "../types/Expense";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const BASE_URL = "https://699355fffade7a9ec0f274ea.mockapi.io/api/v1/expenses";

export const useAddExpense = () => {
  const dispatch = useAppDispatch();


const addExpense = async (expense: Expense) => {
  if (!navigator.onLine) {
    dispatch(queueAdd(expense));
    return;
  }

  await fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(expense),
    headers: { "Content-Type": "application/json" },
  });
};


 

  return { addExpense };
};
