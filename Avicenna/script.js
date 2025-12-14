// Loader Functionality
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500); // Show loader for 1.5 seconds
    }
});

// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navMenu = document.getElementById('nav-menu');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', function() {
        navMenu.classList.toggle('show');
        const icon = mobileMenu.querySelector('i');
        if (icon) {
            if (navMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('show');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Gallery Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            let visibleCount = 0;
            galleryItems.forEach(item => {
                if (filterValue === 'all') {
                    item.classList.remove('hide');
                    visibleCount++;
                } else {
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory === filterValue) {
                        item.classList.remove('hide');
                        visibleCount++;
                    } else {
                        item.classList.add('hide');
                    }
                }
            });

            // Show/hide no results message
            const noResults = document.getElementById('galleryNoResults');
            if (noResults) {
                if (visibleCount === 0) {
                    noResults.classList.add('show');
                } else {
                    noResults.classList.remove('show');
                }
            }
        });
    });
}

// Lightbox Functionality
const galleryItemsForLightbox = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
let visibleImages = [];

if (galleryItemsForLightbox.length > 0 && lightbox) {
    // Get all visible images
    function updateVisibleImages() {
        visibleImages = Array.from(galleryItemsForLightbox).filter(item => 
            !item.classList.contains('hide')
        );
    }

    updateVisibleImages();

    // Open lightbox
    galleryItemsForLightbox.forEach((item, index) => {
        item.addEventListener('click', function() {
            updateVisibleImages();
            const img = this.querySelector('img');
            const overlay = this.querySelector('.gallery-overlay');
            
            if (img) {
                currentImageIndex = visibleImages.indexOf(this);
                if (currentImageIndex === -1) currentImageIndex = 0;
                
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                
                if (overlay && lightboxCaption) {
                    const title = overlay.querySelector('h3');
                    const desc = overlay.querySelector('p');
                    if (title && desc) {
                        lightboxCaption.textContent = title.textContent + ' - ' + desc.textContent;
                    } else if (title) {
                        lightboxCaption.textContent = title.textContent;
                    } else {
                        lightboxCaption.textContent = img.alt;
                    }
                } else if (lightboxCaption) {
                    lightboxCaption.textContent = img.alt;
                }
                
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Navigate to previous image
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            updateVisibleImages();
            if (visibleImages.length > 0) {
                currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
                const img = visibleImages[currentImageIndex].querySelector('img');
                const overlay = visibleImages[currentImageIndex].querySelector('.gallery-overlay');
                
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    
                    if (overlay && lightboxCaption) {
                        const title = overlay.querySelector('h3');
                        const desc = overlay.querySelector('p');
                        if (title && desc) {
                            lightboxCaption.textContent = title.textContent + ' - ' + desc.textContent;
                        } else if (title) {
                            lightboxCaption.textContent = title.textContent;
                        } else {
                            lightboxCaption.textContent = img.alt;
                        }
                    } else if (lightboxCaption) {
                        lightboxCaption.textContent = img.alt;
                    }
                }
            }
        });
    }

    // Navigate to next image
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            updateVisibleImages();
            if (visibleImages.length > 0) {
                currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
                const img = visibleImages[currentImageIndex].querySelector('img');
                const overlay = visibleImages[currentImageIndex].querySelector('.gallery-overlay');
                
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    
                    if (overlay && lightboxCaption) {
                        const title = overlay.querySelector('h3');
                        const desc = overlay.querySelector('p');
                        if (title && desc) {
                            lightboxCaption.textContent = title.textContent + ' - ' + desc.textContent;
                        } else if (title) {
                            lightboxCaption.textContent = title.textContent;
                        } else {
                            lightboxCaption.textContent = img.alt;
                        }
                    } else if (lightboxCaption) {
                        lightboxCaption.textContent = img.alt;
                    }
                }
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('show')) {
            if (e.key === 'Escape') {
                lightbox.classList.remove('show');
                document.body.style.overflow = '';
            } else if (e.key === 'ArrowLeft') {
                if (lightboxPrev) lightboxPrev.click();
            } else if (e.key === 'ArrowRight') {
                if (lightboxNext) lightboxNext.click();
            }
        }
    });
}

// Form Submission Handlers
const admissionForm = document.getElementById('admissionForm');
if (admissionForm) {
    admissionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.studentName || !data.parentName || !data.grade || !data.phone) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Show success message
        alert('Thank you for your inquiry! We will contact you soon at ' + data.phone + '.');
        
        // Reset form
        this.reset();
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.contactName || !data.contactEmail || !data.contactMessage) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon at ' + data.contactEmail + '.');
        
        // Reset form
        this.reset();
    });
}

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (header) {
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
    
    lastScroll = currentScroll;
});

// Animate on Scroll (Simple)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.program-card, .feature-card, .gallery-item, .stat-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Update visible images when filter changes
if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                const visibleItems = document.querySelectorAll('.gallery-item:not(.hide)');
                visibleImages = Array.from(visibleItems);
            }, 100);
        });
    });
}
