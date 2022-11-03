
// Constructores
function Dispositivo (marca, year, garantia) {
    this.marca = marca;
    this.year = year;
    this.garantia = garantia;
}

// Realiza la cotizacion con los datos
Dispositivo.prototype.cotizarDispositivo = function () {
    /*
        1 = IPhone 1.35
        2 = Samsung 1.15
        3 = Xiamoi 1.05
    */

    let cantidad;
    const base = 20000;

    switch(this.marca) {
        case '1':
            cantidad = base * 1.35;
            break;
        case '2':
            cantidad = base * 1.15;
            break;
        case '3':
            cantidad = base * 1.05;
            break;

        default:
            break;
    }

    // Leer el año
    const diferencia = new Date().getFullYear() - this.year;

    // Cada año el costo se reduce 3%
    cantidad -= ((diferencia * 9) * cantidad) / 100; 

    // Si hay garantía, aumenta 20%
    if(this.garantia === 'con-garantia') {
        cantidad *= 1.20;
    } 
    return cantidad;
}

function UI() {}

UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
        min = max - 7;
    
        const selectYear = document.querySelector('#year');

        for(let i = max; i > min; i--) {
            let option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            selectYear.appendChild(option);
        }
}

UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('DIV');
    if ( tipo === 'error') {
        div.classList.add('mensaje', 'error');
    } else {
        div.classList.add('mensaje', 'correcto');
    }
    div.textContent = mensaje;

    const formulario = document.querySelector('#cotizar-dispositivo');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (total, dispositivo) => {
    const { marca, year, garantia } = dispositivo;

    let textoMarca;
    let textoGarantia;

    switch(marca) {
        case '1':
            textoMarca = 'iPhone';
            break;
        case '2':
            textoMarca = 'Samsung';
            break;
        case '3':
            textoMarca = 'Xiaomi';
            break;
        default:
            break;
    }

    switch(garantia) {
        case 'con-garantia':
            textoGarantia = 'Con garantía'
            break;
        case 'sin-garantia':
            textoGarantia = 'Sin garantía'
            break;
        default:
            break;
    }
    
    // Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mensaje');
    div.innerHTML = `
    <p class="resumen">Tu Resumen</p>
    <p class="total">Marca: ${textoMarca}</p>
    <p class="total">Año: ${year}</p>
    <p class="total">Total: $${total}</p>
    <p class="total">${textoGarantia}</p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    

    // Mostrar el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 3000);
}

// instanciar UI
const ui = new UI();


document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();
})

eventListeners();

function eventListeners() {
    const formulario = document.querySelector('#cotizar-dispositivo');
    formulario.addEventListener('submit', cotizarDispositivo);
}

function cotizarDispositivo(e) {
    e.preventDefault();

    // Leer la marca 
    const marca = document.querySelector('#marca').value;
    // Leer el año
    const year = document.querySelector('#year').value;
    // Leer la garantía
    const garantia = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === '' || year === '' || garantia === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
    } else {
        ui.mostrarMensaje('Cotizando dispositivo...', 'exito');
    }

    // Ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    if (resultados != null) {
        resultados.remove();
    }

    // Instanciar el dispositivo
    const dispositivo = new Dispositivo(marca, year, garantia);
    const total = dispositivo.cotizarDispositivo();

    // Utilizar el prototype que cotiza
    ui.mostrarResultado(total, dispositivo);
}