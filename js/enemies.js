// Chronicles of Eldrath - Sistema Nemici

// Classe base per tutti i nemici
class Enemy extends GameObject {
    constructor(x, y, name, enemyType, level = 1) {
        super(x, y, 32, 32);
        this.name = name;
        this.enemyType = enemyType;
        this.level = level;
        
        // Statistiche base
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.attack = 15;
        this.defense = 5;
        this.speed = 50;
        this.aggressionRange = 100;
        this.attackRange = 40;
        this.attackCooldown = 0;
        this.maxAttackCooldown = 2;
        
        // IA
        this.state = 'idle'; // 'idle', 'chase', 'attack', 'retreat'
        this.target = null;
        this.lastKnownPlayerPosition = null;
        this.patrolPoints = [];
        this.currentPatrolIndex = 0;
        this.patrolTimer = 0;
        
        // Loot
        this.lootTable = [];
        this.experienceReward = 50;
        this.goldReward = 25;
        
        // Effetti visivi
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.flashTimer = 0;
        this.isFlashing = false;
        
        // Sistema asset grafici
        this.assetData = null;
        this.spriteImage = null;
        
        // Inizializza il nemico in base al tipo
        this.initializeEnemyType();
        
        // Carica lo sprite grafico
        this.loadEnemySprite();
    }

    initializeEnemyType() {
        switch (this.enemyType) {
            case 'orc':
                this.initializeOrc();
                break;
            case 'dragon':
                this.initializeDragon();
                break;
            case 'eagle':
                this.initializeEagle();
                break;
            case 'phoenix':
                this.initializePhoenix();
                break;
        }
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Aggiorna i timer
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        if (this.flashTimer > 0) {
            this.flashTimer -= deltaTime;
            if (this.flashTimer <= 0) {
                this.isFlashing = false;
            }
        }
        
        // Aggiorna l'IA
        this.updateAI(deltaTime);
        
        // Aggiorna l'animazione
        this.updateAnimation(deltaTime);
    }

    updateAI(deltaTime) {
        // Trova il giocatore più vicino
        const player = this.findNearestPlayer();
        
        if (player && this.isAlive) {
            const distance = this.distanceTo(player);
            
            if (distance <= this.aggressionRange) {
                this.target = player;
                this.lastKnownPlayerPosition = { x: player.x, y: player.y };
                
                if (distance <= this.attackRange && this.attackCooldown <= 0) {
                    this.state = 'attack';
                    this.attackPlayer(player);
                } else {
                    this.state = 'chase';
                    this.chasePlayer(player);
                }
            } else {
                this.state = 'idle';
                this.patrol(deltaTime);
            }
        } else {
            this.state = 'idle';
            this.patrol(deltaTime);
        }
    }

    findNearestPlayer() {
        // Placeholder - dovrebbe cercare nel game world
        return null;
    }

    chasePlayer(player) {
        if (!player) return;
        
        const directionX = player.x - this.x;
        const directionY = player.y - this.y;
        const distance = Math.sqrt(directionX * directionX + directionY * directionY);
        
        if (distance > 0) {
            this.velocityX = (directionX / distance) * this.speed;
            this.velocityY = (directionY / distance) * this.speed;
        }
    }

    attackPlayer(player) {
        if (!player || this.attackCooldown > 0) return;
        
        const damage = this.calculateDamage();
        player.takeDamage(damage, 'physical');
        
        this.attackCooldown = this.maxAttackCooldown;
        console.log(`${this.name} attacca ${player.name} per ${damage} danni!`);
    }

    calculateDamage() {
        const baseDamage = this.attack;
        const variation = Utils.random(-5, 5);
        return Math.max(1, baseDamage + variation);
    }

