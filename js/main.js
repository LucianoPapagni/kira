let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);

    })


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesComprar = document.querySelectorAll(".boton-comprar");
const carritoProductos = document.  querySelector("#carrito-productos");
const numero = document.querySelector("#numero");

function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="info-producto">
                <h3 class="titulo-producto">${producto.titulo}</h3>
                <p class="precio-producto">$${producto.precio}</p>
                <button class="boton-comprar" id="${producto.id}">Comprar</button>
            </div>
        `;
        contenedorProductos.append(div);

    })
    actulizarBotonesComprar();

}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));

        e.currentTarget.classList.add("active");
        
        if(e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerHTML = productoCategoria.categoria.nombre;

            const productosSeleccionados = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosSeleccionados);
        } else {
            tituloPrincipal.innerHTML = "Todos los productos";
            cargarProductos(productos)
        }

    })
})


function actulizarBotonesComprar() {
    botonesComprar = document.querySelectorAll(".boton-comprar");

    botonesComprar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });

}
let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if(productosEnCarritoLS){
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumero(); 
} else {
    productosEnCarrito = [];
}


function agregarAlCarrito(e) {

    Toastify({
        text: "Producto añadido",
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
    const productoComprado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoComprado.cantidad = 1;
        productosEnCarrito.push(productoComprado);
    }


    actualizarNumero();
    
    
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

function actualizarNumero(){
    let nuevoNumero = productosEnCarrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    numero.innerText = nuevoNumero;
}