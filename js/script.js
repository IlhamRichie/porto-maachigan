// Smooth scrolling for navigation links
document.querySelectorAll('.nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Remove active class from all
        document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
        // Add active class to clicked
        this.classList.add('active');

        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80, // Adjust for sticky header
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll event listener to update active nav link
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').substring(1) === current) {
            a.classList.add('active');
        }
    });
});

// Disable Right Click & Image Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    // Disable right click on all images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
    });

    // Create Modal Elements
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <span class="modal-close">&times;</span>
        <div class="modal-content-wrapper">
            <img class="modal-content" src="" alt="Modal Image">
        </div>
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('.modal-content');
    const closeModal = modal.querySelector('.modal-close');
    
    // Disable right-click on the image inside the modal
    modalImg.addEventListener('contextmenu', e => e.preventDefault());

    // Add click event to gallery items and hero image
    document.querySelectorAll('.gallery-item img, .hero-image').forEach(img => {
        img.style.cursor = 'pointer'; // Make sure they look clickable
        
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            
            // Show modal with a tiny delay to allow display:flex to apply before opacity transition
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        });
    });

    // Close Modal Logic
    const closeFunc = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Wait for transition
    };

    closeModal.addEventListener('click', closeFunc);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === modal.querySelector('.modal-content-wrapper')) {
            closeFunc();
        }
    });

    // --- ANIMATIONS ON SCROLL ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation classes to elements
    const fadeUpElements = [
        document.querySelector('.hero-content'),
        document.querySelector('.hero-image-container'),
        document.querySelector('.about-card'),
        document.querySelector('.signpost'),
        ...document.querySelectorAll('.gallery-item')
    ];

    fadeUpElements.forEach(el => {
        if (el) {
            el.classList.add('fade-up');
            observer.observe(el);
        }
    });
});
