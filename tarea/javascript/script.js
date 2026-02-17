let campers = [];
let rutas = ['NodeJS', 'Java', 'NetCore'];

// Navegación
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'coordinacion') renderInscritos();
}

// Registro de Campers
document.getElementById('form-camper').addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevoCamper = {
        id: document.getElementById('id').value,
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        estado: 'Inscrito',
        riesgo: 'Bajo',
        notas: { inicialTeorica: 0, inicialPractica: 0 }
    };
    campers.push(nuevoCamper);
    alert('Camper registrado exitosamente');
    e.target.reset();
});

// Renderizar campers para que el coordinador les ponga nota
function renderInscritos() {
    const contenedor = document.getElementById('lista-inscritos');
    contenedor.innerHTML = '';
    
    const inscritos = campers.filter(c => c.estado === 'Inscrito');
    
    inscritos.forEach(c => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div>
                <strong>${c.nombres} ${c.apellidos}</strong> - ID: ${c.id}
            </div>
            <div>
                <input type="number" placeholder="Teórica" id="t-${c.id}">
                <input type="number" placeholder="Práctica" id="p-${c.id}">
                <button onclick="evaluarIngreso('${c.id}')">Evaluar</button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

// Lógica de aprobación inicial (Coordinador)
function evaluarIngreso(id) {
    const notaT = parseFloat(document.getElementById(`t-${id}`).value);
    const notaP = parseFloat(document.getElementById(`p-${id}`).value);
    const promedio = (notaT + notaP) / 2;

    const index = campers.findIndex(c => c.id === id);
    if (promedio >= 60) {
        campers[index].estado = 'Aprobado';
        alert(`${campers[index].nombres} ha aprobado y puede ser asignado a una ruta.`);
    } else {
        campers[index].estado = 'Reprobado'; // O se mantiene en proceso
        alert('No alcanzó el puntaje mínimo (60).');
    }
    renderInscritos();
}

// Reportes
function reporteInscritos() {
    const lista = campers.filter(c => c.estado === 'Inscrito');
    mostrarReporte('Campers Inscritos', lista);
}

function reporteAprobados() {
    const lista = campers.filter(c => c.estado === 'Aprobado');
    mostrarReporte('Campers que Aprobaron Examen Inicial', lista);
}

function mostrarReporte(titulo, data) {
    const display = document.getElementById('display-reporte');
    let html = `<h3>${titulo}</h3><ul>`;
    data.forEach(c => {
        html += `<li>${c.nombres} ${c.apellidos} - Estado: ${c.estado}</li>`;
    });
    html += `</ul>`;
    display.innerHTML = html;
} 