    patrol(deltaTime) {
        if (this.patrolPoints.length === 0) return;
        
        this.patrolTimer += deltaTime;
        if (this.patrolTimer >= 3) { // Cambia punto ogni 3 secondi
            this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
            this.patrolTimer = 0;
        }
        
        const targetPoint = this.patrolPoints[this.currentPatrolIndex];
        if (targetPoint) {
            const directionX = targetPoint.x - this.x;
            const directionY = targetPoint.y - this.y;
            const distance = Math.sqrt(directionX * directionX + directionY * directionY);
            
            if (distance > 10) {
                this.velocityX = (directionX / distance) * (this.speed * 0.5);
                this.velocityY = (directionY / distance) * (this.speed * 0.5);
            } else {
                this.velocityX = 0;
                this.velocityY = 0;
            }
        }
    }

    takeDamage(damage, damageType = 'physical') {
        if (!this.isAlive) return 0;
        
        let actualDamage = damage;
        
        // Applica resistenze
        if (damageType === 'physical') {
            actualDamage = Math.max(1, damage - this.defense);
        }
        
        this.health -= actualDamage;
        
        // Effetto flash quando colpito
        this.isFlashing = true;
        this.flashTimer = 0.2;
        
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
        
        return actualDamage;
    }

    die() {
        this.isAlive = false;
        this.velocityX = 0;
        this.velocityY = 0;
        this.state = 'dead';
        
        // Genera loot
        this.generateLoot();
        
        console.log(`${this.name} è stato sconfitto!`);
    }

    generateLoot() {
        // Placeholder per la generazione del loot
        console.log(`${this.name} ha lasciato ${this.goldReward} oro e ${this.experienceReward} esperienza!`);
    }

    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer >= 0.2) { // 5 FPS per l'animazione
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }

    draw(ctx) {
        if (!this.isAlive) {
            ctx.globalAlpha = 0.3;
        }
        
        // Effetto flash quando colpito
        if (this.isFlashing) {
            ctx.globalAlpha = 0.8;
        }
        
        // Colore basato sul tipo di nemico
        let color;
        switch (this.enemyType) {
            case 'orc': color = '#8b4513'; break;
            case 'dragon': color = '#ff4500'; break;
            case 'eagle': color = '#4682b4'; break;
            case 'phoenix': color = '#ff8c00'; break;
            default: color = '#666666';
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Nome del nemico
        ctx.fillStyle = '#ff0000';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.width / 2, this.y - 5);
        
        // Barra della salute
        const healthBarWidth = 32;
        const healthBarHeight = 3;
        const healthPercentage = this.health / this.maxHealth;
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, this.y - 15, healthBarWidth, healthBarHeight);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y - 15, healthBarWidth * healthPercentage, healthBarHeight);
        
        ctx.globalAlpha = 1;
    }

    // Metodi per asset grafici
    loadEnemySprite() {
        if (window.GameAssets) {
            this.assetData = window.GameAssets.getEnemyById(this.enemyType);
            if (this.assetData) {
                this.loadSpriteImage();
            }
        }
    }

    async loadSpriteImage() {
        if (this.assetData && this.assetData.svg) {
            try {
                this.spriteImage = await window.GameAssets.createSVGElement(
                    this.assetData.svg, 
                    48, 
                    48
                );
                console.log(`🎨 Sprite nemico caricato per ${this.enemyType}:`, this.assetData.name);
            } catch (error) {
                console.error(`❌ Errore caricamento sprite nemico per ${this.enemyType}:`, error);
            }
        }
    }

    // Metodo per disegnare il nemico
    draw(ctx, cameraX = 0, cameraY = 0) {
        if (this.spriteImage) {
            // Disegna lo sprite SVG
            ctx.drawImage(
                this.spriteImage, 
                this.x - cameraX - 24, 
                this.y - cameraY - 24, 
                48, 
                48
            );
        } else {
            // Fallback: disegna un rettangolo colorato
            ctx.fillStyle = this.assetData ? this.assetData.color || '#ff0000' : '#ff0000';
            ctx.fillRect(this.x - cameraX - 16, this.y - cameraY - 16, 32, 32);
            
            // Nome del nemico
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.name, this.x - cameraX, this.y - cameraY - 20);
        }

        // Disegna la barra della vita
        this.drawHealthBar(ctx, cameraX, cameraY);
    }

    // Metodo per ottenere informazioni sull'asset
    getAssetInfo() {
        return this.assetData || {
            name: this.enemyType,
            description: 'Nemico sconosciuto',
            type: 'unknown'
        };
    }
}

