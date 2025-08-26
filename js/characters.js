// Chronicles of Eldrath - Sistema Personaggi

// Classe base per tutti i personaggi
class Character extends GameObject {
    constructor(x, y, name, characterClass) {
        super(x, y, 32, 32);
        this.name = name;
        this.characterClass = characterClass;
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = this.getExperienceForLevel(2);
        
        // Attributi base
        this.attributes = new Attributes();
        this.setupClassAttributes();
        
        // Statistiche di combattimento
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxMana = 100;
        this.mana = this.maxMana;
        this.maxStamina = 100;
        this.stamina = this.maxStamina;
        
        // Statistiche di combattimento
        this.attack = 10;
        this.defense = 5;
        this.magicAttack = 10;
        this.magicDefense = 5;
        this.speed = 100;
        this.criticalChance = 5;
        this.criticalMultiplier = 1.5;
        
        // Sistema di abilità
        this.skills = [];
        this.activeEffects = [];
        
        // Inventario ed equipaggiamento
        this.inventory = new Inventory();
        this.equipment = new Equipment();
        
        // Stato del personaggio
        this.isAlive = true;
        this.isMoving = false;
        this.facingDirection = 'down';
        this.animationFrame = 0;
        this.animationTimer = 0;
        
        // Controlli
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Sistema asset grafici
        this.assetData = null;
        this.spriteImage = null;
        this.loadCharacterSprite();
        
        // Inizializza le abilità della classe
        this.initializeClassSkills();
        
        // Aggiorna le statistiche dopo l'inizializzazione completa
        this.updateStats();
    }

    setupClassAttributes() {
        switch (this.characterClass) {
            case 'mage':
                this.attributes.intelligence = 18;
                this.attributes.strength = 8;
                this.attributes.agility = 12;
                this.attributes.charisma = 14;
                this.attributes.constitution = 8;
                this.attributes.wisdom = 16;
                break;
            case 'archer':
                this.attributes.intelligence = 12;
                this.attributes.strength = 10;
                this.attributes.agility = 18;
                this.attributes.charisma = 12;
                this.attributes.constitution = 10;
                this.attributes.wisdom = 14;
                break;
            case 'knight':
                this.attributes.intelligence = 10;
                this.attributes.strength = 18;
                this.attributes.agility = 8;
                this.attributes.charisma = 16;
                this.attributes.constitution = 16;
                this.attributes.wisdom = 10;
                break;
            case 'valkyrie':
                this.attributes.intelligence = 14;
                this.attributes.strength = 14;
                this.attributes.agility = 16;
                this.attributes.charisma = 18;
                this.attributes.constitution = 12;
                this.attributes.wisdom = 16;
                break;
        }
    }

    updateStats() {
        // Calcola le statistiche basate sugli attributi e l'equipaggiamento
        const strMod = this.attributes.getModifier('strength');
        const intMod = this.attributes.getModifier('intelligence');
        const agiMod = this.attributes.getModifier('agility');
        const conMod = this.attributes.getModifier('constitution');
        const wisMod = this.attributes.getModifier('wisdom');
        
        // Statistiche base
        this.maxHealth = 100 + (conMod * 10) + (this.level - 1) * 5;
        this.maxMana = 100 + (intMod * 8) + (this.level - 1) * 3;
        this.maxStamina = 100 + (agiMod * 5) + (this.level - 1) * 2;
        
        this.attack = 10 + strMod * 2;
        this.defense = 5 + conMod * 2;
        this.magicAttack = 10 + intMod * 2;
        this.magicDefense = 5 + wisMod * 2;
        this.speed = 100 + agiMod * 5;
        this.criticalChance = 5 + agiMod;
        
        // Applica bonus dell'equipaggiamento
        if (this.equipment && typeof this.equipment.getTotalStats === 'function') {
            const equipBonus = this.equipment.getTotalStats();
            for (const stat in equipBonus) {
                if (this[stat] !== undefined) {
                    this[stat] += equipBonus[stat];
                }
            }
        }
        
        // Clamp delle statistiche
        this.health = Math.min(this.health, this.maxHealth);
        this.mana = Math.min(this.mana, this.maxMana);
        this.stamina = Math.min(this.stamina, this.maxStamina);
    }

