// Chronicles of Eldrath - Gestore Audio
// Sistema per gestire musica di menu e gioco con file MP3 reali

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.menuMusic = null;
        this.gameMusic = null;
        this.currentMusic = null;
        this.isPlaying = false;
        this.loop = true;
        this.volume = 0.7;
        
        this.musicTracks = {
            menu: {
                path: 'musica/menu/Echi di Leggende (1).mp3',
                name: 'Echi di Leggende - Menu',
                description: 'Musica per menu principale e selezione personaggio'
            },
            game: {
                path: 'musica/gioco/Echi di Leggende.mp3',
                name: 'Echi di Leggende - Gioco',
                description: 'Musica per il gameplay'
            }
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Inizializza l'audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.audioContext.destination);
            
            // Precarica le tracce audio
            await this.preloadTracks();
            
            // Sistema di autoplay intelligente
            this.setupAutoplaySystem();
            
            console.log('🎵 Gestore audio inizializzato con successo - Sistema autoplay configurato');
            
        } catch (error) {
            console.error('Errore nell\'inizializzazione del gestore audio:', error);
        }
    }
    
    async preloadTracks() {
        try {
            console.log('🎵 Inizio precaricamento tracce audio...');
            
            // Precarica la musica del menu
            console.log(`🎵 Caricamento: ${this.musicTracks.menu.path}`);
            this.menuMusic = await this.loadAudioTrack(this.musicTracks.menu.path);
            this.menuMusic.loop = this.loop;
            console.log('✅ Musica menu caricata:', this.menuMusic);
            
            // Precarica la musica del gioco
            console.log(`🎵 Caricamento: ${this.musicTracks.game.path}`);
            this.gameMusic = await this.loadAudioTrack(this.musicTracks.game.path);
            this.gameMusic.loop = this.loop;
            console.log('✅ Musica gioco caricata:', this.gameMusic);
            
            console.log('🎵 Tracce audio precaricate con successo');
            
        } catch (error) {
            console.error('❌ Errore nel precaricamento delle tracce:', error);
        }
    }
    
    async loadAudioTrack(path) {
        return new Promise((resolve, reject) => {
            console.log(`🎵 Creazione elemento audio per: ${path}`);
            const audio = new Audio();
            
            // Eventi di debug
            audio.addEventListener('loadstart', () => {
                console.log(`🎵 Loadstart per: ${path}`);
            });
            
            audio.addEventListener('durationchange', () => {
                console.log(`🎵 Durata cambiata per: ${path} - ${audio.duration}s`);
            });
            
            audio.addEventListener('loadedmetadata', () => {
                console.log(`🎵 Metadata caricati per: ${path}`);
            });
            
            audio.addEventListener('canplay', () => {
                console.log(`🎵 Canplay per: ${path}`);
            });
            
            audio.addEventListener('canplaythrough', () => {
                console.log(`🎵 Canplaythrough per: ${path} - Audio pronto!`);
                resolve(audio);
            }, { once: true });
            
            audio.addEventListener('error', (error) => {
                console.error(`❌ Errore audio per: ${path}`, error);
                console.error(`❌ Codice errore: ${audio.error?.code}`);
                console.error(`❌ Messaggio errore: ${audio.error?.message}`);
                reject(new Error(`Errore nel caricamento di ${path}: ${audio.error?.message || error.message}`));
            });
            
            audio.addEventListener('abort', () => {
                console.log(`🎵 Caricamento abortito per: ${path}`);
            });
            
            console.log(`🎵 Impostazione src: ${path}`);
            audio.src = path;
            audio.load();
            
            // Timeout di sicurezza
            setTimeout(() => {
                if (audio.readyState < 3) { // HAVE_FUTURE_DATA
                    console.warn(`⚠️ Timeout caricamento per: ${path}`);
                    reject(new Error(`Timeout caricamento per: ${path}`));
                }
            }, 10000); // 10 secondi
        });
    }
    
    // Riproduce la musica del menu
    playMenuMusic() {
        if (this.currentMusic === this.menuMusic && this.isPlaying) {
            return; // Già in riproduzione
        }
        
        this.stopCurrentMusic();
        
        if (this.menuMusic) {
            this.currentMusic = this.menuMusic;
            this.currentMusic.volume = this.volume;
            this.currentMusic.loop = this.loop;
            
            // Riproduzione diretta (ora dovrebbe funzionare)
            this.currentMusic.play().then(() => {
                this.isPlaying = true;
                console.log(`🎵 Riproduzione menu: ${this.musicTracks.menu.name}`);
            }).catch(error => {
                console.log('🎵 Riproduzione diretta fallita, riprovo...');
                this.attemptImmediateAutoplay();
            });
        }
    }
    
    // Riproduce la musica del gioco
    playGameMusic() {
        if (this.currentMusic === this.gameMusic && this.isPlaying) {
            return; // Già in riproduzione
        }
        
        this.stopCurrentMusic();
        
        if (this.gameMusic) {
            this.currentMusic = this.gameMusic;
            this.currentMusic.volume = this.volume;
            this.currentMusic.loop = this.loop;
            
            // Riproduzione diretta (ora dovrebbe funzionare)
            this.currentMusic.play().then(() => {
                this.isPlaying = true;
                console.log(`🎵 Riproduzione gioco: ${this.musicTracks.game.name}`);
            }).catch(error => {
                console.log('🎵 Riproduzione diretta fallita, riprovo...');
                this.attemptImmediateAutoplay();
            });
        }
    }
    
    // Gestisce l'autoplay con fallback intelligente
    attemptAutoplay(audio, trackType) {
        // Prima prova: riproduzione diretta
        audio.play().then(() => {
            this.isPlaying = true;
            console.log(`🎵 Riproduzione automatica ${trackType}: ${this.musicTracks[trackType].name}`);
        }).catch(error => {
            console.warn(`Autoplay bloccato per ${trackType}:`, error.message);
            
            // Seconda prova: dopo interazione utente
            this.setupAutoplayOnInteraction(audio, trackType);
        });
    }
    
    // Sistema di autoplay intelligente e silenzioso
    setupAutoplaySystem() {
        // Prima prova: avvio immediato
        this.attemptImmediateAutoplay();
        
        // Seconda prova: dopo interazione utente
        this.setupInteractionAutoplay();
        
        // Terza prova: dopo un breve delay
        setTimeout(() => {
            if (!this.isPlaying) {
                this.attemptDelayedAutoplay();
            }
        }, 1000);
    }
    
    // Prova autoplay immediato
    attemptImmediateAutoplay() {
        if (this.menuMusic) {
            console.log('🎵 Tentativo autoplay immediato...');
            console.log('🎵 Stato audio:', this.menuMusic.readyState);
            console.log('🎵 Durata:', this.menuMusic.duration);
            console.log('🎵 Src:', this.menuMusic.src);
            
            this.menuMusic.volume = 0.1; // Volume basso per iniziare
            this.menuMusic.play().then(() => {
                this.isPlaying = true;
                this.currentMusic = this.menuMusic;
                this.menuMusic.volume = this.volume; // Ripristina volume normale
                console.log('🎵 Autoplay immediato riuscito!');
                console.log('🎵 Volume impostato a:', this.volume);
            }).catch(error => {
                console.log('🎵 Autoplay immediato fallito:', error.message);
                console.log('🎵 Codice errore:', error.name);
                console.log('🎵 Attendo interazione utente...');
            });
        } else {
            console.log('❌ menuMusic non disponibile per autoplay');
        }
    }
    
    // Configura autoplay dopo interazione
    setupInteractionAutoplay() {
        const events = ['click', 'keydown', 'touchstart', 'mousedown'];
        
        const startMusic = () => {
            console.log('🎵 Interazione utente rilevata, avvio musica...');
            
            if (!this.isPlaying && this.menuMusic) {
                console.log('🎵 Tentativo riproduzione dopo interazione...');
                console.log('🎵 Stato audio:', this.menuMusic.readyState);
                console.log('🎵 Volume corrente:', this.menuMusic.volume);
                
                this.menuMusic.play().then(() => {
                    this.isPlaying = true;
                    this.currentMusic = this.menuMusic;
                    console.log('🎵 Musica avviata dopo interazione utente!');
                    console.log('🎵 Riproduzione attiva:', this.isPlaying);
                }).catch(error => {
                    console.log('🎵 Errore nell\'avvio dopo interazione:', error.message);
                    console.log('🎵 Codice errore:', error.name);
                });
                
                // Rimuovi gli event listener dopo il primo avvio
                events.forEach(event => {
                    document.removeEventListener(event, startMusic);
                });
            } else {
                console.log('🎵 Condizioni non soddisfatte per avvio:', {
                    isPlaying: this.isPlaying,
                    hasMenuMusic: !!this.menuMusic
                });
            }
        };
        
        events.forEach(event => {
            document.addEventListener(event, startMusic, { once: true });
            console.log(`🎵 Event listener aggiunto per: ${event}`);
        });
        
        console.log('🎵 Sistema autoplay post-interazione configurato');
    }
    
    // Prova autoplay ritardato
    attemptDelayedAutoplay() {
        if (!this.isPlaying && this.menuMusic) {
            console.log('🎵 Tentativo autoplay ritardato...');
            this.menuMusic.play().then(() => {
                this.isPlaying = true;
                this.currentMusic = this.menuMusic;
                console.log('🎵 Autoplay ritardato riuscito!');
            }).catch(error => {
                console.log('🎵 Autoplay ritardato fallito:', error.message);
                console.log('🎵 Sistema in attesa...');
            });
        } else {
            console.log('🎵 Condizioni non soddisfatte per autoplay ritardato');
        }
    }
    
    // Funzione di test per debug
    testAudio() {
        console.log('🎵 === TEST AUDIO ===');
        console.log('🎵 Stato generale:', {
            isPlaying: this.isPlaying,
            hasMenuMusic: !!this.menuMusic,
            hasGameMusic: !!this.gameMusic,
            currentMusic: this.currentMusic,
            volume: this.volume,
            loop: this.loop
        });
        
        if (this.menuMusic) {
            console.log('🎵 Menu Music:', {
                readyState: this.menuMusic.readyState,
                duration: this.menuMusic.duration,
                src: this.menuMusic.src,
                volume: this.menuMusic.volume,
                paused: this.menuMusic.paused,
                ended: this.menuMusic.ended
            });
        }
        
        if (this.gameMusic) {
            console.log('🎵 Game Music:', {
                readyState: this.gameMusic.readyState,
                duration: this.gameMusic.duration,
                src: this.gameMusic.src,
                volume: this.gameMusic.volume,
                paused: this.gameMusic.paused,
                ended: this.gameMusic.ended
            });
        }
        
        console.log('🎵 === FINE TEST ===');
    }
    
    // Configura l'autoplay dopo la prima interazione utente
    setupAutoplayOnInteraction(audio, trackType) {
        const interactionEvents = ['click', 'keydown', 'touchstart', 'mousedown'];
        
        const startMusicOnInteraction = () => {
            audio.play().then(() => {
                this.isPlaying = true;
                console.log(`🎵 Musica ${trackType} avviata dopo interazione utente`);
                
                // Rimuovi tutti i listener
                interactionEvents.forEach(event => {
                    document.removeEventListener(event, startMusicOnInteraction, true);
                });
            }).catch(error => {
                console.error(`Errore nell'avvio della musica ${trackType}:`, error);
            });
        };
        
        // Aggiungi listener per tutti gli eventi di interazione
        interactionEvents.forEach(event => {
            document.addEventListener(event, startMusicOnInteraction, true);
        });
        
        console.log(`⏳ In attesa di interazione utente per avviare la musica ${trackType}...`);
    }
    

    
    // Ferma la musica corrente
    stopCurrentMusic() {
        if (this.currentMusic && this.isPlaying) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.isPlaying = false;
        }
    }
    
    // Mette in pausa la musica corrente
    pauseMusic() {
        if (this.currentMusic && this.isPlaying) {
            this.currentMusic.pause();
            this.isPlaying = false;
            console.log('⏸️ Musica in pausa');
        }
    }
    
    // Riprende la musica corrente
    resumeMusic() {
        if (this.currentMusic && !this.isPlaying) {
            this.currentMusic.play().then(() => {
                this.isPlaying = true;
                console.log('🎵 Musica ripresa con successo');
            }).catch(error => {
                console.log('🎵 Errore nel riprendere la musica:', error.message);
            });
        }
    }
    
    // Controlli di volume
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        if (this.currentMusic) {
            this.currentMusic.volume = this.volume;
        }
        
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
        
        console.log(`🔊 Volume impostato a: ${Math.round(this.volume * 100)}%`);
    }
    
    // Controllo loop
    toggleLoop() {
        this.loop = !this.loop;
        
        if (this.currentMusic) {
            this.currentMusic.loop = this.loop;
        }
        
        console.log(`🔄 Loop ${this.loop ? 'abilitato' : 'disabilitato'}`);
        return this.loop;
    }
    
    // Cambia traccia
    switchTrack(trackType) {
        if (trackType === 'menu') {
            this.playMenuMusic();
        } else if (trackType === 'game') {
            this.playGameMusic();
        }
    }
    
    // Transizione graduale tra tracce
    crossfadeTracks(fromTrack, toTrack, duration = 2000) {
        if (!fromTrack || !toTrack) return;
        
        const fadeOut = fromTrack;
        const fadeIn = toTrack;
        
        // Fade out della traccia corrente
        const fadeOutInterval = setInterval(() => {
            if (fadeOut.volume > 0.01) {
                fadeOut.volume -= 0.01;
            } else {
                clearInterval(fadeOutInterval);
                fadeOut.pause();
                fadeOut.currentTime = 0;
            }
        }, duration / 100);
        
        // Fade in della nuova traccia
        fadeIn.volume = 0;
        fadeIn.play();
        
        const fadeInInterval = setInterval(() => {
            if (fadeIn.volume < this.volume) {
                fadeIn.volume += 0.01;
            } else {
                clearInterval(fadeInInterval);
                fadeIn.volume = this.volume;
            }
        }, duration / 100);
        
        this.currentMusic = fadeIn;
        this.isPlaying = true;
    }
    
    // Gestione autoplay policy - Sistema automatico silenzioso
    showAutoplayMessage() {
        // Non mostra messaggi - sistema completamente automatico
        console.log('🎵 Sistema audio automatico - Riproduzione in background');
    }
    
    // Metodi di utilità
    getCurrentTrackInfo() {
        if (!this.currentMusic) return null;
        
        if (this.currentMusic === this.menuMusic) {
            return this.musicTracks.menu;
        } else if (this.currentMusic === this.gameMusic) {
            return this.musicTracks.game;
        }
        
        return null;
    }
    
    // Ottiene il tipo di traccia corrente
    getCurrentTrackType() {
        if (!this.currentMusic) return null;
        
        if (this.currentMusic === this.menuMusic) {
            return 'menu';
        } else if (this.currentMusic === this.gameMusic) {
            return 'game';
        }
        
        return null;
    }
    
    getStatus() {
        return {
            isPlaying: this.isPlaying,
            loop: this.loop,
            volume: this.volume,
            currentTrack: this.getCurrentTrackInfo(),
            audioContextState: this.audioContext ? this.audioContext.state : 'not_initialized'
        };
    }
    
    // Cleanup
    destroy() {
        this.stopCurrentMusic();
        
        if (this.menuMusic) {
            this.menuMusic.src = '';
        }
        
        if (this.gameMusic) {
            this.gameMusic.src = '';
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Inizializzazione e controllo globale
let audioManager = null;

// Funzioni globali per il controllo dell'audio
window.initAudioManager = function() {
    audioManager = new AudioManager();
    return audioManager;
};

window.playMenuMusic = function() {
    if (audioManager) {
        audioManager.playMenuMusic();
    }
};

window.playGameMusic = function() {
    if (audioManager) {
        audioManager.playGameMusic();
    }
};

window.pauseMusic = function() {
    if (audioManager) {
        audioManager.pauseMusic();
    }
};

window.resumeMusic = function() {
    if (audioManager) {
        audioManager.resumeMusic();
    }
};

window.stopMusic = function() {
    if (audioManager) {
        audioManager.stopCurrentMusic();
    }
};

window.setAudioVolume = function(volume) {
    if (audioManager) {
        audioManager.setVolume(volume);
    }
};

window.toggleAudioLoop = function() {
    if (audioManager) {
        return audioManager.toggleLoop();
    }
    return false;
};

window.switchAudioTrack = function(trackType) {
    if (audioManager) {
        audioManager.switchTrack(trackType);
    }
};

window.getAudioStatus = function() {
    if (audioManager) {
        return audioManager.getStatus();
    }
    return null;
};

// Esporta la classe
window.AudioManager = AudioManager;
