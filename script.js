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
const playlistItems = document.querySelectorAll('.playlist-item');
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
        duration: '3:45'
    },
    {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        title: 'Night Party Set',
        artist: 'DJ VN Events',
        duration: '4:20'
    },
    {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        title: 'Elegant Evening',
        artist: 'DJ VN Events',
        duration: '5:12'
    },
    {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        title: 'Corporate Ambience',
        artist: 'DJ VN Events',
        duration: '3:58'
    }
];

// Array de imágenes de la galería con sus relaciones de aspecto
// Puedes reemplazar con tus propias imágenes
const galleryImages = [
    // Columna 1
    [
        { src: 'https://picsum.photos/800/800?random=1', span: 2 },
        { src: 'https://picsum.photos/800/400?random=2', span: 1 },
        { src: 'https://picsum.photos/800/400?random=3', span: 1 },
        { src: 'https://picsum.photos/800/600?random=4', span: 2 }
    ],
    // Columna 2
    [
        { src: 'https://picsum.photos/800/400?random=5', span: 1 },
        { src: 'https://picsum.photos/800/600?random=6', span: 2 },
        { src: 'https://picsum.photos/800/800?random=7', span: 2 }
    ],
    // Columna 3
    [
        { src: 'https://picsum.photos/800/1200?random=8', span: 3 },
        { src: 'https://picsum.photos/800/400?random=9', span: 1 },
        { src: 'https://picsum.photos/800/600?random=10', span: 2 }
    ],
    // Columna 4
    [
        { src: 'https://picsum.photos/800/400?random=11', span: 1 },
        { src: 'https://picsum.photos/800/400?random=12', span: 1 },
        { src: 'https://picsum.photos/800/800?random=13', span: 2 }
    ]
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
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playBtn.querySelector('i').classList.remove('bx-pause');
        playBtn.querySelector('i').classList.add('bx-play');
        stickyPlayBtn.querySelector('i').classList.remove('bx-pause');
        stickyPlayBtn.querySelector('i').classList.add('bx-play');
    } else {
        audioPlayer.play();
        isPlaying = true;
        playBtn.querySelector('i').classList.remove('bx-play');
        playBtn.querySelector('i').classList.add('bx-pause');
        stickyPlayBtn.querySelector('i').classList.remove('bx-play');
        stickyPlayBtn.querySelector('i').classList.add('bx-pause');
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

// Click en items de la playlist
playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        loadTrack(index);
        if (!isPlaying) {
            togglePlay();
        } else {
            audioPlayer.play();
        }
    });
});

// Cargar primera pista al inicio
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
    contactForm.addEventListener('submit', function(e) {
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

let currentGalleryIndex = 0;
const columnWidth = 365; // 350px + 15px gap
let allImages = []; // Array plano de todas las imágenes
let currentLightboxIndex = 0;

// Drag to scroll
let isDraggingGallery = false;
let startX;
let scrollLeft;

// Función para crear una columna de galería
function createGalleryColumn(images, columnIndex) {
    const column = document.createElement('div');
    column.className = 'gallery-column';
    column.dataset.column = columnIndex;
    
    images.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = `gallery-item ${image.span > 1 ? `span-${image.span}` : ''}`;
        
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = 'Evento';
        imgElement.className = 'gallery-image';
        
        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';
        overlay.innerHTML = '<i class="bx bx-plus"></i>';
        
        item.appendChild(imgElement);
        item.appendChild(overlay);
        
        // Click para abrir lightbox
        item.addEventListener('click', () => {
            openLightbox(allImages.indexOf(image));
        });
        
        column.appendChild(item);
    });
    
    return column;
}

// Inicializar galería
function initGallery() {
    if (!galleryTrack) return;
    
    galleryTrack.innerHTML = '';
    allImages = [];
    
    // Aplanar todas las imágenes en un solo array
    galleryImages.forEach(columnImages => {
        columnImages.forEach(img => allImages.push(img));
    });
    
    // Crear 3 sets completos para efecto infinito
    const totalSets = 3;
    for (let set = 0; set < totalSets; set++) {
        galleryImages.forEach((columnImages, columnIndex) => {
            const column = createGalleryColumn(columnImages, columnIndex + (set * galleryImages.length));
            galleryTrack.appendChild(column);
        });
    }
    
    // Posicionar en el set del medio
    setTimeout(() => {
        currentGalleryIndex = galleryImages.length;
        updateGalleryPosition(false);
    }, 100);
}

// Actualizar posición de la galería
function updateGalleryPosition(animate = true) {
    if (animate) {
        galleryTrack.style.transition = 'transform 0.5s ease';
    } else {
        galleryTrack.style.transition = 'none';
    }
    
    const offset = currentGalleryIndex * columnWidth;
    galleryTrack.style.transform = `translateX(-${offset}px)`;
}

