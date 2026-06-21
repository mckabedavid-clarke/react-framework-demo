import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5050/api/todos'

function TodoList() {
  const [todos, setTodos] = useState([])
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error('Failed to load todos:', err))
  }, [])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    })
    const newTodo = await res.json()
    setTodos([newTodo, ...todos])
    setNewTitle('')
  }

  const toggleTodo = async (id, completed) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    })
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
    )
  }

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    setTodos(todos.filter((t) => t.id !== id))
  }

  return (
    <section id="todo-list">
      <h2>Todo List</h2>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo.id, todo.completed)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TodoList
