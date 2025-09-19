// Enhanced Audio Demo Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navigation').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight active navigation item
    function updateActiveNav() {
        const sections = document.querySelectorAll('.section');
        const navHeight = document.querySelector('.navigation').offsetHeight;
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call

    // Audio player enhancements
    const audioPlayers = document.querySelectorAll('.audio-player');
    
    audioPlayers.forEach(player => {
        // Stop other players when one starts playing
        player.addEventListener('play', function() {
            audioPlayers.forEach(otherPlayer => {
                if (otherPlayer !== player && !otherPlayer.paused) {
                    otherPlayer.pause();
                }
            });
        });

        // Add loading state
        player.addEventListener('loadstart', function() {
            this.closest('.audio-item, .comparison-item').classList.add('loading');
        });

        player.addEventListener('canplay', function() {
            this.closest('.audio-item, .comparison-item').classList.remove('loading');
        });

        // Add error handling
        player.addEventListener('error', function() {
            this.closest('.audio-item, .comparison-item').classList.add('error');
            console.warn('Audio failed to load:', this.src);
        });
    });

    // Copy citation functionality
    const citationBox = document.querySelector('.citation-box');
    if (citationBox) {
        citationBox.addEventListener('click', function() {
            const citationText = this.textContent;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(citationText).then(() => {
                    showToast('Citation copied to clipboard!');
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = citationText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Citation copied to clipboard!');
            }
        });

        // Add hover effect
        citationBox.style.cursor = 'pointer';
        citationBox.title = 'Click to copy citation';
    }

    // Toast notification function
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Add playback progress indicators
    audioPlayers.forEach(player => {
        const container = player.closest('.audio-item, .comparison-item');
        
        player.addEventListener('timeupdate', function() {
            if (this.duration) {
                const progress = (this.currentTime / this.duration) * 100;
                updateProgressIndicator(container, progress);
            }
        });

        player.addEventListener('ended', function() {
            updateProgressIndicator(container, 0);
        });
    });

    function updateProgressIndicator(container, progress) {
        let indicator = container.querySelector('.progress-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'progress-indicator';
            indicator.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #667eea, #764ba2);
                transition: width 0.1s linear;
                border-radius: 0 0 12px 12px;
            `;
            container.style.position = 'relative';
            container.appendChild(indicator);
        }
        indicator.style.width = progress + '%';
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections for animations
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Add animation styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .nav-list a.active {
            color: #667eea;
            border-bottom-color: #667eea;
            background-color: #f7fafc;
        }
        
        .audio-item.loading::after,
        .comparison-item.loading::after {
            content: 'Loading...';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 0.9rem;
            color: #667eea;
        }
        
        .audio-item.error .audio-player,
        .comparison-item.error .audio-player {
            opacity: 0.5;
            pointer-events: none;
        }
        
        .audio-item.error::after,
        .comparison-item.error::after {
            content: 'Failed to load audio';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 0.9rem;
        }
    `;
    document.head.appendChild(animationStyles);
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Pause all audio players
        document.querySelectorAll('.audio-player').forEach(player => {
            if (!player.paused) {
                player.pause();
            }
        });
    }
});

// Performance optimization: Lazy load audio
function lazyLoadAudio() {
    const audioElements = document.querySelectorAll('audio[data-src]');
    
    const audioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const audio = entry.target;
                audio.src = audio.dataset.src;
                audio.load();
                audioObserver.unobserve(audio);
            }
        });
    });

    audioElements.forEach(audio => {
        audioObserver.observe(audio);
    });
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadAudio);