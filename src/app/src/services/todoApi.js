/**
 * API service for TODO operations.
 *
 * Centralises all HTTP communication with the Django backend.
 * Every function returns a Promise and throws on non-2xx responses
 * so callers can handle errors uniformly.
 */

const API_BASE_URL = 'http://localhost:8000';

/**
 * Fetch all TODO items from the backend.
 * @returns {Promise<Array<{id: string, description: string}>>}
 */
export const fetchTodos = async () => {
    const response = await fetch(`${API_BASE_URL}/todos/`);

    if (!response.ok) {
        throw new Error(`Failed to fetch todos (${response.status})`);
    }

    return response.json();
};

/**
 * Create a new TODO item.
 * @param {string} description - The TODO description text.
 * @returns {Promise<{id: string, description: string}>} The created TODO.
 */
export const createTodo = async (description) => {
    const response = await fetch(`${API_BASE_URL}/todos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `Failed to create todo (${response.status})`);
    }

    return response.json();
};
