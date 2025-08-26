// Chronicles of Eldrath - Configurazione Asset Grafici
// Gestisce tutti i personaggi, sfondi, nemici e elementi UI

const GameAssets = {
    // Personaggi giocabili
    characters: {
        mage: {
            id: 'mage',
            name: 'Mago',
            description: 'Incantesimi elementali e controllo',
            svg: 'assets/characters/mage.svg',
            color: '#4a90e2',
            stats: {
                intelligence: 18,
                strength: 8,
                agility: 12,
                charisma: 14,
                constitution: 8,
                wisdom: 16
            }
        },
        archer: {
            id: 'archer',
            name: 'Arciere',
            description: 'Attacco a distanza e furtività',
            svg: 'assets/characters/archer.svg',
            color: '#50c878',
            stats: {
                intelligence: 12,
                strength: 10,
                agility: 18,
                charisma: 12,
                constitution: 10,
                wisdom: 14
            }
        },
        knight: {
            id: 'knight',
            name: 'Cavaliere',
            description: 'Combattimento corpo a corpo e difesa',
            svg: 'assets/characters/knight.svg',
            color: '#8b4513',
            stats: {
                intelligence: 10,
                strength: 18,
                agility: 8,
                charisma: 16,
                constitution: 16,
                wisdom: 10
            }
        },
        valkyrie: {
            id: 'valkyrie',
            name: 'Valkiria',
            description: 'Guerriera mistica e supporto',
            svg: 'assets/characters/valkyrie.svg',
            color: '#ffd700',
            stats: {
                intelligence: 14,
                strength: 14,
                agility: 16,
                charisma: 18,
                constitution: 12,
                wisdom: 16
            }
        }
    },

    // Sfondi delle regioni
    backgrounds: {
        valdoria: {
            id: 'valdoria',
            name: 'Valdoria',
            description: 'Regione principale con castello medievale',
            image: 'scenari/rovine_di_valdori.png',
            imageType: 'png',
            music: 'musica/menu/Echi di Leggende (1).mp3',
            enemies: ['orc', 'goblin', 'bandit'],
            level: 1
        },
        tharok: {
            id: 'tharok',
            name: 'Monti di Tharok',
            description: 'Catene montuose con miniere abbandonate e rovine antiche',
            image: 'scenari/moti_di_tharok.png',
            imageType: 'png',
            music: 'musica/gioco/Echi di Leggende.mp3',
            enemies: ['eagle', 'golem', 'troll'],
            level: 21
        },
        forestaMyr: {
            id: 'foresta-myr',
            name: 'Foresta di Myr',
            description: 'Foresta misteriosa e oscura',
            image: 'scenari/foresta-myr.png',
            imageType: 'png',
            music: 'musica/gioco/Echi di Leggende.mp3',
            enemies: ['orc', 'wolf', 'dark-elf'],
            level: 5
        },
        khar: {
            id: 'khar',
            name: 'Desolazione di Khar',
            description: 'Terre bruciate, vulcani attivi e fortezze oscure',
            image: 'scenari/desolazione_di_khar.png',
            imageType: 'png',
            music: 'musica/gioco/Echi di Leggende.mp3',
            enemies: ['dragon', 'demon', 'cultist'],
            level: 61
        },
        aeloria: {
            id: 'aeloria',
            name: 'Isole di Aeloria',
            description: 'Arcipelago fluttuante con templi volanti e magie antiche',
            image: 'scenari/isola_di_aeloria.png',
            imageType: 'png',
            music: 'musica/gioco/Echi di Leggende.mp3',
            enemies: ['elemental', 'siren', 'magic-guardian'],
            level: 81
        }
    },

    // Nemici
    enemies: {
        orc: {
            id: 'orc',
            name: 'Orco',
            description: 'Creatura verde e minacciosa',
            svg: 'assets/enemies/orc.svg',
            type: 'melee',
            health: 80,
            attack: 25,
            defense: 15,
            speed: 60,
            experience: 50,
            gold: 20,
            drops: ['leather', 'iron-ore', 'health-potion']
        },
        dragon: {
            id: 'dragon',
            name: 'Drago',
            description: 'Creatura leggendaria e potente',
            svg: 'assets/enemies/dragon.svg',
            type: 'boss',
            health: 500,
            attack: 80,
            defense: 60,
            speed: 40,
            experience: 500,
            gold: 200,
            drops: ['dragon-scale', 'magic-weapon', 'rare-gem'],
            special: 'fire-breath'
        }
    },

    // Elementi UI
    ui: {
        healthBar: {
            background: '#2e2e2e',
            border: '#ff0000',
            fill: '#00ff00'
        },
        manaBar: {
            background: '#2e2e2e',
            border: '#0000ff',
            fill: '#0080ff'
        },
        staminaBar: {
            background: '#2e2e2e',
            border: '#ffff00',
            fill: '#ffd700'
        }
    },

    // Metodi di utilità
    getCharacterById: function(id) {
        return this.characters[id] || null;
    },

    getBackgroundById: function(id) {
        return this.backgrounds[id] || null;
    },

    getEnemyById: function(id) {
        return this.enemies[id] || null;
    },

    getAllCharacters: function() {
        return Object.values(this.characters);
    },

    getAllBackgrounds: function() {
        return Object.values(this.backgrounds);
    },

    getAllEnemies: function() {
        return Object.values(this.enemies);
    },

    // Precaricamento asset
    preloadAssets: async function() {
        console.log('🎨 Inizio precaricamento asset grafici...');
        
        try {
            // Precarica personaggi
            for (const character of this.getAllCharacters()) {
                if (character.svg) {
                    await this.preloadSVG(character.svg);
                }
            }
            
            // Precarica sfondi
            for (const background of this.getAllBackgrounds()) {
                if (background.svg) {
                    await this.preloadSVG(background.svg);
                } else if (background.image) {
                    await this.preloadImage(background.image);
                }
            }
            
            // Precarica nemici
            for (const enemy of this.getAllEnemies()) {
                if (enemy.svg) {
                    await this.preloadSVG(enemy.svg);
                }
            }
            
            console.log('✅ Tutti gli asset grafici precaricati con successo!');
            
        } catch (error) {
            console.error('❌ Errore nel precaricamento degli asset:', error);
        }
    },

    // Precarica un singolo SVG
    preloadSVG: function(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => reject(new Error(`Errore caricamento: ${url}`));
            img.src = url;
        });
    },

    // Precarica un'immagine PNG/JPG
    preloadImage: function(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                console.log(`✅ Immagine precaricata: ${url}`);
                resolve(url);
            };
            img.onerror = (error) => {
                console.error(`❌ Errore caricamento immagine: ${url}`, error);
                reject(new Error(`Errore caricamento: ${url}`));
            };
            img.src = url;
        });
    },

    // Crea elemento SVG per il canvas
    createSVGElement: function(svgUrl, width = 64, height = 64) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas);
            };
            img.onerror = () => reject(new Error(`Errore caricamento SVG: ${svgUrl}`));
            img.src = svgUrl;
        });
    },

    // Carica immagini PNG/JPG
    createImageElement: function(imagePath, width = 800, height = 600) {
        return new Promise((resolve, reject) => {
            console.log(`🔄 Tentativo caricamento immagine: ${imagePath}`);
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                console.log(`✅ Immagine caricata con successo: ${imagePath}`);
                // Crea un canvas per ridimensionare l'immagine
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                
                // Disegna l'immagine ridimensionata
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas);
            };
            
            img.onerror = (error) => {
                console.error(`❌ Errore caricamento immagine: ${imagePath}`, error);
                reject(new Error(`Errore caricamento immagine: ${imagePath}`));
            };
            img.src = imagePath;
        });
    }
};

// Esporta per uso globale
if (typeof window !== 'undefined') {
    window.GameAssets = GameAssets;
}

// Esporta per moduli ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameAssets;
}
