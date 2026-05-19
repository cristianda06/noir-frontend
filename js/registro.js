
const registroForm = document.getElementById("registroForm");
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto, color) {
    mensaje.textContent = texto;
    mensaje.style.color = color;
}

registroForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre   = document.getElementById("nombre").value.trim();
    const correo   = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmar = document.getElementById("confirmar").value.trim();

    // Validaciones campo por campo
    if (!nombre) {
        mostrarMensaje("Por favor ingresa tu nombre completo.", "red");
        return;
    }
    if (!correo) {
        mostrarMensaje("Por favor ingresa tu correo electrónico.", "red");
        return;
    }
    if (!password) {
        mostrarMensaje("Por favor ingresa una contraseña.", "red");
        return;
    }
    if (password.length < 6) {
        mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", "red");
        return;
    }
    if (!confirmar) {
        mostrarMensaje("Por favor confirma tu contraseña.", "red");
        return;
    }
    if (password !== confirmar) {
        mostrarMensaje("Las contraseñas no coinciden.", "red");
        return;
    }

    // Verificar si el correo ya está registrado
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find(u => u.correo === correo);
    if (existe) {
        mostrarMensaje("Este correo ya está registrado.", "red");
        return;
    }

    // Guardar nuevo usuario
    usuarios.push({ nombre, correo, password });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarMensaje("¡Cuenta creada exitosamente! Redirigiendo...", "green");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
});