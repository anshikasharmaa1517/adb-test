/**
 * App — Root component that composes the TODO application.
 *
 * Uses the useTodos custom hook for all state management and
 * delegates rendering to TodoForm and TodoList components.
 */

import React from 'react';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import useTodos from './hooks/useTodos';

export function App() {
  const { todos, loading, error, addTodo } = useTodos();

  return (
    <div className="App">
      <header className="app-header">
        <h1>Adbrew TODO</h1>
      </header>

      <main className="app-content">
        <section className="section">
          <h2>Create a ToDo</h2>
          <TodoForm onSubmit={addTodo} />
        </section>

        <section className="section">
          <h2>List of TODOs</h2>
          <TodoList todos={todos} loading={loading} error={error} />
        </section>
      </main>
    </div>
  );
}

export default App;
