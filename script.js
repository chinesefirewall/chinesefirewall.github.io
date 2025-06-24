// Skill bars animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillItems = entry.target.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 100); // Stagger the animations
            });
            skillObserver.unobserve(entry.target); // Only animate once
        }
    });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Dark mode toggle
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

// Function to switch theme
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// Event listener for toggle
toggleSwitch.addEventListener('change', switchTheme, false);

// Check for saved user preference
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

// Testimonials carousel
const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const indicators = document.querySelectorAll('.indicator');
let currentIndex = 0;
let autoRotateInterval;

// Function to show testimonial at index
function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
        testimonial.setAttribute('aria-hidden', 'true');
    });

    // Update indicators
    indicators.forEach((indicator, i) => {
        indicator.classList.remove('active');
        indicator.setAttribute('aria-selected', 'false');
        indicator.setAttribute('tabindex', '0');
    });

    // Show current testimonial and indicator
    testimonials[index].classList.add('active');
    testimonials[index].setAttribute('aria-hidden', 'false');
    indicators[index].classList.add('active');
    indicators[index].setAttribute('aria-selected', 'true');

    // Update current index
    currentIndex = index;

    // Announce to screen readers
    const liveRegion = document.getElementById('carousel-live-region');
    if (!liveRegion) {
        const newLiveRegion = document.createElement('div');
        newLiveRegion.id = 'carousel-live-region';
        newLiveRegion.className = 'sr-only';
        newLiveRegion.setAttribute('aria-live', 'polite');
        document.body.appendChild(newLiveRegion);
    }
    document.getElementById('carousel-live-region').textContent = `Showing testimonial ${index + 1} of ${testimonials.length}`;
}

// Next testimonial
function nextTestimonial() {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= testimonials.length) {
        nextIndex = 0;
    }
    showTestimonial(nextIndex);
}

// Previous testimonial
function prevTestimonial() {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
        prevIndex = testimonials.length - 1;
    }
    showTestimonial(prevIndex);
}

// Auto rotate testimonials
function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
        nextTestimonial();
    }, 5000); // Change testimonial every 5 seconds
}

// Stop auto rotation on user interaction
function stopAutoRotate() {
    clearInterval(autoRotateInterval);
    // Restart after a delay
    setTimeout(startAutoRotate, 10000);
}

// Event listeners for controls
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        prevTestimonial();
        stopAutoRotate();
    });

    nextBtn.addEventListener('click', () => {
        nextTestimonial();
        stopAutoRotate();
    });
}

// Event listeners for indicators
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showTestimonial(index);
        stopAutoRotate();
    });

    // Keyboard navigation for indicators
    indicator.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            // Enter or Space key activates the indicator
            e.preventDefault();
            showTestimonial(index);
            stopAutoRotate();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            // Right or Down arrow moves to next indicator
            e.preventDefault();
            const nextIndex = (index + 1) % indicators.length;
            indicators[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            // Left or Up arrow moves to previous indicator
            e.preventDefault();
            const prevIndex = (index - 1 + indicators.length) % indicators.length;
            indicators[prevIndex].focus();
        }
    });
});

// Keyboard navigation for carousel buttons
prevBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        prevTestimonial();
        stopAutoRotate();
    }
});

nextBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        nextTestimonial();
        stopAutoRotate();
    }
});

// Start auto rotation
startAutoRotate();

// Typing animation
const typedTextElement = document.getElementById('typed-text');
if (typedTextElement) {
    new Typed('#typed-text', {
        strings: [
            'Data Engineering',
            'Django Development',
            'Solution Architecture',
            'Database Administration',
            'Cloud Computing'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close menu when clicking on a link and track the click in Google Analytics
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Track the navigation click in Google Analytics
            const sectionName = link.textContent.trim();
            gtag('event', 'section_click', {
                'event_category': 'navigation',
                'event_label': sectionName
            });

            if (nav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
}

function toggleMenu() {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
}

// Section visibility tracking for Google Analytics
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Get the section id and send an event to Google Analytics
            const sectionId = entry.target.id;
            const sectionName = entry.target.querySelector('h2') ? 
                                entry.target.querySelector('h2').textContent.trim() : 
                                sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

            gtag('event', 'section_view', {
                'event_category': 'engagement',
                'event_label': sectionName,
                'non_interaction': true // Won't affect bounce rate
            });

            // Unobserve after first view to avoid duplicate events
            sectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 }); // Trigger when 30% of the section is visible

// Observe all sections
document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// Custom cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-dot-outline');

// Position cursor in the center of the screen initially
if (cursorDot && cursorOutline) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    cursorDot.style.left = centerX + 'px';
    cursorDot.style.top = centerY + 'px';
    cursorOutline.style.left = centerX + 'px';
    cursorOutline.style.top = centerY + 'px';
}

// Only enable custom cursor on desktop
if (window.innerWidth > 768) {
    // Show cursor when mouse moves
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;

        // Position cursor elements at mouse position
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';

        // Add slight delay to outline for effect
        setTimeout(() => {
            cursorOutline.style.left = e.clientX + 'px';
            cursorOutline.style.top = e.clientY + 'px';
        }, 50);
    });

    // Keep cursor visible even when mouse leaves window
    // Commented out to ensure cursor is always visible
    /*
    window.addEventListener('mouseout', () => {
        cursorDot.style.opacity = 0;
        cursorOutline.style.opacity = 0;
    });
    */

    // Add hover effect to interactive elements and track interactions
    const interactiveElements = document.querySelectorAll('a, button, .item, .skill-item, .theme-switch');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursorDot.classList.add('cursor-dot-hover');
            cursorOutline.classList.add('cursor-hover');

            // Track hover interaction in Google Analytics
            // Get element description for the event label
            let elementDescription = '';

            if (el.tagName === 'A' || el.tagName === 'BUTTON') {
                // For links and buttons, use the text content
                elementDescription = el.textContent.trim();
            } else if (el.classList.contains('skill-item')) {
                // For skill items, use the skill name
                elementDescription = 'Skill: ' + (el.dataset.skill || el.querySelector('.skill-name span').textContent.trim());
            } else if (el.classList.contains('item')) {
                // For experience/education/project items, use the heading
                const heading = el.querySelector('h3');
                elementDescription = heading ? heading.textContent.trim() : 'Item';
            } else if (el.classList.contains('theme-switch')) {
                // For theme switch
                elementDescription = 'Theme Switch';
            } else {
                // Default fallback
                elementDescription = el.tagName.toLowerCase();
            }

            // Limit tracking to one event per element per page view
            if (!el.dataset.tracked) {
                gtag('event', 'cursor_hover', {
                    'event_category': 'interaction',
                    'event_label': elementDescription
                });
                el.dataset.tracked = 'true';
            }
        });

        el.addEventListener('mouseout', () => {
            cursorDot.classList.remove('cursor-dot-hover');
            cursorOutline.classList.remove('cursor-hover');
        });
    });
} else {
    // Restore default cursor on mobile
    document.body.style.cursor = 'auto';
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        el.style.cursor = 'auto';
    });
}
