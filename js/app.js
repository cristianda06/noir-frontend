
const featuredProducts = [
    {
        id: "feat-1",
        name: "Camiseta Oversize",
        price: 89900,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1160&auto=format&fit=crop"
    },
    {
        id: "feat-2",
        name: "Chaqueta Urbana",
        price: 149900,
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1170&auto=format&fit=crop"
    },
    {
        id: "feat-3",
        name: "Sudadera Noir",
        price: 119900,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1160&auto=format&fit=crop"
    },
    {
        id: "feat-4",
        name: "Gorra Noir",
        price: 59900,
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1160&auto=format&fit=crop"
    }
];

function addToCart(product) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(product);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Feedback visual en el botón
    const btns = document.querySelectorAll(`[data-id="${product.id}"]`);
    btns.forEach(btn => {
        const original = btn.textContent;
        btn.textContent = "¡Agregado!";
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
        }, 1200);
    });
}

function renderFeatured() {
    const container = document.querySelector(".products-container");
    if (!container) return;

    container.innerHTML = featuredProducts.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price.toLocaleString("es-CO")}</p>
            <button class="btn-carrito" data-id="${p.id}" onclick='addToCart(${JSON.stringify(p)})'>
                Agregar al carrito
            </button>
        </div>
    `).join("");
}

renderFeatured();

const ADMIN_CORREO   = "admin@noir.com";
const ADMIN_PASSWORD = "noir2024";

function abrirAdminModal() {
    document.getElementById("adminModalCorreo").value   = "";
    document.getElementById("adminModalPassword").value = "";
    document.getElementById("adminModalError").textContent = "";
    const overlay = document.getElementById("adminModalOverlay");
    overlay.style.display = "flex";
}

function cerrarAdminModal() {
    document.getElementById("adminModalOverlay").style.display = "none";
}

function procesarAdminLogin() {
    const correo   = document.getElementById("adminModalCorreo").value.trim();
    const password = document.getElementById("adminModalPassword").value.trim();
    const errorEl  = document.getElementById("adminModalError");

    errorEl.textContent = "";

    if (!correo)   { errorEl.textContent = "Ingresa tu correo."; return; }
    if (!password) { errorEl.textContent = "Ingresa tu contraseña."; return; }

    if (correo !== ADMIN_CORREO || password !== ADMIN_PASSWORD) {
        errorEl.textContent = "Credenciales incorrectas.";
        return;
    }

    localStorage.setItem("adminActivo", JSON.stringify({ correo, rol: "admin" }));
    cerrarAdminModal();
    window.location.href = "admin.html"; // va al panel admin
}

// Cerrar modal al hacer clic fuera
document.getElementById("adminModalOverlay").addEventListener("click", function(e) {
    if (e.target === this) cerrarAdminModal();
});
