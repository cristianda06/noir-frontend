// ========================= //
// ADMIN.JS
// ========================= //

// ── PROTECCIÓN DE RUTA ──────────────────────────────
const usuarioRol    = localStorage.getItem("usuarioRol");
const usuarioNombre = localStorage.getItem("usuarioNombre");

if (!usuarioRol || usuarioRol !== "admin") {
    window.location.href = "admin-login.html";
}

document.getElementById("topbarAdmin").textContent = usuarioNombre || "Admin";

// ── ESTADO ─────────────────────────────────────────
let editIndex = null;

// Datos de ejemplo — reemplazar por fetch() al backend cuando esté listo
let productos = [
    { nombre: "Blazer sastre negro",  precio: 189000, categoria: "Chaquetas",  desc: "Corte recto, tela premium" },
    { nombre: "Pantalón wide leg",    precio: 129000, categoria: "Pantalones", desc: "Tiro alto, color crema" },
    { nombre: "Vestido midi satén",   precio: 215000, categoria: "Vestidos",   desc: "Escote en V, manga larga" },
    { nombre: "Camiseta oversized",   precio: 79000,  categoria: "Camisetas",  desc: "100% algodón, logo bordado" },
];

const pedidos = [
    { id: "#0041", cliente: "Laura Gómez",    total: 189000, estado: "Enviado",   fecha: "17 may 2026" },
    { id: "#0040", cliente: "Valentina Ríos", total: 344000, estado: "Pendiente", fecha: "16 may 2026" },
    { id: "#0039", cliente: "Camila Torres",  total: 79000,  estado: "Entregado", fecha: "15 may 2026" },
    { id: "#0038", cliente: "Sofía Mendoza",  total: 215000, estado: "Entregado", fecha: "14 may 2026" },
    { id: "#0037", cliente: "Mariana Pérez",  total: 129000, estado: "Cancelado", fecha: "13 may 2026" },
];

// ── HELPERS ─────────────────────────────────────────
function fmt(n) {
    return "$" + n.toLocaleString("es-CO");
}

function badgeClass(estado) {
    const map = {
        "Enviado":   "badge-info",
        "Pendiente": "badge-warn",
        "Entregado": "badge-success",
        "Cancelado": "badge-danger",
    };
    return map[estado] || "badge-info";
}

// ── RENDER PRODUCTOS ────────────────────────────────
function renderProductos() {
    const tbody = document.getElementById("tbodyProductos");

    if (!productos.length) {
        tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">No hay productos registrados.</div></td></tr>`;
        return;
    }

    tbody.innerHTML = productos.map((p, i) => `
        <tr>
            <td>${p.nombre}</td>
            <td>${fmt(p.precio)}</td>
            <td>${p.categoria}</td>
            <td style="display:flex; gap:6px; flex-wrap:wrap;">
                <button class="btn-sm btn-edit" onclick="editarProducto(${i})">Editar</button>
                <button class="btn-sm btn-del"  onclick="eliminarProducto(${i})">Eliminar</button>
            </td>
        </tr>
    `).join("");
}

// ── RENDER PEDIDOS ──────────────────────────────────
function renderPedidos() {
    const tbody = document.getElementById("tbodyPedidos");

    if (!pedidos.length) {
        tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No hay pedidos registrados.</div></td></tr>`;
        return;
    }

    tbody.innerHTML = pedidos.map(p => `
        <tr>
            <td style="font-family: monospace; font-size: 12px; color: #888;">${p.id}</td>
            <td>${p.cliente}</td>
            <td>${fmt(p.total)}</td>
            <td><span class="badge ${badgeClass(p.estado)}">${p.estado}</span></td>
            <td style="font-size: 12px; color: #888;">${p.fecha}</td>
        </tr>
    `).join("");
}

// ── NAVEGACIÓN ──────────────────────────────────────
function switchTab(tab, el) {
    event.preventDefault();
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    el.classList.add("active");
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    const titles = { productos: "Productos", pedidos: "Pedidos" };
    document.getElementById("topbarTitle").textContent = titles[tab];
    document.getElementById("sec" + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add("active");
}

// ── MODAL ───────────────────────────────────────────
function abrirModal(i = null) {
    editIndex = i;
    document.getElementById("modalError").textContent = "";

    if (i !== null) {
        const p = productos[i];
        document.getElementById("mNombre").value    = p.nombre;
        document.getElementById("mPrecio").value    = p.precio;
        document.getElementById("mCategoria").value = p.categoria;
        document.getElementById("mDesc").value      = p.desc || "";
        document.getElementById("modalTitle").textContent = "Editar producto";
    } else {
        document.getElementById("mNombre").value    = "";
        document.getElementById("mPrecio").value    = "";
        document.getElementById("mCategoria").value = "";
        document.getElementById("mDesc").value      = "";
        document.getElementById("modalTitle").textContent = "Agregar producto";
    }

    document.getElementById("modalOverlay").classList.add("open");
}

function cerrarModal() {
    document.getElementById("modalOverlay").classList.remove("open");
    editIndex = null;
}

// Cerrar modal al hacer clic fuera
document.getElementById("modalOverlay").addEventListener("click", function(e) {
    if (e.target === this) cerrarModal();
});

// ── GUARDAR PRODUCTO ────────────────────────────────
function guardarProducto() {
    const errorEl   = document.getElementById("modalError");
    const nombre    = document.getElementById("mNombre").value.trim();
    const precio    = parseInt(document.getElementById("mPrecio").value);
    const categoria = document.getElementById("mCategoria").value;
    const desc      = document.getElementById("mDesc").value.trim();

    if (!nombre)               { errorEl.textContent = "Ingresa el nombre del producto."; return; }
    if (!precio || precio < 0) { errorEl.textContent = "Ingresa un precio válido."; return; }
    if (!categoria)            { errorEl.textContent = "Selecciona una categoría."; return; }

    const prod = { nombre, precio, categoria, desc };

    if (editIndex !== null) {
        productos[editIndex] = prod;
    } else {
        productos.push(prod);
    }

    cerrarModal();
    renderProductos();
}

// ── EDITAR ──────────────────────────────────────────
function editarProducto(i) {
    abrirModal(i);
}

// ── ELIMINAR ────────────────────────────────────────
function eliminarProducto(i) {
    if (!confirm(`¿Eliminar "${productos[i].nombre}"? Esta acción no se puede deshacer.`)) return;
    productos.splice(i, 1);
    renderProductos();
}

// ── CERRAR SESIÓN ───────────────────────────────────
function cerrarSesion() {
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("usuarioRol");
    localStorage.removeItem("usuarioNombre");
    window.location.href = "admin-login.html";
}

// ── INIT ────────────────────────────────────────────
renderProductos();
renderPedidos();