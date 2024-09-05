// Inicializar arreglo de estudiantes o cargarlo desde localStorage con conversión a JSON si es necesario
let estudiantes;

try {
    // Intenta parsear los estudiantes como JSON
    estudiantes = JSON.parse(localStorage.getItem('estudiantes'));
    if (!Array.isArray(estudiantes)) {
        // Si no es un arreglo (es nulo, un objeto, etc.), reinicia a un arreglo vacío
        estudiantes = [];
    }
} catch (e) {
    // Si ocurre un error en el parseo, significa que el formato no es JSON válido
    estudiantes = [];
    let datosAntiguos = localStorage.getItem('estudiantes');
    if (datosAntiguos) {
        // Intentamos migrar los datos antiguos al formato JSON
        estudiantes = datosAntiguos.split(',').map(est => {
            let [nombre, grupo] = est.split(':');
            return { nombre, grupo, notas: [] };
        });
        guardarEstudiantes(); // Guardamos el nuevo formato en localStorage
    }
}

// Función para guardar los estudiantes en localStorage
function guardarEstudiantes() {
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
}

// Agregar estudiante
document.getElementById('formAgregarEstudiante')?.addEventListener('submit', function (event) {
    event.preventDefault();
    let nombre = document.getElementById('nombre').value;
    let grupo = document.getElementById('grupo').value;
    estudiantes.push({ nombre: nombre, grupo: grupo, notas: [] });
    guardarEstudiantes();
    document.getElementById('resultadoAgregar').textContent = `Estudiante ${nombre} agregado al grupo ${grupo}.`; // Mostrar resultado en el HTML
    this.reset();
});

// Buscar estudiante
document.getElementById('formBuscarEstudiante')?.addEventListener('submit', function (event) {
    event.preventDefault();
    let nombreBuscar = document.getElementById('nombreBuscar').value;
    let estudiante = estudiantes.find(est => est.nombre === nombreBuscar);
    let resultadoBusqueda = document.getElementById('resultadoBusqueda');
    if (estudiante) {
        resultadoBusqueda.textContent = `Estudiante: ${estudiante.nombre}, Grupo: ${estudiante.grupo}, Notas: ${estudiante.notas.join(', ')}`;
    } else {
        resultadoBusqueda.textContent = 'Estudiante no encontrado';
    }
});

// Cambiar grupo de un estudiante
document.getElementById('formCambiarGrupo')?.addEventListener('submit', function (event) {
    event.preventDefault();
    let nombreCambiar = document.getElementById('nombreCambiar').value;
    let nuevoGrupo = document.getElementById('nuevoGrupo').value;
    let estudiante = estudiantes.find(est => est.nombre === nombreCambiar);
    if (estudiante) {
        estudiante.grupo = nuevoGrupo;
        guardarEstudiantes();
        document.getElementById('resultadoCambiarGrupo').textContent = `Grupo de ${nombreCambiar} cambiado a ${nuevoGrupo}.`; // Mostrar resultado en el HTML
    } else {
        document.getElementById('resultadoCambiarGrupo').textContent = 'Estudiante no encontrado';
    }
    this.reset();
});

// Agregar nota a un estudiante
document.getElementById('formAgregarNota')?.addEventListener('submit', function (event) {
    event.preventDefault();
    let nombreNota = document.getElementById('nombreNota').value;
    let nota = parseFloat(document.getElementById('nota').value);
    let estudiante = estudiantes.find(est => est.nombre === nombreNota);
    if (estudiante) {
        estudiante.notas.push(nota);
        guardarEstudiantes();
        document.getElementById('resultadoAgregarNota').textContent = `Nota ${nota} agregada a ${nombreNota}.`; // Mostrar resultado en el HTML
        mostrarNotas(nombreNota);
    } else {
        document.getElementById('resultadoAgregarNota').textContent = 'Estudiante no encontrado';
    }
    this.reset();
});

// Mostrar notas en el HTML
function mostrarNotas(nombre) {
    let estudiante = estudiantes.find(est => est.nombre === nombre);
    if (estudiante) {
        document.getElementById('resultadoBusqueda').textContent = `Estudiante: ${estudiante.nombre}, Notas: ${estudiante.notas.join(', ')}`;
    }
}

// Calcular promedio de un estudiante
document.getElementById('formPromedioEstudiante')?.addEventListener('submit', function (event) {
    event.preventDefault();
    let nombrePromedio = document.getElementById('nombrePromedio').value;
    let estudiante = estudiantes.find(est => est.nombre === nombrePromedio);
    if (estudiante && estudiante.notas.length > 0) {
        let promedio = estudiante.notas.reduce((a, b) => a + b, 0) / estudiante.notas.length;
        document.getElementById('resultadoPromedio').textContent = `El promedio de ${nombrePromedio} es ${promedio.toFixed(2)}.`; // Mostrar resultado en el HTML
    } else {
        document.getElementById('resultadoPromedio').textContent = 'Estudiante no encontrado o sin notas.';
    }
    this.reset();
});