    initializeClassSkills() {
        switch (this.characterClass) {
            case 'mage':
                this.skills = [
                    new MageFireball(),
                    new MageIceShield(),
                    new MageLightningBolt(),
                    new MageTeleport()
                ];
                break;
            case 'archer':
                this.skills = [
                    new ArcherPreciseShot(),
                    new ArcherStealth(),
                    new ArcherTrap(),
                    new ArcherMultiShot()
                ];
                break;
            case 'knight':
                this.skills = [
                    new KnightSlash(),
                    new KnightShieldBash(),
                    new KnightCharge(),
                    new KnightGuardian()
                ];
                break;
            case 'valkyrie':
                this.skills = [
                    new ValkyrieDivineStrike(),
                    new ValkyrieHeal(),
                    new ValkyrieAura(),
                    new ValkyrieAscension()
                ];
                break;
        }
    }

    getExperienceForLevel(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    gainExperience(amount) {
        this.experience += amount;
        
        while (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.experience -= this.experienceToNext;
        this.experienceToNext = this.getExperienceForLevel(this.level + 1);
        
        // Migliora gli attributi
        this.attributes.increase('strength');
        this.attributes.increase('intelligence');
        this.attributes.increase('agility');
        this.attributes.increase('charisma');
        this.attributes.increase('constitution');
        this.attributes.increase('wisdom');
        
        // Aggiorna le statistiche
        this.updateStats();
        
        // Ripristina completamente salute, mana e stamina
        this.health = this.maxHealth;
        this.mana = this.maxMana;
        this.stamina = this.maxStamina;
        
        // Migliora le abilità
        for (const skill of this.skills) {
            skill.gainExperience(50);
        }
        
        console.log(`${this.name} è salito al livello ${this.level}!`);
    }

    takeDamage(damage, damageType = 'physical') {
        if (!this.isAlive) return 0;
        
        let actualDamage = damage;
        
        // Applica resistenze
        if (damageType === 'physical') {
            actualDamage = Math.max(1, damage - this.defense);
        } else if (damageType === 'magical') {
            actualDamage = Math.max(1, damage - this.magicDefense);
        }
        
        this.health -= actualDamage;
        
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
        
        return actualDamage;
    }

    heal(amount) {
        if (!this.isAlive) return 0;
        
        const oldHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        
        return this.health - oldHealth;
    }

    useMana(amount) {
        if (this.mana < amount) return false;
        
        this.mana -= amount;
        return true;
    }

    restoreMana(amount) {
        const oldMana = this.mana;
        this.mana = Math.min(this.maxMana, this.mana + amount);
        
        return this.mana - oldMana;
    }

    useStamina(amount) {
        if (this.stamina < amount) return false;
        
        this.stamina -= amount;
        return true;
    }

    restoreStamina(amount) {
        const oldStamina = this.stamina;
        this.stamina = Math.min(this.maxStamina, this.stamina + amount);
        
        return this.stamina - oldStamina;
    }

    die() {
        this.isAlive = false;
        this.velocityX = 0;
        this.velocityY = 0;
        console.log(`${this.name} è morto!`);
    }

    respawn() {
        this.isAlive = true;
        this.health = this.maxHealth * 0.5;
        this.mana = this.maxMana * 0.5;
        this.stamina = this.maxStamina * 0.5;
        console.log(`${this.name} è risorto!`);
    }

    addEffect(effect) {
        // Controlla se l'effetto può essere accumulato
        const existingEffect = this.activeEffects.find(e => e.name === effect.name);
        if (existingEffect && existingEffect.canStack()) {
            existingEffect.addStack();
        } else {
            this.activeEffects.push(effect);
            effect.apply(this);
        }
    }

    removeEffect(effectName) {
        const index = this.activeEffects.findIndex(e => e.name === effectName);
        if (index > -1) {
            const effect = this.activeEffects[index];
            effect.remove(this);
            this.activeEffects.splice(index, 1);
        }
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Aggiorna gli effetti attivi
        for (let i = this.activeEffects.length - 1; i >= 0; i--) {
            const effect = this.activeEffects[i];
            if (!effect.update(deltaTime)) {
                effect.remove(this);
                this.activeEffects.splice(i, 1);
            }
        }
        
        // Aggiorna le abilità
        for (const skill of this.skills) {
            skill.update(deltaTime);
        }
        
        // Rigenerazione naturale
        if (this.isAlive) {
            this.stamina = Math.min(this.maxStamina, this.stamina + 10 * deltaTime);
            if (this.stamina >= this.maxStamina * 0.5) {
                this.mana = Math.min(this.maxMana, this.mana + 5 * deltaTime);
            }
        }
        
        // Aggiorna l'animazione
        this.updateAnimation(deltaTime);
    }

    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer >= 0.1) { // 10 FPS per l'animazione
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }

    draw(ctx) {
        if (!this.isAlive) {
            ctx.globalAlpha = 0.5;
        }
        
        // Colore basato sulla classe
        let color;
        switch (this.characterClass) {
            case 'mage': color = '#4a90e2'; break;
            case 'archer': color = '#50c878'; break;
            case 'knight': color = '#8b4513'; break;
            case 'valkyrie': color = '#ffd700'; break;
            default: color = '#ffffff';
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Nome del personaggio
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.width / 2, this.y - 5);
        
        // Barra della salute
        const healthBarWidth = 32;
        const healthBarHeight = 4;
        const healthPercentage = this.health / this.maxHealth;
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, this.y - 15, healthBarWidth, healthBarHeight);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y - 15, healthBarWidth * healthPercentage, healthBarHeight);
        
