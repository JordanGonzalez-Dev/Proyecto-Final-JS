let stockProductos = [];
let carritoDeCompras = [];

const selectCategoria = document.getElementById("selectCategoria");
const buscador = document.getElementById("search");
const ordenarProductos = document.getElementById("sort-by");

const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("carrito-contenedor");

const botonTerminar = document.getElementById("terminar");
const finCompra = document.getElementById("fin-compra");

const contadorCarrito = document.getElementById("contadorCarrito");
const precioTotal = document.querySelector("#precioTotal");

fetch("../stock.json")
    .then((resp) => resp.json())
    .then((datos) => {
        datos.forEach((e) => {
            stockProductos.push(e);
            mostrarProductos(stockProductos);
        });
    });

//Filtro de Categorías

selectCategoria.addEventListener("change", () => {
    selectCategoria.value == "all" ?
        mostrarProductos(stockProductos) :
        mostrarProductos(
            stockProductos.filter(
                (elemento) => elemento.categoria == selectCategoria.value
            )
        );
});

//Barra de Búsqueda

buscador.addEventListener("input", () => {
    buscador.value == "" ?
        mostrarProductos(stockProductos) :
        mostrarProductos(
            stockProductos.filter((elemento) =>
                elemento.nombre.toLowerCase().includes(buscador.value.toLowerCase())
            )
        );
});

//Ordenar Mayor o Menor Precio

ordenarProductos.addEventListener("change", () => {
    if (ordenarProductos.value == "descendente") {
        mostrarProductos(
            stockProductos.sort((a, b) => {
                if (a.precio > b.precio) {
                    return -1;
                }
                if (a.precio < b.precio) {
                    return 1;
                }
                return 0;
            })
        );
    } else if (ordenarProductos.value == "ascendente") {
        mostrarProductos(
            stockProductos.sort((a, b) => {
                if (a.precio < b.precio) {
                    return -1;
                }
                if (a.precio > b.precio) {
                    return 1;
                }
                return 0;
            })
        );
    } else if (ordenarProductos.value == "todos") {
        mostrarProductos(
            stockProductos.sort((a, b) => {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                return 0;
            })
        );
    }
});

//Lógica de la Tienda

function mostrarProductos(array) {
    contenedorProductos.innerHTML = "";

    array.forEach((item) => {
        let div = document.createElement("div");
        div.classList.add("producto");

        // Productos

        div.innerHTML += `
                    <div class="card">
                    <img class="card-profile-img" src="${item.img}">
                    <div class="card-description-bk"></div>
                    <div class="card-description">
                        <p>${item.nombre}</p>
                    </div>
                    <div  class="card-date">
                        <p>$ ${item.precio}</p>
                    </div>
                    <div class="card-btn btnTrans">
                        <a id="agregar${item.id}">Agregar al carrito</a>
                    </div>
                    </div>
                    `;

        contenedorProductos.appendChild(div);

        let btnAgregar = document.getElementById(`agregar${item.id}`);

        btnAgregar.addEventListener("click", () => {
            agregarAlCarrito(item.id);
            Toastify({
                text: "Agregado al carrito",
                style: {
                    background: "linear-gradient(315deg, #7f5a83 0%, #0d324d 74%)",
                },
                offset: {
                    x: 10,
                    y: 150,
                },
            }).showToast();
        });
    });
}

function agregarAlCarrito(id) {
    let yaEsta = carritoDeCompras.find((item) => item.id == id);
    if (yaEsta) {
        yaEsta.cantidad++;
        document.getElementById(
            `und${yaEsta.id}`
        ).innerHTML = ` <p id=und${yaEsta.id}>Und:${yaEsta.cantidad}</p>`;
        actualizarCarrito();
    } else {
        let productoAgregar = stockProductos.find((elemento) => elemento.id == id);

        productoAgregar.cantidad = 1;

        carritoDeCompras.push(productoAgregar);

        actualizarCarrito();

        mostrarCarrito(productoAgregar);
    }
    localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
}

function mostrarCarrito(productoAgregar) {
    let div = document.createElement("div");
    div.className = "productoEnCarrito d-flex justify-content-betweem";

    // Modal

    div.innerHTML = `
                    <p>${productoAgregar.nombre}</p>
                    <p>Precio: $${productoAgregar.precio}</p>
                    <p id="und${productoAgregar.id}">Und:${productoAgregar.cantidad}</p>
                    <button id="eliminar${productoAgregar.id}" class="boton-eliminar"><img src="../assets/img/trash3-fill.svg"></img></button>`;

    contenedorCarrito.appendChild(div);

    let btnEliminar = document.getElementById(`eliminar${productoAgregar.id}`);

    btnEliminar.addEventListener("click", () => {
        Toastify({
            text: "Producto eliminado",
            style: {
                background: "linear-gradient(315deg, #7f5a83 0%, #0d324d 74%)",
            },
            gravity: "bottom",
            offset: {
                x: 10, 
                y: 50
            },
        }).showToast();
        if (productoAgregar.cantidad == 1) {
            btnEliminar.parentElement.remove();
            carritoDeCompras = carritoDeCompras.filter(
                (item) => item.id != productoAgregar.id
            );
            actualizarCarrito();
            localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
        } else {
            productoAgregar.cantidad = productoAgregar.cantidad - 1;
            document.getElementById(
                `und${productoAgregar.id}`
            ).innerHTML = ` <p id=und${productoAgregar.id}>Und:${productoAgregar.cantidad}</p>`;
            actualizarCarrito();
            localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
        }
    });
}

function actualizarCarrito() {
    contadorCarrito.innerText = [...carritoDeCompras].reduce(
        (acc, el) => acc + el.cantidad,
        0
    );
    precioTotal.innerText = [...carritoDeCompras].reduce(
        (acc, el) => acc + el.precio * el.cantidad,
        0
    );
}

function recuperar() {
    let recuperarLS = JSON.parse(localStorage.getItem("carrito"));
    if (recuperarLS) {
        recuperarLS.forEach((el) => {
            mostrarCarrito(el);
            carritoDeCompras.push(el);
            actualizarCarrito();
        });
    }
}

recuperar();