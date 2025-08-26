// Chronicles of Eldrath - Sistema Interfaccia Utente

// Classe per gestire l'interfaccia utente del gioco
class GameUI {
    constructor(game) {
        this.game = game;
        this.isInventoryOpen = false;
        this.isMapOpen = false;
        this.isMenuOpen = false;
        
        // Elementi UI
        this.elements = {
            healthFill: document.getElementById('health-fill'),
            healthText: document.getElementById('health-text'),
            manaFill: document.getElementById('mana-fill'),
            manaText: document.getElementById('mana-text'),
            staminaFill: document.getElementById('stamina-fill'),
            staminaText: document.getElementById('stamina-text'),
            levelDisplay: document.getElementById('level-display'),
            weaponName: document.getElementById('weapon-name'),
            weaponDamage: document.getElementById('weapon-damage'),
            weaponIcon: document.getElementById('weapon-icon')
        };
        
        // Pannelli
        this.panels = {
            inventory: document.getElementById('inventory-panel'),
            mainMenu: document.getElementById('main-menu')
        };
        
        // Setup degli eventi
        this.setupEventListeners();
        
        console.log('UI inizializzata!');
    }

    setupEventListeners() {
        // Pulsanti dell'interfaccia
        const inventoryBtn = document.getElementById('inventory-btn');
        const mapBtn = document.getElementById('map-btn');
        const menuBtn = document.getElementById('menu-btn');
        
        if (inventoryBtn) {
            inventoryBtn.addEventListener('click', () => this.toggleInventory());
        }
        
        if (mapBtn) {
            mapBtn.addEventListener('click', () => this.toggleMap());
        }
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.toggleMenu());
        }
        
        // Pulsanti di azione
        const attackBtn = document.getElementById('attack-btn');
        const magicBtn = document.getElementById('magic-btn');
        const specialBtn = document.getElementById('special-btn');
        const interactBtn = document.getElementById('interact-btn');
        
        if (attackBtn) {
            attackBtn.addEventListener('click', () => this.game.playerAttack());
        }
        
        if (magicBtn) {
            magicBtn.addEventListener('click', () => this.useMagicSkill());
        }
        
        if (specialBtn) {
            specialBtn.addEventListener('click', () => this.useSpecialSkill());
        }
        
        if (interactBtn) {
            interactBtn.addEventListener('click', () => this.game.playerInteract());
        }
        
        // Pulsanti dell'inventario
        const closeInventoryBtn = document.getElementById('close-inventory');
        if (closeInventoryBtn) {
            closeInventoryBtn.addEventListener('click', () => this.toggleInventory());
        }
        
        // Tab dell'inventario
        const inventoryTabs = document.querySelectorAll('.tab-btn');
        inventoryTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchInventoryTab(tab.dataset.tab));
        });
        
        // Pulsanti del menu principale
        const resumeBtn = document.getElementById('resume-btn');
        const saveBtn = document.getElementById('save-btn');
        const loadBtn = document.getElementById('load-btn');
        const settingsBtn = document.getElementById('settings-btn-game');
        const quitBtn = document.getElementById('quit-btn');
        
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.toggleMenu());
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveGame());
        }
        
        if (loadBtn) {
            loadBtn.addEventListener('click', () => this.loadGame());
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }
        
        if (quitBtn) {
            quitBtn.addEventListener('click', () => this.quitGame());
        }
        
        // Slot rapidi dell'inventario
        const quickSlots = document.querySelectorAll('.quick-slot');
        quickSlots.forEach((slot, index) => {
            slot.addEventListener('click', () => this.useQuickSlot(index));
            slot.setAttribute('data-key', index + 1);
        });
    }

    update(deltaTime) {
        if (!this.game.player) return;
        
        // Aggiorna le barre di stato
        this.updateStatusBars();
        
        // Aggiorna le informazioni del personaggio
        this.updateCharacterInfo();
        
        // Aggiorna le informazioni dell'arma
        this.updateWeaponInfo();
        
        // Aggiorna gli slot rapidi
        this.updateQuickSlots();
        
        // Aggiorna la mini-mappa
        this.updateMiniMap();
    }

    updateStatusBars() {
        const player = this.game.player;
        
        // Barra della salute
        if (this.elements.healthFill && this.elements.healthText) {
            const healthPercentage = (player.health / player.maxHealth) * 100;
            this.elements.healthFill.style.width = `${healthPercentage}%`;
            this.elements.healthText.textContent = `${player.health}/${player.maxHealth}`;
        }
        
        // Barra del mana
        if (this.elements.manaFill && this.elements.manaText) {
            const manaPercentage = (player.mana / player.maxMana) * 100;
            this.elements.manaFill.style.width = `${manaPercentage}%`;
            this.elements.manaText.textContent = `${player.mana}/${player.maxMana}`;
        }
        
        // Barra della stamina
        if (this.elements.staminaFill && this.elements.staminaText) {
            const staminaPercentage = (player.stamina / player.maxStamina) * 100;
            this.elements.staminaFill.style.width = `${staminaPercentage}%`;
            this.elements.staminaText.textContent = `${player.stamina}/${player.maxStamina}`;
        }
    }

    updateCharacterInfo() {
        const player = this.game.player;
        
        // Livello
        if (this.elements.levelDisplay) {
            this.elements.levelDisplay.textContent = player.level;
        }
        
        // Ritratto (placeholder)
        const portraitImg = document.getElementById('portrait-img');
        if (portraitImg) {
            // Qui potresti impostare l'immagine del ritratto basata sulla classe
            portraitImg.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect width="50" height="50" fill="${this.getCharacterColor(player.characterClass)}"/></svg>`;
        }
    }

    getCharacterColor(characterClass) {
        const colors = {
            'mage': '#4a90e2',
            'archer': '#50c878',
            'knight': '#8b4513',
            'valkyrie': '#ffd700'
        };
        return colors[characterClass] || '#ffffff';
    }

    updateWeaponInfo() {
        const player = this.game.player;
        const weapon = player.equipment.slots.weapon;
        
        if (weapon) {
            if (this.elements.weaponName) {
                this.elements.weaponName.textContent = weapon.name;
            }
            
            if (this.elements.weaponDamage) {
                this.elements.weaponDamage.textContent = `Danno: ${weapon.stats.attack}`;
            }
            
            if (this.elements.weaponIcon) {
                this.elements.weaponIcon.textContent = this.getWeaponIcon(weapon.type);
            }
        } else {
            // Arma di default
            if (this.elements.weaponName) {
                this.elements.weaponName.textContent = 'Spada Base';
            }
            
            if (this.elements.weaponDamage) {
                this.elements.weaponDamage.textContent = 'Danno: 15-25';
            }
            
            if (this.elements.weaponIcon) {
                this.elements.weaponIcon.textContent = '⚔️';
            }
        }
    }

    getWeaponIcon(weaponType) {
        const icons = {
            'sword': '⚔️',
            'axe': '🪓',
            'mace': '🔨',
            'bow': '🏹',
            'staff': '🧙‍♂️',
            'dagger': '🗡️'
        };
        return icons[weaponType] || '⚔️';
    }

    updateQuickSlots() {
        const player = this.game.player;
        const quickSlots = document.querySelectorAll('.quick-slot');
        
        quickSlots.forEach((slot, index) => {
            // Trova l'item nello slot rapido
            const item = this.getQuickSlotItem(player, index);
            
            if (item) {
                slot.textContent = this.getItemIcon(item);
                slot.title = item.name;
                slot.classList.remove('empty');
            } else {
                slot.textContent = '';
                slot.title = 'Slot vuoto';
                slot.classList.add('empty');
            }
        });
    }

    getQuickSlotItem(player, slotIndex) {
        // Placeholder per la logica degli slot rapidi
        // Dovrebbe restituire l'item assegnato a quello slot
        return null;
    }

    getItemIcon(item) {
        const icons = {
            'health_potion': '💊',
            'mana_potion': '🧪',
            'strength_potion': '💪',
            'speed_potion': '⚡',
            'invisibility_potion': '👻',
            'fire_resistance': '🔥',
            'ice_resistance': '❄️'
        };
        return icons[item.type] || '📦';
    }

    updateMiniMap() {
        const mapCanvas = document.getElementById('map-canvas');
        if (!mapCanvas) return;
        
        const ctx = mapCanvas.getContext('2d');
        ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
        
        // Disegna la mappa base
        this.drawMiniMap(ctx, mapCanvas.width, mapCanvas.height);
        
        // Disegna la posizione del giocatore
        if (this.game.player) {
            this.drawPlayerOnMiniMap(ctx, mapCanvas.width, mapCanvas.height);
        }
        
        // Disegna i nemici
        this.drawEnemiesOnMiniMap(ctx, mapCanvas.width, mapCanvas.height);
        
        // Disegna i punti di interesse
        this.drawPointsOfInterestOnMiniMap(ctx, mapCanvas.width, mapCanvas.height);
    }

    drawMiniMap(ctx, width, height) {
        // Sfondo della mini-mappa
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);
        
        // Griglia della mappa
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        
        const gridSize = 20;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    drawPlayerOnMiniMap(ctx, width, height) {
        const player = this.game.player;
        
        // Calcola la posizione relativa sulla mini-mappa
        const mapX = (player.x / 800) * width;
        const mapY = (player.y / 600) * height;
        
        // Disegna il giocatore
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(mapX, mapY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Bordo del giocatore
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    drawEnemiesOnMiniMap(ctx, width, height) {
        for (const enemy of this.game.enemies) {
            if (!enemy.isAlive) continue;
            
            // Calcola la posizione relativa
            const mapX = (enemy.x / 800) * width;
            const mapY = (enemy.y / 600) * height;
            
            // Colore basato sul tipo di nemico
            let color;
            switch (enemy.enemyType) {
                case 'orc': color = '#8b4513'; break;
                case 'dragon': color = '#ff4500'; break;
                case 'eagle': color = '#4682b4'; break;
                case 'phoenix': color = '#ff8c00'; break;
                default: color = '#ff0000';
            }
            
            ctx.fillStyle = color;
            ctx.fillRect(mapX - 1, mapY - 1, 2, 2);
        }
    }

    drawPointsOfInterestOnMiniMap(ctx, width, height) {
        // Disegna i punti di uscita
        for (const item of this.game.items) {
            if (item.type === 'exit') {
                const mapX = (item.x / 800) * width;
                const mapY = (item.y / 600) * height;
                
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(mapX, mapY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Metodi per i pannelli
    toggleInventory() {
        this.isInventoryOpen = !this.isInventoryOpen;
        
        if (this.isInventoryOpen) {
            Utils.showPanel('inventory-panel');
            this.populateInventory();
        } else {
            Utils.hidePanel('inventory-panel');
        }
    }

    toggleMap() {
        this.isMapOpen = !this.isMapOpen;
        
        // Placeholder per la mappa a schermo intero
        if (this.isMapOpen) {
            console.log('Mappa aperta');
        } else {
            console.log('Mappa chiusa');
        }
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            Utils.showPanel('main-menu');
            this.game.pause();
        } else {
            Utils.hidePanel('main-menu');
            this.game.resume();
        }
    }

    populateInventory() {
        if (!this.game.player) return;
        
        const inventoryGrid = document.getElementById('inventory-grid');
        if (!inventoryGrid) return;
        
        // Pulisci la griglia
        inventoryGrid.innerHTML = '';
        
        const inventory = this.game.player.inventory;
        
        // Crea gli slot dell'inventario
        for (let i = 0; i < inventory.maxSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            
            const item = inventory.getItem(i);
            if (item) {
                slot.textContent = this.getItemIcon(item.item);
                slot.title = `${item.item.name} (x${item.quantity})`;
                
                // Aggiungi classe per la rarità
                if (item.item.rarity) {
                    slot.classList.add(item.item.rarity);
                }
                
                // Event listener per l'item
                slot.addEventListener('click', () => this.useInventoryItem(i));
            } else {
                slot.classList.add('empty');
                slot.title = 'Slot vuoto';
            }
            
            inventoryGrid.appendChild(slot);
        }
    }

    useInventoryItem(slotIndex) {
        const player = this.game.player;
        const item = player.inventory.getItem(slotIndex);
        
        if (!item) return;
        
        // Usa l'item
        this.useItem(item.item, slotIndex);
    }

    useItem(item, slotIndex) {
        const player = this.game.player;
        
        switch (item.type) {
            case 'health_potion':
                const healAmount = player.heal(item.stats.healAmount);
                if (healAmount > 0) {
                    player.inventory.removeItem(slotIndex, 1);
                    this.showMessage(`Curato per ${healAmount} punti vita!`);
                }
                break;
                
            case 'mana_potion':
                const manaAmount = player.restoreMana(item.stats.healAmount);
                if (manaAmount > 0) {
                    player.inventory.removeItem(slotIndex, 1);
                    this.showMessage(`Mana ripristinato per ${manaAmount} punti!`);
                }
                break;
                
            case 'weapon':
            case 'armor':
                this.equipItem(item, slotIndex);
                break;
                
            default:
                this.showMessage(`Usato: ${item.name}`);
                break;
        }
        
        // Aggiorna l'inventario
        this.populateInventory();
    }

    equipItem(item, slotIndex) {
        const player = this.game.player;
        
        // Trova lo slot corretto per l'equipaggiamento
        let equipSlot = null;
        
        if (item.type === 'weapon') {
            equipSlot = 'weapon';
        } else if (item.type === 'armor') {
            // Determina il tipo di armatura
            if (item.name.includes('elmo') || item.name.includes('helmet')) {
                equipSlot = 'helmet';
            } else if (item.name.includes('corazza') || item.name.includes('chest')) {
                equipSlot = 'chest';
            } else if (item.name.includes('guanti') || item.name.includes('gloves')) {
                equipSlot = 'gloves';
            } else if (item.name.includes('stivali') || item.name.includes('boots')) {
                equipSlot = 'boots';
            }
        }
        
        if (equipSlot) {
            // Equipaggia l'item
            const oldItem = player.equipment.equip(item, equipSlot);
            
            // Rimuovi l'item dall'inventario
            player.inventory.removeItem(slotIndex, 1);
            
            // Aggiungi l'item precedente all'inventario se presente
            if (oldItem) {
                player.inventory.addItem(oldItem);
            }
            
            // Aggiorna le statistiche
            player.updateStats();
            
            this.showMessage(`Equipaggiato: ${item.name}`);
        }
    }

    switchInventoryTab(tabName) {
        // Aggiorna i tab attivi
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Filtra gli item per categoria
        this.filterInventoryByCategory(tabName);
    }

    filterInventoryByCategory(category) {
        if (!this.game.player) return;
        
        const inventory = this.game.player.inventory;
        const items = inventory.getItemsByCategory(category);
        
        // Placeholder per il filtraggio dell'inventario
        console.log(`Mostrando ${category}:`, items);
    }

    useQuickSlot(slotIndex) {
        const player = this.game.player;
        const item = this.getQuickSlotItem(player, slotIndex);
        
        if (item) {
            this.useItem(item, slotIndex);
        }
    }

    useMagicSkill() {
        if (!this.game.player || !this.game.player.skills[1]) return;
        
        this.game.useSkill(1);
    }

    useSpecialSkill() {
        if (!this.game.player || !this.game.player.skills[2]) return;
        
        this.game.useSkill(2);
    }

    // Metodi per il menu principale
    saveGame() {
        if (this.game.saveGame()) {
            this.showMessage('Gioco salvato con successo!');
        } else {
            this.showMessage('Errore nel salvataggio!');
        }
    }

    loadGame() {
        if (this.game.loadGame()) {
            this.showMessage('Gioco caricato con successo!');
            this.toggleMenu();
        } else {
            this.showMessage('Nessun salvataggio trovato!');
        }
    }

    openSettings() {
        // Placeholder per le impostazioni
        console.log('Apertura impostazioni...');
        this.showMessage('Impostazioni non ancora implementate');
    }

    quitGame() {
        if (confirm('Sei sicuro di voler uscire? I progressi non salvati andranno persi.')) {
            // Torna alla schermata principale
            Utils.showScreen('welcome-screen');
            this.game.stop();
        }
    }

    // Metodi di utilità
    showMessage(message, duration = 3000) {
        // Crea un elemento per il messaggio
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            border: 2px solid #ffd700;
            z-index: 1000;
            font-size: 16px;
            font-weight: bold;
            animation: messageFadeIn 0.3s ease-out;
        `;
        
        // Aggiungi il messaggio al DOM
        document.body.appendChild(messageElement);
        
        // Rimuovi il messaggio dopo la durata specificata
        setTimeout(() => {
            messageElement.style.animation = 'messageFadeOut 0.3s ease-out';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, duration);
    }

    render(ctx) {
        // L'UI viene renderizzata direttamente nel DOM, non sul canvas
        // Questo metodo è un placeholder per eventuali rendering futuri
    }
}

// Stili CSS per i messaggi di gioco
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    @keyframes messageFadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes messageFadeOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;
document.head.appendChild(messageStyles);

// Esporta la classe per uso globale
window.GameUI = GameUI;
