document.addEventListener("DOMContentLoaded", function(){

    console.log("FG Solutions - Sitio cargado correctamente");

});


// Animación simple al desplazarse

const elementos = document.querySelectorAll(".card");


window.addEventListener("scroll",()=>{

    elementos.forEach(elemento=>{

        let posicion = elemento.getBoundingClientRect().top;

        let pantalla = window.innerHeight;

        if(posicion < pantalla - 80){

            elemento.style.opacity="1";
            elemento.style.transform="translateY(0)";

        }

    });

});
