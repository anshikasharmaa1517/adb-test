/**
 * TodoForm — Controlled form for creating new TODO items.
 *
 * Manages its own input state and submission lifecycle (submitting flag,
 * submission errors). Calls the onSubmit prop to delegate actual creation
 * to the parent / hook layer.
 */

import React, { useState, useCallback } from 'react';

const TodoForm = ({ onSubmit }) => {
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            const trimmed = description.trim();
            if (!trimmed) return;

            try {
                setSubmitting(true);
                setError(null);
                await onSubmit(trimmed);
                setDescription(''); // Clear input only on success.
            } catch (err) {
                setError(err.message);
            } finally {
                setSubmitting(false);
            }
        },
        [description, onSubmit],
    );

    return (
        <form onSubmit={handleSubmit} className="todo-form">
            {error && <p className="error-message">Error: {error}</p>}
            <div className="form-group">
                <label htmlFor="todo-input">ToDo: </label>
                <input
                    id="todo-input"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={submitting}
                    placeholder="What needs to be done?"
                />
            </div>
            <div className="form-actions">
                <button type="submit" disabled={submitting || !description.trim()}>
                    {submitting ? 'Adding…' : 'Add ToDo!'}
                </button>
            </div>
        </form>
    );
};

export default TodoForm;
