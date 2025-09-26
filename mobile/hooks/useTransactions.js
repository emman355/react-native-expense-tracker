// REACT CUSTOM HOOK FILE

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/constants";


export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [isLoading, setIsLoading] = useState(true);


    //useCallback is used for performance reasons, it will memoize the function
    const fetTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.log("Error fetching transactions:", error)
        }
    }, [userId])

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.log("Error fetching summary:", error)
        }
    }, [userId])

    const loadData = useCallback(async () => {
        if (!userId) return;

        try {
            // can be run in parallel
            await Promise.all([fetTransactions(), fetchSummary()])
        } catch (error) {
            console.log("Error loading data:", error)
        } finally {
            setIsLoading(false);
        }
    }, [fetTransactions, fetchSummary, userId]);

    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete transaction");

            // Refresh data after deletion;
            loadData();
            Alert.alert("Success", "Transaction deleted successfuylly");
        } catch (error) {
            console.log("Error deleting transactions:", error);
            Alert.alert("Error", error.message);
        }
    };

    return {
        transactions,
        summary,
        isLoading,
        loadData,
        deleteTransaction,
    }
};