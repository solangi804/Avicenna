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

// Enhanced Mobile Menu Functionality with Overlay
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('#nav-menu');
let mobileNavOverlay;

// Create mobile navigation overlay
function createMobileNavOverlay() {
    mobileNavOverlay = document.createElement('div');
    mobileNavOverlay.className = 'mobile-nav-overlay';
    document.body.appendChild(mobileNavOverlay);
    
    // Close menu when clicking overlay
    mobileNavOverlay.addEventListener('click', function() {
        closeMobileMenu();
    });
}

// Open mobile menu
function openMobileMenu() {
    if (navMenu) {
        navMenu.classList.add('show');
        mobileMenuBtn.classList.add('active');
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }
}

// Close mobile menu
function closeMobileMenu() {
    if (navMenu) {
        navMenu.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (navMenu && navMenu.classList.contains('show')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// Initialize mobile menu functionality
if (mobileMenuBtn && navMenu) {
    createMobileNavOverlay();
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

// Smooth Scrolling for Anchor Links with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only handle internal anchor links
        if (href !== '#' && href.length > 1) {
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Calculate scroll position with header offset
                const headerHeight = document.querySelector('header')?.offsetHeight || 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

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
let visibleImages = [];

function updateVisibleImages() {
    visibleImages = Array.from(galleryItems).filter(item => 
        !item.classList.contains('hide')
    );
}

if (filterButtons.length > 0 && galleryItems.length > 0) {
    // Initialize visible images
    updateVisibleImages();
    
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

            // Update visible images array
            updateVisibleImages();
            
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
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;

function openLightbox(index) {
    if (!visibleImages.length) return;
    
    currentImageIndex = index;
    const item = visibleImages[currentImageIndex];
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay');
    
    if (img) {
        // Preload image for smooth transition
        const preloadImg = new Image();
        preloadImg.src = img.src;
        
        preloadImg.onload = function() {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            
            // Set caption
            if (overlay && lightboxCaption) {
                const title = overlay.querySelector('h3');
                const desc = overlay.querySelector('p');
                if (title && desc) {
                    lightboxCaption.textContent = `${title.textContent} - ${desc.textContent}`;
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
        };
    }
}

function navigateLightbox(direction) {
    if (!visibleImages.length) return;
    
    if (direction === 'prev') {
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    } else if (direction === 'next') {
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    }
    
    openLightbox(currentImageIndex);
}

// Initialize lightbox functionality
if (galleryItems.length > 0 && lightbox) {
    // Open lightbox when clicking gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Find the index in visibleImages
            const visibleIndex = visibleImages.indexOf(this);
            openLightbox(visibleIndex !== -1 ? visibleIndex : 0);
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
            navigateLightbox('prev');
        });
    }

    // Navigate to next image
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            navigateLightbox('next');
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('show')) {
            switch(e.key) {
                case 'Escape':
                    lightbox.classList.remove('show');
                    document.body.style.overflow = '';
                    break;
                case 'ArrowLeft':
                    if (lightboxPrev) navigateLightbox('prev');
                    break;
                case 'ArrowRight':
                    if (lightboxNext) navigateLightbox('next');
                    break;
            }
        }
    });
}

// Form Submission Handlers with Validation
const admissionForm = document.getElementById('admissionForm');
if (admissionForm) {
    admissionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validation
        let isValid = true;
        const requiredFields = ['studentName', 'parentName', 'grade', 'phone'];
        
        requiredFields.forEach(field => {
            const input = this.querySelector(`[name="${field}"]`);
            if (input && !input.value.trim()) {
                isValid = false;
                highlightError(input);
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields marked with *.');
            return;
        }
        
        // Email validation if email field exists
        const emailField = this.querySelector('[name="email"]');
        if (emailField && emailField.value.trim()) {
            const email = emailField.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                highlightError(emailField);
                return;
            }
        }
        
        // Phone validation
        const phoneField = this.querySelector('[name="phone"]');
        if (phoneField) {
            const phone = phoneField.value.trim().replace(/\D/g, '');
            if (phone.length < 10) {
                alert('Please enter a valid phone number with at least 10 digits.');
                highlightError(phoneField);
                return;
            }
        }
        
        // Show success message (in a real app, this would be an AJAX request)
        showFormSuccess(this, 'admission');
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validation
        let isValid = true;
        const requiredFields = ['contactName', 'contactEmail', 'contactMessage'];
        
        requiredFields.forEach(field => {
            const input = this.querySelector(`[name="${field}"]`);
            if (input && !input.value.trim()) {
                isValid = false;
                highlightError(input);
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Email validation
        const emailField = this.querySelector('[name="contactEmail"]');
        if (emailField) {
            const email = emailField.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                highlightError(emailField);
                return;
            }
        }
        
        // Show success message (in a real app, this would be an AJAX request)
        showFormSuccess(this, 'contact');
    });
}

function highlightError(input) {
    input.style.borderColor = '#dc3545';
    input.focus();
    
    // Remove error highlight after 3 seconds
    setTimeout(() => {
        input.style.borderColor = '';
    }, 3000);
}

function showFormSuccess(form, type) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.style.cssText = `
        background-color: #d4edda;
        color: #155724;
        padding: 15px;
        margin-top: 20px;
        border-radius: 4px;
        border: 1px solid #c3e6cb;
        text-align: center;
        animation: fadeIn 0.3s ease;
    `;
    
    let message = '';
    if (type === 'admission') {
        const phone = form.querySelector('[name="phone"]')?.value || '';
        message = `Thank you for your inquiry! We will contact you soon at ${phone}.`;
    } else {
        const email = form.querySelector('[name="contactEmail"]')?.value || '';
        message = `Thank you for your message! We will get back to you soon at ${email}.`;
    }
    
    successMessage.textContent = message;
    
    // Insert after form
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    // Reset form
    form.reset();
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }, 5000);
}

