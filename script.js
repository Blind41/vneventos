// Selección de elementos del DOM
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const fadeElements = document.querySelectorAll('.fade-in');

// Elementos del reproductor de música
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const progressHandle = document.querySelector('.progress-handle');
const timeCurrent = document.querySelector('.time-current');
const timeTotal = document.querySelector('.time-total');
const volumeSlider = document.querySelector('.volume-slider');
const playlistContainer = document.querySelector('.playlist');
let playlistItems = [];
const currentTrackTitle = document.querySelector('.current-track-title');
const currentTrackArtist = document.querySelector('.current-track-artist');

// Elementos del sticky player
const stickyPlayer = document.getElementById('sticky-player');
const stickyPlayBtn = document.getElementById('sticky-play-btn');
const stickyPrevBtn = document.getElementById('sticky-prev-btn');
const stickyNextBtn = document.getElementById('sticky-next-btn');
const stickyProgressBar = document.querySelector('.sticky-progress-bar');
const stickyProgressFill = document.querySelector('.sticky-progress-fill');
const stickyProgressHandle = document.querySelector('.sticky-progress-handle');
const stickyTimeCurrent = document.querySelector('.sticky-time-current');
const stickyTimeTotal = document.querySelector('.sticky-time-total');
const stickyVolumeSlider = document.querySelector('.sticky-volume-slider');
const stickyTrackTitle = document.querySelector('.sticky-track-title');
const stickyTrackArtist = document.querySelector('.sticky-track-artist');

// Elementos de la sección de música desplegable
const togglePlaylistBtn = document.getElementById('toggle-playlist-btn');
const musicSection = document.getElementById('musica');

// Estado del reproductor
let currentTrackIndex = 0;
let isPlaying = false;
let isDragging = false;
let isStickyDragging = false;

// Variables para control de scroll en móvil
let lastScrollTop = 0;
let scrollTimeout;
const isMobile = window.innerWidth <= 768;

// Array de pistas (puedes reemplazar estos URLs con tus archivos de audio reales)
const tracks = [
    {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: 'Summer Vibes Mix',
        artist: 'DJ VN Events',
        duration: '6:12'
    },
    {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        title: 'Night Party Set',
        artist: 'DJ VN Events',
        duration: '7:05'
    },
    {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        title: 'Elegant Evening',
        artist: 'DJ VN Events',
        duration: '5:44'
    },
    {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        title: 'Corporate Ambience',
        artist: 'DJ VN Events',
        duration: '5:02'
    }
];

// Array de imágenes de la galería con sus relaciones de aspecto
// Puedes reemplazar con tus propias imágenes
const galleryImages = [
    'https://picsum.photos/800/800?random=1',
    'https://picsum.photos/800/400?random=2', // Landscape -> Span 2 cols
    'https://picsum.photos/400/800?random=3', // Portrait -> Span 2 rows
    'https://picsum.photos/800/600?random=4',
    'https://picsum.photos/800/800?random=5',
    'https://picsum.photos/800/400?random=6',
    'https://picsum.photos/800/1200?random=7', // Tall
    'https://picsum.photos/1200/800?random=8', // Wide
    'https://picsum.photos/800/800?random=9',
    'https://picsum.photos/800/400?random=10'
];

// Toggle del menú móvil
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = navToggle.querySelector('i');

    if (navMenu.classList.contains('active')) {
        icon.classList.remove('bx-menu');
        icon.classList.add('bx-x');
    } else {
        icon.classList.remove('bx-x');
        icon.classList.add('bx-menu');
    }
});

// Cerrar menú al hacer click en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.remove('bx-x');
        icon.classList.add('bx-menu');
    });
});

// Cambiar estilo del navbar al hacer scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    activateFadeIn();
    updateActiveLink();
    handleStickyPlayerScroll();
});

// Función para activar animaciones fade-in
function activateFadeIn() {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// Función para actualizar el enlace activo en la navegación
function updateActiveLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        // Añadir un offset para que se active antes (navbar fijo)
        if (window.pageYOffset >= sectionTop - 200 &&
            window.pageYOffset < sectionTop + sectionHeight - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        // IMPORTANTE: El href es "#inicio", no "inicio"
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animación de números en las estadísticas
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const suffix = stat.textContent.includes('+') ? '+' : '%';

        const updateNumber = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target + suffix;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(stat);
    });
}

