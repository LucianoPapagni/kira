const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));
const containerCarritoVacio = document.querySelector("#carrito-vacio");
const containerCarritoProductos = document.querySelector("#carrito-productos");
const containerCarritoAcciones = document.querySelector("#carrito-acciones");
const containerCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector(".carrito-acciones-vaciar");
const containerTotal = document.querySelector("#total");
const botonComprar = document.querySelector(".carrito-acciones-comprar");

function cargarProductosCarrito(){
    if(productosEnCarrito && productosEnCarrito.length > 0){
        containerCarritoVacio.classList.add("disabled");
        containerCarritoProductos.classList.remove("disabled");
        containerCarritoAcciones.classList.remove("disabled");
        containerCarritoComprado.classList.add("disabled");
    
        containerCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-img" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Titulo</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash3-fill"></i></button>
            `;
    
            containerCarritoProductos.append(div);
        })
    
    
    } else {
        containerCarritoVacio.classList.remove("disabled");
        containerCarritoProductos.classList.add("disabled");
        containerCarritoAcciones.classList.add("disabled");
        containerCarritoComprado.classList.add("disabled");
    }

    actulizarBotonesEliminar();
    actualizarTotal();

}


cargarProductosCarrito();


function actulizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #F8BBD0, #EF9A9A)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".80rem",
        },
        offset: {
            x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: "1.5rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); 

}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    Swal.fire({
        title: "¿Estas seguro que queres vaciar el carrito?",
        text: `Se van a borrar ${productosEnCarrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0)} productos del carrito`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, vaciar"
      }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
          Swal.fire({
            title: "Carrito vaciado",
            text: "El carrito ha sido vaciado",
            icon: "success"
          });
        }
      });
}

function actualizarTotal(){
    const totalCalculado = productosEnCarrito.reduce((acumulador, producto) => acumulador + producto.cantidad * producto.precio, 0);
    total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    containerCarritoVacio.classList.add("disabled");
        containerCarritoProductos.classList.add("disabled");
        containerCarritoAcciones.classList.add("disabled");
        containerCarritoComprado.classList.remove("disabled");
    
}