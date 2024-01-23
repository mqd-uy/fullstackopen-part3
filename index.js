require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')

const app = express()

app.use(express.static('dist'))

app.use(express.json())

morgan.token('response-data', (req, res) => JSON.stringify(req.body))

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://localhost:5173'
    ]
}

app.use(cors(corsOptions))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-data'))

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
    Person.find({})
        .then(result => {
            response.json(result)
        })
        .catch(error => {
            console.log('error fetching people:', error);
        })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id)
        .then(person => {
            if (!person)
                response.status(404).end()
            response.json(person)
        })
        .catch(error => {
            console.log('find person by id error: ', error)
            response.status(400).end()
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    /*
    if (persons.some(p => p.name === body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }
    */
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save().then(person => {
        console.log('new person added:', person);
        response.json(person)
    }).catch(error => {
        console.log('adding person error:', error)
    })
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})