// Efecto parallax sutil en el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');

    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 500);
    }
});

// CONTROL DEL STICKY PLAYER EN SCROLL (MÓVIL)
function handleStickyPlayerScroll() {
    if (window.innerWidth <= 768) {
        const st = window.pageYOffset || document.documentElement.scrollTop;

        if (st > lastScrollTop && st > 200) {
            // Scrolling hacia abajo - ocultar player
            stickyPlayer.classList.add('hidden');
        } else {
            // Scrolling hacia arriba - mostrar player
            stickyPlayer.classList.remove('hidden');
        }

        lastScrollTop = st <= 0 ? 0 : st;
    } else {
        // En desktop siempre visible
        stickyPlayer.classList.remove('hidden');
    }
}

// Detectar cambio de tamaño de ventana
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        stickyPlayer.classList.remove('hidden');
    }
});

// FUNCIONES DEL REPRODUCTOR DE MÚSICA

// GENERAR PLAYLIST DINÁMICA
function generatePlaylist() {
    playlistContainer.innerHTML = '';
    tracks.forEach((track, index) => {
        const item = document.createElement('div');
        // Usar clases existentes: playlist-item
        item.className = 'playlist-item';
        if (index === currentTrackIndex) item.classList.add('active');

        // Estructura HTML idéntica a la que había
        item.innerHTML = `
            <div class="track-info">
                <div class="track-icon">
                    <i class='bx bx-music'></i>
                </div>
                <div class="track-details">
                    <h4 class="track-title">${track.title}</h4>
                    <p class="track-artist">${track.artist}</p>
                </div>
            </div>
            <span class="track-duration">${track.duration}</span>
        `;

        // Agregar evento click
        item.addEventListener('click', () => {
            loadTrack(index);
            if (!isPlaying) {
                togglePlay();
            } else {
                audioPlayer.play();
            }
        });

        playlistContainer.appendChild(item);
    });

    // Actualizar referencia global
    playlistItems = document.querySelectorAll('.playlist-item');
}

// Cargar pista
function loadTrack(index) {
    currentTrackIndex = index;
    const track = tracks[index];

    audioPlayer.src = track.src;
    currentTrackTitle.textContent = track.title;
    currentTrackArtist.textContent = track.artist;

    // Actualizar sticky player
    stickyTrackTitle.textContent = track.title;
    stickyTrackArtist.textContent = track.artist;

    // Verificar si el título es muy largo y activar scroll
    checkTitleScroll();

    // Actualizar playlist activa
    playlistItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Función para verificar si el título necesita scroll
function checkTitleScroll() {
    const titleElement = stickyTrackTitle;
    const maxWidth = 200; // Ancho máximo definido en CSS

    // Crear elemento temporal para medir el ancho real del texto
    const tempElement = document.createElement('span');
    tempElement.style.visibility = 'hidden';
    tempElement.style.position = 'absolute';
    tempElement.style.whiteSpace = 'nowrap';
    tempElement.style.font = window.getComputedStyle(titleElement).font;
    tempElement.textContent = titleElement.textContent;
    document.body.appendChild(tempElement);

    const textWidth = tempElement.offsetWidth;
    document.body.removeChild(tempElement);

    // Si el texto es más ancho que el contenedor, activar scroll
    if (textWidth > maxWidth) {
        titleElement.classList.add('scrolling');
        // Crear elemento duplicado para efecto continuo
        if (!titleElement.querySelector('.scroll-duplicate')) {
            const duplicate = document.createElement('span');
            duplicate.className = 'scroll-duplicate';
            duplicate.textContent = ' • ' + titleElement.textContent;
            duplicate.style.paddingLeft = '20px';
            titleElement.appendChild(duplicate);
        }
    } else {
        titleElement.classList.remove('scrolling');
        const duplicate = titleElement.querySelector('.scroll-duplicate');
        if (duplicate) {
            duplicate.remove();
        }
    }
}

// Play/Pause
function togglePlay() {
    const visualizerBars = document.querySelectorAll('.bar');
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playBtn.querySelector('i').classList.remove('bx-pause');
        playBtn.querySelector('i').classList.add('bx-play');
        stickyPlayBtn.querySelector('i').classList.remove('bx-pause');
        stickyPlayBtn.querySelector('i').classList.add('bx-play');

        // Pausar visualizador
        visualizerBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
            bar.style.height = '10%'; // Resetear a altura mínima
        });
    } else {
        audioPlayer.play();
        isPlaying = true;
        playBtn.querySelector('i').classList.remove('bx-play');
        playBtn.querySelector('i').classList.add('bx-pause');
        stickyPlayBtn.querySelector('i').classList.remove('bx-play');
        stickyPlayBtn.querySelector('i').classList.add('bx-pause');

        // Activar visualizador
        visualizerBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
    }
}

