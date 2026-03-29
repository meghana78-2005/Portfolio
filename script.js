const canvas = document.getElementById('splash-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let hue = 0;

// Resize canvas dynamically if window resizes
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const mouse = {
    x: undefined,
    y: undefined,
}

// Attach event listeners to window instead of canvas so nothing gets blocked!
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    // Spawn 5 particles per mousemove event for a dense rainbow splash
    for (let i = 0; i < 5; i++) {
        particlesArray.push(new Particle());
    }
});

window.addEventListener('touchmove', function(event){
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
    for (let i = 0; i < 5; i++) {
        particlesArray.push(new Particle());
    }
});

class Particle {
    constructor(){
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 15 + 1;
        // Explode outward dynamically
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        // Random rainbow color based on the continuously shifting global hue
        this.color = 'hsl(' + hue + ', 100%, 50%)';
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        // Rapidly shrink the particle as it moves
        if (this.size > 0.1) this.size -= 0.15;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Draw the glowing circle
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Optional: Adding a slight glow effect (can be heavy on performance, but looks amazing)
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
    }
}

function handleParticles(){
    for (let i = 0; i < particlesArray.length; i++){
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Garbage collection: remove tiny, faded particles
        if (particlesArray[i].size <= 0.3){
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    hue += 4; 
    requestAnimationFrame(animate);
}

// Start Canvas Loop
animate();

// --- Gooey Nav Logic ---
const navItems = document.querySelectorAll('.gooey-item');
const indicator = document.querySelector('.gooey-indicator');

function updateIndicator(item) {
    if (!item || !indicator) return;
    const itemRect = item.getBoundingClientRect();
    const navRect = item.closest('.gooey-nav-content').getBoundingClientRect();
    
    // Calculate precise center-alignment relative to the parent nav (Vertical)
    const topPos = (itemRect.top - navRect.top) + (itemRect.height / 2) - (indicator.offsetHeight / 2);
    indicator.style.transform = `translateY(${topPos}px)`;
    
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
}

// Initialize Active States when DOM is ready
if (navItems.length > 0) {
    // Slight timeout ensures CSS layouts are fully computed before measuring bounding boxes
    setTimeout(() => updateIndicator(navItems[0]), 100);
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            updateIndicator(this);
        });
    });
}

// --- Tech Stack Scroll Reveal Animation ---
const observerOptions = {
    threshold: 0.1
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Triggers the CSS .show class to fade/scale up
            entry.target.classList.add('show');
        } else {
            // Remove when out of view so it animates every single time you scroll past!
            entry.target.classList.remove('show');
        }
    });
}, observerOptions);

const hiddenSkills = document.querySelectorAll('.skill-card');
hiddenSkills.forEach((el) => skillObserver.observe(el));

// --- Contact Form Submission & Success Toast ---
const contactForm = document.getElementById('contact-form');
const successToast = document.getElementById('success-toast');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop standard form submission

        // In a real project, you would send the data to a server here (e.g., Formspree/EmailJS)
        
        // Reset form
        contactForm.reset();

        // Show Success Toast
        if (successToast) {
            successToast.classList.add('active');
            
            // Hide after 3 seconds
            setTimeout(() => {
                successToast.classList.remove('active');
            }, 3000);
        }
    });
}

// --- Mobile Menu Toggle Logic ---
const mobileMenuOpen = document.getElementById('mobileMenuOpen');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');

if (mobileMenuOpen && mobileMenuOverlay && mobileMenuClose) {
    // Open Menu
    mobileMenuOpen.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling while menu is open
    });

    // Close Menu (via X button)
    mobileMenuClose.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close Menu (via Clicking any Link)
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}
