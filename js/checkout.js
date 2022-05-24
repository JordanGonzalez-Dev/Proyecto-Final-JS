const productosCarrito = [];
const contenedorCheckout = document.getElementById("checkout-contenedor");
const precioTotal = document.getElementById("precioTotal");

productosCheckout();

//Productos en Carrito

function productosCheckout() {
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    if (carrito) {
        carrito.forEach((el) => {
            productosCarrito.push(el);

            let div = document.createElement("div");
            div.className = "d-flex justify-content-between";

            div.innerHTML = `
                    <div class="card">
                    <img class="card-profile-img" src="${el.img}">
                    <div class="card-description-bk"></div>
                    <div  class="card-date">
                    <p>${el.nombre} ( x ${el.cantidad} )</p>
                        <p>Precio Unitario: $ ${el.precio}</p>
                    </div>

                    </div>
                    `;

                    // <div class="p-4">
                    //     <img class="card-img-top" src=${el.img}>
                    //     <div class="card-body">
                    //         <p>Producto: ${el.nombre} (x ${el.cantidad})</p>
                    //         <p>Precio x Unidad: $${el.precio}</p>
                    //     </div>
                    // </div>

            contenedorCheckout.appendChild(div);
        });
    }
    precioTotal.innerText = [...productosCarrito].reduce(
        (acc, el) => acc + el.precio * el.cantidad,
        0
    );
}
// Botón de "Pagar"

document.querySelector("#pagar").addEventListener("click", () =>
        Swal.fire({
            title: "Estas seguro?",
            icon: "warning",
            text: `Confirmar el pago`,
            allowEnterKey: true,
            showConfirmButton: true,
            confirmButtonText: "Aceptar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Compra realizada!",
                    toast: "true",
                    timer: "2000",
                    timerProgressBar: "true",
                    showConfirmButton: false,
                    width: "210px",
                }).then(()=>{
                    location.href='productos.html'
                    localStorage.clear();
                });
            } else if (result.isDismissed) {
                Swal.fire({
                    icon: "error",
                    title: "Cancelado",
                    toast: "true",
                    timer: "1000",
                    timerProgressBar: "true",
                    showConfirmButton: false,
                    width: "210px",
                });
            }
        }));