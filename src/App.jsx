import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/todos/')
      .then(({ data }) => {
        setTodos(data);
      })
      .catch(error => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  const handleChangeTodo = (event) => {
    setNewTodo(event.target.value);
  };

  const createTodo = (event) => {
    event.preventDefault();

    axios.post('http://localhost:8000/api/todos/', {
      title: newTodo,
      done: false // Al crear, 'done' debe ser false
    })
      .then(({ data }) => {
        setTodos(_todos => [data, ..._todos]);
        setNewTodo('');
      })
      .catch(error => {
        console.error("Error creating todo:", error);
      });
  };

  const deleteTodo = (todo) => {
    axios.delete(`http://localhost:8000/api/todo/${todo.id}/`)
      .then(() => {
        setTodos(_todos => _todos.filter(t => t.id !== todo.id));
      })
      .catch(error => {
        console.error("Error deleting todo:", error);
      });
  };

  const toggleComplete = (todo) => {
    axios.patch(`http://localhost:8000/api/todo/${todo.id}/`, {
      done: !todo.done // Cambia el estado de 'done'
    })
      .then(({ data }) => {
        setTodos(_todos => _todos.map(t => (t.id === todo.id ? data : t)));
      })
      .catch(error => {
        console.error("Error updating todo:", error);
      });
  };

  return (
    <div className="my-5 text-center">
      <div className="card mx-auto" style={{ maxWidth: '520px' }}>
        <div className="card-body">
          <h1>TO DO List</h1>
          <div className="text-start">
            <form className="mt-5 mb-3" onSubmit={createTodo}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Ingresa una nueva tarea"
                  className="form-control"
                  onChange={handleChangeTodo}
                  value={newTodo}
                />
                <button className="btn btn-primary">+</button>
              </div>
            </form>
            {todos.map(todo => (
              <div key={todo.id} className="d-flex gap-2 justify-content-between align-items-center">
                <input
                  type="checkbox"
                  checked={todo.done} // Usa 'done' aquí
                  onChange={() => toggleComplete(todo)}
                />
                <div style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                  {todo.title}
                </div>
                <a href="#" className="small" onClick={() => deleteTodo(todo)}>
                  Eliminar
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
