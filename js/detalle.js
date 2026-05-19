

function addToCart(id, button) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(product);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    if (button) {
        button.textContent = "¡Agregado!";
        button.disabled = true;
        setTimeout(() => {
            button.textContent = "Agregar al carrito";
            button.disabled = false;
        }, 1500);
    }
}

function buyNow(id) {
    addToCart(id, null);
    window.location.href = "pago.html";
}

const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get("id"));
const selectedProduct = products.find(p => p.id === id);
const detailSection = document.getElementById("product-detail");

if (selectedProduct) {
    detailSection.innerHTML = `
        <nav class="detail-breadcrumb">
            <a href="index.html">Inicio</a>
            <span>/</span>
            <a href="catalogo.html">Catálogo</a>
            <span>/</span>
            <span>${selectedProduct.name}</span>
        </nav>

        <div class="detail-main">
            <div class="detail-grid">

                <div class="detail-img-col">
                    <div class="detail-img-wrap">
                        <img src="${selectedProduct.image}" alt="${selectedProduct.name}">
                    </div>
                </div>

                <div class="detail-info-col">
                    <span class="detail-category">${selectedProduct.category}</span>
                    <h1 class="detail-nombre">${selectedProduct.name}</h1>
                    <p class="detail-precio">$${selectedProduct.price.toLocaleString("es-CO")}</p>
                    <p class="detail-desc">
                        Prenda de colección exclusiva <em>Noir</em>.
                        Diseño urbano de alta calidad, confeccionada con materiales premium
                        para un estilo moderno y atemporal.
                    </p>

                    <div class="detail-tallas">
                        <p class="tallas-label">Talla</p>
                        <div class="tallas-grid">
                            <button class="talla-btn" onclick="selectTalla(this)">XS</button>
                            <button class="talla-btn" onclick="selectTalla(this)">S</button>
                            <button class="talla-btn" onclick="selectTalla(this)">M</button>
                            <button class="talla-btn" onclick="selectTalla(this)">L</button>
                            <button class="talla-btn" onclick="selectTalla(this)">XL</button>
                        </div>
                    </div>

                    <div class="detail-actions">
                        <button class="btn-detail-cart" onclick="addToCart(${selectedProduct.id}, this)">
                            Agregar al carrito
                        </button>
                        <button class="btn-detail-cart" onclick="buyNow(${selectedProduct.id})"
                            style="background:#444; flex:0.5;">
                            Comprar ahora
                        </button>
                    </div>

                    <p class="detail-msg" id="detailMsg"></p>

                    <a href="catalogo.html" class="btn-detail-back">← Volver al catálogo</a>
                </div>

            </div>
        </div>
    `;
} else {
    detailSection.innerHTML = `
        <div class="detail-not-found">
            <p>Producto no encontrado</p>
            <a href="catalogo.html" class="btn-detail-back">← Volver al catálogo</a>
        </div>
    `;
}

function selectTalla(btn) {
    document.querySelectorAll(".talla-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}
