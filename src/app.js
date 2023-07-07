const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid')

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;
  const results = title

    ? repositories.filter(repository => repositories.title.includes(title))
    : repositories;

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuidv4(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  let likes = 0;
  repositories.forEach(repository => {
    if (repository.id === id) {
      likes = repository.likes;
    }
  })
  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }
  const repository = {
    id, title, url, techs, likes
  };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  };

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  };
  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex])
});

module.exports = app;
