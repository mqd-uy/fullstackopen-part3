import axios from "axios";

const baseUrl = 'https://part3-phonebook-s6wn.onrender.com/api/persons'

const getAll = () =>
    axios
        .get(baseUrl)
        .then(response => response.data)

const addPerson = object =>
    axios
        .post(baseUrl, object)
        .then(response => response.data)

const deletePerson = id =>
    axios
        .delete(`${baseUrl}/${id}`)
        .then(() => true)

const updatePerson = object =>
    axios
        .put(`${baseUrl}/${object.id}`, object)
        .then(response => response.data)

export default { getAll, addPerson, deletePerson, updatePerson }