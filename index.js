const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

app.use(morgan('tiny'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (!person) {
        response.status(404).end()
    }
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body);
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if (persons.some(p => p.name === body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }
    const newPerson = {
        name: body.name,
        number: body.number,
        id: getNewId()
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const updatedPersons = persons.filter(p => p.id !== id)
    if (persons.length - updatedPersons.length === 1) {
        persons = updatedPersons
        response.sendStatus(204)
    } else {
        response.status(404).end()
    }

})

app.get('/info', (request, response) => {
    const contactsQty = persons.length
    let html = `<p>Phonebook has info for ${contactsQty} ${contactsQty === 1 ? 'person' : 'people'}</p>`
    html += `<p>${new Date(Date.now()).toString()}</p>`
    response.send(html)
})

const getNewId = () => {
    let newId = 0
    do {
        newId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    } while (persons.some(p => p.id === newId))

    return newId
}

const PORT = 3001
// const HOST_NAME = 'localhost'
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})