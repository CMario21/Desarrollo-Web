  const formulario = document.getElementById("FormularioContacto");
  const modal = new bootstrap.Modal(document.getElementById("confirmacionModal"));

  formulario.addEventListener("submit", function(event) {
    event.preventDefault(); // No recarga pagina
    let esValido = true;

    // Campos del formulario
    const nombre = document.getElementById("nombre");
    const fecha = document.getElementById("fecha");
    const correo = document.getElementById("correo");
    const mensaje = document.getElementById("mensaje");

    // Validar nombre (mínimo 2 palabras, sin números)
    const regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ]+\s+[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    if (nombre.value.trim() === "" || !regexNombre.test(nombre.value.trim())) {
      nombre.classList.add("is-invalid");
      esValido = false;
    } else {
      nombre.classList.remove("is-invalid");
      nombre.classList.add("is-valid");
    }

    // Validar fecha (que no esté vacía)
    if (fecha.value.trim() === "") {
      fecha.classList.add("is-invalid");
      esValido = false;
    } else {
      fecha.classList.remove("is-invalid");
      fecha.classList.add("is-valid");
    }

    // Validar correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo.value.trim() === "" || !regexCorreo.test(correo.value.trim())) {
      correo.classList.add("is-invalid");
      esValido = false;
    } else {
      correo.classList.remove("is-invalid");
      correo.classList.add("is-valid");
    }

    // Validar mensaje (mínimo 10 caracteres)
    if (mensaje.value.trim().length < 10) {
      mensaje.classList.add("is-invalid");
      esValido = false;
    } else {
      mensaje.classList.remove("is-invalid");
      mensaje.classList.add("is-valid");
    }

    // Si todo es válido → mostrar modal
    if (esValido) {
      console.log("Nombre: ", nombre.value);
      console.log("Fecha: ", fecha.value);
      console.log("Correo: ", correo.value);
      console.log("Mensaje: ", mensaje.value);

      modal.show();
      formulario.reset(); // Limpia el formulario
      // Quitar clases de validación para no dejar "verde"
      document.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));
    }
  });


