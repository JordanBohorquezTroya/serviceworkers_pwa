let mostar = document.getElementById("infoMostrar");
let caracteristicas = document.getElementById("caracteristicas");

mostar.addEventListener("click", function() {
    caracteristicas.innerHTML = `
        <ul>
            <li>Conocimientos en HTML, CSS, JavaScript y MySQL</li>
            <li>Experiencia en diseño responsivo</li>
            <li>Interés en nuevas tecnologías como PWA </li>
            <li>Capacidad para trabajar en equipo y resolver problemas</li>
        </ul>
        <button id="infoCerrar">Cerrar</button>
    `;
    mostar.style.display = "none";
    
    cerrar();
});

function cerrar() {
    
    let cerrar = document.getElementById("infoCerrar");
    
    cerrar.addEventListener("click", function() {
       
        mostar.style.display = "block";
        caracteristicas.innerHTML = ''; 
    });
}
