const mongoose = require('mongoose')

const argsProvided = process.argv.length

if (argsProvided < 3) {
    console.log('You need to provide at least one argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://mqd-uy:${password}@cluster0.qstjepl.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (argsProvided === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(p => console.log(p.name + ' ' + p.number))
        mongoose.connection.close()
    })
} else if (argsProvided === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const newPerson = new Person({ name, number })
    newPerson.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('You need to provide one or three arguments')
    mongoose.connection.close()
}