// Navegar a la izquierda
function galleryPrev() {
    currentGalleryIndex--;
    updateGalleryPosition(true);
    checkGalleryLoop();
}

// Navegar a la derecha
function galleryNext() {
    currentGalleryIndex++;
    updateGalleryPosition(true);
    checkGalleryLoop();
}

// Verificar y hacer loop infinito
function checkGalleryLoop() {
    setTimeout(() => {
        if (currentGalleryIndex >= galleryImages.length * 2) {
            galleryTrack.style.transition = 'none';
            currentGalleryIndex = galleryImages.length;
            updateGalleryPosition(false);
        }
        
        if (currentGalleryIndex < galleryImages.length) {
            galleryTrack.style.transition = 'none';
            currentGalleryIndex = galleryImages.length + currentGalleryIndex;
            updateGalleryPosition(false);
        }
    }, 500);
}

// Event listeners para navegación con botones
if (galleryNavLeft) {
    galleryNavLeft.addEventListener('click', galleryPrev);
}

if (galleryNavRight) {
    galleryNavRight.addEventListener('click', galleryNext);
}

// Drag to scroll
if (galleryWrapper) {
    galleryWrapper.addEventListener('mousedown', (e) => {
        isDraggingGallery = true;
        galleryWrapper.classList.add('dragging');
        startX = e.pageX;
        scrollLeft = currentGalleryIndex;
        galleryTrack.style.transition = 'none';
    });

    galleryWrapper.addEventListener('mouseleave', () => {
        if (isDraggingGallery) {
            isDraggingGallery = false;
            galleryWrapper.classList.remove('dragging');
            snapToClosestColumn();
        }
    });

    galleryWrapper.addEventListener('mouseup', () => {
        if (isDraggingGallery) {
            isDraggingGallery = false;
            galleryWrapper.classList.remove('dragging');
            snapToClosestColumn();
        }
    });

    galleryWrapper.addEventListener('mousemove', (e) => {
        if (!isDraggingGallery) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (startX - x) / columnWidth;
        const newPosition = scrollLeft + walk;
        
        galleryTrack.style.transform = `translateX(-${newPosition * columnWidth}px)`;
    });
}

// Función para ajustar a la columna más cercana al soltar
function snapToClosestColumn() {
    const currentTransform = galleryTrack.style.transform;
    const currentOffset = parseFloat(currentTransform.match(/-?\d+\.?\d*/)[0]);
    const closestIndex = Math.round(currentOffset / columnWidth);
    
    currentGalleryIndex = closestIndex;
    galleryTrack.style.transition = 'transform 0.3s ease-out';
    updateGalleryPosition(true);
    checkGalleryLoop();
}

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (!galleryLightbox.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            galleryPrev();
        } else if (e.key === 'ArrowRight') {
            galleryNext();
        }
    }
});

// Soporte táctil para móvil
let touchStartX = 0;
let touchEndX = 0;

if (galleryTrack) {
    galleryTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    galleryTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGallerySwipe();
    });
}

function handleGallerySwipe() {
    if (touchEndX < touchStartX - 50) {
        galleryNext();
    }
    if (touchEndX > touchStartX + 50) {
        galleryPrev();
    }
}

// === LIGHTBOX FUNCTIONS ===

function openLightbox(index) {
    currentLightboxIndex = index;
    lightboxImage.src = allImages[index].src;
    galleryLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    galleryLightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPrevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + allImages.length) % allImages.length;
    lightboxImage.src = allImages[currentLightboxIndex].src;
}

function showNextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % allImages.length;
    lightboxImage.src = allImages[currentLightboxIndex].src;
}

// Lightbox event listeners
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPrevImage);
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', showNextImage);
}

// Cerrar con Escape y navegar con flechas en lightbox
document.addEventListener('keydown', (e) => {
    if (galleryLightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    }
});

// Click fuera de la imagen para cerrar
galleryLightbox.addEventListener('click', (e) => {
    if (e.target === galleryLightbox) {
        closeLightbox();
    }
});

// Swipe en lightbox (móvil)
let lightboxTouchStartX = 0;
let lightboxTouchEndX = 0;

if (galleryLightbox) {
    galleryLightbox.addEventListener('touchstart', (e) => {
        lightboxTouchStartX = e.changedTouches[0].screenX;
    });

    galleryLightbox.addEventListener('touchend', (e) => {
        lightboxTouchEndX = e.changedTouches[0].screenX;
        handleLightboxSwipe();
    });
}

function handleLightboxSwipe() {
    if (lightboxTouchEndX < lightboxTouchStartX - 50) {
        showNextImage();
    }
    if (lightboxTouchEndX > lightboxTouchStartX + 50) {
        showPrevImage();
    }
}

// Inicializar galería cuando cargue la página
initGallery();