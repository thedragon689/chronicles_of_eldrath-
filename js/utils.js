// Chronicles of Eldrath - Utility Functions

class Utils {
    // Gestione delle schermate
    static showScreen(screenId) {
        // Nasconde tutte le schermate
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostra la schermata richiesta
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    // Gestione dei pannelli
    static showPanel(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.classList.remove('hidden');
        }
    }

    static hidePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    // Gestione del caricamento
    static updateLoadingProgress(progress, text) {
        const loadingFill = document.getElementById('loading-fill');
        const loadingText = document.getElementById('loading-text');
        
        if (loadingFill) {
            loadingFill.style.width = `${progress}%`;
        }
        
        if (loadingText && text) {
            loadingText.textContent = text;
        }
    }

    // Generazione di numeri casuali
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Calcolo della distanza tra due punti
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Interpolazione lineare
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Clamp di un valore tra min e max
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Conversione di gradi in radianti
    static toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Conversione di radianti in gradi
    static toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    // Rotazione di un punto attorno a un centro
    static rotatePoint(x, y, centerX, centerY, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const dx = x - centerX;
        const dy = y - centerY;
        
        return {
            x: centerX + dx * cos - dy * sin,
            y: centerY + dx * sin + dy * cos
        };
    }

    // Generazione di ID univoci
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Formattazione del tempo
    static formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Formattazione dei numeri grandi
    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Animazione fluida
    static animate(start, end, duration, callback, easing = 'linear') {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            let easedProgress;
            switch (easing) {
                case 'easeIn':
                    easedProgress = progress * progress;
                    break;
                case 'easeOut':
                    easedProgress = 1 - (1 - progress) * (1 - progress);
                    break;
                case 'easeInOut':
                    easedProgress = progress < 0.5 ? 
                        2 * progress * progress : 
                        1 - 2 * (1 - progress) * (1 - progress);
                    break;
                default:
                    easedProgress = progress;
            }
            
            const current = start + (end - start) * easedProgress;
            callback(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // Gestione del suono
    static playSound(soundName, volume = 1.0) {
        // Placeholder per la gestione del suono
        console.log(`Playing sound: ${soundName} at volume: ${volume}`);
    }

    // Gestione delle vibrazioni (per dispositivi mobili)
    static vibrate(pattern) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    // Salvataggio locale
    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    // Caricamento locale
    static loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    // Gestione degli errori
    static handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Qui potresti aggiungere logging più avanzato
        // o notifiche all'utente
    }

    // Debounce per ottimizzare le performance
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle per limitare la frequenza di esecuzione
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Gestione del resize della finestra
    static onResize(callback) {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(callback, 100);
        });
    }

    // Rilevamento del dispositivo
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Gestione del fullscreen
    static toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Gestione della visibilità della pagina
    static onVisibilityChange(callback) {
        document.addEventListener('visibilitychange', callback);
    }

    // Gestione del focus della finestra
    static onWindowFocus(callback) {
        window.addEventListener('focus', callback);
    }

    static onWindowBlur(callback) {
        window.addEventListener('blur', callback);
    }

    // Utility per il debug
    static debug = {
        enabled: false,
        
        log: function(message, data = null) {
            if (this.enabled) {
                if (data) {
                    console.log(`[DEBUG] ${message}`, data);
                } else {
                    console.log(`[DEBUG] ${message}`);
                }
            }
        },
        
        enable: function() {
            this.enabled = true;
            console.log('[DEBUG] Debug mode enabled');
        },
        
        disable: function() {
            this.enabled = false;
            console.log('[DEBUG] Debug mode disabled');
        }
    };

    // Utility per le performance
    static performance = {
        marks: {},
        
        start: function(name) {
            this.marks[name] = performance.now();
        },
        
        end: function(name) {
            if (this.marks[name]) {
                const duration = performance.now() - this.marks[name];
                console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
                delete this.marks[name];
                return duration;
            }
            return 0;
        }
    };
}

// Esporta per uso globale
window.Utils = Utils;
