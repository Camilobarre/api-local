import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'

const URL_GENERAL = 'http://localhost:3000/categories'
const tbody = document.querySelector('tbody')
const form = document.querySelector("form")
const name = document.querySelector("#name")
const image = document.querySelector("#url-image")
let id

index()

form.addEventListener('submit', async (event) => {
    event.preventDefault() //Evitar que la pagina se recargue
    //ACA DEBEMOS LLAMAR A LA FUNCION QUE SE ENCARGA DE GUARDAR

    if (id === undefined) {
        await create(name, image) //Envia los inputs a la funcion que se encarga de guardar
    } else {
        await update(id, name, image) //Envia los inputs a la funcion que se encarga de guardar
    }

    await index() //Volvemos a recargar la lista
    form.reset()
})

tbody.addEventListener('click', async function (event) {
    // ACA DEBEMOS LOCALIZAR A LOS ESCUCHADORES DE EVENTOS

    if (event.target.classList.contains("btn-danger")) { //Nos aseguramos que estamos presionando el boton rojo
        const id = event.target.getAttribute("data-id") //Le sacamos el id al boton rojo 
        await deleteItem(id) //Enviamos el id a la funcion que se encarga de eliminar
        await index() //Volvemos a recargar la lista
    }

    if(event.target.classList.contains("btn-warning")){
        id = event.target.getAttribute("data-id")
        const categoryFound = await find(id);
        name.value = categoryFound.name
        image.value = categoryFound.image
    }
})


async function index() {
    const response = await fetch('https://api.escuelajs.co/api/v1/categories') //Lamamos a los datos
    const data = await response.json() //Convertimos los datos de JSON a Javascript

    tbody.innerHTML = ""
    data.forEach(element => {
        tbody.innerHTML += `
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>
                <img width="100px" src=${element.image} alt=${element.name}>
            </td>
            <td>${element.creationAt}</td>
            <td>${element.updatedAt}</td>
            <td>
                <button type="button" data-id=${element.id} class="btn btn-warning">Edit</button>
                <button type="button" data-id=${element.id} class="btn btn-danger">Delete</button>
            </td>
        `
    })
}

async function find(id) {
    //ACA DEBEMOS PROGRAMAR LA PETICION PARA BUSCAR UNA CATEGORIA
    const response = await fetch(`${URL_GENERAL}/${id}`) //Vamos y traemos todo el elemento
    const data = await response.json() //Convertimos elemento JSON a Javascript
    return data //Retornamos el elemento
}

async function create(name, image) {
    //ACA DEBEMOS PROGRAMAR LA PETICION PARA CREAR UNA CATEGORIA

    //Preparamos a la nueva categoria que vamos a guardar
    const newCategory = {
        name: name.value,
        image: image.value
    }

    await fetch(`${URL_GENERAL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory),
    })
}

async function update(id, name, image) {
    //ACA DEBEMOS PROGRAMAR LA PETICION PARA CREAR UNA CATEGORIA

    //Preparamos a la nueva categoria que vamos a guardar
    const updateCategory = {
        name: name.value,
        image: image.value
    }

    await fetch(`${URL_GENERAL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateCategory),
    })

    id = undefined
}

async function deleteItem(id) {
    //ACA DEBEMOS PROGRAMAR LA PETICION PARA ELIMINAR UNA CATEGORIA

    await fetch(`${URL_GENERAL}/${id}`, {
        method: 'DELETE',
    })
}