        ctx.globalAlpha = 1;
    }

    // Metodi per il salvataggio
    toJSON() {
        return {
            name: this.name,
            characterClass: this.characterClass,
            level: this.level,
            experience: this.experience,
            attributes: this.attributes.toJSON(),
            health: this.health,
            mana: this.mana,
            stamina: this.stamina,
            skills: this.skills.map(skill => skill.toJSON()),
            inventory: this.inventory.toJSON(),
            equipment: this.equipment.toJSON(),
            x: this.x,
            y: this.y
        };
    }

    fromJSON(data) {
        this.name = data.name;
        this.characterClass = data.characterClass;
        this.level = data.level;
        this.experience = data.experience;
        this.attributes.fromJSON(data.attributes);
        this.health = data.health;
        this.mana = data.mana;
        this.stamina = data.stamina;
        
        // Ricarica le abilità
        this.initializeClassSkills();
        for (let i = 0; i < this.skills.length && i < data.skills.length; i++) {
            this.skills[i].fromJSON(data.skills[i]);
        }
        
        this.inventory.fromJSON(data.inventory);
        this.equipment.fromJSON(data.equipment);
        this.x = data.x;
        this.y = data.y;
        
        this.updateStats();
    }

    // Metodi per asset grafici
    loadCharacterSprite() {
        if (window.GameAssets) {
            this.assetData = window.GameAssets.getCharacterById(this.characterClass);
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
                    64, 
                    64
                );
                console.log(`🎨 Sprite caricato per ${this.characterClass}:`, this.assetData.name);
            } catch (error) {
                console.error(`❌ Errore caricamento sprite per ${this.characterClass}:`, error);
            }
        }
    }

    // Metodo per disegnare il personaggio
    draw(ctx, cameraX = 0, cameraY = 0) {
        if (this.spriteImage) {
            // Disegna lo sprite SVG
            ctx.drawImage(
                this.spriteImage, 
                this.x - cameraX - 32, 
                this.y - cameraY - 32, 
                64, 
                64
            );
        } else {
            // Fallback: disegna un rettangolo colorato
            ctx.fillStyle = this.assetData ? this.assetData.color : '#ff0000';
            ctx.fillRect(this.x - cameraX - 16, this.y - cameraY - 16, 32, 32);
            
            // Nome del personaggio
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.name, this.x - cameraX, this.y - cameraY - 20);
        }
    }

    // Metodo per ottenere informazioni sull'asset
    getAssetInfo() {
        return this.assetData || {
            name: this.characterClass,
            description: 'Classe sconosciuta',
            color: '#ff0000'
        };
    }
}

// Abilità del Mago
class MageFireball extends Skill {
    constructor() {
        super('Palla di Fuoco', 'Lancia una palla di fuoco che infligge danni magici', 'active', 'intelligence');
        this.maxCooldown = 3;
        this.manaCost = 25;
        this.damage = 40;
        this.range = 150;
    }

    execute(character, target) {
        if (target && character.distanceTo(target) <= this.range) {
            const damage = this.damage + character.attributes.getModifier('intelligence') * 5;
            target.takeDamage(damage, 'magical');
            console.log(`${character.name} lancia Palla di Fuoco su ${target.name} per ${damage} danni!`);
        }
    }
}

