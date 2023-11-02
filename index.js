const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (request, response) => {
    return JSON.stringify(request.body);
});

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = persons.find((person) => person.id == id);

    if (person) {
        response.send(person);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    console.log(id);
    persons = persons.filter((person) => person.id != id);

    response.status(204).end();
});

const generateId = () => {
    return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (request, response) => {
    const body = request.body;
    const person = persons.find((person) => person.name == body.name);
    console.log(person);
    if (
        !body.name ||
        !body.number ||
        persons.find((person) => person.name == body.name)
    ) {
        response.status(400);
        response.send({ error: "name must be unique" });
    } else {
        const newPerson = {
            id: generateId(),
            name: body.name,
            number: body.number,
        };

        persons = persons.concat(newPerson);

        response.send(persons);
    }
});

app.get("/info", (request, response) => {
    const time = new Date().toUTCString();

    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>\n<p>${time}`
    );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
