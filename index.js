const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
var requests = 0;

function checkIdExists(req, res, next) {
  const { id } = req.params;

  if (!projects[id]) {
    return res.status(400).json({ error: 'Id not found' });
  }

  return next();
}

server.use((req, res, next) => {
  requests++;

  console.log(requests);

  return next();
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json({ message: `Projeto ${title} adicionado com sucesso!` });
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.title = title;

  return res.json({ message: `Título do projeto alterado para ${title}!` });
});

server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  projects.splice(projectIndex, 1);

  return res.json({ message: `Projeto com o id ${id} deletado!` });
});

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.tasks.push(title);

  return res.json({ message: `Tarefa ${title} adicionada com sucesso  !` });
})

server.listen(3000);