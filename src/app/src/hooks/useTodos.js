/**
 * Custom hook that encapsulates all TODO state management and API interactions.
 *
 * Provides a clean interface for components to read todos and trigger
 * mutations without knowing anything about the underlying data source.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchTodos, createTodo } from '../services/todoApi';

const useTodos = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Load (or reload) all TODOs from the backend.
     */
    const loadTodos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchTodos();
            setTodos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Create a new TODO and then refresh the list so the UI
     * always reflects the latest server state.
     *
     * @param {string} description
     */
    const addTodo = useCallback(async (description) => {
        // Let errors propagate so the form component can show
        // submission-specific feedback to the user.
        await createTodo(description);
        await loadTodos();
    }, [loadTodos]);

    // Initial fetch on mount.
    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    return { todos, loading, error, addTodo, refreshTodos: loadTodos };
};

export default useTodos;
