let service = document.querySelectorAll("#service");
let title = document.querySelector("#titulo");
let About = document.querySelector("#About");
let header = document.querySelector('#header');
let portfolio = document.querySelector('#Portfolio');
let contact = document.querySelector('#Contact');
let navs = document.querySelectorAll('.navbar a');

var alturaScroll = header.offsetTop;
var alturaAbout = About.offsetTop;
var alturaTitle = title.offsetTop;
var alturaPortfolio = portfolio.offsetTop;
var alturaContact = contact.offsetTop;

function reestablecerScroll(){
    alturaScroll = header.offsetTop;
    alturaAbout = About.offsetTop;
    alturaTitle = title.offsetTop;
    alturaPortfolio = portfolio.offsetTop;
    alturaContact = contact.offsetTop;
}

function mostrarServicios(){
    let scrollTop = document.documentElement.scrollTop;

    if (alturaTitle - 500 < scrollTop){
        title.style.opacity = 1;
        title.classList.add("mostrarAnimado");
    }

    for (var i=0; i < service.length; i++){
        let alturaService = service[i].offsetTop;
        if (alturaService - 570 < scrollTop){
            service[i].style.opacity = 1;
            service[i].classList.add("mostrarAnimado");
        }
    }
}

function mostrarAbout(){
    let scrollTop = document.documentElement.scrollTop;    
    if (alturaAbout - 400 < scrollTop){
        About.style.opacity = 1;
        About.classList.add("mostrarAnimado");
    }
}

function cambiarNav(){
    let scrollTop = document.documentElement.scrollTop;
    
    if (alturaScroll + 400 < scrollTop){
        header.style.background = 'black';
    }
    else{
        header.style.background = 'linear-gradient( to bottom, #0e0c1fa1, #ffffff00)';
        activer(0)
    }
}

function activer(x){
    navs[0].classList.remove('active');
    navs[1].classList.remove('active');
    navs[2].classList.remove('active');
    navs[3].classList.remove('active');
    navs[4].classList.remove('active');
    navs[x].classList.add('active');
}

let aboutBottom = document.querySelector("#about-bottom");
let portfolioBottom = document.querySelector("#portfolio-bottom");

let observer = new IntersectionObserver(verificarVisibilidad, {});
let observer2 = new IntersectionObserver(verificarVisibilidad2, {});

observer.observe(aboutBottom)
observer2.observe(portfolioBottom)

var scrollTop = 0;

function scroller(){
    let scroll = document.documentElement.scrollTop; 
    scrollTop = scroll;
}

function verificarVisibilidad(e){
    if (e[0].isIntersecting){
        activer(1)
    }
    else if (!e[0].isIntersecting && scrollTop>alturaAbout){
        activer(2)
    }
}

function verificarVisibilidad2(e){
    var a = scrollTop-alturaPortfolio;
    var b = alturaContact-scrollTop;

    if (e[0].isIntersecting && scrollTop>1){
        activer(3)
    }
    
    else if(!e[0].isIntersecting && scrollTop<alturaPortfolio && scrollTop>alturaTitle && scrollTop<alturaContact){
        activer(2)
    }

    else if(!e[0].isIntersecting && scrollTop>alturaPortfolio && scrollTop<alturaContact){
        activer(4)
    }
}


window.addEventListener('scroll', mostrarAbout);
window.addEventListener('scroll', mostrarServicios);
window.addEventListener('scroll', cambiarNav);
window.addEventListener('scroll', scroller);
window.addEventListener('scroll', reestablecerScroll);
