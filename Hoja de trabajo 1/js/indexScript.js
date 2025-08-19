// Agrupamos las tablas y botones
let tablas = {
  boton1: document.querySelector(".tabla1"),
  boton2: document.querySelector(".tabla2"),
  boton3: document.querySelector(".tabla3"),
};

// Función para mostrar/ocultar tabla
function toggleTabla(tablaActiva) {
  Object.values(tablas).forEach(tabla => {
    if (tabla === tablaActiva) {
      tabla.style.display = (tabla.style.display === "block") ? "none" : "block";
    } else {
      tabla.style.display = "none";
    }
  });
}

// Listeners
document.getElementById("boton1").addEventListener("click", () => toggleTabla(tablas.boton1));
document.getElementById("boton2").addEventListener("click", () => toggleTabla(tablas.boton2));
document.getElementById("boton3").addEventListener("click", () => toggleTabla(tablas.boton3));

/* Comentarios */
  //Arreglo de nombres
  const nombres = [
    "Ana", "Carlos", "María", "Luis", "Sofía",
    "Pedro", "Lucía", "Diego", "Valeria", "Javier"
  ];

  // Arreglo de comentarios
  const comentarios = [
    "Las montañas rusas son increíbles, nunca había sentido tanta adrenalina.",
    "El show de luces nocturno fue espectacular, vale mucho la pena quedarse hasta el final.",
    "Los juegos mecánicos para niños son seguros y muy divertidos.",
    "El parque es enorme, recomiendo llevar zapatos cómodos.",
    "La comida dentro del parque es variada y deliciosa.",
    "El personal fue muy amable y siempre dispuesto a ayudar.",
    "La rueda de la fortuna tiene una vista espectacular de todo el parque.",
    "Las filas eran largas, pero la experiencia de los juegos lo compensó.",
    "La zona acuática fue mi favorita, perfecta para refrescarse en el calor.",
    "Definitivamente volvería, es un lugar mágico para toda la familia."
  ];

  // Función para mezclar un arreglo 
  function mezclar(array) {
    let copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function mostrarComentarios() {
    // Seleccionar 3 nombres y 3 comentarios aleatorios sin repetir
    const nombresAleatorios = mezclar(nombres).slice(0, 3);
    const comentariosAleatorios = mezclar(comentarios).slice(0, 3);

    // Contenedor donde se mostrarán
    const container = document.getElementById("comentariosContainer");

    // Generar cards
    for (let i = 0; i < 3; i++) {
        const card = `
        <div class="col-md-4">
            <div class="card h-100 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">${nombresAleatorios[i]}</h5>
                <p class="card-text">${comentariosAleatorios[i]}</p>
            </div>
            </div>
        </div>
        `;
        container.innerHTML += card;
    }
  }

mostrarComentarios();


