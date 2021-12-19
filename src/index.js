const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const res = require('express/lib/response');

// const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user)
    return response.status(404).json({
      error: "User not found"
    });

  request.username = user.username;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const id = uuid();

  const user = {
    id,
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request;

  const user = users.find(user => user.username === username);

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { title, deadline } = request.body;
  
  const user = users.find(user => user.username === username);

  const id = uuid();

  const todo = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const user = users.find(user => user.username === username);

  let todo = user.todos.find(todo => todo.id === id);

  todo = {
    title,
    deadline: new Date(deadline),
    ...todo
  };

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;