// Orco - Nemico base da mischia
class Orc extends Enemy {
    constructor(x, y, level = 1) {
        super(x, y, `Orco Lv.${level}`, 'orc', level);
        this.addTag('orc');
        this.addTag('melee');
    }

    initializeOrc() {
        this.maxHealth = 80 + (this.level - 1) * 15;
        this.health = this.maxHealth;
        this.attack = 18 + (this.level - 1) * 2;
        this.defense = 8 + (this.level - 1);
        this.speed = 60;
        this.aggressionRange = 120;
        this.attackRange = 35;
        this.maxAttackCooldown = 1.5;
        
        // Abilità speciali
        this.berserkThreshold = 0.3; // Attiva berserk quando la vita scende sotto il 30%
        this.berserkActive = false;
        this.berserkMultiplier = 1.5;
        
        // Loot
        this.lootTable = [
            { item: 'Pozione di Salute', chance: 0.3, quantity: [1, 2] },
            { item: 'Oro', chance: 0.8, quantity: [10, 25] },
            { item: 'Pelle d\'Orco', chance: 0.6, quantity: [1, 3] }
        ];
        
        this.experienceReward = 40 + (this.level - 1) * 10;
        this.goldReward = 20 + (this.level - 1) * 5;
        
        // Punti di pattuglia
        this.patrolPoints = [
            { x: this.x - 50, y: this.y - 50 },
            { x: this.x + 50, y: this.y - 50 },
            { x: this.x + 50, y: this.y + 50 },
            { x: this.x - 50, y: this.y + 50 }
        ];
    }

    takeDamage(damage, damageType) {
        const actualDamage = super.takeDamage(damage, damageType);
        
        // Controlla se attivare il berserk
        if (this.health / this.maxHealth <= this.berserkThreshold && !this.berserkActive) {
            this.activateBerserk();
        }
        
        return actualDamage;
    }

    activateBerserk() {
        this.berserkActive = true;
        this.attack *= this.berserkMultiplier;
        this.speed *= 1.2;
        this.maxAttackCooldown *= 0.7;
        console.log(`${this.name} entra in modalità BERSERK!`);
    }

    calculateDamage() {
        let damage = super.calculateDamage();
        
        if (this.berserkActive) {
            damage = Math.floor(damage * this.berserkMultiplier);
        }
        
        return damage;
    }
}

// Drago - Boss volante con attacchi magici
class Dragon extends Enemy {
    constructor(x, y, level = 1) {
        super(x, y, `Drago Lv.${level}`, 'dragon', level);
        this.addTag('dragon');
        this.addTag('boss');
        this.addTag('flying');
    }

    initializeDragon() {
        this.maxHealth = 500 + (this.level - 1) * 100;
        this.health = this.maxHealth;
        this.attack = 40 + (this.level - 1) * 5;
        this.defense = 20 + (this.level - 1) * 2;
        this.speed = 80;
        this.aggressionRange = 200;
        this.attackRange = 80;
        this.maxAttackCooldown = 3;
        
        // Abilità speciali del drago
        this.fireBreathCooldown = 0;
        this.maxFireBreathCooldown = 8;
        this.wingBuffetCooldown = 0;
        this.maxWingBuffetCooldown = 5;
        this.isFlying = true;
        this.flyingHeight = 20;
        
        // Fasi del combattimento
        this.combatPhase = 1;
        this.phaseThresholds = [0.7, 0.3]; // Cambia fase al 70% e 30% di vita
        
        // Loot
        this.lootTable = [
            { item: 'Scaglie di Drago', chance: 0.9, quantity: [2, 5] },
            { item: 'Oro', chance: 1.0, quantity: [100, 300] },
            { item: 'Arma Leggendaria', chance: 0.1, quantity: [1, 1] }
        ];
        
        this.experienceReward = 500 + (this.level - 1) * 100;
        this.goldReward = 200 + (this.level - 1) * 50;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Aggiorna i cooldown delle abilità speciali
        if (this.fireBreathCooldown > 0) {
            this.fireBreathCooldown -= deltaTime;
        }
        if (this.wingBuffetCooldown > 0) {
            this.wingBuffetCooldown -= deltaTime;
        }
        
        // Controlla i cambi di fase
        this.checkPhaseChange();
    }

