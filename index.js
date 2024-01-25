require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://localhost:5173'
    ]
}
app.use(cors(corsOptions))

morgan.token('response-data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-data'))

const errorHandler = (error, request, response, next) => {
    if (error.name == 'CastError') {
        return response.status(400).json({ error: 'malformatted id' })
    }
    next(error)
}

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

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(result => {
            console.log('person deleted: ', result);
            // response.status(204).end()
            response.sendStatus(204)
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const contactsQty = persons.length
    let html = `<p>Phonebook has info for ${contactsQty} ${contactsQty === 1 ? 'person' : 'people'}</p>`
    html += `<p>${new Date(Date.now()).toString()}</p>`
    response.send(html)
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})