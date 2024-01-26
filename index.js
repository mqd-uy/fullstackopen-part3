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

morgan.token('response-data', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-data'))

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(result => {
      response.json(result)
    })
    .catch(error => {
      console.log('error fetching people:', error)
      next(error)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (!person)
        response.status(404).end()
      response.json(person)
    })
    .catch(error => {
      console.log('find person by id error: ', error)
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  // validation moved to mongoose schema
  // if (!body.name || !body.number) {
  //     return response.status(400).json({
  //         error: 'content missing'
  //     })
  // }
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
    console.log('new person added:', person)
    response.json(person)
  }).catch(error => {
    console.log('adding person error:', error)
    next(error)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      console.log('person deleted: ', result)
      response.sendStatus(204)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const personToUpdate = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, personToUpdate, { new: true, runValidators: true })
    .then(updatedPerson => {
      console.log('updated person', updatedPerson)
      if (!updatedPerson)
        return response.status(404).end()
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', async (request, response) => {
  const contactsQty = await Person.countDocuments({})
  let html = `<p>Phonebook has info for ${contactsQty} ${contactsQty === 1 ? 'person' : 'people'}</p>`
  html += `<p>${new Date(Date.now()).toString()}</p>`
  response.send(html)
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name == 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }
  if (error.name == 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})