    checkPhaseChange() {
        const healthPercentage = this.health / this.maxHealth;
        
        if (healthPercentage <= this.phaseThresholds[0] && this.combatPhase === 1) {
            this.combatPhase = 2;
            this.enterPhase2();
        } else if (healthPercentage <= this.phaseThresholds[1] && this.combatPhase === 2) {
            this.combatPhase = 3;
            this.enterPhase3();
        }
    }

    enterPhase2() {
        this.maxAttackCooldown *= 0.8;
        this.speed *= 1.2;
        console.log(`${this.name} entra nella Fase 2 - Attacchi più veloci!`);
    }

    enterPhase3() {
        this.maxAttackCooldown *= 0.6;
        this.speed *= 1.5;
        this.attack *= 1.3;
        console.log(`${this.name} entra nella Fase 3 - BERSERK FINALE!`);
    }

    attackPlayer(player) {
        if (!player || this.attackCooldown > 0) return;
        
        // Scegli un attacco casuale
        const attackType = Math.random();
        
        if (attackType < 0.4 && this.fireBreathCooldown <= 0) {
            this.fireBreath(player);
        } else if (attackType < 0.7 && this.wingBuffetCooldown <= 0) {
            this.wingBuffet(player);
        } else {
            super.attackPlayer(player);
        }
    }

    fireBreath(player) {
        const damage = this.calculateDamage() * 1.5;
        player.takeDamage(damage, 'magical');
        this.fireBreathCooldown = this.maxFireBreathCooldown;
        console.log(`${this.name} usa Soffio di Fuoco su ${player.name} per ${damage} danni!`);
    }

    wingBuffet(player) {
        const damage = this.calculateDamage();
        player.takeDamage(damage, 'physical');
        
        // Spinge indietro il giocatore
        const pushDistance = 50;
        const directionX = player.x - this.x;
        const directionY = player.y - this.y;
        const distance = Math.sqrt(directionX * directionX + directionY * directionY);
        
        if (distance > 0) {
            player.x += (directionX / distance) * pushDistance;
            player.y += (directionY / distance) * pushDistance;
        }
        
        this.wingBuffetCooldown = this.maxWingBuffetCooldown;
        console.log(`${this.name} usa Colpo d\'Ala su ${player.name} per ${damage} danni!`);
    }

    draw(ctx) {
        // Disegna l'ombra del drago
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(this.x, this.y + this.flyingHeight, this.width, this.height);
        
        // Disegna il drago
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.translate(0, -this.flyingHeight);
        
        super.draw(ctx);
        
        ctx.restore();
    }
}

// Aquila Gigante - Nemico volante con attacchi aerei
class Eagle extends Enemy {
    constructor(x, y, level = 1) {
        super(x, y, `Aquila Gigante Lv.${level}`, 'eagle', level);
        this.addTag('eagle');
        this.addTag('flying');
        this.addTag('ranged');
    }

