import { useState, useEffect } from 'react'
import phonebook from '../services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [failMessage, setFailMessage] = useState(null)

  useEffect(() => {
    phonebook
      .getAll()
      .then(data => setPersons(data))
  }, [])

  const handleNewName = event => setNewName(event.target.value)

  const handleNewNumber = event => setNewNumber(event.target.value)

  const handleSearchFilter = event => setSearchFilter(event.target.value)

  const shownPersons = persons.filter(person => person.name.toLocaleLowerCase().includes(searchFilter.toLowerCase()))

  const personAdded = event => {
    event.preventDefault()
    const newPersonObject = {
      name: newName,
      number: newNumber
    }
    const personSearched = persons.find(person => person.name === newPersonObject.name)
    if (personSearched !== undefined) {
      const personToUpdate = {
        ...personSearched,
        number: newNumber
      }
      updatePerson(personToUpdate)
    } else {
      phonebook
        .addPerson(newPersonObject)
        .then(data => {
          setPersons(persons.concat(data))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${newPersonObject.name}`)
          setTimeout(() => setSuccessMessage(null), 3000)
        })
        .catch(error => {
          console.log('person added eror', error);
          setFailMessage(error.response.data.error)
          setTimeout(() => setFailMessage(null), 5000)
        })
    }
  }

  const updatePerson = (person) => {
    if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`))
      phonebook.updatePerson(person)
        .then(personUpdated => {
          setPersons(persons.map(
            person => person.id !== personUpdated.id ? person : personUpdated
          ))
          setSuccessMessage(`Updated ${personUpdated.name}`)
          setTimeout(() => setSuccessMessage(null), 3000)
        })
        .catch(error => {
          console.log('person updated eror', error);
          if (error.response.status === 404) {
            setPersons(persons.filter(p => p.id !== person.id))
            setFailMessage(`Information of ${person.name} has already been removed from server`)
          } else {
            setFailMessage(error.response.data.error)
          }
          setTimeout(() => setFailMessage(null), 3000)
        })
  }

  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`))
      phonebook.deletePerson(person.id)
        .then(isDeleted => {
          if (isDeleted)
            setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setFailMessage(`Information of ${person.name} has already been removed from server`)
          setTimeout(() => setFailMessage(null), 3000)
        })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Success message={successMessage} />
      <Fail message={failMessage} />
      <Filter searchFilter={searchFilter} handleSearchFilter={handleSearchFilter} />
      <h3>Add a new</h3>
      <PersonForm
        handlers={{
          personAdded: personAdded,
          handleNewName: handleNewName,
          handleNewNumber: handleNewNumber
        }}
        values={{
          newName: newName,
          newNumber: newNumber
        }}
      />
      <h3>Numbers</h3>
      <Persons persons={shownPersons} handleDeletePerson={handleDeletePerson} />
    </div>
  )
}


const Person = ({ person, handleDeletePerson }) =>
  <p>
    {person.name}
    {person.number}
    <button onClick={() => handleDeletePerson(person)}>delete</button>
  </p>

const Persons = ({ persons, handleDeletePerson }) => (
  <div>
    {persons.map(person => <Person key={person.name} person={person} handleDeletePerson={handleDeletePerson} />)}
  </div>
)

const PersonForm = ({ handlers, values }) => (
  <form onSubmit={handlers.personAdded}>
    <div>
      name: <input value={values.newName} onChange={handlers.handleNewName} />
      <br />
      number: <input value={values.newNumber} onChange={handlers.handleNewNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Filter = ({ searchFilter, handleSearchFilter }) => (
  <div>
    filter shown with <input value={searchFilter} onChange={handleSearchFilter} />
  </div>
)

const Success = ({ message }) => {
  const style = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  if (message === null)
    return null
  else
    return (
      <div style={style}>
        {message}
      </div>
    )
}

const Fail = ({ message }) => {
  const style = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  if (message === null)
    return null
  else
    return (
      <div style={style}>
        {message}
      </div>
    )
}

export default App