const express = require('express')

const app = express()

const persons = [
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

app.get('/info', (request, response) => {
    const contactsQty = persons.length
    let html = `<p>Phonebook has info for ${contactsQty} ${contactsQty === 1 ? 'person' : 'people'}</p>`
    html += `<p>${new Date(Date.now()).toString()}</p>`
    response.send(html)
})

const PORT = 3001
// const HOST_NAME = 'localhost'
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})