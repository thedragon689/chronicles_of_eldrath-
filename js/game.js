// Chronicles of Eldrath - Sistema Principale del Gioco

// Classe principale del gioco
class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Stato del gioco
        this.gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameOver'
        this.player = null;
        this.enemies = [];
        this.items = [];
        this.particles = [];
        this.ui = null;
        
        // Mondo di gioco
        this.world = new GameWorld();
        
        // Input
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            clicked: false
        };
        
        // Camera
        this.camera = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            lerp: 0.1
        };
        
        // Performance
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsTime = 0;
        
        // Inizializza il gioco
        this.init();
    }

    init() {
        // Ottieni il canvas
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            console.error('Canvas non trovato!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Imposta le dimensioni del canvas
        this.resizeCanvas();
        
        // Event listeners
        this.setupEventListeners();
        
        // Inizializza l'UI
        this.ui = new GameUI(this);
        
        console.log('Gioco inizializzato con successo!');
    }

    setupEventListeners() {
        // Gestione del resize della finestra
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Gestione della tastiera
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyDown(e);
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Gestione del mouse
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
            this.mouse.clicked = true;
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouse.pressed = false;
        });
        
        // Gestione del touch per dispositivi mobili
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
            this.mouse.pressed = true;
            this.mouse.clicked = true;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.mouse.pressed = false;
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.gameState = 'playing';
        this.gameLoop();
        
        console.log('Gioco avviato!');
    }

    stop() {
        this.isRunning = false;
        this.gameState = 'paused';
        console.log('Gioco fermato!');
    }

    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        // Calcola il delta time
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Limita il delta time per evitare salti
        this.deltaTime = Math.min(this.deltaTime, 0.1);
        
        // Aggiorna le performance
        this.updatePerformance(currentTime);
        
        // Aggiorna il gioco
        this.update(this.deltaTime);
        
        // Renderizza
        this.render();
        
        // Continua il loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    updatePerformance(currentTime) {
        this.frameCount++;
        
        if (currentTime - this.lastFpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = currentTime;
        }
    }

    update(deltaTime) {
        // Aggiorna il mondo
        this.world.update(deltaTime);
        
        // Aggiorna il giocatore
        if (this.player) {
            this.player.update(deltaTime);
            this.updateCamera();
        }
        
        // Aggiorna i nemici
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime);
            
            // Rimuovi nemici morti
            if (!enemy.isAlive) {
                this.enemies.splice(i, 1);
                this.onEnemyDeath(enemy);
            }
        }
        
        // Aggiorna gli oggetti
        for (const item of this.items) {
            if (item.update) {
                item.update(deltaTime);
            }
        }
        
        // Aggiorna le particelle
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime);
            
            // Rimuovi particelle morte
            if (!particle.isAlive) {
                this.particles.splice(i, 1);
            }
        }
        
        // Aggiorna l'UI
        if (this.ui) {
            this.ui.update(deltaTime);
        }
        
        // Controlli di input
        this.handleInput(deltaTime);
        
        // Controlli di collisione
        this.checkCollisions();
    }

    updateCamera() {
        if (!this.player) return;
        
        // Calcola la posizione target della camera (centrata sul giocatore)
        this.camera.targetX = this.player.x - this.canvas.width / 2;
        this.camera.targetY = this.player.y - this.canvas.height / 2;
        
        // Applica interpolazione per movimento fluido
        this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.lerp;
        this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.lerp;
        
        // Limita la camera ai bordi del mondo
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.world.maxWidth - this.canvas.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, this.world.maxHeight - this.canvas.height));
    }

    handleInput(deltaTime) {
        if (!this.player || this.gameState !== 'playing') return;
        
        // Movimento del giocatore
        let moveX = 0;
        let moveY = 0;
        
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            moveY = -1;
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            moveY = 1;
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            moveX = -1;
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            moveX = 1;
        }
        
        // Normalizza il movimento diagonale
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
        }
        
        // Applica il movimento
        if (moveX !== 0 || moveY !== 0) {
            this.player.velocityX = moveX * this.player.speed;
            this.player.velocityY = moveY * this.player.speed;
            this.player.isMoving = true;
        } else {
            this.player.velocityX = 0;
            this.player.velocityY = 0;
            this.player.isMoving = false;
        }
        
        // Aggiorna la direzione del personaggio
        if (moveX > 0) this.player.facingDirection = 'right';
        else if (moveX < 0) this.player.facingDirection = 'left';
        else if (moveY > 0) this.player.facingDirection = 'down';
        else if (moveY < 0) this.player.facingDirection = 'up';
        
        // Abilità
        if (this.keys['Digit1'] && this.player.skills[0]) {
            this.useSkill(0);
        }
        if (this.keys['Digit2'] && this.player.skills[1]) {
            this.useSkill(1);
        }
        if (this.keys['Digit3'] && this.player.skills[2]) {
            this.useSkill(2);
        }
        if (this.keys['Digit4'] && this.player.skills[3]) {
            this.useSkill(3);
        }
        
        // Attacco base
        if (this.keys['Space']) {
            this.playerAttack();
        }
        
        // Interazione
        if (this.keys['KeyE']) {
            this.playerInteract();
        }
        
        // Inventario
        if (this.keys['KeyI']) {
            this.toggleInventory();
        }
        
        // Mappa
        if (this.keys['KeyM']) {
            this.toggleMap();
        }
        
        // Menu
        if (this.keys['Escape']) {
            this.toggleMenu();
        }
    }

    handleKeyDown(e) {
        switch (e.code) {
            case 'KeyF':
                if (e.ctrlKey) {
                    this.toggleFullscreen();
                }
                break;
            case 'KeyR':
                if (e.ctrlKey) {
                    this.restart();
                }
                break;
            // Comandi debug per cambiare regione
            case 'Digit1':
                this.changeRegion('valdoria');
                break;
            case 'Digit2':
                this.changeRegion('tharok');
                break;
            case 'Digit3':
                this.changeRegion('myr');
                break;
            case 'Digit4':
                this.changeRegion('khar');
                break;
            case 'Digit5':
                this.changeRegion('aeloria');
                break;
        }
    }

    useSkill(skillIndex) {
        if (!this.player || !this.player.skills[skillIndex]) return;
        
        const skill = this.player.skills[skillIndex];
        
        // Trova il nemico più vicino come target
        const target = this.findNearestEnemy();
        
        if (skill.canUse(this.player)) {
            skill.use(this.player, target);
            
            // Effetti visivi
            this.createSkillEffect(this.player, skill);
        }
    }

    findNearestEnemy() {
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        for (const enemy of this.enemies) {
            if (!enemy.isAlive) continue;
            
            const distance = this.player.distanceTo(enemy);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        }
        
        return nearestEnemy;
    }

    playerAttack() {
        if (!this.player) return;
        
        // Trova il nemico più vicino
        const target = this.findNearestEnemy();
        
        if (target && this.player.distanceTo(target) <= this.player.attackRange) {
            const damage = this.player.attack;
            target.takeDamage(damage, 'physical');
            
            // Effetti visivi
            this.createDamageNumber(target, damage);
            this.createAttackEffect(this.player, target);
        }
    }

    playerInteract() {
        if (!this.player) return;
        
        // Cerca oggetti interattivi nelle vicinanze
        for (const item of this.items) {
            if (item.isInteractable && this.player.distanceTo(item) <= 50) {
                this.interactWithItem(item);
                break;
            }
        }
    }

    interactWithItem(item) {
        if (item.type === 'exit') {
            this.changeLevel(item.level);
        } else if (item.type === 'chest') {
            this.openChest(item);
        } else if (item.type === 'npc') {
            this.talkToNPC(item);
        }
    }

    changeLevel(level) {
        if (this.world.changeLevel(level)) {
            // Genera il nuovo livello
            this.generateLevel(level);
            
            // Posiziona il giocatore
            if (this.player) {
                this.player.x = 400;
                this.player.y = 300;
            }
            
            console.log(`Cambiato al livello ${level}`);
        }
    }

    generateLevel(level) {
        // Genera la mappa
        const levelMap = this.world.createLevelMap(level);
        
        // Genera i nemici
        this.enemies = this.world.generateEnemies(level);
        
        // Genera il boss se necessario
        if (this.world.isBossLevel(level)) {
            const boss = this.world.generateBoss(level);
            if (boss) {
                this.enemies.push(boss);
            }
        }
        
        // Genera gli oggetti
        this.items = this.world.generateItems(level);
        
        // Posiziona gli oggetti sulla mappa
        this.placeItemsOnMap(levelMap);
    }

    placeItemsOnMap(levelMap) {
        // Posiziona i punti di uscita
        for (const exit of levelMap.exitPoints) {
            this.items.push({
                x: exit.x,
                y: exit.y,
                type: 'exit',
                level: exit.level,
                isInteractable: true,
                width: 32,
                height: 32
            });
        }
        
        // Posiziona i punti di spawn
        for (const spawn of levelMap.spawnPoints) {
            if (spawn.type === 'player' && this.player) {
                this.player.x = spawn.x;
                this.player.y = spawn.y;
            }
        }
    }

    checkCollisions() {
        if (!this.player) return;
        
        // Collisioni giocatore-nemici
        for (const enemy of this.enemies) {
            if (!enemy.isAlive) continue;
            
            if (this.player.collidesWith(enemy)) {
                this.handlePlayerEnemyCollision(this.player, enemy);
            }
        }
        
        // Collisioni giocatore-oggetti
        for (const item of this.items) {
            if (this.player.collidesWith(item)) {
                this.handlePlayerItemCollision(this.player, item);
            }
        }
        
        // Collisioni proiettili-nemici
        // Placeholder per il sistema di proiettili
    }

    handlePlayerEnemyCollision(player, enemy) {
        // Il nemico attacca il giocatore
        if (enemy.attackCooldown <= 0) {
            const damage = enemy.calculateDamage();
            player.takeDamage(damage, 'physical');
            
            // Effetti visivi
            this.createDamageNumber(player, damage);
            this.createHitEffect(player);
            
            // Vibrazione (se supportata)
            Utils.vibrate(100);
        }
    }

    handlePlayerItemCollision(player, item) {
        if (item.type === 'health_potion') {
            player.heal(item.healAmount);
            this.removeItem(item);
            this.createHealEffect(player);
        } else if (item.type === 'mana_potion') {
            player.restoreMana(item.manaAmount);
            this.removeItem(item);
            this.createManaEffect(player);
        }
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    onEnemyDeath(enemy) {
        // Aggiungi esperienza al giocatore
        if (this.player) {
            this.player.gainExperience(enemy.experienceReward);
        }
        
        // Aggiungi oro al giocatore
        if (this.player) {
            this.player.inventory.addGold(enemy.goldReward);
        }
        
        // Genera loot
        this.generateLoot(enemy);
        
        // Effetti visivi
        this.createDeathEffect(enemy);
        
        // Controlla se il giocatore ha completato il livello
        this.checkLevelCompletion();
    }

    generateLoot(enemy) {
        // Placeholder per la generazione del loot
        console.log(`${enemy.name} ha lasciato ${enemy.goldReward} oro e ${enemy.experienceReward} esperienza!`);
    }

    checkLevelCompletion() {
        // Controlla se tutti i nemici sono stati sconfitti
        const aliveEnemies = this.enemies.filter(enemy => enemy.isAlive);
        
        if (aliveEnemies.length === 0) {
            this.onLevelComplete();
        }
    }

    onLevelComplete() {
        console.log('Livello completato!');
        
        // Mostra messaggio di completamento
        this.showLevelCompleteMessage();
        
        // Sblocca il livello successivo
        this.world.changeLevel(this.world.currentLevel + 1);
    }

    showLevelCompleteMessage() {
        // Placeholder per il messaggio di completamento
        console.log('🎉 Livello completato! 🎉');
    }

    render() {
        // Pulisci il canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Applica la trasformazione della camera
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Renderizza il mondo
        this.renderWorld();
        
        // Renderizza gli oggetti
        this.renderItems();
        
        // Renderizza i nemici
        this.renderEnemies();
        
        // Renderizza il giocatore
        this.renderPlayer();
        
        // Renderizza le particelle
        this.renderParticles();
        
        // Ripristina il contesto
        this.ctx.restore();
        
        // Renderizza l'UI (sempre sopra tutto)
        this.renderUI();
        
        // Debug info
        if (Utils.debug.enabled) {
            this.renderDebugInfo();
        }
    }

    renderWorld() {
        // Disegna lo sfondo della regione corrente
        if (this.world) {
            this.world.drawBackground(this.ctx, this.camera.x, this.camera.y);
        } else {
            // Fallback: sfondo semplice
            this.ctx.fillStyle = '#2F4F4F';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    renderItems() {
        for (const item of this.items) {
            if (item.draw) {
                item.draw(this.ctx);
            }
        }
    }

    renderEnemies() {
        for (const enemy of this.enemies) {
            if (enemy.isAlive) {
                enemy.draw(this.ctx, this.camera.x, this.camera.y);
            }
        }
    }

    renderPlayer() {
        if (this.player) {
            this.player.draw(this.ctx, this.camera.x, this.camera.y);
        }
    }

    renderParticles() {
        for (const particle of this.particles) {
            if (particle.draw) {
                particle.draw(this.ctx);
            }
        }
    }

    renderUI() {
        if (this.ui) {
            this.ui.render(this.ctx);
        }
    }

    renderDebugInfo() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
        this.ctx.fillText(`Enemies: ${this.enemies.length}`, 10, 35);
        this.ctx.fillText(`Items: ${this.items.length}`, 10, 50);
        this.ctx.fillText(`Particles: ${this.particles.length}`, 10, 65);
        
        if (this.player) {
            this.ctx.fillText(`Player: ${this.player.x.toFixed(1)}, ${this.player.y.toFixed(1)}`, 10, 80);
            this.ctx.fillText(`Health: ${this.player.health}/${this.player.maxHealth}`, 10, 95);
        }
        
        if (this.world) {
            const region = this.world.regions.get(this.world.currentRegion);
            this.ctx.fillText(`Region: ${region ? region.name : 'Unknown'}`, 10, 110);
            this.ctx.fillText(`Background: ${region ? region.background : 'None'}`, 10, 125);
        }
        
        // Comandi debug per cambiare regione
        this.ctx.fillText(`Debug: 1=Valdoria, 2=Tharok, 3=Myr, 4=Khar, 5=Aeloria`, 10, 140);
    }

    // Metodi per la gestione delle regioni
    changeRegion(regionId) {
        if (this.world && this.world.regions.has(regionId)) {
            this.world.currentRegion = regionId;
            console.log(`🌍 Cambiata regione a: ${this.world.regions.get(regionId).name}`);
            
            // Aggiorna la musica se disponibile
            if (window.audioManager) {
                window.audioManager.playGameMusic();
            }
        }
    }

    // Metodi per gli effetti visivi
    createDamageNumber(target, damage) {
        const particle = {
            x: target.x + target.width / 2,
            y: target.y,
            text: damage.toString(),
            color: '#ff4444',
            velocityY: -50,
            life: 1,
            maxLife: 1,
            isAlive: true,
            
            update: function(deltaTime) {
                this.y += this.velocityY * deltaTime;
                this.velocityY += 100 * deltaTime; // Gravità
                this.life -= deltaTime;
                this.isAlive = this.life > 0;
            },
            
            draw: function(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life / this.maxLife;
                ctx.fillStyle = this.color;
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(this.text, this.x, this.y);
                ctx.restore();
            }
        };
        
        this.particles.push(particle);
    }

    createAttackEffect(attacker, target) {
        // Placeholder per l'effetto di attacco
    }

    createHitEffect(target) {
        // Placeholder per l'effetto di colpo
    }

    createHealEffect(target) {
        // Placeholder per l'effetto di cura
    }

    createManaEffect(target) {
        // Placeholder per l'effetto di mana
    }

    createDeathEffect(enemy) {
        // Placeholder per l'effetto di morte
    }

    createSkillEffect(caster, skill) {
        // Placeholder per l'effetto di abilità
    }

    // Metodi per l'UI
    toggleInventory() {
        if (this.ui) {
            this.ui.toggleInventory();
        }
    }

    toggleMap() {
        if (this.ui) {
            this.ui.toggleMap();
        }
    }

    toggleMenu() {
        if (this.ui) {
            this.ui.toggleMenu();
        }
    }

    // Metodi di utilità
    toggleFullscreen() {
        Utils.toggleFullscreen();
    }

    restart() {
        // Ricarica la pagina
        location.reload();
    }

    // Metodi per il salvataggio
    saveGame() {
        const saveData = {
            player: this.player ? this.player.toJSON() : null,
            world: this.world.toJSON(),
            timestamp: Date.now()
        };
        
        if (Utils.saveToLocalStorage('chronicles_of_eldrath_save', saveData)) {
            console.log('Gioco salvato con successo!');
            return true;
        }
        
        return false;
    }

    loadGame() {
        const saveData = Utils.loadFromLocalStorage('chronicles_of_eldrath_save');
        
        if (saveData) {
            // Ricarica il mondo
            this.world.fromJSON(saveData.world);
            
            // Ricarica il giocatore
            if (saveData.player) {
                this.player = new Character(400, 300, saveData.player.name, saveData.player.characterClass);
                this.player.fromJSON(saveData.player);
                
                // Aggiorna l'avatar nel ritratto del gioco
                this.updatePlayerPortrait(saveData.player.characterClass);
            }
            
            // Genera il livello corrente
            this.generateLevel(this.world.currentLevel);
            
            console.log('Gioco caricato con successo!');
            return true;
        }
        
        return false;
    }

    // Metodi per la gestione del personaggio
    createPlayer(characterData) {
        this.player = new Character(400, 300, characterData.name, characterData.characterClass);
        
        // Imposta la difficoltà
        this.world.difficulty = characterData.difficulty;
        
        // Genera il primo livello
        this.generateLevel(1);
        
        // Aggiorna l'avatar nel ritratto del gioco
        this.updatePlayerPortrait(characterData.characterClass);
        
        // Avvia la musica del gioco
        this.startGameMusic();
        
        console.log(`Personaggio creato: ${this.player.name} (${this.player.characterClass})`);
    }
    
    // Aggiorna l'avatar del giocatore nel ritratto
    updatePlayerPortrait(characterClass) {
        const portraitImg = document.getElementById('portrait-img');
        if (portraitImg) {
            const classAvatars = {
                'mage': 'avatar/mago.png',
                'archer': 'avatar/arcere.png',
                'knight': 'avatar/cavaliere.png',
                'valkyrie': 'avatar/valkiria.png'
            };
            
            portraitImg.src = classAvatars[characterClass] || 'avatar/mago.png';
            portraitImg.alt = `Portrait ${characterClass}`;
        }
    }
    
    // Avvia la musica del gioco
    startGameMusic() {
        if (window.audioManager) {
            window.audioManager.playGameMusic();
            console.log('🎵 Musica del gioco avviata');
        }
    }
    
    // Ferma la musica del gioco
    stopGameMusic() {
        if (window.audioManager) {
            window.audioManager.stopCurrentMusic();
            console.log('🎵 Musica del gioco fermata');
        }
    }

    // Metodi per la gestione del gioco
    pause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            console.log('Gioco in pausa');
        }
    }

    resume() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            console.log('Gioco ripreso');
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        console.log('Game Over!');
        
        // Mostra schermata di game over
        this.showGameOverScreen();
    }

    showGameOverScreen() {
        // Placeholder per la schermata di game over
        console.log('💀 Game Over! 💀');
    }
}

// Esporta la classe per uso globale
window.Game = Game;