// Siguiente pista
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

// Pista anterior
function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

// Formatear tiempo
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Actualizar progreso
function updateProgress() {
    if (!isDragging && audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = `${progress}%`;
        progressHandle.style.left = `${progress}%`;
        timeCurrent.textContent = formatTime(audioPlayer.currentTime);
    }

    if (!isStickyDragging && audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        stickyProgressFill.style.width = `${progress}%`;
        stickyProgressHandle.style.left = `${progress}%`;
        stickyTimeCurrent.textContent = formatTime(audioPlayer.currentTime);
    }
}

// Actualizar duración total
function updateDuration() {
    if (audioPlayer.duration) {
        timeTotal.textContent = formatTime(audioPlayer.duration);
        stickyTimeTotal.textContent = formatTime(audioPlayer.duration);
    }
}

// Click en la barra de progreso
function setProgress(e) {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

// Eventos del reproductor
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// Eventos del sticky player
stickyPlayBtn.addEventListener('click', togglePlay);
stickyNextBtn.addEventListener('click', nextTrack);
stickyPrevBtn.addEventListener('click', prevTrack);

audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('loadedmetadata', updateDuration);
audioPlayer.addEventListener('ended', nextTrack);

progressBar.addEventListener('click', setProgress);
stickyProgressBar.addEventListener('click', (e) => {
    const rect = stickyProgressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

// Drag en la barra de progreso
progressBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    setProgress(e);
});

stickyProgressBar.addEventListener('mousedown', (e) => {
    isStickyDragging = true;
    const rect = stickyProgressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        setProgress(e);
    }
    if (isStickyDragging) {
        const rect = stickyProgressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    isStickyDragging = false;
});

// Control de volumen
volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
    if (stickyVolumeSlider) {
        stickyVolumeSlider.value = e.target.value;
    }
});

if (stickyVolumeSlider) {
    stickyVolumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value / 100;
        volumeSlider.value = e.target.value;
    });
}

// Click en items de la playlist (Manejado en generatePlaylist)
// playlistItems.forEach((item, index) => { ... });

// Cargar primera pista al inicio
generatePlaylist();
loadTrack(0);

// Toggle sección de música
if (togglePlaylistBtn) {
    togglePlaylistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        musicSection.classList.toggle('active');
        togglePlaylistBtn.classList.toggle('active');
    });
}

// Cerrar al hacer click fuera
document.addEventListener('click', (e) => {
    if (musicSection.classList.contains('active') &&
        !musicSection.contains(e.target) &&
        !togglePlaylistBtn.contains(e.target)) {
        musicSection.classList.remove('active');
        togglePlaylistBtn.classList.remove('active');
    }
});

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && musicSection.classList.contains('active')) {
        musicSection.classList.remove('active');
        togglePlaylistBtn.classList.remove('active');
    }
});

// Validación y envío del formulario de contacto
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const mensaje = document.getElementById('mensaje').value;

        console.log('Formulario enviado:', { nombre, email, telefono, mensaje });

        showSuccessMessage();
        contactForm.reset();
    });
}

// Función para mostrar mensaje de éxito
function showSuccessMessage() {
    const button = contactForm.querySelector('.btn-primary');
    const originalText = button.innerHTML;

    button.innerHTML = '<i class="bx bx-check"></i> ¡Mensaje Enviado!';
    button.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';

    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 3000);
}

