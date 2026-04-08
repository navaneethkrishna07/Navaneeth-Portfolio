// --- CUSTOM CURSOR ---
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// --- NAVIGATION SCROLL EFFECT ---
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// --- THREE.JS 3D BACKGROUND ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05050a, 0.001);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Lighting
const pointLight = new THREE.PointLight(0x06b6d4, 2, 100);
pointLight.position.set(20, 20, 20);

const pointLight2 = new THREE.PointLight(0x6d28d9, 2, 100);
pointLight2.position.set(-20, -20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(pointLight, pointLight2, ambientLight);

// Elements
const objects = [];

// Create Torus
const torusGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x6d28d9, 
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const torusKnot = new THREE.Mesh(torusGeometry, material);
torusKnot.position.x = 20;
torusKnot.position.y = 5;
torusKnot.position.z = -10;
scene.add(torusKnot);
objects.push(torusKnot);

// Create random floating spheres
function addStar() {
    const geometry = new THREE.OctahedronGeometry(Math.random() * 2 + 1, 0);
    const mat = new THREE.MeshStandardMaterial({ 
        color: Math.random() > 0.5 ? 0x06b6d4 : 0x6d28d9,
        roughness: 0.2,
        metalness: 0.8
    });
    const star = new THREE.Mesh(geometry, mat);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(150));
    star.position.set(x, y, z - 20);
    
    scene.add(star);
    objects.push({mesh: star, speed: Math.random() * 0.01});
}

Array(100).fill().forEach(addStar);

// Mouse interaction for 3D elements
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Scroll Animation for Three.js
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    
    camera.position.y = t * 0.01;
    torusKnot.rotation.y += 0.05;
}
document.body.onscroll = moveCamera;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.002;
    torusKnot.rotation.z += 0.005;

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Smooth interaction
    torusKnot.rotation.y += 0.05 * (targetX - torusKnot.rotation.y);
    torusKnot.rotation.x += 0.05 * (targetY - torusKnot.rotation.x);

    // Animate all spheres
    objects.forEach(obj => {
        if(obj.mesh) {
            obj.mesh.rotation.x += obj.speed;
            obj.mesh.rotation.y += obj.speed;
            
            // Subtle mouse parallax
            obj.mesh.position.x += (mouseX * 0.01 - obj.mesh.position.x) * 0.005;
            obj.mesh.position.y += (-mouseY * 0.01 - obj.mesh.position.y) * 0.005;
        }
    });

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- GSAP SCROLL ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);

// Initial Hero Animation
const tl = gsap.timeline();
tl.from('.logo', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' })
  .from('.nav-links li', { y: -50, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, "-=0.5")
  .from('.hero-content .subtitle', { x: -50, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.2")
  .from('.hero-content .title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, "-=0.6")
  .from('.hero-content .tagline', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
  .from('.hero-buttons', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.4");

// Scroll Animations for Sections
const sections = document.querySelectorAll('.section');
sections.forEach(section => {
    if(section.id !== 'hero') {
        const elements = section.querySelectorAll('.section-title, .glass-card, .timeline-item, .cert-card');
        gsap.from(elements, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%", // Animates when top of section hits 80% of viewport
            }
        });
    }
});

// --- MODAL FUNCTIONALITY ---
const modal = document.getElementById('certModal');
const modalTitle = document.getElementById('modalTitle');
const modalImageContainer = document.getElementById('modalImageContainer');

window.openModal = function(certId) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Set title and image based on certId
    let title = "";
    let fileSrc = "";
    
    if(certId === 'cert1') {
        title = "Applied Artificial Intelligence Workshop";
        fileSrc = "1.jpg";
    } else if (certId === 'cert2') {
        title = "Cyber Security & Ethical Hacking Workshop";
        fileSrc = "2.jpg";
    } else if (certId === 'cert_keltron') {
        title = "Keltron Internship Certificate";
        fileSrc = "keltron certificate.pdf";
    } else if (certId === 'cert3') {
        title = "Infosys Certification";
        fileSrc = "INFOSYS.pdf";
    }

    modalTitle.textContent = title;
    
    if (fileSrc.toLowerCase().endsWith('.pdf')) {
        modalImageContainer.innerHTML = `<iframe src="${fileSrc}" style="width: 100%; height: 80vh; border: none; border-radius: 8px;"></iframe>`;
    } else {
        modalImageContainer.innerHTML = `<img id="modalImage" src="${fileSrc}" alt="Certificate" style="max-width: 100%; max-height: 80vh; object-fit: contain;">`;
    }
}

window.closeModal = function() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Enable scrolling
}

// Close when clicking outside of modal content
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}
