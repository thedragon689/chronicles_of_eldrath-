// Chronicles of Eldrath - File Principale

// Variabili globali
let game = null;
let currentCharacterData = null;

// Inizializzazione del gioco quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chronicles of Eldrath - Inizializzazione...');
    
    // Abilita il debug se necessario
    if (window.location.search.includes('debug=true')) {
        Utils.debug.enable();
    }
    
    // Inizializza le schermate
    initializeScreens();
    
    // Inizializza la creazione del personaggio
    initializeCharacterCreation();
    
    // Inizializza il sistema audio
    initializeAudioSystem();
    
    // Inizializza il sistema di asset grafici
    initializeGraphicsSystem();
    
    console.log('Inizializzazione completata!');
});

// Inizializzazione delle schermate
function initializeScreens() {
    // Pulsanti della schermata di benvenuto
    const newGameBtn = document.getElementById('new-game-btn');
    const loadGameBtn = document.getElementById('load-game-btn');
    const settingsBtn = document.getElementById('settings-btn');
    
    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => {
            Utils.showScreen('character-creation');
        });
    }
    
    if (loadGameBtn) {
        loadGameBtn.addEventListener('click', () => {
            loadExistingGame();
        });
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            openSettings();
        });
    }
    
    // Pulsante per tornare alla schermata di benvenuto
    const backToWelcomeBtn = document.getElementById('back-to-welcome');
    if (backToWelcomeBtn) {
        backToWelcomeBtn.addEventListener('click', () => {
            Utils.showScreen('welcome-screen');
        });
    }
}

// Inizializzazione della creazione del personaggio
function initializeCharacterCreation() {
    // Selezione della classe
    const classOptions = document.querySelectorAll('.class-option');
    classOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectClass(option);
        });
    });
    
    // Selezione della difficoltà
    const difficultyOptions = document.querySelectorAll('input[name="difficulty"]');
    difficultyOptions.forEach(option => {
        option.addEventListener('change', () => {
            updateStartButton();
        });
    });
    
    // Campo nome del personaggio
    const characterNameInput = document.getElementById('character-name');
    if (characterNameInput) {
        characterNameInput.addEventListener('input', () => {
            updateStartButton();
        });
    }
    
    // Pulsante per iniziare il gioco
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            startNewGame();
        });
    }
}

// Inizializzazione del sistema audio
function initializeAudioSystem() {
    try {
        // Inizializza il gestore audio
        window.audioManager = new AudioManager();
        
        // Inizializza i controlli audio
        initializeAudioControls();
        
        // Aggiorna le informazioni della traccia
        updateTrackInfo();
        
        console.log('🎵 Sistema audio inizializzato con successo - Sistema autoplay configurato');
        
    } catch (error) {
        console.error('Errore nell\'inizializzazione del sistema audio:', error);
    }
}

// Inizializzazione del sistema di asset grafici
async function initializeGraphicsSystem() {
    try {
        if (window.GameAssets) {
            console.log('🎨 Inizializzazione sistema asset grafici...');
            
            // Precarica tutti gli asset
            await window.GameAssets.preloadAssets();
            
            console.log('🎨 Sistema asset grafici inizializzato con successo!');
        } else {
            console.warn('🎨 GameAssets non disponibile, sistema grafico non inizializzato');
        }
        
    } catch (error) {
        console.error('❌ Errore nell\'inizializzazione del sistema grafico:', error);
    }
}

// Inizializzazione del sistema audio automatico
function initializeAudioControls() {
    // Sistema completamente automatico - nessun controllo manuale
    console.log('🎵 Sistema audio automatico inizializzato');
}



// Aggiorna le informazioni della traccia corrente
function updateTrackInfo() {
    if (!window.audioManager) return;
    
    const trackInfo = window.audioManager.getCurrentTrackInfo();
    if (trackInfo) {
        const trackName = document.getElementById('current-track-name');
        const trackDesc = document.getElementById('current-track-desc');
        
        if (trackName) {
            trackName.textContent = `"${trackInfo.name}"`;
        }
        
        if (trackDesc) {
            trackDesc.textContent = trackInfo.description;
        }
    }
}