    initializeEagle() {
        this.maxHealth = 120 + (this.level - 1) * 20;
        this.health = this.maxHealth;
        this.attack = 25 + (this.level - 1) * 3;
        this.defense = 6 + (this.level - 1);
        this.speed = 120;
        this.aggressionRange = 150;
        this.attackRange = 100;
        this.maxAttackCooldown = 2.5;
        
        // Abilità speciali dell'aquila
        this.diveAttackCooldown = 0;
        this.maxDiveAttackCooldown = 6;
        this.isDiving = false;
        this.diveSpeed = 200;
        this.flyingHeight = 30;
        this.diveHeight = 5;
        
        // Loot
        this.lootTable = [
            { item: 'Piume d\'Aquila', chance: 0.8, quantity: [1, 4] },
            { item: 'Oro', chance: 0.7, quantity: [15, 35] },
            { item: 'Pozione di Velocità', chance: 0.2, quantity: [1, 1] }
        ];
        
        this.experienceReward = 60 + (this.level - 1) * 15;
        this.goldReward = 30 + (this.level - 1) * 8;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.diveAttackCooldown > 0) {
            this.diveAttackCooldown -= deltaTime;
        }
        
        // Aggiorna l'altezza di volo
        if (this.isDiving) {
            this.flyingHeight = Math.max(this.diveHeight, this.flyingHeight - this.diveSpeed * deltaTime);
            if (this.flyingHeight <= this.diveHeight) {
                this.isDiving = false;
                this.flyingHeight = 30;
            }
        }
    }

    attackPlayer(player) {
        if (!player || this.attackCooldown > 0) return;
        
        if (this.diveAttackCooldown <= 0 && Math.random() < 0.3) {
            this.diveAttack(player);
        } else {
            super.attackPlayer(player);
        }
    }

    diveAttack(player) {
        this.isDiving = true;
        this.diveAttackCooldown = this.maxDiveAttackCooldown;
        
        const damage = this.calculateDamage() * 1.8;
        player.takeDamage(damage, 'physical');
        
        console.log(`${this.name} usa Attacco in Picchiata su ${player.name} per ${damage} danni!`);
    }

    draw(ctx) {
        // Disegna l'ombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(this.x, this.y + this.flyingHeight, this.width, this.height);
        
        // Disegna l'aquila
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.translate(0, -this.flyingHeight);
        
        super.draw(ctx);
        
        ctx.restore();
    }
}

// Fenice - Creatura mitica con poteri di fuoco e resurrezione
class Phoenix extends Enemy {
    constructor(x, y, level = 1) {
        super(x, y, `Fenice Lv.${level}`, 'phoenix', level);
        this.addTag('phoenix');
        this.addTag('boss');
        this.addTag('fire');
        this.addTag('immortal');
    }

    initializePhoenix() {
        this.maxHealth = 400 + (this.level - 1) * 80;
        this.health = this.maxHealth;
        this.attack = 35 + (this.level - 1) * 4;
        this.defense = 15 + (this.level - 1) * 2;
        this.speed = 90;
        this.aggressionRange = 180;
        this.attackRange = 70;
        this.maxAttackCooldown = 2.5;
        
        // Abilità speciali della fenice
        this.immolationCooldown = 0;
        this.maxImmolationCooldown = 10;
        this.rebirthCooldown = 0;
        this.maxRebirthCooldown = 30;
        this.canRebirth = true;
        this.rebirthCount = 0;
        this.maxRebirths = 2;
        
        // Effetti di fuoco
        this.fireAuraActive = false;
        this.fireAuraDamage = 5;
        this.fireAuraRange = 60;
        
        // Loot
        this.lootTable = [
            { item: 'Piume di Fenice', chance: 0.9, quantity: [3, 6] },
            { item: 'Oro', chance: 1.0, quantity: [150, 400] },
            { item: 'Arma di Fuoco', chance: 0.15, quantity: [1, 1] }
        ];
        
        this.experienceReward = 400 + (this.level - 1) * 80;
        this.goldReward = 150 + (this.level - 1) * 40;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.immolationCooldown > 0) {
            this.immolationCooldown -= deltaTime;
        }
        
        // Attiva l'aura di fuoco quando la vita è bassa
        if (this.health / this.maxHealth <= 0.5 && !this.fireAuraActive) {
            this.activateFireAura();
        }
        
