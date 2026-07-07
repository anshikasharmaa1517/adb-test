/**
 * TodoList — Renders the list of TODO items with loading and error states.
 *
 * This is a pure presentational component; it receives all data via props
 * and contains no side effects.
 */

import React from 'react';

const TodoList = ({ todos, loading, error }) => {
    if (loading) {
        return <p className="status-message">Loading todos…</p>;
    }

    if (error) {
        return <p className="error-message">Error: {error}</p>;
    }

    if (todos.length === 0) {
        return <p className="status-message">No todos yet. Add one above!</p>;
    }

    return (
        <ul className="todo-list">
            {todos.map((todo) => (
                <li key={todo.id} className="todo-item">
                    {todo.description}
                </li>
            ))}
        </ul>
    );
};

export default TodoList;
