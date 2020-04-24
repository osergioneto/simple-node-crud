const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");
const app = express();


app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", validateProjectID, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = getRepositoryIndex(id, response);
  
  repositories[repositoryIndex] = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", validateProjectID, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = getRepositoryIndex(id, response);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateProjectID, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = getRepositoryIndex(id, response);

  repositories[repositoryIndex] = {
    id: repositories[repositoryIndex].id,
    title: repositories[repositoryIndex].title,
    url: repositories[repositoryIndex].url,
    techs: repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes + 1
  }

  return response.status(200).json(repositories[repositoryIndex]);
});

// ===================================================================>

function getRepositoryIndex(id, response) {
  const repositoryIndex = repositories.findIndex(repository => id === repository.id);

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: "Repository with ID not found." });
  } 

  return repositoryIndex;
}

function validateProjectID (req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  return next();
}

module.exports = app;