        // Danni dell'aura di fuoco ai nemici vicini
        if (this.fireAuraActive) {
            this.dealFireAuraDamage();
        }
    }

    takeDamage(damage, damageType) {
        const actualDamage = super.takeDamage(damage, damageType);
        
        // Controlla se attivare la resurrezione
        if (this.health <= 0 && this.canRebirth && this.rebirthCount < this.maxRebirths) {
            this.rebirth();
        }
        
        return actualDamage;
    }

    rebirth() {
        this.rebirthCount++;
        this.health = this.maxHealth * 0.8;
        this.isAlive = true;
        this.rebirthCooldown = this.maxRebirthCooldown;
        
        // Potenzia la fenice dopo la resurrezione
        this.attack *= 1.2;
        this.speed *= 1.1;
        
        console.log(`${this.name} risorge dalle ceneri! (${this.rebirthCount}/${this.maxRebirths})`);
        
        if (this.rebirthCount >= this.maxRebirths) {
            this.canRebirth = false;
        }
    }

    activateFireAura() {
        this.fireAuraActive = true;
        console.log(`${this.name} attiva l'Aura di Fuoco!`);
    }

    dealFireAuraDamage() {
        // Placeholder per infliggere danni ai nemici nell'aura
        // Dovrebbe cercare i nemici nel raggio dell'aura
    }

    attackPlayer(player) {
        if (!player || this.attackCooldown > 0) return;
        
        if (this.immolationCooldown <= 0 && Math.random() < 0.25) {
            this.immolation(player);
        } else {
            super.attackPlayer(player);
        }
    }

    immolation(player) {
        this.immolationCooldown = this.maxImmolationCooldown;
        
        const damage = this.calculateDamage() * 2;
        player.takeDamage(damage, 'magical');
        
        // Aggiunge un effetto di bruciatura
        // Placeholder per l'effetto DoT
        
        console.log(`${this.name} usa Immolazione su ${player.name} per ${damage} danni!`);
    }

    draw(ctx) {
        // Effetti di fuoco
        if (this.fireAuraActive) {
            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = '#ff4500';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.fireAuraRange, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        super.draw(ctx);
        
        // Particelle di fuoco
        if (this.isAlive) {
            this.drawFireParticles(ctx);
        }
    }

    drawFireParticles(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#ff8c00';
        
        for (let i = 0; i < 5; i++) {
            const angle = (Date.now() * 0.001 + i) % (Math.PI * 2);
            const radius = 20 + Math.sin(Date.now() * 0.002 + i) * 5;
            const x = this.x + this.width / 2 + Math.cos(angle) * radius;
            const y = this.y + this.height / 2 + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Factory per creare nemici
class EnemyFactory {
    static createEnemy(type, x, y, level = 1) {
        switch (type) {
            case 'orc':
                return new Orc(x, y, level);
            case 'dragon':
                return new Dragon(x, y, level);
            case 'eagle':
                return new Eagle(x, y, level);
            case 'phoenix':
                return new Phoenix(x, y, level);
            default:
                return new Enemy(x, y, 'Nemico Sconosciuto', 'unknown', level);
        }
    }

    static createRandomEnemy(x, y, level = 1) {
        const types = ['orc', 'eagle'];
        const randomType = types[Utils.random(0, types.length - 1)];
        return this.createEnemy(randomType, x, y, level);
    }

    static createBoss(x, y, level = 1) {
        const bossTypes = ['dragon', 'phoenix'];
        const randomBossType = bossTypes[Utils.random(0, bossTypes.length - 1)];
        return this.createEnemy(randomBossType, x, y, level);
    }
}

// Esporta le classi per uso globale
window.Enemy = Enemy;
window.Orc = Orc;
window.Dragon = Dragon;
window.Eagle = Eagle;
window.Phoenix = Phoenix;
window.EnemyFactory = EnemyFactory;
