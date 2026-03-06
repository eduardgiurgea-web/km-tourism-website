/* -------------------------------------------------------------------------- */
/*                               Scroll Animations                            */
/* -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for Fade-Up Elements
    const fadeElements = document.querySelectorAll('.fade-up, .reveal-text, .slide-together');

    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    // 3. Animated Counters (Stats Section)
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const statsSection = document.getElementById('about');

    // Function to animate a single counter
    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps

        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                el.innerText = Math.ceil(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = target.toLocaleString();
            }
        };

        updateCounter();
    };

    // Observer for specifically the stats section to trigger counters
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(num => animateCounter(num));
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // 4. Subtle Particle Animation (Canvas implementation for Hero background)
    const canvasContainer = document.getElementById('particles');
    if (canvasContainer) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvasContainer.appendChild(canvas);

        let width, height;
        const particlesArray = [];

        function resize() {
            width = canvasContainer.clientWidth;
            height = canvasContainer.clientHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`; // Gold particles
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray.length = 0;
            // Fewer particles for subtlety
            for (let i = 0; i < 50; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // 5. Horizontal Row Assembly Observer
    const horizontalRow = document.getElementById('horizontal-row');

    if (horizontalRow) {
        // Observer for the central assembly animation
        const rowObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('assembled');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        rowObserver.observe(horizontalRow);
    }

    // 6. Hero Image Sequence
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        const frameCount = 61;
        const currentFrame = index => `hero section video/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

        const images = [];

        // Preload first frame to set canvas size
        const firstImg = new Image();
        firstImg.src = currentFrame(1);
        firstImg.onload = () => {
            heroCanvas.width = firstImg.width;
            heroCanvas.height = firstImg.height;
            ctx.drawImage(firstImg, 0, 0);
        };
        images.push(firstImg);

        for (let i = 2; i <= frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        let currentFrameIndex = 0;

        const playSequence = () => {
            setInterval(() => {
                currentFrameIndex = (currentFrameIndex + 1) % frameCount;
                if (images[currentFrameIndex] && images[currentFrameIndex].complete) {
                    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
                    ctx.drawImage(images[currentFrameIndex], 0, 0);
                }
            }, 1000 / 8); // 8fps (from 6fps = ~33% faster)
        };

        playSequence();
    }

    // 7. Events Image Sequence
    const eventsCanvas = document.getElementById('events-canvas');
    if (eventsCanvas) {
        const eventsCtx = eventsCanvas.getContext('2d');
        const eFrameCount = 26;
        const getEventsFrame = index => `Events/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

        const eImages = [];

        // Preload first frame
        const eFirst = new Image();
        eFirst.src = getEventsFrame(1);
        eFirst.onload = () => {
            eventsCanvas.width = eFirst.width;
            eventsCanvas.height = eFirst.height;
            eventsCtx.drawImage(eFirst, 0, 0);
        };
        eImages.push(eFirst);

        for (let i = 2; i <= eFrameCount; i++) {
            const img = new Image();
            img.src = getEventsFrame(i);
            eImages.push(img);
        }

        let eIndex = 0;

        const playEventsSequence = () => {
            setInterval(() => {
                eIndex = (eIndex + 1) % eFrameCount;
                if (eImages[eIndex] && eImages[eIndex].complete && eImages[eIndex].naturalHeight !== 0) {
                    eventsCtx.clearRect(0, 0, eventsCanvas.width, eventsCanvas.height);
                    eventsCtx.drawImage(eImages[eIndex], 0, 0, eventsCanvas.width, eventsCanvas.height);
                }
            }, 1000 / 8); // 8fps roughly
        };

        playEventsSequence();
    }

    // 8. About Us Image Sequence
    const aboutCanvas = document.getElementById('about-canvas');
    if (aboutCanvas) {
        const aboutCtx = aboutCanvas.getContext('2d');
        const aFrameCount = 51;
        const getAboutFrame = index => `final video/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

        const aImages = [];

        // Preload first frame
        const aFirst = new Image();
        aFirst.src = getAboutFrame(1);
        aFirst.onload = () => {
            aboutCanvas.width = aFirst.width;
            aboutCanvas.height = aFirst.height;
            aboutCtx.drawImage(aFirst, 0, 0, aboutCanvas.width, aboutCanvas.height);
        };
        aImages.push(aFirst);

        for (let i = 2; i <= aFrameCount; i++) {
            const img = new Image();
            img.src = getAboutFrame(i);
            aImages.push(img);
        }

        let aIndex = 0;

        // Check if mobile to slow down the video playback (e.g. 4fps instead of 8fps)
        const speed = window.innerWidth <= 900 ? (1000 / 4) : (1000 / 8);

        const playAboutSequence = () => {
            setInterval(() => {
                aIndex = (aIndex + 1) % aFrameCount;
                if (aImages[aIndex] && aImages[aIndex].complete && aImages[aIndex].naturalHeight !== 0) {
                    aboutCtx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
                    aboutCtx.drawImage(aImages[aIndex], 0, 0, aboutCanvas.width, aboutCanvas.height);
                }
            }, speed);
        };

        playAboutSequence();
    }

    // 9. Mobile Card Glow Observer
    const mobileCards = document.querySelectorAll('.horizontal-card');
    if (mobileCards.length > 0) {
        // Only apply special glow behavior on mobile
        if (window.innerWidth <= 900) {
            const cardObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('mobile-active-glow');
                        // Keep them permanently visible once scrolled into view
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15, // Trigger very early (15% in view) so there's no delay
                rootMargin: "0px 0px -10% 0px"
            });

            mobileCards.forEach(card => cardObserver.observe(card));
        }
    }


    // 7. Hero Text Flying In Letters
    const animateHeroText = () => {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');

        if (heroTitle && heroSubtitle) {
            const splitIntoFlyingLetters = (element) => {
                // Read current HTML to detect explicitly styled <br>
                const currentHtml = element.innerHTML;
                element.innerHTML = '';

                // Tokenize <br> so we can split cleanly on spaces
                const tokenizedHtml = currentHtml.replace(/<br\s*\/?>/gi, ' [BR] ');
                const words = tokenizedHtml.split(' ');

                words.forEach(word => {
                    if (word === '') return;
                    if (word === '[BR]') {
                        element.appendChild(document.createElement('br'));
                        return;
                    }

                    // Wrap word in a nowrap container to prevent mid-word breaking
                    const wordSpan = document.createElement('span');
                    wordSpan.style.display = 'inline-block';
                    wordSpan.style.whiteSpace = 'nowrap';

                    word.split('').forEach((char) => {
                        const span = document.createElement('span');
                        span.textContent = char;
                        span.style.display = 'inline-block';
                        span.style.opacity = '0';

                        // Random starting positions
                        const randomX = (Math.random() - 0.5) * 800; // -400px to 400px
                        const randomY = (Math.random() - 0.5) * 800;
                        const randomRot = (Math.random() - 0.5) * 180;
                        const randomZ = Math.random() * 500;

                        span.style.transform = `translate3d(${randomX}px, ${randomY}px, ${randomZ}px) rotate(${randomRot}deg) scale(2)`;

                        // Linear easing to keep animation speed constant start to end
                        span.style.transition = 'opacity 1.5s linear, transform 1.8s linear';

                        wordSpan.appendChild(span);

                        // Trigger reflow and start animation
                        setTimeout(() => {
                            span.style.opacity = '1';
                            span.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
                        }, 50 + (Math.random() * 600)); // slightly staggered start times
                    });

                    element.appendChild(wordSpan);
                    element.appendChild(document.createTextNode(' '));
                });
            };

            // Remove the default CSS fade-up classes to avoid conflicts
            heroTitle.classList.remove('reveal-text');
            heroTitle.style.overflow = 'visible'; // Allow letters to fly in from outside
            heroSubtitle.classList.remove('fade-up');

            splitIntoFlyingLetters(heroTitle);
            splitIntoFlyingLetters(heroSubtitle);
        }
    };

    // call it on load
    animateHeroText();
});