// Intersección observer para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            if (entry.target.classList.contains('service-card')) {
                const cards = document.querySelectorAll('.service-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

fadeElements.forEach(el => observer.observe(el));

// Inicializar animaciones al cargar la página
window.addEventListener('load', () => {
    activateFadeIn();
    animateNumbers();
    document.body.classList.add('loaded');
});

console.log('VN Eventos - Landing Page cargada correctamente ✨');
console.log('Reproductor de música inicializado 🎵');

// ===== GALERÍA CAROUSEL INFINITO CON GRID MASONRY =====

const galleryTrack = document.querySelector('.gallery-track');
const galleryNavLeft = document.querySelector('.gallery-nav-left');
const galleryNavRight = document.querySelector('.gallery-nav-right');
const galleryWrapper = document.querySelector('.gallery-wrapper');

// Lightbox
const galleryLightbox = document.getElementById('gallery-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

const columnWidth = 295; // 280 (item) + 15 (gap)
let allImages = [];

// Variables para el Infinite Scroll
let setWidth = 0;
let isScrolling = false;

// Función para determinar el span
function determineSpan(width, height) {
    const ratio = width / height;
    if (ratio > 1.5) return 'span-col-2';
    if (ratio < 0.7) return 'span-row-2';
    if (width > 2000 && height > 2000) return 'span-2x2';
    return '';
}

// Cargar metadatos
async function preloadImages() {
    return Promise.all(galleryImages.map(async (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve({ url, width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = () => resolve(null); // Ignorar errores
        });
    })).then(items => items.filter(item => item !== null));
}

// Crear un "Set" de galería (Grid Container)
function createGallerySet(items, setIndex) {
    const setContainer = document.createElement('div');
    setContainer.className = 'gallery-set';
    // setIndex solo para depuración si hiciera falta
    setContainer.dataset.set = setIndex;

    items.forEach((item, index) => {
        const div = document.createElement('div');
        const spanClass = determineSpan(item.width, item.height);
        div.className = `gallery-item ${spanClass}`;
        div.innerHTML = `
            <img src="${item.url}" class="gallery-image" alt="Evento">
            <div class="gallery-overlay"><i class="bx bx-plus"></i></div>
       `;
        div.addEventListener('click', () => openLightbox(index));
        setContainer.appendChild(div);
    });

    return setContainer;
}

// Inicializar galería
async function initGallery() {
    if (!galleryTrack) return;

    galleryTrack.innerHTML = '';
    const validItems = await preloadImages();
    if (validItems.length === 0) return;

    allImages = validItems.map(item => ({ src: item.url }));

    // Renderizar 3 Sets: [0: Clon Izq] [1: Centro/Principal] [2: Clon Der]
    // Esto asegura que siempre tengas contenido a ambos lados.
    for (let i = 0; i < 3; i++) {
        const setDiv = createGallerySet(validItems, i);
        galleryTrack.appendChild(setDiv);
    }

    // Configuración inicial del scroll
    // Esperamos 1 frame para que el layout se calcule
    requestAnimationFrame(() => {
        const sets = document.querySelectorAll('.gallery-set');
        if (sets.length > 0) {
            setWidth = sets[0].offsetWidth; // Ancho de un solo set (incluyendo gaps internos)
            // Agregamos un pequeño ajuste por el gap externo entre sets si existiera, 
            // pero como usamos padding en .gallery-set para el gap, offsetWidth debería ser correcto o casi.

            // Centrar scroll en el Set 1 (El del medio)
            galleryTrack.scrollLeft = setWidth;
        }
    });

    // Evento de Scroll Infinito
    galleryTrack.addEventListener('scroll', handleInfiniteScroll);
}

// Lógica de Scroll Infinito
function handleInfiniteScroll() {
    if (setWidth === 0) return;

    const currentScroll = galleryTrack.scrollLeft;

    // Si llegamos casi al final del Set 2 (entrando al Set 3)
    if (currentScroll >= setWidth * 2) {
        // Saltar atrás al inicio del Set 2
        galleryTrack.scrollLeft = currentScroll - setWidth;
    }
    // Si llegamos al principio del Set 1 (entrando al Set 0)
    else if (currentScroll <= 0) {
        // Saltar adelante al final del Set 1
        galleryTrack.scrollLeft = currentScroll + setWidth;
    }
}

// Custom Cubic Bezier easing for smoother scroll
function smoothScrollTo(element, target, duration) {
    const start = element.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animateScroll(currentTime) {
        const timeElapsed = currentTime - startTime;
        if (timeElapsed < duration) {
            const progress = easeOutCubic(timeElapsed / duration);
            element.scrollLeft = start + change * progress;
            requestAnimationFrame(animateScroll);
        } else {
            element.scrollLeft = target;
        }
    }

    requestAnimationFrame(animateScroll);
}

// Navegación Manual (Botones) con animación custom
function galleryPrev() {
    const target = galleryTrack.scrollLeft - columnWidth;
    smoothScrollTo(galleryTrack, target, 400); // 400ms duration
}

function galleryNext() {
    const target = galleryTrack.scrollLeft + columnWidth;
    smoothScrollTo(galleryTrack, target, 400);
}

if (galleryNavLeft) galleryNavLeft.addEventListener('click', galleryPrev);
if (galleryNavRight) galleryNavRight.addEventListener('click', galleryNext);

// Drag Logic (Mouse)
let isDown = false;
let startX;
let scrollLeft;
let isGalleryDragging = false; // Flag para diferenciar click de drag

galleryTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    isGalleryDragging = false; // Reset
    galleryTrack.classList.add('active');
    startX = e.pageX - galleryTrack.offsetLeft;
    scrollLeft = galleryTrack.scrollLeft;
});

