// Chronicles of Eldrath - Classi Base del Sistema

// Classe base per tutti gli oggetti del gioco
class GameObject {
    constructor(x, y, width, height) {
        this.id = Utils.generateId();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.active = true;
        this.tags = [];
    }

    update(deltaTime) {
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
    }

    draw(ctx) {
        // Metodo base per il rendering
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }

    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

    distanceTo(other) {
        const center1 = this.getCenter();
        const center2 = other.getCenter();
        return Utils.distance(center1.x, center1.y, center2.x, center2.y);
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }

    hasTag(tag) {
        return this.tags.includes(tag);
    }

    removeTag(tag) {
        const index = this.tags.indexOf(tag);
        if (index > -1) {
            this.tags.splice(index, 1);
        }
    }
}

// Sistema di attributi
class Attributes {
    constructor() {
        this.strength = 10;      // Forza - Danno fisico, capacità di carico
        this.intelligence = 10;  // Intelligenza - Potenza magica, mana
        this.agility = 10;       // Agilità - Velocità, precisione, critico
        this.charisma = 10;      // Carisma - Prezzi, dialogo, leadership
        this.constitution = 10;  // Costituzione - Vita, resistenza
        this.wisdom = 10;        // Saggezza - Resistenza magica, percezione
    }

    getModifier(attribute) {
        return Math.floor((this[attribute] - 10) / 2);
    }

    getTotalModifier(attribute) {
        return this.getModifier(attribute);
    }

    increase(attribute, amount = 1) {
        if (this[attribute] !== undefined) {
            this[attribute] = Math.min(this[attribute] + amount, 20);
        }
    }

    decrease(attribute, amount = 1) {
        if (this[attribute] !== undefined) {
            this[attribute] = Math.max(this[attribute] - amount, 1);
        }
    }

    toJSON() {
        return {
            strength: this.strength,
            intelligence: this.intelligence,
            agility: this.agility,
            charisma: this.charisma,
            constitution: this.constitution,
            wisdom: this.wisdom
        };
    }

    fromJSON(data) {
        Object.assign(this, data);
    }
}

// Sistema di abilità
class Skill {
    constructor(name, description, type, baseAttribute, maxLevel = 100) {
        this.name = name;
        this.description = description;
        this.type = type; // 'active', 'passive', 'ultimate'
        this.baseAttribute = baseAttribute;
        this.level = 1;
        this.maxLevel = maxLevel;
        this.experience = 0;
        this.experienceToNext = this.getExperienceForLevel(2);
        this.cooldown = 0;
        this.maxCooldown = 0;
        this.manaCost = 0;
        this.staminaCost = 0;
        this.effects = [];
    }

    getExperienceForLevel(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    gainExperience(amount) {
        this.experience += amount;
        while (this.experience >= this.experienceToNext && this.level < this.maxLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.experience -= this.experienceToNext;
        this.experienceToNext = this.getExperienceForLevel(this.level + 1);
        
        // Migliora l'abilità con il livello
        this.improveWithLevel();
    }

    improveWithLevel() {
        // Override nelle classi figlie per personalizzare i miglioramenti
    }

    canUse(character) {
        return this.cooldown <= 0 && 
               character.mana >= this.manaCost && 
               character.stamina >= this.staminaCost;
    }

    use(character, target) {
        if (!this.canUse(character)) {
            return false;
        }

        character.mana -= this.manaCost;
        character.stamina -= this.staminaCost;
        this.cooldown = this.maxCooldown;

        this.execute(character, target);
        return true;
    }

    execute(character, target) {
        // Override nelle classi figlie per implementare la logica dell'abilità
    }

    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }

    getCooldownPercentage() {
        return this.maxCooldown > 0 ? (this.cooldown / this.maxCooldown) * 100 : 0;
    }

    toJSON() {
        return {
            name: this.name,
            level: this.level,
            experience: this.experience,
            cooldown: this.cooldown
        };
    }

    fromJSON(data) {
        Object.assign(this, data);
    }
}

// Sistema di effetti
class Effect {
    constructor(name, duration, type, magnitude) {
        this.name = name;
        this.duration = duration;
        this.remainingDuration = duration;
        this.type = type; // 'buff', 'debuff', 'dot', 'hot'
        this.magnitude = magnitude;
        this.stacks = 1;
        this.maxStacks = 1;
        this.source = null;
    }

    update(deltaTime) {
        this.remainingDuration -= deltaTime;
        return this.remainingDuration > 0;
    }

    apply(character) {
        // Override nelle classi figlie per implementare l'effetto
    }

    remove(character) {
        // Override nelle classi figlie per rimuovere l'effetto
    }

    canStack() {
        return this.stacks < this.maxStacks;
    }

    addStack() {
        if (this.canStack()) {
            this.stacks++;
            this.remainingDuration = this.duration; // Reset della durata
        }
    }

    getMagnitude() {
        return this.magnitude * this.stacks;
    }

    toJSON() {
        return {
            name: this.name,
            remainingDuration: this.remainingDuration,
            stacks: this.stacks
        };
    }
}

// Sistema di inventario
class Inventory {
    constructor(maxSlots = 50) {
        this.maxSlots = maxSlots;
        this.slots = new Array(maxSlots).fill(null);
        this.gold = 0;
        this.categories = {
            weapons: [],
            armor: [],
            potions: [],
            materials: [],
            quest: []
        };
    }

    addItem(item, quantity = 1) {
        // Cerca uno slot vuoto
        const emptySlot = this.slots.findIndex(slot => slot === null);
        if (emptySlot === -1) {
            return false; // Inventario pieno
        }

        this.slots[emptySlot] = {
            item: item,
            quantity: quantity
        };

        // Aggiorna le categorie
        this.updateCategories();
        return true;
    }

    removeItem(slotIndex, quantity = 1) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) {
            return false;
        }

        const slot = this.slots[slotIndex];
        if (!slot) {
            return false;
        }

        if (quantity >= slot.quantity) {
            this.slots[slotIndex] = null;
        } else {
            slot.quantity -= quantity;
        }

        this.updateCategories();
        return true;
    }

    getItem(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) {
            return null;
        }
        return this.slots[slotIndex];
    }

    hasItem(itemName, quantity = 1) {
        let totalQuantity = 0;
        for (const slot of this.slots) {
            if (slot && slot.item.name === itemName) {
                totalQuantity += slot.quantity;
            }
        }
        return totalQuantity >= quantity;
    }

    updateCategories() {
        // Reset delle categorie
        for (const category in this.categories) {
            this.categories[category] = [];
        }

        // Riorganizza gli item per categoria
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            if (slot) {
                const category = slot.item.category || 'materials';
                this.categories[category].push({
                    slotIndex: i,
                    item: slot.item,
                    quantity: slot.quantity
                });
            }
        }
    }

    getItemsByCategory(category) {
        return this.categories[category] || [];
    }

    addGold(amount) {
        this.gold += amount;
        return this.gold;
    }

    removeGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }

    getUsedSlots() {
        return this.slots.filter(slot => slot !== null).length;
    }

    getFreeSlots() {
        return this.maxSlots - this.getUsedSlots();
    }

    toJSON() {
        return {
            slots: this.slots,
            gold: this.gold
        };
    }

    fromJSON(data) {
        this.slots = data.slots || this.slots;
        this.gold = data.gold || 0;
        this.updateCategories();
    }
}

// Sistema di equipaggiamento
class Equipment {
    constructor() {
        this.slots = {
            weapon: null,
            shield: null,
            helmet: null,
            chest: null,
            gloves: null,
            boots: null,
            ring1: null,
            ring2: null,
            necklace: null,
            cloak: null
        };
        this.bonuses = {
            attack: 0,
            defense: 0,
            magic: 0,
            resistance: 0,
            speed: 0,
            critical: 0
        };
    }

    equip(item, slot) {
        if (!this.slots[slot]) {
            return false;
        }

        // Rimuovi l'item precedente se presente
        if (this.slots[slot]) {
            this.unequip(slot);
        }

        this.slots[slot] = item;
        this.updateBonuses();
        return true;
    }

    unequip(slot) {
        if (!this.slots[slot]) {
            return null;
        }

        const item = this.slots[slot];
        this.slots[slot] = null;
        this.updateBonuses();
        return item;
    }

    updateBonuses() {
        // Reset dei bonus
        for (const bonus in this.bonuses) {
            this.bonuses[bonus] = 0;
        }

        // Calcola i bonus da tutti gli item equipaggiati
        for (const slot in this.slots) {
            const item = this.slots[slot];
            if (item && item.bonuses) {
                for (const bonus in item.bonuses) {
                    if (this.bonuses[bonus] !== undefined) {
                        this.bonuses[bonus] += item.bonuses[bonus];
                    }
                }
            }
        }
    }

    getBonus(bonusName) {
        return this.bonuses[bonusName] || 0;
    }

    getTotalStats() {
        const stats = {};
        for (const slot in this.slots) {
            const item = this.slots[slot];
            if (item && item.stats) {
                for (const stat in item.stats) {
                    stats[stat] = (stats[stat] || 0) + item.stats[stat];
                }
            }
        }
        return stats;
    }

    toJSON() {
        return {
            slots: this.slots
        };
    }

    fromJSON(data) {
        this.slots = data.slots || this.slots;
        this.updateBonuses();
    }
}

// Esporta le classi per uso globale
window.GameObject = GameObject;
window.Attributes = Attributes;
window.Skill = Skill;
window.Effect = Effect;
window.Inventory = Inventory;
window.Equipment = Equipment;