// Selezione della classe
function selectClass(classOption) {
    // Rimuovi la selezione precedente
    document.querySelectorAll('.class-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Seleziona la nuova classe
    classOption.classList.add('selected');
    
    // Aggiorna l'anteprima del personaggio
    updateCharacterPreview(classOption.dataset.class);
    
    // Aggiorna il pulsante di inizio
    updateStartButton();
}

// Aggiorna l'anteprima del personaggio
function updateCharacterPreview(characterClass) {
    const characterImage = document.querySelector('.character-image');
    if (!characterImage) return;
    
    // Percorsi degli avatar per ogni classe
    const classAvatars = {
        'mage': 'avatar/mago.png',
        'archer': 'avatar/arcere.png',
        'knight': 'avatar/cavaliere.png',
        'valkyrie': 'avatar/valkiria.png'
    };
    
    // Aggiorna l'immagine dell'avatar
    characterImage.innerHTML = `<img src="${classAvatars[characterClass] || 'avatar/mago.png'}" alt="${characterClass}" class="preview-avatar">`;
    
    // Aggiorna i colori del bordo
    const characterSprite = document.querySelector('.character-sprite');
    if (characterSprite) {
        const colors = {
            'mage': '#4a90e2',
            'archer': '#50c878',
            'knight': '#8b4513',
            'valkyrie': '#ffd700'
        };
        
        characterSprite.style.borderColor = colors[characterClass] || '#ffd700';
    }
}

// Aggiorna il pulsante di inizio
function updateStartButton() {
    const startGameBtn = document.getElementById('start-game-btn');
    const characterNameInput = document.getElementById('character-name');
    const selectedClass = document.querySelector('.class-option.selected');
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked');
    
    if (!startGameBtn || !characterNameInput || !selectedClass || !selectedDifficulty) return;
    
    const isNameValid = characterNameInput.value.trim().length > 0;
    const isClassSelected = selectedClass !== null;
    const isDifficultySelected = selectedDifficulty !== null;
    
    if (isNameValid && isClassSelected && isDifficultySelected) {
        startGameBtn.disabled = false;
        startGameBtn.classList.add('ready');
    } else {
        startGameBtn.disabled = true;
        startGameBtn.classList.remove('ready');
    }
}

// Inizia una nuova partita
function startNewGame() {
    // Raccogli i dati del personaggio
    const characterData = collectCharacterData();
    
    if (!characterData) {
        console.error('Dati del personaggio non validi!');
        return;
    }
    
    // Ferma la musica del menu
    if (window.audioManager) {
        window.audioManager.stopCurrentMusic();
    }
    
    // Mostra la schermata di caricamento
    Utils.showScreen('loading-screen');
    
    // Simula il caricamento
    simulateLoading(() => {
        // Inizializza il gioco
        initializeGame(characterData);
        
        // Passa alla schermata di gioco
        Utils.showScreen('game-screen');
        
        // Avvia il gioco
        if (game) {
            game.start();
        }
    });
}

// Raccoglie i dati del personaggio
function collectCharacterData() {
    const characterName = document.getElementById('character-name').value.trim();
    const selectedClass = document.querySelector('.class-option.selected');
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    const selectedRace = document.querySelector('input[name="race"]:checked');
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked');
    
    if (!characterName || !selectedClass || !selectedGender || !selectedRace || !selectedDifficulty) {
        return null;
    }
    
    return {
        name: characterName,
        characterClass: selectedClass.dataset.class,
        gender: selectedGender.value,
        race: selectedRace.value,
        difficulty: selectedDifficulty.value
    };
}

// Simula il caricamento del gioco
function simulateLoading(callback) {
    const loadingSteps = [
        { progress: 20, text: 'Inizializzazione del mondo di Eldrath...' },
        { progress: 40, text: 'Generazione delle regioni...' },
        { progress: 60, text: 'Caricamento delle classi e abilità...' },
        { progress: 80, text: 'Preparazione del primo livello...' },
        { progress: 100, text: 'Gioco pronto!' }
    ];
    
    let currentStep = 0;
    
    function updateLoading() {
        if (currentStep >= loadingSteps.length) {
            setTimeout(callback, 500);
            return;
        }
        
        const step = loadingSteps[currentStep];
        Utils.updateLoadingProgress(step.progress, step.text);
        
        currentStep++;
        setTimeout(updateLoading, 800);
    }
    
    updateLoading();
}

// Inizializza il gioco
function initializeGame(characterData) {
    console.log('Inizializzazione del gioco con personaggio:', characterData);
    
    // Crea l'istanza del gioco
    game = new Game();
    
    // Crea il personaggio
    game.createPlayer(characterData);
    
    // Salva i dati del personaggio per riferimento futuro
    currentCharacterData = characterData;
    
    console.log('Gioco inizializzato con successo!');
}

// Carica una partita esistente
function loadExistingGame() {
    const saveData = Utils.loadFromLocalStorage('chronicles_of_eldrath_save');
    
    if (!saveData) {
        alert('Nessuna partita salvata trovata!');
        return;
    }
    
    // Ferma la musica del menu
    if (window.audioManager) {
        window.audioManager.stopCurrentMusic();
    }
    
    // Mostra la schermata di caricamento
    Utils.showScreen('loading-screen');
    
    // Simula il caricamento
    simulateLoading(() => {
        // Inizializza il gioco
        game = new Game();
        
        // Carica la partita
        if (game.loadGame()) {
            // Passa alla schermata di gioco
            Utils.showScreen('game-screen');
            
            // Avvia il gioco
            game.start();
        } else {
            alert('Errore nel caricamento della partita!');
            Utils.showScreen('welcome-screen');
        }
    });
}

// Apre le impostazioni
function openSettings() {
    // Placeholder per le impostazioni
    alert('Impostazioni non ancora implementate. Verranno aggiunte in una versione futura.');
}

// Gestione degli errori globali
window.addEventListener('error', function(event) {
    console.error('Errore globale:', event.error);
    
    // Mostra un messaggio di errore all'utente
    if (game && game.ui) {
        game.ui.showMessage('Si è verificato un errore. Controlla la console per i dettagli.', 5000);
    }
});

// Gestione del ridimensionamento della finestra
window.addEventListener('resize', function() {
    if (game && game.canvas) {
        game.resizeCanvas();
    }
});

// Gestione della visibilità della pagina
document.addEventListener('visibilitychange', function() {
    if (game) {
        if (document.hidden) {
            // Pagina nascosta - metti in pausa il gioco
            if (game.gameState === 'playing') {
                game.pause();
            }
        } else {
            // Pagina visibile - riprendi il gioco se era in pausa
            if (game.gameState === 'paused') {
                game.resume();
            }
        }
    }
});

// Gestione del focus della finestra
window.addEventListener('focus', function() {
    if (game && game.gameState === 'paused') {
        // Riprendi il gioco quando la finestra riprende il focus
        game.resume();
    }
});

window.addEventListener('blur', function() {
    if (game && game.gameState === 'playing') {
        // Metti in pausa il gioco quando la finestra perde il focus
        game.pause();
    }
});

// Funzioni di utilità per il debug
window.debugGame = function() {
    if (game) {
        console.log('Stato del gioco:', game.gameState);
        console.log('Giocatore:', game.player);
        console.log('Nemici:', game.enemies);
        console.log('Mondo:', game.world);
    } else {
        console.log('Gioco non ancora inizializzato');
    }
};

window.toggleDebug = function() {
    Utils.debug.enabled = !Utils.debug.enabled;
    console.log('Debug mode:', Utils.debug.enabled ? 'enabled' : 'disabled');
};

// Funzioni per il testing
window.testCharacterCreation = function() {
    // Simula la creazione di un personaggio per testing
    const testData = {
        name: 'TestPlayer',
        characterClass: 'mage',
        gender: 'male',
        race: 'human',
        difficulty: 'normal'
    };
    
    console.log('Test character creation:', testData);
    
    // Mostra la schermata di creazione
    Utils.showScreen('character-creation');
    
    // Precompila i campi
    const nameInput = document.getElementById('character-name');
    if (nameInput) nameInput.value = testData.name;
    
    // Seleziona la classe
    const mageOption = document.querySelector('[data-class="mage"]');
    if (mageOption) selectClass(mageOption);
    
    // Seleziona la difficoltà
    const normalDifficulty = document.querySelector('input[value="normal"]');
    if (normalDifficulty) normalDifficulty.checked = true;
    
    // Aggiorna il pulsante
    updateStartButton();
};

// Funzioni per il controllo del gioco
window.startGame = function() {
    if (game) {
        game.start();
    } else {
        console.error('Gioco non inizializzato!');
    }
};

window.stopGame = function() {
    if (game) {
        game.stop();
    }
};

window.pauseGame = function() {
    if (game) {
        game.pause();
    }
};

window.resumeGame = function() {
    if (game) {
        game.resume();
    }
};

// Funzioni per il salvataggio
window.saveGame = function() {
    if (game) {
        return game.saveGame();
    }
    return false;
};

window.loadGame = function() {
    if (game) {
        return game.loadGame();
    }
    return false;
};

// Funzioni per il controllo del personaggio
window.createTestPlayer = function() {
    if (!game) {
        console.error('Gioco non inizializzato!');
        return;
    }
    
    const testData = {
        name: 'TestPlayer',
        characterClass: 'knight',
        gender: 'male',
        race: 'human',
        difficulty: 'normal'
    };
    
    game.createPlayer(testData);
    console.log('Personaggio di test creato:', game.player);
};

// Funzioni per il controllo del mondo
window.changeLevel = function(level) {
    if (game && game.world) {
        return game.world.changeLevel(level);
    }
    return false;
};

window.changeRegion = function(region) {
    if (game && game.world) {
        return game.world.changeRegion(region);
    }
    return false;
};

// Funzioni per il controllo dei nemici
window.spawnEnemy = function(type, x, y) {
    if (game) {
        const enemy = EnemyFactory.createEnemy(type, x || 100, y || 100);
        game.enemies.push(enemy);
        console.log('Nemico generato:', enemy);
        return enemy;
    }
    return null;
};

window.clearEnemies = function() {
    if (game) {
        game.enemies = [];
        console.log('Tutti i nemici rimossi');
    }
};

// Funzioni per il controllo dell'UI
window.toggleInventory = function() {
    if (game && game.ui) {
        game.ui.toggleInventory();
    }
};

window.toggleMap = function() {
    if (game && game.ui) {
        game.ui.toggleMap();
    }
};

window.toggleMenu = function() {
    if (game && game.ui) {
        game.ui.toggleMenu();
    }
};

// Funzioni per il controllo della camera
window.setCameraPosition = function(x, y) {
    if (game) {
        game.camera.x = x;
        game.camera.y = y;
        console.log('Camera posizionata a:', x, y);
    }
};

window.resetCamera = function() {
    if (game) {
        game.camera.x = 0;
        game.camera.y = 0;
        console.log('Camera resettata');
    }
};

// Funzioni per il controllo delle performance
window.showFPS = function() {
    if (game) {
        console.log('FPS attuali:', game.fps);
        return game.fps;
    }
    return 0;
};

window.setTargetFPS = function(targetFPS) {
    // Placeholder per il controllo degli FPS
    console.log('Target FPS impostato a:', targetFPS);
};

// Funzioni per il controllo del suono
window.playSound = function(soundName) {
    Utils.playSound(soundName);
};

window.setVolume = function(volume) {
    // Placeholder per il controllo del volume
    console.log('Volume impostato a:', volume);
};

// Funzioni per il controllo del meteo
window.changeWeather = function(weather) {
    if (game && game.world) {
        game.world.changeWeather(weather);
    }
};

window.getCurrentWeather = function() {
    if (game && game.world) {
        return game.world.weather;
    }
    return 'unknown';
};

// Funzioni per il controllo del tempo
window.setTimeOfDay = function(hour) {
    if (game && game.world) {
        game.world.timeOfDay = hour;
        console.log('Ora del giorno impostata a:', hour);
    }
};

window.getTimeOfDay = function() {
    if (game && game.world) {
        return game.world.getTimeOfDay();
    }
    return '00:00';
};

// Funzioni per il controllo degli eventi
window.triggerEvent = function(eventType) {
    if (game && game.world) {
        game.world.handleEvent(eventType);
    }
};

window.getActiveEvents = function() {
    if (game && game.world) {
        return game.world.activeEvents;
    }
    return [];
};

// Funzioni per il controllo del salvataggio
window.exportSaveData = function() {
    if (game) {
        const saveData = game.saveGame();
        if (saveData) {
            const dataStr = JSON.stringify(saveData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'chronicles_of_eldrath_save.json';
            a.click();
            
            URL.revokeObjectURL(url);
            console.log('Dati di salvataggio esportati');
        }
    }
};

window.importSaveData = function(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const saveData = JSON.parse(e.target.result);
            
            // Salva i dati importati
            Utils.saveToLocalStorage('chronicles_of_eldrath_save', saveData);
            
            console.log('Dati di salvataggio importati');
            alert('Dati di salvataggio importati con successo!');
        } catch (error) {
            console.error('Errore nell\'importazione:', error);
            alert('Errore nell\'importazione dei dati di salvataggio!');
        }
    };
    
    reader.readAsText(file);
};

