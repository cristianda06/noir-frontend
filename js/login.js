
const loginForm          = document.getElementById("loginForm");
const loginMensaje       = document.getElementById("loginMensaje");
const btnOlvidePassword  = document.getElementById("btnOlvidePassword");
const recuperarForm      = document.getElementById("recuperarForm");
const recuperarMensaje   = document.getElementById("recuperarMensaje");
const nuevaPasswordForm  = document.getElementById("nuevaPasswordForm");

let correoRecuperacion = ""; // guarda el correo encontrado entre pasos

function mostrarMensaje(el, texto, color) {
    el.textContent = texto;
    el.style.color = color;
}

loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const correo   = document.getElementById("loginCorreo").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!correo)   { mostrarMensaje(loginMensaje, "Por favor ingresa tu correo.", "red"); return; }
    if (!password) { mostrarMensaje(loginMensaje, "Por favor ingresa tu contraseña.", "red"); return; }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario  = usuarios.find(u => u.correo === correo && u.password === password);

    if (!usuario) {
        mostrarMensaje(loginMensaje, "Correo o contraseña incorrectos.", "red");
        return;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    mostrarMensaje(loginMensaje, `Bienvenido, ${usuario.nombre} 👋`, "green");

    setTimeout(() => { window.location.href = "index.html"; }, 1200);
});

btnOlvidePassword.addEventListener("click", function(e) {
    e.preventDefault();

    // Oculta login, muestra recuperación
    loginForm.style.display         = "none";
    loginMensaje.textContent        = "";
    btnOlvidePassword.style.display = "none";
    recuperarForm.style.display     = "block";
});

recuperarForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const correo   = document.getElementById("recuperarCorreo").value.trim();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario  = usuarios.find(u => u.correo === correo);

    if (!usuario) {
        mostrarMensaje(recuperarMensaje, "No encontramos una cuenta con ese correo.", "red");
        return;
    }

    // Correo encontrado → muestra formulario de nueva contraseña
    correoRecuperacion = correo;
    mostrarMensaje(recuperarMensaje, `Cuenta encontrada: ${usuario.nombre}. Elige una nueva contraseña.`, "green");
    recuperarForm.style.display    = "none";
    nuevaPasswordForm.style.display = "block";
});

nuevaPasswordForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const nueva     = document.getElementById("nuevaPassword").value.trim();
    const confirmar = document.getElementById("confirmarPassword").value.trim();

    if (!nueva)            { mostrarMensaje(recuperarMensaje, "Ingresa una nueva contraseña.", "red"); return; }
    if (nueva.length < 6)  { mostrarMensaje(recuperarMensaje, "La contraseña debe tener al menos 6 caracteres.", "red"); return; }
    if (nueva !== confirmar) { mostrarMensaje(recuperarMensaje, "Las contraseñas no coinciden.", "red"); return; }

    // Actualiza en localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const index    = usuarios.findIndex(u => u.correo === correoRecuperacion);
    usuarios[index].password = nueva;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarMensaje(recuperarMensaje, " Contraseña actualizada. Ahora puedes iniciar sesión.", "green");
    nuevaPasswordForm.style.display = "none";

    // Vuelve al login después de 2 segundos
    setTimeout(() => {
        recuperarMensaje.textContent    = "";
        loginForm.style.display         = "block";
        btnOlvidePassword.style.display = "block";
    }, 2000);
});
