import './App.css';
import axios from 'axios'
import React, { useState, useEffect } from 'react'

const hostBackend = process.env.REACT_APP_BACKEND

async function getTodos(setTodos) {
  let todos = []
  await axios.get(hostBackend + '/todos')
    .then(function (response) {
      for (let i = 0; i < response.data.length; i++) {
        todos[i] = response.data[i]
      }
    })
  let listItems = todos.map((todos) =>
    <li key={todos.toString()}>{todos}</li>
  )
  setTodos(listItems)
}

function App() {
  const [todos, setTodos] = useState([])
  useEffect(() => {
    getTodos(setTodos)
  }, [])
  return (
    <div>
      <img src={hostBackend + '/pic'} alt='something-from-backend'></img>
      <form action={hostBackend + '/todos'} method="POST">
        <input type='text' name='content' />
        <input type='submit' value='Submit' />
      </form>
      <ul>{todos}</ul>
    </div>
  )
}

export default App;