// Funzioni di debug per la musica
window.playMenuMusic = function() {
    if (window.audioManager) {
        window.audioManager.playMenuMusic();
        console.log('🎵 Musica del menu avviata');
    } else {
        console.log('❌ Sistema audio non inizializzato');
    }
};

window.playGameMusic = function() {
    if (window.audioManager) {
        window.audioManager.playGameMusic();
        console.log('🎵 Musica del gioco avviata');
    } else {
        console.log('❌ Sistema audio non inizializzato');
    }
};

window.pauseMusic = function() {
    if (window.audioManager) {
        window.audioManager.pauseMusic();
        console.log('⏸️ Musica in pausa (riprenderà automaticamente)');
    } else {
        console.log('❌ Sistema audio non inizializzato');
    }
};

window.resumeMusic = function() {
    if (window.audioManager) {
        window.audioManager.resumeMusic();
        console.log('▶️ Musica ripresa');
    } else {
        console.log('❌ Sistema audio non inizializzato');
    }
};

window.stopMusic = function() {
    if (window.audioManager) {
        window.audioManager.stopCurrentMusic();
        console.log('⏹️ Musica fermata');
    } else {
        console.log('❌ Sistema audio non inizializzato');
    }
};

window.setAudioVolume = function(volume) {
    if (window.audioManager) {
        window.audioManager.setVolume(volume);
        console.log(`🔊 Volume impostato a: ${Math.round(volume * 100)}%`);
    } else {
        console.log('❌ Sistema audio non inizializzato');
    }
};



