/**
 * Portafolio de Michael Llorens
 * Script principal para funcionalidades interactivas
 */

// === POPUP de imagen de perfil ===
document.addEventListener("DOMContentLoaded", function() {
    // Elementos del popup
    const popup = document.getElementById("popup");
    const profilePic = document.getElementById("profilePic");
    const closeBtn = document.getElementById("closePopup");
    const popupImg = document.querySelector(".popup-img");

    // Mostrar popup al hacer clic en la imagen de perfil
    if (profilePic) {
        profilePic.addEventListener("click", () => {
            popup.classList.remove("hidden");
            // Mejorar accesibilidad - atrapar el foco
            document.body.style.overflow = "hidden";
        });
    }

    // Cerrar popup con el botón de cierre
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            closePopup();
        });
    }

    // Cerrar popup haciendo clic fuera de la imagen
    if (popup) {
        popup.addEventListener("click", (e) => {
            if (e.target === popup || e.target === popupImg) {
                closePopup();
            }
        });
    }

    // Cerrar popup con la tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !popup.classList.contains("hidden")) {
            closePopup();
        }
    });

    // Función para cerrar el popup
    function closePopup() {
        popup.classList.add("hidden");
        document.body.style.overflow = "";
    }

    // === CAROUSEL de los proyectos ===
    initCarousel();
});

/**
 * Inicializa y configura el carrusel de proyectos
 * - Adaptativo según el tamaño de pantalla
 * - Circular (vuelve al inicio al llegar al final)
 * - Navegación con botones y gestos táctiles
 */
function initCarousel() {
    const carousel = document.getElementById('projectCarousel');
    if (!carousel) return;

    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const cards = carousel.querySelectorAll('.project-card');
    
    if (cards.length === 0) return;
    
    // Variables para control táctil
    let touchStartX = 0;
    let touchEndX = 0;
    
    /**
     * Determina cuántas tarjetas mostrar según el ancho de pantalla
     * @returns {number} Número de tarjetas visibles
     */
    function getVisibleCards() {
        const windowWidth = window.innerWidth;
        if (windowWidth < 576) return 1; // Móviles: 1 tarjeta
        if (windowWidth < 992) return 2; // Tablets: 2 tarjetas
        return 3; // Desktop: 3 tarjetas
    }
    
    /**
     * Calcula el ancho de una tarjeta incluyendo su margen
     * @returns {number} Ancho total de una tarjeta
     */
    function getCardWidth() {
        const card = cards[0];
        const style = window.getComputedStyle(card);
        const width = card.offsetWidth;
        const marginRight = parseFloat(style.marginRight) || 0;
        
        return width + marginRight;
    }
    
    /**
     * Obtiene el ancho total del carrusel
     * @returns {number} Ancho total de todas las tarjetas
     */
    function getTotalWidth() {
        return getCardWidth() * cards.length;
    }
    
    /**
     * Verifica si estamos al final del carrusel
     * @returns {boolean} Verdadero si estamos al final
     */
    function isAtEnd() {
        const totalWidth = getTotalWidth();
        const visibleWidth = carousel.clientWidth;
        // Usamos un margen de error más amplio para asegurar la detección
        return carousel.scrollLeft >= totalWidth - visibleWidth - 20;
    }
    
    /**
     * Verifica si estamos al inicio del carrusel
     * @returns {boolean} Verdadero si estamos al inicio
     */
    function isAtStart() {
        return carousel.scrollLeft <= 20;
    }
    
    /**
     * Navega al inicio del carrusel
     */
    function goToStart() {
        carousel.scrollTo({
            left: 0,
            behavior: 'smooth'
        });
    }
    
    /**
     * Navega al final del carrusel
     */
    function goToEnd() {
        const totalWidth = getTotalWidth();
        const visibleWidth = carousel.clientWidth;
        carousel.scrollTo({
            left: totalWidth - visibleWidth,
            behavior: 'smooth'
        });
    }
    
    /**
     * Desplaza el carrusel en la dirección especificada
     * @param {number} direction - Dirección del desplazamiento (1: derecha, -1: izquierda)
     */
    function scrollCarousel(direction) {
        // Si estamos al final y queremos ir a la derecha, vamos al inicio
        if (direction > 0 && isAtEnd()) {
            goToStart();
            return;
        }
        
        // Si estamos al inicio y queremos ir a la izquierda, vamos al final
        if (direction < 0 && isAtStart()) {
            goToEnd();
            return;
        }
        
        // En cualquier otro caso, desplazamos normalmente
        const cardWidth = getCardWidth();
        carousel.scrollBy({
            left: cardWidth * direction,
            behavior: 'smooth'
        });
    }
    
    // Event listeners para los botones
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollCarousel(-1); // Desplazar hacia la izquierda
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollCarousel(1); // Desplazar hacia la derecha
        });
    }
    
    // Soporte para navegación con teclado
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            scrollCarousel(-1);
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            scrollCarousel(1);
            e.preventDefault();
        }
    });
    
    // Soporte para gestos táctiles
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    /**
     * Maneja el gesto de deslizamiento
     */
    function handleSwipe() {
        const swipeThreshold = 50; // Umbral mínimo para considerar un swipe
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe hacia la izquierda (siguiente)
            scrollCarousel(1);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe hacia la derecha (anterior)
            scrollCarousel(-1);
        }
    }
    
    // Ajustar el carrusel cuando cambia el tamaño de la ventana
    window.addEventListener('resize', () => {
        // Asegurar que el carrusel se ajuste correctamente
        const cardWidth = getCardWidth();
        const currentPosition = Math.round(carousel.scrollLeft / cardWidth);
        
        carousel.scrollTo({
            left: currentPosition * cardWidth,
            behavior: 'auto'
        });
    });
}