// Sticky Header with Scroll Effect
let lastScroll = 0;
const header = document.querySelector('header');
const headerHeight = header?.offsetHeight || 90;

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (header) {
        // Add shadow when scrolled
        if (currentScroll > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        // Hide/show header on scroll direction (optional)
        if (currentScroll > lastScroll && currentScroll > headerHeight) {
            // Scrolling down - hide header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show header
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    }
});

// Animate on Scroll with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.visibility = 'visible';
            
            // Add animation class for staggered animations
            if (entry.target.classList.contains('animate-stagger')) {
                entry.target.style.animationDelay = `${entry.target.dataset.delay || 0}ms`;
            }
        }
    });
}, observerOptions);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.program-card, .feature-card, .gallery-item, .stat-card, .why-choose-item, .extracurricular-card'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.visibility = 'hidden';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, visibility 0.6s ease';
        
        // Add staggered animation for grid items
        if (el.closest('.programs-grid') || el.closest('.features-grid')) {
            el.classList.add('animate-stagger');
            el.dataset.delay = (index % 3) * 100;
        }
        
        observer.observe(el);
    });
    
    // Animate section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        title.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(title);
    });
});

// Initialize tooltips for gallery filter buttons
if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        // Add tooltip on hover for mobile (touch devices)
        button.addEventListener('touchstart', function() {
            if (window.innerWidth <= 768) {
                const tooltip = document.createElement('div');
                tooltip.className = 'filter-tooltip';
                tooltip.textContent = this.getAttribute('data-filter').replace('all', 'All Categories');
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--primary);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    white-space: nowrap;
                    z-index: 1000;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-top: 5px;
                `;
                
                this.style.position = 'relative';
                this.appendChild(tooltip);
                
                // Remove tooltip after 2 seconds
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 2000);
            }
        });
    });
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Close mobile menu on large screens
        if (window.innerWidth > 992 && navMenu && navMenu.classList.contains('show')) {
            closeMobileMenu();
        }
        
        // Update header height
        if (header) {
            const newHeight = header.offsetHeight;
            document.documentElement.style.setProperty('--header-height', `${newHeight}px`);
        }
    }, 250);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set header height CSS variable
    if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
    
    // Add loading animation to stats
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent.replace(/\D/g, ''));
        let currentValue = 0;
        const increment = finalValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue.toLocaleString() + (stat.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(currentValue).toLocaleString() + (stat.textContent.includes('+') ? '+' : '');
            }
        }, 30);
    });
});

// Handle page transitions
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .hero-content {
        opacity: 0;
        transform: translateY(20px);
        animation: slideUp 0.8s ease forwards;
    }
    
    .form-success {
        animation: fadeIn 0.3s ease;
    }
    
    /* Prevent flash of unstyled content */
    body {
        opacity: 1 !important;
        transition: opacity 0.3s ease !important;
    }
`;
document.head.appendChild(style);