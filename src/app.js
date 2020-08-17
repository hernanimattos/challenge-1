const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkIdParams = (req, resp, next) => {
	const { id } = req.params;
	const { likes } = req.body;

	if (likes) {
		return resp.status(400).send({ likes: 0 });
	}
	const findIndex = repositories.findIndex((repo) => repo.id == id);
	if (findIndex < 0) {
		return resp.status(400).send({ status: 'erro' });
	}
	return next();
};

app.get('/repositories', (request, response) => {
	return response.json(repositories);
});

app.post('/repositories', (request, response) => {
	const { url, title, techs } = request.body;
	const createId = uuid();
	repositories.push({
		id: createId,
		url,
		title,
		techs,
		likes: 0,
	});

	return response.json({
		id: createId,
		url,
		title,
		techs,
		likes: 0,
	});
});

app.put('/repositories/:id', checkIdParams, (request, response) => {
	// TODO
	const { id } = request.params;
	const { title, techs, url } = request.body;

	const findIndex = repositories.findIndex((repo) => repo.id === id);
	repositories[findIndex] = {
		id,
		title,
		techs,
		url,
	};
	return response.json({ ...repositories[findIndex] });
});

app.delete(
	'/repositories/:id',
	checkIdParams,
	checkIdParams,
	(request, response) => {
		// TODO
		const { id } = request.params;
		const findIndex = repositories.findIndex((repo) => repo.id == id);

		repositories.splice(findIndex, 1);
		return response.status(204).send();
	},
);

app.post('/repositories/:id/like', checkIdParams, (request, response) => {
	const { id } = request.params;

	const findIndex = repositories.findIndex((repo) => repo.id == id);

	const likes = (repositories[findIndex].likes += 1);
	return response.json({ likes });
});

module.exports = app;