class MageIceShield extends Skill {
    constructor() {
        super('Scudo di Ghiaccio', 'Crea uno scudo protettivo che assorbe danni', 'active', 'intelligence');
        this.maxCooldown = 8;
        this.manaCost = 40;
        this.duration = 10;
        this.shieldAmount = 50;
    }

    execute(character, target) {
        const shield = new Effect('Scudo di Ghiaccio', this.duration, 'buff', this.shieldAmount);
        character.addEffect(shield);
        console.log(`${character.name} attiva Scudo di Ghiaccio!`);
    }
}

class MageLightningBolt extends Skill {
    constructor() {
        super('Fulmine', 'Scaglia un fulmine che colpisce più nemici', 'active', 'intelligence');
        this.maxCooldown = 5;
        this.manaCost = 35;
        this.damage = 30;
        this.range = 120;
        this.chainCount = 3;
    }

    execute(character, target) {
        // Logica per il fulmine a catena
        console.log(`${character.name} lancia Fulmine!`);
    }
}

class MageTeleport extends Skill {
    constructor() {
        super('Teletrasporto', 'Ti teletrasporta a una posizione vicina', 'active', 'intelligence');
        this.maxCooldown = 12;
        this.manaCost = 50;
        this.range = 100;
    }

    execute(character, target) {
        // Logica per il teletrasporto
        console.log(`${character.name} si teletrasporta!`);
    }
}

// Abilità dell'Arciere
class ArcherPreciseShot extends Skill {
    constructor() {
        super('Tiro Preciso', 'Un tiro preciso con alta probabilità di critico', 'active', 'agility');
        this.maxCooldown = 2;
        this.staminaCost = 15;
        this.damage = 35;
        this.range = 200;
        this.criticalBonus = 25;
    }

    execute(character, target) {
        if (target && character.distanceTo(target) <= this.range) {
            const damage = this.damage + character.attributes.getModifier('agility') * 3;
            const isCritical = Math.random() * 100 < (character.criticalChance + this.criticalBonus);
            const finalDamage = isCritical ? damage * character.criticalMultiplier : damage;
            
            target.takeDamage(finalDamage, 'physical');
            console.log(`${character.name} usa Tiro Preciso su ${target.name} per ${finalDamage} danni! ${isCritical ? 'CRITICO!' : ''}`);
        }
    }
}

class ArcherStealth extends Skill {
    constructor() {
        super('Furtività', 'Ti rende invisibile per un breve periodo', 'active', 'agility');
        this.maxCooldown = 15;
        this.staminaCost = 30;
        this.duration = 8;
    }

    execute(character, target) {
        const stealth = new Effect('Furtività', this.duration, 'buff', 1);
        character.addEffect(stealth);
        console.log(`${character.name} attiva Furtività!`);
    }
}

class ArcherTrap extends Skill {
    constructor() {
        super('Trappola', 'Piazza una trappola che immobilizza i nemici', 'active', 'agility');
        this.maxCooldown = 10;
        this.staminaCost = 25;
        this.duration = 5;
        this.range = 50;
    }

    execute(character, target) {
        console.log(`${character.name} piazza una Trappola!`);
    }
}

class ArcherMultiShot extends Skill {
    constructor() {
        super('Tiro Multiplo', 'Lancia frecce multiple contro più nemici', 'active', 'agility');
        this.maxCooldown = 6;
        this.staminaCost = 35;
        this.damage = 25;
        this.arrowCount = 3;
        this.range = 150;
    }

    execute(character, target) {
        console.log(`${character.name} usa Tiro Multiplo!`);
    }
}

// Abilità del Cavaliere
class KnightSlash extends Skill {
    constructor() {
        super('Fendente', 'Un potente attacco con la spada', 'active', 'strength');
        this.maxCooldown = 1.5;
        this.staminaCost = 20;
        this.damage = 45;
        this.range = 40;
    }

    execute(character, target) {
        if (target && character.distanceTo(target) <= this.range) {
            const damage = this.damage + character.attributes.getModifier('strength') * 4;
            target.takeDamage(damage, 'physical');
            console.log(`${character.name} usa Fendente su ${target.name} per ${damage} danni!`);
        }
    }
}

class KnightShieldBash extends Skill {
    constructor() {
        super('Scudo Spinta', 'Usa lo scudo per stordire i nemici', 'active', 'strength');
        this.maxCooldown = 4;
        this.staminaCost = 25;
        this.damage = 20;
        this.stunDuration = 2;
        this.range = 35;
    }

