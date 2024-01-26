const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  console.log('connected to MongoDB')
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters']
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        if (v.length < 8)
          return false
        const regex = /^\d{2,3}[-]\d+$/
        return v.match(regex)
      },
      message: 'Phone number must be at least 8 digits. Prefix should be 2 o 3 digits. Prefix and number must be dash (-) separated'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person