
//Constructores - prototypes
function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}


//Realizar la cotizacion de los datos, creando un prototype para Seguro
Seguro.prototype.cotizarSeguro = function() {
    /* 1 = americano 1.15
       2 = asiatico 1.05
       3 = europeo 1.35 */ 

    let cantidad;
    const base = 4000;

    switch(this.marca){
        case '1':
            cantidad = base * 1.15
            break;
        case '2':
            cantidad = base * 1.05
            break;
        case '3':
            cantidad = base * 1.35
            break;
        default:
            break;
    }   

    //Cada año q es mas viejo el auto el seguro es mas barato un 3% menos por cada año
    const diferencia = new Date().getFullYear() - this.year;
    cantidad -= ((diferencia * 3) * cantidad ) / 100;


    //Si el seguro es basico se multiplica por 30% si es completo por 50% mas
    if(this.tipo === 'terceros') {
        cantidad *= 1.30;
    } else{
        cantidad *= 1.50;
    }
    return cantidad;

}







function UI() {}

//LLena las opciones de los años en la interfaz del año actual a 20 años menos en forma de opciones
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20
    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;

        selectYear.appendChild(option)
    }
}


//Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');
    
    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    //insertar en el html
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));
    setTimeout(()=>{
        div.remove()
    },2000);

}



UI.prototype.mostrarResultado = (total, seguro) => {
    const {marca, year, tipo} = seguro;
    let textoMarca;

    switch(marca) {
        case '1':
            textoMarca = 'Ford'
            break;
        case '2':
            textoMarca = 'Chevrolet'
            break;
        case '3':
            textoMarca = 'Fiat'
            break;    

        default:
            break;
    }


    //creo el resultado
    const div = document.createElement('div');
    div.classList.add('my-10');

    div.innerHTML= `
    <p class="header">Tu Resumen</p>
    <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca}</span></p>
    <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
    <p class="font-bold">Tipo de seguro: <span class="font-normal"> ${tipo}</span></p>
    <p class="font-bold">Total: <span class="font-normal"> $${total}</span></p>
    `;
    
    //Mostrar el spinner
    const resultadoDiv = document.getElementById("resultado");
    const spinner = document.getElementById("cargando");

    spinner.style.display = 'block';
    setTimeout(()=>{
        spinner.style.display = 'none'; //se desaparece el spinner y se inserta el div
        resultadoDiv.appendChild(div)
    },2000);
}


//instanciar UI
const ui = new UI();



//ADD EVENT
document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();//llena el selct con los años
})



eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();
    //leer la marca seleccionada
    const marca = document.getElementById('marca').value;
    //leer el año seleccionado
    const year = document.getElementById('year').value;
    //leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === "" || year === "" || tipo === ""){
        ui.mostrarMensaje("Todos los campos son obligatorios",'error')
        return;
    }

    ui.mostrarMensaje("Cotizando...",'exito')

    //ocultar las cotizaciones que aparecieron antes
    const resultados = document.querySelector('#resultado div')
    if(resultados != null){
        resultados.remove()
    }

    //instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();


    //utilizar el prototype que va a cotizar
    ui.mostrarResultado(total, seguro)
}