galleryTrack.addEventListener('mouseleave', () => {
    isDown = false;
    galleryTrack.classList.remove('active');
});

galleryTrack.addEventListener('mouseup', () => {
    isDown = false;
    galleryTrack.classList.remove('active');
    // Para suavizar el 'corte', el navegador ya tiene inercia si no prevenimos el default en todo momento.
    // Aquí solo manejamos el drag manual.
});

galleryTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - galleryTrack.offsetLeft;
    const walk = (x - startX) * 2;

    // Si se mueve más de 5px, lo consideramos drag
    if (Math.abs(walk) > 5) {
        isGalleryDragging = true;
    }

    galleryTrack.scrollLeft = scrollLeft - walk;
});

// Touch Logic
let touchStartX = 0;
let touchScrollLeft = 0;

galleryTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchScrollLeft = galleryTrack.scrollLeft;
    isGalleryDragging = false;
});

galleryTrack.addEventListener('touchmove', (e) => {
    const touchX = e.changedTouches[0].screenX;
    const walk = (touchStartX - touchX) * 2;
    if (Math.abs(walk) > 5) isGalleryDragging = true;
    galleryTrack.scrollLeft = touchScrollLeft + walk;
});

// === LIGHTBOX UPDATED ===
function openLightbox(index) {
    if (isGalleryDragging) return;

    currentLightboxIndex = index;
    // Reset classes
    lightboxImage.className = 'lightbox-image';
    lightboxImage.src = allImages[index].src;

    galleryLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    galleryLightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Clean up
    setTimeout(() => {
        lightboxImage.className = 'lightbox-image';
    }, 300);
}

function switchLightboxImage(direction) {
    // 1. Fase de Salida
    if (direction === 'next') {
        lightboxImage.classList.add('slide-out-left');
    } else {
        lightboxImage.classList.add('slide-out-right');
    }

    // 2. Esperar a que salga (400ms matches CSS)
    setTimeout(() => {
        // Calcular índice
        if (direction === 'next') {
            currentLightboxIndex = (currentLightboxIndex + 1) % allImages.length;
        } else {
            currentLightboxIndex = (currentLightboxIndex - 1 + allImages.length) % allImages.length;
        }

        // Cambiar src
        lightboxImage.src = allImages[currentLightboxIndex].src;

        // 3. Preparar entrada (Teletransportar al lado opuesto sin transición)
        lightboxImage.className = 'lightbox-image'; // Reset base
        if (direction === 'next') {
            lightboxImage.classList.add('prepare-right');
        } else {
            lightboxImage.classList.add('prepare-left');
        }

        // Forzar reflow para que el navegador "vea" la posición inicial
        void lightboxImage.offsetWidth;

        // 4. Animar entrada (Quitar clase de preparación para volver a estado neutral)
        lightboxImage.className = 'lightbox-image';

    }, 400);
}

function showPrevImage() {
    switchLightboxImage('prev');
}

function showNextImage() {
    switchLightboxImage('next');
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

document.addEventListener('keydown', (e) => {
    if (galleryLightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    }
});

galleryLightbox.addEventListener('click', (e) => {
    if (e.target === galleryLightbox) closeLightbox();
});

// Inicializar galería cuando cargue la página
initGallery();