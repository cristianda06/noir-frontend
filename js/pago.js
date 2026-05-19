
let metodoPago = "tarjeta";

// Detecta si viene de "Comprar" individual o del checkout total
const compraActiva = JSON.parse(localStorage.getItem("compraActiva"));
const carritoCompleto = JSON.parse(localStorage.getItem("carrito")) || [];

const carrito = compraActiva ? [compraActiva] : carritoCompleto;

const resumenItems = document.getElementById("resumenItems");
const resumenTotal = document.getElementById("resumenTotal");

if (carrito.length === 0) {
    window.location.href = "carrito.html";
}

let total = 0;
carrito.forEach(p => {
    total += p.price;
    resumenItems.innerHTML += `
        <div class="resumen-item">
            <span>${p.name}</span>
            <span>$${p.price.toLocaleString("es-CO")}</span>
        </div>
    `;
});
resumenTotal.textContent = `$${total.toLocaleString("es-CO")}`;

// Seleccionar método de pago
function selectMetodo(btn, metodo) {
    metodoPago = metodo;
    document.querySelectorAll(".metodo-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const camposTarjeta = document.getElementById("camposTarjeta");
    const camposOtro = document.getElementById("camposOtroPago");
    const instrucciones = document.getElementById("instruccionesPago");

    if (metodo === "tarjeta") {
        camposTarjeta.style.display = "block";
        camposOtro.style.display = "none";
    } else {
        camposTarjeta.style.display = "none";
        camposOtro.style.display = "block";
        if (metodo === "efectivo") {
            instrucciones.textContent = "Paga en efectivo al momento de recibir tu pedido. Nuestro equipo se pondrá en contacto contigo para coordinar la entrega.";
        } else {
            instrucciones.textContent = "Realiza tu transferencia a la cuenta que tu asesor te indicará. Una vez confirmado el pago, procesaremos tu pedido.";
        }
    }
}

// Formatear número de tarjeta
const inputTarjeta = document.getElementById("pagoTarjeta");
if (inputTarjeta) {
    inputTarjeta.addEventListener("input", e => {
        let val = e.target.value.replace(/\D/g, "").slice(0, 16);
        e.target.value = val.replace(/(.{4})/g, "$1 ").trim();
    });
}

// Formatear vencimiento
const inputVenc = document.getElementById("pagoVencimiento");
if (inputVenc) {
    inputVenc.addEventListener("input", e => {
        let val = e.target.value.replace(/\D/g, "").slice(0, 4);
        if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
        e.target.value = val;
    });
}

// Validar y procesar pago
function procesarPago() {
    const errorEl = document.getElementById("pagoError");
    errorEl.textContent = "";

    const nombre    = document.getElementById("pagoNombre").value.trim();
    const apellido  = document.getElementById("pagoApellido").value.trim();
    const correo    = document.getElementById("pagoCorreo").value.trim();
    const ciudad    = document.getElementById("pagoCiudad").value.trim();
    const telefono  = document.getElementById("pagoTelefono").value.trim();
    const direccion = document.getElementById("pagoDireccion").value.trim();

    if (!nombre)    { errorEl.textContent = "Ingresa tu nombre."; return; }
    if (!apellido)  { errorEl.textContent = "Ingresa tu apellido."; return; }
    if (!correo)    { errorEl.textContent = "Ingresa tu correo."; return; }
    if (!ciudad)    { errorEl.textContent = "Ingresa tu ciudad."; return; }
    if (!telefono)  { errorEl.textContent = "Ingresa tu teléfono."; return; }
    if (!direccion) { errorEl.textContent = "Ingresa tu dirección."; return; }

    if (metodoPago === "tarjeta") {
        const tarjeta     = document.getElementById("pagoTarjeta").value.replace(/\s/g, "");
        const vencimiento = document.getElementById("pagoVencimiento").value;
        const cvv         = document.getElementById("pagoCVV").value.trim();

        if (tarjeta.length < 16)  { errorEl.textContent = "Ingresa un número de tarjeta válido."; return; }
        if (vencimiento.length < 5) { errorEl.textContent = "Ingresa la fecha de vencimiento."; return; }
        if (cvv.length < 3)       { errorEl.textContent = "Ingresa el CVV."; return; }
    }

    //  Limpia solo lo que corresponde según el flujo
    localStorage.removeItem("compraActiva"); // siempre se limpia
    if (!compraActiva) {
        localStorage.removeItem("carrito"); // solo si fue checkout total
    }

    document.getElementById("pagoGrid").style.display = "none";
    document.getElementById("pagoConfirmacion").style.display = "block";
    document.querySelector(".pago-title").style.display = "none";
}