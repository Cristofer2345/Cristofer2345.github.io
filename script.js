let score = 0;
const scoreDisplay = document.getElementById("score");
const items = document.querySelectorAll(".item");
const dropzones = document.querySelectorAll(".dropzone");
const svg = document.getElementById("svg-lines");
const container = document.querySelector(".game-area");
let selectedItem = null;
let connections = [];
const correctVideos = ["videos/correcto1.mp4","videos/coeecto4.mp4", "videos/correcto2.mp4", "videos/correcto3.mp4", "videos/correcto5.mp4", "videos/correcto6.mp4"];
const incorrectVideos = ["videos/incorrecto1.mp4", "videos/incorrecto2.mp4", "videos/incorrecto3.mp4", "videos/incorrecto4.mp4"];

items.forEach(item => {
    item.addEventListener("click", () => {
        if (selectedItem) {
            selectedItem.classList.remove("selected");
        }
        selectedItem = item;
        item.classList.add("selected");
    });
});

dropzones.forEach(dropzone => {
    dropzone.addEventListener("click", () => {
        if (selectedItem) {
            if (selectedItem.getAttribute("data-value") === dropzone.getAttribute("data-value")) {
                drawLine(selectedItem, dropzone);
                score += 5;
                
                showVideo(true);
                Init();
            } else {
                score -= 1;
                showVideo(false);
            }
            scoreDisplay.textContent = score;
            selectedItem.classList.remove("selected");
            selectedItem = null;
        }
    });
});

function drawLine(startElement, endElement) {
    const containerRect = container.getBoundingClientRect();
    const startRect = startElement.getBoundingClientRect();
    const endRect = endElement.getBoundingClientRect();
    
    const x1 = startRect.right - containerRect.left;
    const y1 = startRect.top + startRect.height / 2 - containerRect.top;
    const x2 = endRect.left - containerRect.left;
    const y2 = endRect.top + endRect.height / 2 - containerRect.top;
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "orange");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
    connections.push(line);
}


function showVideo(isCorrect) {
    const videoList = isCorrect ? correctVideos : incorrectVideos;
    const randomIndex = Math.floor(Math.random() * videoList.length);
    const videoSrc = videoList[randomIndex];
    const imageSrc = "videos/imagespika.jpg";
    
    const modal = document.createElement("div");
    modal.classList.add("video-modal");
    modal.innerHTML = `
        <div class="video-box">
            <video controls autoplay id="modalVideo">
                <source src="${videoSrc}" type="video/mp4">
                Tu navegador no soporta el video.
            </video>
            <img id="endImage" src="${imageSrc}" alt="Imagen final" style="display: none; width: 100%;">
            <button class="close-btn" onclick="closeModal(this,${isCorrect})">Cerrar</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Capturar el video y la imagen
    const video = modal.querySelector("#modalVideo");
    const image = modal.querySelector("#endImage");

    // Cuando el video termine, ocultarlo y mostrar la imagen
    video.addEventListener("ended", function() {
        video.style.display = "none"; // Oculta el video
        image.style.display = "block"; // Muestra la imagen
    });
}

function closeModal(button,isCorrect) {
    const modal = button.closest(".video-modal");
    if (modal) {
        modal.remove();
    }
    if(isCorrect){
        resetGame(); 
    }
    }
    
function resetGame() {
    // Restablecer los puntos, velocidad, y estado de los elementos
    score = 0;
    scoreDisplay.textContent = score;
    
    gameVel = 1; // Velocidad inicial del juego
    contenedor.classList.remove("mediodia", "tarde", "noche");
    suelo.style.animationDuration = "3s";
    
    // Limpiar las nubes y los obstáculos
    nubes.forEach(nube => nube.remove());
    obstaculos.forEach(obstaculo => obstaculo.remove());
    nubes = [];
    obstaculos = [];
    
    // Reiniciar el dinosaurio
    dinoPosX = 42;
    dinoPosY = sueloY;
    velY = 0;
    saltando = false;
    parado = false;
    dino.classList.remove("dino-estrellado");
    dino.classList.add("dino-corriendo");

    // Reiniciar el suelo
    sueloX = 0;
}

// CSS para ajustar el modal dentro del juego
const style = document.createElement("style");
style.innerHTML = `
.video-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    z-index: 1000;
}
.video-box {
    background: white;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
video {
    width: 300px;
    height: 200px;
}
.close-btn {
    margin-top: 10px;
    padding: 5px 10px;
    background: red;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}
.close-btn:hover {
    background: darkred;
}
`;
document.head.appendChild(style);
  //Juego de Dinosaurs
  var time = new Date();
var deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else{
    document.addEventListener("DOMContentLoaded", Init); 
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var dinoPosX = 42;
var dinoPosY = sueloY; 

var sueloX = 0;
var velEscenario = 1280/3;
var gameVel = 1;
var puntos = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var contenedor;
var dino;
var textoScore;
var suelo;
var gameOver;

function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);
}

function Update() {
    if(parado) return;
    
    MoverDinosaurio();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearNubes();
    MoverObstaculos();
    MoverNubes();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev){
    if(ev.keyCode == 32){
        Saltar();
    }
}

function Saltar(){
    if(dinoPosY === sueloY){
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo");
    }
}

function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;
    if(dinoPosY < sueloY){
        
        TocarSuelo();
    }
    dino.style.bottom = dinoPosY+"px";
}

function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if(saltando){
        dino.classList.add("dino-corriendo");
    }
    saltando = false;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
    dino.classList.remove("dino-corriendo");
    dino.classList.add("dino-estrellado");
    parado = true;
}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if(tiempoHastaNube <= 0) {
        CrearNube();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");
    if(Math.random() > 0.5) obstaculo.classList.add("cactus2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel;
}

function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth+"px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px";
    
    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel;
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if(nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        }else{
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX+"px";
        }
    }
}

function GanarPuntos() {
    puntos++;
    textoScore.innerText = puntos;
    if(puntos == 5){
        gameVel = 1.5;
        contenedor.classList.add("mediodia");
    }else if(puntos == 10) {
        gameVel = 2;
        contenedor.classList.add("tarde");
    } else if(puntos== 20) {
        gameVel = 3;
        contenedor.classList.add("noche");
    }
    suelo.style.animationDuration = (3/gameVel)+"s";
}

function GameOver() {
    Estrellarse();
    alert("Resulve esta integral para seguir jugando ");
    gameOver.style.display = "block";
}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if(obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        }else{
            if(IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}