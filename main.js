document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const diagForm = document.getElementById('diag-form');
    const formSuccess = document.getElementById('form-success');

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Form Handling
    if (diagForm) {
        diagForm.addEventListener('submit', (e) => {
            e.preventDefault();
            diagForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Scroll to the success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .review-card, .about-grid > div, .form-container, .simulator-wrapper').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Interactive Pricing Simulator Logic
    const simDeviceBtns = document.querySelectorAll('#sim-device .btn-select');
    const simRepair = document.getElementById('sim-repair');
    const simStudent = document.getElementById('sim-student');
    const priceValue = document.getElementById('price-value');

    let currentDevice = 'phone';

    // Base Pricing Matrix (Mockup data)
    const pricing = {
        phone: { screen: 65, battery: 45, port: 35, water: 80 },
        pc: { screen: 90, battery: 60, port: 45, water: 120 }
    };

    function updatePrice() {
        const repairType = simRepair.value;
        let basePrice = pricing[currentDevice][repairType];
        
        if (simStudent.checked) {
            basePrice = basePrice * 0.85; // 15% discount
        }

        // Animate price change
        animateValue(priceValue, parseInt(priceValue.innerText), Math.round(basePrice), 300);
    }

    simDeviceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            simDeviceBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDevice = btn.dataset.val;
            
            // Adjust options based on device
            if(currentDevice === 'pc') {
                simRepair.options[0].text = "Substituição de Ecrã Lcd";
                simRepair.options[1].text = "Bateria Interna";
            } else {
                simRepair.options[0].text = "Substituição de Ecrã";
                simRepair.options[1].text = "Substituição de Bateria";
            }
            
            updatePrice();
        });
    });

    simRepair.addEventListener('change', updatePrice);
    simStudent.addEventListener('change', updatePrice);

    // Helper to animate numbers
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Review Form Handling
    const reviewForm = document.getElementById('review-form');
    const reviewSuccess = document.getElementById('review-success');
    const starsInput = document.querySelector('.stars-input');

    if (reviewForm) {
        // Handle stars click via event delegation because Lucide replaces <i> with <svg>
        if (starsInput) {
            starsInput.addEventListener('click', (e) => {
                const clickedSvg = e.target.closest('svg');
                if (!clickedSvg) return;
                
                const allSvgs = Array.from(starsInput.querySelectorAll('svg'));
                const index = allSvgs.indexOf(clickedSvg);
                
                allSvgs.forEach((svg, i) => {
                    if (i <= index) {
                        svg.setAttribute('fill', 'currentColor');
                        svg.style.color = '#ffd700';
                    } else {
                        svg.setAttribute('fill', 'none');
                        svg.style.color = 'var(--text-dim)';
                    }
                });
            });
        }

        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            reviewForm.style.display = 'none';
            reviewSuccess.style.display = 'block';
        });
    }

    // Tracker Logic
    const btnTrack = document.getElementById('btn-track');
    const ticketId = document.getElementById('ticket-id');
    const trackerResult = document.getElementById('tracker-result');
    const progressFill = document.getElementById('progress-fill');
    const trackerMsg = document.getElementById('tracker-msg');
    
    if (btnTrack) {
        btnTrack.addEventListener('click', () => {
            if (ticketId.value.trim() === '') return;
            
            trackerResult.style.display = 'block';
            progressFill.style.width = '0%';
            
            // Reset steps
            document.getElementById('step-diag').style.color = 'var(--text-dim)';
            document.getElementById('step-repair').style.color = 'var(--text-dim)';
            document.getElementById('step-done').style.color = 'var(--text-dim)';
            trackerMsg.style.color = '#fff';
            
            // Mock logic
            setTimeout(() => {
                const val = ticketId.value.toUpperCase();
                if (val.includes('1')) {
                    progressFill.style.width = '33%';
                    document.getElementById('step-diag').style.color = 'var(--primary-blue)';
                    trackerMsg.innerText = "Equipamento em diagnóstico na bancada.";
                } else if (val.includes('2')) {
                    progressFill.style.width = '66%';
                    document.getElementById('step-diag').style.color = 'var(--primary-blue)';
                    document.getElementById('step-repair').style.color = 'var(--primary-blue)';
                    trackerMsg.innerText = "Orçamento aprovado. Reparação em curso.";
                } else {
                    progressFill.style.width = '100%';
                    document.getElementById('step-diag').style.color = 'var(--primary-blue)';
                    document.getElementById('step-repair').style.color = 'var(--primary-blue)';
                    document.getElementById('step-done').style.color = 'var(--primary-green)';
                    trackerMsg.innerText = "Equipamento pronto para levantamento!";
                    trackerMsg.style.color = 'var(--primary-green)';
                }
            }, 100);
        });
    }

    // Initialize price
    if (simDeviceBtns.length > 0) {
        updatePrice();
    }
});
