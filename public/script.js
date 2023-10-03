// Seleccionar elementos del DOM
const service = document.querySelectorAll("#service");
const title = document.querySelector("#titulo");
const About = document.querySelector("#About");
const header = document.querySelector('#header');
const body = document.querySelector('body');
const main = document.querySelector('main');
const portfolio = document.querySelector('#Portfolio');
const contact = document.querySelector('#Contact');
const navs = document.querySelectorAll('.navbar a');
const boton = document.getElementById('box-menu');
const navbar2 = document.getElementById('navbar');

// Función para alternar la visibilidad de la barra de navegación
let isNavVisible = false;

function toggleNav() {
    if (!isNavVisible) {
        navbar2.classList.add('show-nav');
    } else {
        navbar2.classList.remove('show-nav');
    }
    isNavVisible = !isNavVisible;
}

boton.addEventListener('click', toggleNav);

function hideNav() {
    if (isNavVisible) {
        toggleNav();
    }
}

main.addEventListener('click', hideNav);

// Variables para las alturas
let alturaScroll, alturaAbout, alturaTitle, alturaPortfolio, alturaContact;

function resetScrollHeights() {
    alturaScroll = header.offsetTop;
    alturaAbout = About.offsetTop;
    alturaTitle = title.offsetTop;
    alturaPortfolio = portfolio.offsetTop;
    alturaContact = contact.offsetTop;
}

resetScrollHeights();

// Función para mostrar servicios con animación
function animateServices() {
    const scrollTop = document.documentElement.scrollTop;

    if (alturaTitle - 500 < scrollTop) {
        title.style.opacity = 1;
        title.classList.add("mostrarAnimado");
    }

    service.forEach((item) => {
        const alturaService = item.offsetTop;
        if (alturaService - 570 < scrollTop) {
            item.style.opacity = 1;
            item.classList.add("mostrarAnimado");
        }
    });
}

// Función para mostrar la sección "About" con animación
function animateAbout() {
    const scrollTop = document.documentElement.scrollTop;
    if (alturaAbout - 400 < scrollTop) {
        About.style.opacity = 1;
        About.classList.add("mostrarAnimado");
    }
}

// Función para cambiar el estilo de la barra de navegación
function changeNavStyle() {
    const scrollTop = document.documentElement.scrollTop;
    if (alturaScroll + 300 < scrollTop) {
        header.style.background = 'black';
    } else {
        header.style.background = 'linear-gradient( to bottom, #0e0c1fa1, #ffffff00)';
        activateNav(0);
    }
}

// Función para activar la clase "active" en los elementos de navegación
function activateNav(index) {
    navs.forEach((nav) => {
        nav.classList.remove('active');
    });
    navs[index].classList.add('active');
}

// Observadores de intersección
const aboutBottom = document.querySelector("#about-bottom");
const portfolioBottom = document.querySelector("#portfolio-bottom");

const observer = new IntersectionObserver(checkVisibility, {});
const observer2 = new IntersectionObserver(checkVisibility2, {});

observer.observe(aboutBottom);
observer2.observe(portfolioBottom);

let scrollTop = 0;

function updateScrollTop() {
    scrollTop = document.documentElement.scrollTop;
}

function checkVisibility(entries) {
    if (entries[0].isIntersecting) {
        activateNav(1);
    } else if (!entries[0].isIntersecting && scrollTop > alturaAbout) {
        activateNav(2);
    }
}

function checkVisibility2(entries) {
    const a = scrollTop - alturaPortfolio;
    const b = alturaContact - scrollTop;

    if (entries[0].isIntersecting && scrollTop > 1) {
        activateNav(3);
    } else if (!entries[0].isIntersecting && scrollTop < alturaPortfolio && scrollTop > alturaTitle && scrollTop < alturaContact) {
        activateNav(2);
    } else if (!entries[0].isIntersecting && scrollTop > alturaPortfolio && scrollTop < alturaContact) {
        activateNav(4);
    }
}

// Event listeners
window.addEventListener('scroll', animateAbout);
window.addEventListener('scroll', animateServices);
window.addEventListener('scroll', changeNavStyle);
window.addEventListener('scroll', updateScrollTop);
window.addEventListener('scroll', resetScrollHeights);
window.onload = function () {
    body.classList.add('mostrar');
};