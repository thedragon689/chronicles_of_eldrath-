// Chronicles of Eldrath - Sistema Musicale Fantasy
// Composizione originale per menu principale e selezione personaggio

class FantasyMusic {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.musicGain = null;
        this.ambientGain = null;
        this.isPlaying = false;
        this.currentTrack = null;
        this.loop = true;
        
        this.instruments = {};
        this.notes = {};
        this.chords = {};
        
        this.init();
    }
    
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.musicGain = this.audioContext.createGain();
            this.ambientGain = this.audioContext.createGain();
            
            // Configurazione dei volumi
            this.masterGain.gain.value = 0.7;
            this.musicGain.gain.value = 0.8;
            this.ambientGain.gain.value = 0.6;
            
            // Connessioni audio
            this.musicGain.connect(this.masterGain);
            this.ambientGain.connect(this.masterGain);
            this.masterGain.connect(this.audioContext.destination);
            
            // Inizializza gli strumenti
            await this.initInstruments();
            
            // Inizializza note e accordi
            this.initNotes();
            this.initChords();
            
            console.log('Sistema musicale fantasy inizializzato');
            
        } catch (error) {
            console.error('Errore nell\'inizializzazione del sistema musicale:', error);
        }
    }
    
    async initInstruments() {
        // Arpa celtica
        this.instruments.harp = this.createHarp();
        
        // Archi (violini, viole, violoncelli)
        this.instruments.strings = this.createStrings();
        
        // Flauto dolce
        this.instruments.flute = this.createFlute();
        
        // Coro etereo (voci femminili)
        this.instruments.choir = this.createChoir();
        
        // Corni francesi
        this.instruments.frenchHorns = this.createFrenchHorns();
        
        // Percussioni leggere
        this.instruments.percussion = this.createPercussion();
    }
    
    createHarp() {
        const gain = this.audioContext.createGain();
        gain.gain.value = 0.4;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        filter.Q.value = 1;
        
        gain.connect(filter);
        filter.connect(this.musicGain);
        
        return { gain, filter, type: 'harp' };
    }
    
    createStrings() {
        const gain = this.audioContext.createGain();
        gain.gain.value = 0.3;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
        filter.Q.value = 0.8;
        
        const reverb = this.createReverb(2.0, 0.8);
        
        gain.connect(filter);
        filter.connect(reverb);
        reverb.connect(this.musicGain);
        
        return { gain, filter, reverb, type: 'strings' };
    }
    
    createFlute() {
        const gain = this.audioContext.createGain();
        gain.gain.value = 0.5;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1500;
        filter.Q.value = 2;
        
        gain.connect(filter);
        filter.connect(this.musicGain);
        
        return { gain, filter, type: 'flute' };
    }
    
    createChoir() {
        const gain = this.audioContext.createGain();
        gain.gain.value = 0.25;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 200;
        filter.Q.value = 1.5;
        
        const reverb = this.createReverb(3.0, 0.9);
        
        gain.connect(filter);
        filter.connect(reverb);
        reverb.connect(this.ambientGain);
        
        return { gain, filter, reverb, type: 'choir' };
    }
    
    createFrenchHorns() {
        const gain = this.audioContext.createGain();
        gain.gain.value = 0.35;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1500;
        filter.Q.value = 1.2;
        
        gain.connect(filter);
        filter.connect(this.musicGain);
        
        return { gain, filter, type: 'frenchHorns' };
    }
    
    createPercussion() {
        const gain = this.audioContext.createGain();
        gain.gain.value = 0.2;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 100;
        filter.Q.value = 1;
        
        gain.connect(filter);
        filter.connect(this.musicGain);
        
        return { gain, filter, type: 'percussion' };
    }
    
    createReverb(duration, decay) {
        const reverb = this.audioContext.createConvolver();
        const impulse = this.audioContext.createBuffer(2, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < channelData.length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / channelData.length, decay);
            }
        }
        
        reverb.buffer = impulse;
        return reverb;
    }
    
    initNotes() {
        // Scala minore naturale in D (Re minore)
        this.notes = {
            'D': 146.83,   // Re
            'E': 164.81,   // Mi
            'F': 174.61,   // Fa
            'G': 196.00,   // Sol
            'A': 220.00,   // La
            'Bb': 233.08,  // Si bemolle
            'C': 261.63,   // Do
            'D2': 293.66   // Re ottava superiore
        };
    }
    
    initChords() {
        // Accordi modali per atmosfera fantasy
        this.chords = {
            'Dm': ['D', 'F', 'A'],
            'Gm': ['G', 'Bb', 'D'],
            'Am': ['A', 'C', 'E'],
            'F': ['F', 'A', 'C'],
            'Bb': ['Bb', 'D', 'F'],
            'Cm': ['C', 'Eb', 'G'],
            'Em': ['E', 'G', 'B']
        };
    }
    
    playNote(frequency, duration, instrument, startTime = 0) {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        // Configurazione dell'oscillatore
        oscillator.frequency.value = frequency;
        oscillator.type = this.getOscillatorType(instrument.type);
        
        // Configurazione dell'inviluppo
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        // Connessioni
        oscillator.connect(gain);
        gain.connect(instrument.gain);
        
        // Avvio e stop
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
        
        return { oscillator, gain };
    }
    
    getOscillatorType(instrumentType) {
        switch (instrumentType) {
            case 'harp': return 'triangle';
            case 'strings': return 'sine';
            case 'flute': return 'sine';
            case 'choir': return 'sine';
            case 'frenchHorns': return 'sawtooth';
            case 'percussion': return 'square';
            default: return 'sine';
        }
    }
    
    playChord(chordName, duration, instrument, startTime = 0) {
        const chord = this.chords[chordName];
        if (!chord) return;
        
        chord.forEach((note, index) => {
            const frequency = this.notes[note];
            if (frequency) {
                this.playNote(frequency, duration, instrument, startTime + (index * 0.1));
            }
        });
    }
    
    // Traccia principale: "Destino di Eldrath"
    playMainTheme() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        const startTime = this.audioContext.currentTime;
        
        console.log('🎵 Riproduzione traccia principale: "Destino di Eldrath"');
        
        // INTRODUZIONE (0:00 - 0:30)
        // Arpeggio di arpa con accordi
        this.playHarpArpeggio(startTime);
        
        // Archi leggeri in sottofondo
        this.playStringsBackground(startTime);
        
        // MELODIA PRINCIPALE (0:30 - 1:00)
        // Flauto dolce introduce la melodia
        this.playFluteMelody(startTime + 30);
        
        // Coro etereo entra gradualmente
        this.playChoirEthereal(startTime + 35);
        
        // SVILUPPO (1:00 - 1:45)
        // Violoncelli e corni francesi
        this.playCrescendoSection(startTime + 60);
        
        // CLIMAX (1:45 - 2:15)
        // Tutti gli strumenti insieme
        this.playClimaxSection(startTime + 105);
        
        // CONCLUSIONE (2:15 - 2:45)
        // Ritorno graduale all'arpa
        this.playConclusion(startTime + 135);
        
        // Loop della traccia
        if (this.loop) {
            setTimeout(() => {
                if (this.isPlaying) {
                    this.playMainTheme();
                }
            }, 165000); // 2 minuti e 45 secondi
        }
    }
    
    playHarpArpeggio(startTime) {
        const arpeggioPattern = [
            { chord: 'Dm', time: 0 },
            { chord: 'Gm', time: 2 },
            { chord: 'Am', time: 4 },
            { chord: 'F', time: 6 },
            { chord: 'Gm', time: 8 },
            { chord: 'Dm', time: 10 },
            { chord: 'Bb', time: 12 },
            { chord: 'F', time: 14 }
        ];
        
        arpeggioPattern.forEach((pattern, index) => {
            const time = startTime + pattern.time;
            this.playChord(pattern.chord, 1.8, this.instruments.harp, time);
        });
    }
    
    playStringsBackground(startTime) {
        // Archi che suonano accordi in sottofondo
        const stringPattern = [
            { chord: 'Dm', time: 0, duration: 4 },
            { chord: 'Gm', time: 4, duration: 4 },
            { chord: 'Am', time: 8, duration: 4 },
            { chord: 'F', time: 12, duration: 4 }
        ];
        
        stringPattern.forEach((pattern, index) => {
            const time = startTime + pattern.time;
            this.playChord(pattern.chord, pattern.duration, this.instruments.strings, time);
        });
    }
    
    playFluteMelody(startTime) {
        // Melodia principale del flauto
        const melody = [
            { note: 'D', duration: 2, time: 0 },
            { note: 'F', duration: 1, time: 2 },
            { note: 'G', duration: 1, time: 3 },
            { note: 'A', duration: 2, time: 4 },
            { note: 'G', duration: 1, time: 6 },
            { note: 'F', duration: 1, time: 7 },
            { note: 'D', duration: 2, time: 8 },
            { note: 'D2', duration: 2, time: 10 }
        ];
        
        melody.forEach((note, index) => {
            const time = startTime + note.time;
            const frequency = this.notes[note.note];
            if (frequency) {
                this.playNote(frequency, note.duration, this.instruments.flute, time);
            }
        });
    }
    
    playChoirEthereal(startTime) {
        // Coro etereo con note lunghe
        const choirNotes = [
            { note: 'D', duration: 8, time: 0 },
            { note: 'A', duration: 8, time: 4 },
            { note: 'F', duration: 8, time: 8 },
            { note: 'D', duration: 8, time: 12 }
        ];
        
        choirNotes.forEach((note, index) => {
            const time = startTime + note.time;
            const frequency = this.notes[note.note];
            if (frequency) {
                this.playNote(frequency, note.duration, this.instruments.choir, time);
            }
        });
    }
    
    playCrescendoSection(startTime) {
        // Violoncelli e corni francesi
        const crescendoChords = [
            { chord: 'Dm', time: 0, duration: 6 },
            { chord: 'Gm', time: 6, duration: 6 },
            { chord: 'Am', time: 12, duration: 6 },
            { chord: 'F', time: 18, duration: 6 }
        ];
        
        crescendoChords.forEach((pattern, index) => {
            const time = startTime + pattern.time;
            this.playChord(pattern.chord, pattern.duration, this.instruments.frenchHorns, time);
        });
    }
    
    playClimaxSection(startTime) {
        // Tutti gli strumenti insieme
        const climaxChords = [
            { chord: 'Dm', time: 0, duration: 8 },
            { chord: 'Gm', time: 8, duration: 8 },
            { chord: 'Am', time: 16, duration: 8 },
            { chord: 'F', time: 24, duration: 8 }
        ];
        
        climaxChords.forEach((pattern, index) => {
            const time = startTime + pattern.time;
            // Arpa
            this.playChord(pattern.chord, pattern.duration, this.instruments.harp, time);
            // Archi
            this.playChord(pattern.chord, pattern.duration, this.instruments.strings, time + 0.5);
            // Cori
            this.playChord(pattern.chord, pattern.duration, this.instruments.choir, time + 1);
        });
    }
    
    playConclusion(startTime) {
        // Ritorno graduale all'arpa
        const conclusionChords = [
            { chord: 'Dm', time: 0, duration: 4 },
            { chord: 'Gm', time: 4, duration: 4 },
            { chord: 'Dm', time: 8, duration: 4 }
        ];
        
        conclusionChords.forEach((pattern, index) => {
            const time = startTime + pattern.time;
            this.playChord(pattern.chord, pattern.duration, this.instruments.harp, time);
        });
    }
    
    // Controlli di riproduzione
    play() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this.playMainTheme();
    }
    
    pause() {
        this.isPlaying = false;
        console.log('⏸️ Musica in pausa');
    }
    
    stop() {
        this.isPlaying = false;
        console.log('⏹️ Musica fermata');
    }
    
    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }
    
    setMusicVolume(volume) {
        if (this.musicGain) {
            this.musicGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }
    
    setAmbientVolume(volume) {
        if (this.ambientGain) {
            this.ambientGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }
    
    toggleLoop() {
        this.loop = !this.loop;
        console.log(`🔄 Loop ${this.loop ? 'abilitato' : 'disabilitato'}`);
    }
    
    // Metodi di utilità
    getStatus() {
        return {
            isPlaying: this.isPlaying,
            loop: this.loop,
            masterVolume: this.masterGain ? this.masterGain.gain.value : 0,
            musicVolume: this.musicGain ? this.musicGain.gain.value : 0,
            ambientVolume: this.ambientGain ? this.ambientGain.gain.value : 0
        };
    }
}

// Inizializzazione e controllo globale
let fantasyMusic = null;

// Funzioni globali per il controllo della musica
window.initFantasyMusic = function() {
    fantasyMusic = new FantasyMusic();
    return fantasyMusic;
};

window.playFantasyMusic = function() {
    if (fantasyMusic) {
        fantasyMusic.play();
    }
};

window.pauseFantasyMusic = function() {
    if (fantasyMusic) {
        fantasyMusic.pause();
    }
};

window.stopFantasyMusic = function() {
    if (fantasyMusic) {
        fantasyMusic.stop();
    }
};

window.setMusicVolume = function(volume) {
    if (fantasyMusic) {
        fantasyMusic.setVolume(volume);
    }
};

window.toggleMusicLoop = function() {
    if (fantasyMusic) {
        fantasyMusic.toggleLoop();
    }
};

window.getMusicStatus = function() {
    if (fantasyMusic) {
        return fantasyMusic.getStatus();
    }
    return null;
};

// Esporta la classe
window.FantasyMusic = FantasyMusic;
