const container = document.getElementById("products-container");
// Esta variable almacenará la unión de (Locales + Backend)
let allProducts = []; 

// 1. FUNCIÓN PARA CARGAR Y UNIR TODO
async function loadCatalog() {
    // Primero, cargamos los que ya existen en tu archivo products.js local
    // (Asumiendo que la variable se llama 'products')
    if (typeof products !== 'undefined') {
        allProducts = [...products];
    }

    try {
        // Pedimos los nuevos productos al Backend
        const response = await fetch('http://localhost:3000/productos');
        
        if (response.ok) {
            const backendProducts = await response.json();
            
            // Convertimos los nombres del backend (ej: nombre -> name) para que no falle el diseño
            const mappedBackend = backendProducts.map(p => ({
                id: p.id + 5000, // Sumamos 5000 para que no choque con IDs locales
                name: p.nombre || p.name,
                price: p.precio || p.price,
                category: p.categoria || p.category,
                image: p.imagen || p.image || 'img/default.jpg'
            }));

            // UNIÓN FINAL: Locales + Backend
            allProducts = [...allProducts, ...mappedBackend];
        }
    } catch (error) {
        console.warn("No se pudo conectar con el Backend, mostrando solo productos locales.");
    }

    // Una vez unidos, los mostramos
    showProducts(allProducts);
}

// 2. MOSTRAR PRODUCTOS (Tu función original con corrección de seguridad)
function showProducts(productsArray) {
    container.innerHTML = "";

    if (!productsArray || productsArray.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>No se encontraron productos</p>
                <span>Intenta con otra búsqueda o categoría</span>
            </div>`;
        return;
    }

    productsArray.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <div class="product-img-wrap">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <p class="product-category">${product.category}</p>
                    <h3>${product.name}</h3>
                    <p class="product-price">$${Number(product.price).toLocaleString("es-CO")}</p>
                </div>
                <button class="btn-carrito" onclick="addToCart(${product.id}, this)">
                    Agregar al carrito
                </button>
                <a href="detalle.html?id=${product.id}" class="btn-carrito" style="text-align:center; margin-top:0; background:#333;">
                    Ver producto
                </a>
            </div>
        `;
    });
}

// 3. FILTROS (Ahora filtran sobre la lista combinada)
function filterProducts(category) {
    if (category === "todos") {
        showProducts(allProducts);
    } else {
        showProducts(allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase()));
    }
}

// 4. AGREGAR AL CARRITO (Busca en la lista combinada)
function addToCart(id, button) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(product);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    button.textContent = "¡Agregado!";
    button.disabled = true;
    setTimeout(() => {
        button.textContent = "Agregar al carrito";
        button.disabled = false;
    }, 1500);
}

// 5. BÚSQUEDA (Actualizada)
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", e => {
        const text = e.target.value.toLowerCase();
        showProducts(allProducts.filter(p =>
            p.name.toLowerCase().includes(text) ||
            p.category.toLowerCase().includes(text)
        ));
    });
}

// --- LÓGICA DE INICIO ---

// Sustituimos la lógica de URL para que espere a la carga del Backend
document.addEventListener("DOMContentLoaded", async () => {
    await loadCatalog(); // Esperamos a que se unan los productos

    const params = new URLSearchParams(window.location.search);
    const categoriaURL = params.get("categoria");
    const categoryFilter = document.getElementById("categoryFilter");

    if (categoriaURL) {
        if (categoryFilter) {
            const opcion = [...categoryFilter.options].find(o => o.value === categoriaURL);
            if (opcion) opcion.selected = true;
        }
        filterProducts(categoriaURL);
    }
});