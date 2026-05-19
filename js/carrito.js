const cartContainer = document.getElementById("cartContainer");
const totalEl = document.getElementById("total");
const btnCheckout = document.getElementById("btnCheckout");

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function renderCart() {
    if (carrito.length === 0) {
        
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="1"
                    stroke-linecap="round" stroke-linejoin="round"
                    style="opacity:0.25; display:block; margin:0 auto 1rem;">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p>Tu carrito está vacío.</p>
            </div>
        `;
        totalEl.textContent = "Total: $0";
        if (btnCheckout) btnCheckout.style.display = "none";
        return;
    }

    let total = 0;
    cartContainer.innerHTML = "";

    carrito.forEach((product, index) => {
        total += product.price;
        cartContainer.innerHTML += `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-info">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toLocaleString("es-CO")}</p>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <button class="btn-detail-cart" onclick="comprarItem(${index})">Comprar</button>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Eliminar</button>
                </div>
            </div>
        `;
    });

    totalEl.textContent = `Total: $${total.toLocaleString("es-CO")}`;
    if (btnCheckout) btnCheckout.style.display = "inline-block";
}

function removeFromCart(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCart();
}

function comprarItem(index) {
    const producto = carrito[index];
    localStorage.setItem("compraActiva", JSON.stringify(producto));
    window.location.href = "pago.html";
}

renderCart();