window.switchAudioTrack = function(trackType) {
    if (window.audioManager) {
        window.audioManager.switchTrack(trackType);
        console.log(`🔄 Cambiata traccia a: ${trackType}`);
        updateTrackInfo();
    } else {
        console.log('❌ Sistema audio non inizializzato');
    }
};

window.getAudioStatus = function() {
    if (window.audioManager) {
        const status = window.audioManager.getStatus();
        console.log('🎵 Stato dell\'audio:', status);
        return status;
    } else {
        console.log('❌ Sistema audio non inizializzato');
        return null;
    }
};

window.testAudio = function() {
    if (window.audioManager) {
        window.audioManager.testAudio();
    } else {
        console.log('❌ Sistema audio non inizializzato');
    }
};

// Inizializzazione completa
console.log('Chronicles of Eldrath - Sistema principale caricato!');
console.log('Comandi disponibili:');
console.log('- debugGame() - Mostra lo stato del gioco');
console.log('- toggleDebug() - Abilita/disabilita il debug');
console.log('- testCharacterCreation() - Testa la creazione del personaggio');
console.log('- startGame() - Avvia il gioco');
console.log('- stopGame() - Ferma il gioco');
console.log('- pauseGame() - Mette in pausa il gioco');
console.log('- resumeGame() - Riprende il gioco');
console.log('- saveGame() - Salva il gioco');
console.log('- loadGame() - Carica il gioco');
console.log('- createTestPlayer() - Crea un personaggio di test');
console.log('- changeLevel(level) - Cambia livello');
console.log('- changeRegion(region) - Cambia regione');
console.log('- spawnEnemy(type, x, y) - Genera un nemico');
console.log('- clearEnemies() - Rimuove tutti i nemici');
console.log('- toggleInventory() - Apre/chiude l\'inventario');
console.log('- toggleMap() - Apre/chiude la mappa');
console.log('- toggleMenu() - Apre/chiude il menu');
console.log('- setCameraPosition(x, y) - Imposta la posizione della camera');
console.log('- resetCamera() - Resetta la camera');
console.log('- showFPS() - Mostra gli FPS attuali');
console.log('- changeWeather(weather) - Cambia il meteo');
console.log('- getCurrentWeather() - Ottiene il meteo attuale');
console.log('- setTimeOfDay(hour) - Imposta l\'ora del giorno');
console.log('- getTimeOfDay() - Ottiene l\'ora del giorno');
console.log('- triggerEvent(eventType) - Attiva un evento');
console.log('- getActiveEvents() - Ottiene gli eventi attivi');
console.log('- exportSaveData() - Esporta i dati di salvataggio');
console.log('- importSaveData(file) - Importa i dati di salvataggio');
console.log('');
console.log('🎵 Controlli Audio:');
console.log('- playMenuMusic() - Riproduce la musica del menu');
console.log('- playGameMusic() - Riproduce la musica del gioco');
console.log('- pauseMusic() - Mette in pausa la musica (riprende automaticamente)');
console.log('- resumeMusic() - Riprende la musica');
console.log('- stopMusic() - Ferma la musica');
console.log('- setAudioVolume(volume) - Imposta il volume (0-1)');
console.log('- switchAudioTrack(type) - Cambia traccia (menu/game)');
console.log('- getAudioStatus() - Mostra lo stato dell\'audio');
console.log('- testAudio() - Test completo del sistema audio');
