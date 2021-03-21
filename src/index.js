const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryFound = repositories.find(
    (repository) => repository.id === id
  );

  if (!repositoryFound) {
    return response.status(404).json({ error: "Repository not found." });
  }

  if (title) {
    repositoryFound.title = title;
  }

  if (url) {
    repositoryFound.url = url;
  }

  if (techs) {
    repositoryFound.techs = techs;
  }

  return response.json(repositoryFound);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  console.log("before delete", repositories);

  const repositoryFoundIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryFoundIndex < 0) {
    return response.status(404).json({ error: "Repository not found." });
  }

  repositories.splice(repositoryFoundIndex, 1);

  console.log("after delete", repositories);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryFound = repositories.find(
    (repository) => repository.id === id
  );

  if (!repositoryFound) {
    return response.status(404).json({ error: "Repository not found." });
  }

  repositoryFound.likes = ++repositoryFound.likes;

  return response.json({ likes: repositoryFound.likes });
});

module.exports = app;