    execute(character, target) {
        if (target && character.distanceTo(target) <= this.range) {
            const damage = this.damage + character.attributes.getModifier('strength') * 2;
            target.takeDamage(damage, 'physical');
            
            const stun = new Effect('Stordito', this.stunDuration, 'debuff', 1);
            target.addEffect(stun);
            
            console.log(`${character.name} usa Scudo Spinta su ${target.name} per ${damage} danni e stordimento!`);
        }
    }
}

class KnightCharge extends Skill {
    constructor() {
        super('Carica', 'Carica verso il nemico infliggendo danni extra', 'active', 'strength');
        this.maxCooldown = 8;
        this.staminaCost = 40;
        this.damage = 60;
        this.range = 80;
        this.chargeSpeed = 200;
    }

    execute(character, target) {
        if (target && character.distanceTo(target) <= this.range) {
            const damage = this.damage + character.attributes.getModifier('strength') * 5;
            target.takeDamage(damage, 'physical');
            console.log(`${character.name} usa Carica su ${target.name} per ${damage} danni!`);
        }
    }
}

class KnightGuardian extends Skill {
    constructor() {
        super('Guardiano', 'Aumenta temporaneamente la difesa', 'active', 'strength');
        this.maxCooldown = 12;
        this.staminaCost = 30;
        this.duration = 15;
        this.defenseBonus = 20;
    }

    execute(character, target) {
        const guardian = new Effect('Guardiano', this.duration, 'buff', this.defenseBonus);
        character.addEffect(guardian);
        console.log(`${character.name} attiva Guardiano!`);
    }
}

// Abilità della Valkiria
class ValkyrieDivineStrike extends Skill {
    constructor() {
        super('Colpo Divino', 'Un attacco sacro che cura gli alleati', 'active', 'charisma');
        this.maxCooldown = 4;
        this.manaCost = 30;
        this.damage = 40;
        this.healAmount = 25;
        this.range = 50;
    }

    execute(character, target) {
        if (target && character.distanceTo(target) <= this.range) {
            const damage = this.damage + character.attributes.getModifier('charisma') * 3;
            target.takeDamage(damage, 'magical');
            
            // Cura gli alleati vicini
            const allies = this.getNearbyAllies(character, 80);
            for (const ally of allies) {
                ally.heal(this.healAmount);
            }
            
            console.log(`${character.name} usa Colpo Divino su ${target.name} per ${damage} danni e cura gli alleati!`);
        }
    }

    getNearbyAllies(character, range) {
        // Placeholder per la logica degli alleati
        return [];
    }
}

class ValkyrieHeal extends Skill {
    constructor() {
        super('Cura', 'Cura un alleato o te stesso', 'active', 'charisma');
        this.maxCooldown = 6;
        this.manaCost = 40;
        this.healAmount = 60;
        this.range = 100;
    }

    execute(character, target) {
        const targetToHeal = target || character;
        if (character.distanceTo(targetToHeal) <= this.range) {
            const healAmount = this.healAmount + character.attributes.getModifier('charisma') * 4;
            targetToHeal.heal(healAmount);
            console.log(`${character.name} cura ${targetToHeal.name} per ${healAmount} punti vita!`);
        }
    }
}

class ValkyrieAura extends Skill {
    constructor() {
        super('Aura Divina', 'Un\'aura che potenzia gli alleati', 'active', 'charisma');
        this.maxCooldown = 15;
        this.manaCost = 50;
        this.duration = 20;
        this.auraRange = 120;
    }

    execute(character, target) {
        const aura = new Effect('Aura Divina', this.duration, 'buff', 1);
        character.addEffect(aura);
        console.log(`${character.name} attiva Aura Divina!`);
    }
}

class ValkyrieAscension extends Skill {
    constructor() {
        super('Ascensione', 'Ti solleva in aria rendendoti invulnerabile', 'active', 'charisma');
        this.maxCooldown = 20;
        this.manaCost = 60;
        this.duration = 8;
    }

    execute(character, target) {
        const ascension = new Effect('Ascensione', this.duration, 'buff', 1);
        character.addEffect(ascension);
        console.log(`${character.name} attiva Ascensione!`);
    }
}



// Esporta le classi per uso globale
window.Character = Character;
