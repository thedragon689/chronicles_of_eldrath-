// Chronicles of Eldrath - Sistema Mondo di Gioco

// Classe per gestire il mondo di gioco
class GameWorld {
    constructor() {
        this.regions = new Map();
        this.currentRegion = null;
        this.currentLevel = 1;
        this.maxLevel = 100;
        this.difficulty = 'normal';
        
        // Sistema meteo
        this.weather = 'clear';
        this.weatherTimer = 0;
        this.weatherDuration = 300; // 5 minuti
        
        // Sistema giorno/notte
        this.timeOfDay = 0; // 0-24 ore
        this.dayLength = 1200; // 20 minuti per un giorno completo
        this.timeSpeed = 1;
        
        // Eventi dinamici
        this.activeEvents = [];
        this.eventTimer = 0;
        this.eventInterval = 600; // 10 minuti
        
        // Sistema asset grafici
        this.backgroundImages = new Map();
        
        // Inizializza le regioni
        this.initializeRegions();
        
        // Carica gli sfondi grafici
        this.loadBackgroundAssets();
    }

    initializeRegions() {
        // Valdoria - Terre fertili con città fortificate
        this.regions.set('valdoria', {
            name: 'Valdoria',
            description: 'Terre fertili con città fortificate, mercati e gilde',
            theme: 'medieval',
            background: 'scenari/rovine_di_valdori.png',
            backgroundType: 'png',
            enemies: ['orc', 'bandit', 'wolf'],
            boss: 'Gor\'Thak il Sanguinario',
            levels: [1, 20],
            cities: ['Valdoria City', 'Riverside Village', 'Fortress Gate'],
            dungeons: ['Ancient Crypt', 'Bandit Hideout', 'Wolf Den'],
            music: 'valdoria_theme',
            weather: ['clear', 'rain', 'fog']
        });

        // Monti di Tharok - Catene montuose
        this.regions.set('tharok', {
            name: 'Monti di Tharok',
            description: 'Catene montuose con miniere abbandonate e rovine antiche',
            theme: 'mountain',
            background: 'scenari/moti_di_tharok.png',
            backgroundType: 'png',
            enemies: ['eagle', 'golem', 'troll'],
            boss: 'Tharok il Guardiano di Pietra',
            levels: [21, 40],
            cities: ['Mountain Peak', 'Miner\'s Rest', 'Ancient Forge'],
            dungeons: ['Abandoned Mine', 'Stone Temple', 'Crystal Cave'],
            music: 'tharok_theme',
            weather: ['clear', 'snow', 'storm']
        });

        // Foresta di Myr - Bosco sacro
        this.regions.set('myr', {
            name: 'Foresta di Myr',
            description: 'Bosco sacro abitato da creature magiche e druidi',
            theme: 'forest',
            background: 'scenari/foresta-myr.png',
            backgroundType: 'png',
            enemies: ['phoenix', 'spirit', 'giant_spider'],
            boss: 'Myr\'Dana la Protettrice',
            levels: [41, 60],
            cities: ['Druid Grove', 'Spirit Village', 'Ancient Tree'],
            dungeons: ['Sacred Grove', 'Spirit Realm', 'Spider\'s Web'],
            music: 'myr_theme',
            weather: ['clear', 'rain', 'mystical']
        });

        // Desolazione di Khar - Terre bruciate
        this.regions.set('khar', {
            name: 'Desolazione di Khar',
            description: 'Terre bruciate, vulcani attivi e fortezze oscure',
            theme: 'volcanic',
            background: 'scenari/desolazione_di_khar.png',
            backgroundType: 'png',
            enemies: ['dragon', 'demon', 'cultist'],
            boss: 'Khar\'Zul il Signore del Fuoco',
            levels: [61, 80],
            cities: ['Volcanic City', 'Ash Village', 'Dark Fortress'],
            dungeons: ['Volcanic Chamber', 'Demon Portal', 'Cultist Temple'],
            music: 'khar_theme',
            weather: ['ash', 'fire_rain', 'volcanic_storm']
        });

        // Isole di Aeloria - Arcipelago fluttuante
        this.regions.set('aeloria', {
            name: 'Isole di Aeloria',
            description: 'Arcipelago fluttuante con templi volanti e magie antiche',
            theme: 'celestial',
            background: 'scenari/isola_di_aeloria.png',
            backgroundType: 'png',
            enemies: ['elemental', 'siren', 'magic_guardian'],
            boss: 'Aeloria la Custode del Tempo',
            levels: [81, 100],
            cities: ['Floating Temple', 'Sky Village', 'Time Portal'],
            dungeons: ['Floating Palace', 'Siren\'s Cove', 'Time Chamber'],
            music: 'aeloria_theme',
            weather: ['clear', 'aurora', 'time_storm']
        });
    }

    getCurrentRegion() {
        return this.currentRegion;
    }

    getRegionForLevel(level) {
        for (const [key, region] of this.regions) {
            if (level >= region.levels[0] && level <= region.levels[1]) {
                return key;
            }
        }
        return 'valdoria'; // Default
    }

    changeRegion(regionKey) {
        if (this.regions.has(regionKey)) {
            this.currentRegion = regionKey;
            const region = this.regions.get(regionKey);
            
            // Cambia la musica
            this.changeMusic(region.music);
            
            // Cambia il meteo
            this.changeWeather(region.weather[Utils.random(0, region.weather.length - 1)]);
            
            console.log(`Entrato nella regione: ${region.name}`);
            return true;
        }
        return false;
    }

    changeLevel(level) {
        if (level >= 1 && level <= this.maxLevel) {
            this.currentLevel = level;
            
            // Cambia regione se necessario
            const newRegion = this.getRegionForLevel(level);
            if (newRegion !== this.currentRegion) {
                this.changeRegion(newRegion);
            }
            
            // Genera il livello
            this.generateLevel(level);
            
            console.log(`Salito al livello ${level}`);
            return true;
        }
        return false;
    }

    generateLevel(level) {
        // Genera la mappa del livello
        const levelMap = this.createLevelMap(level);
        
        // Genera i nemici
        const enemies = this.generateEnemies(level);
        
        // Genera il boss se è un livello di boss
        if (this.isBossLevel(level)) {
            const boss = this.generateBoss(level);
        }
        
        // Genera il loot e gli oggetti
        const items = this.generateItems(level);
        
        console.log(`Livello ${level} generato con successo`);
    }

    createLevelMap(level) {
        const mapSize = 50 + (level * 2); // Mappa più grande per livelli più alti
        const map = {
            width: mapSize,
            height: mapSize,
            tiles: [],
            obstacles: [],
            spawnPoints: [],
            exitPoints: []
        };

        // Genera la mappa base
        for (let y = 0; y < map.height; y++) {
            map.tiles[y] = [];
            for (let x = 0; x < map.width; x++) {
                map.tiles[y][x] = this.generateTile(x, y, level);
            }
        }

        // Aggiungi ostacoli
        this.addObstacles(map, level);
        
        // Aggiungi punti di spawn
        this.addSpawnPoints(map, level);
        
        // Aggiungi punti di uscita
        this.addExitPoints(map, level);

        return map;
    }

    generateTile(x, y, level) {
        const region = this.getRegionForLevel(level);
        const regionData = this.regions.get(region);
        
        // Genera tile basati sul tema della regione
        switch (regionData.theme) {
            case 'medieval':
                return this.generateMedievalTile(x, y);
            case 'mountain':
                return this.generateMountainTile(x, y);
            case 'forest':
                return this.generateForestTile(x, y);
            case 'volcanic':
                return this.generateVolcanicTile(x, y);
            case 'celestial':
                return this.generateCelestialTile(x, y);
            default:
                return this.generateMedievalTile(x, y);
        }
    }

    generateMedievalTile(x, y) {
        const tileTypes = ['grass', 'stone', 'water', 'dirt'];
        const weights = [0.6, 0.2, 0.1, 0.1];
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < tileTypes.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                return {
                    type: tileTypes[i],
                    walkable: tileTypes[i] !== 'water',
                    decoration: this.getTileDecoration(tileTypes[i])
                };
            }
        }
        
        return { type: 'grass', walkable: true, decoration: null };
    }

    generateMountainTile(x, y) {
        const tileTypes = ['rock', 'snow', 'mountain', 'cave'];
        const weights = [0.4, 0.3, 0.2, 0.1];
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < tileTypes.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                return {
                    type: tileTypes[i],
                    walkable: tileTypes[i] !== 'mountain',
                    decoration: this.getTileDecoration(tileTypes[i])
                };
            }
        }
        
        return { type: 'rock', walkable: true, decoration: null };
    }

    generateForestTile(x, y) {
        const tileTypes = ['forest', 'grass', 'mystical', 'clearing'];
        const weights = [0.5, 0.3, 0.15, 0.05];
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < tileTypes.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                return {
                    type: tileTypes[i],
                    walkable: tileTypes[i] !== 'mystical',
                    decoration: this.getTileDecoration(tileTypes[i])
                };
            }
        }
        
        return { type: 'forest', walkable: true, decoration: null };
    }

    generateVolcanicTile(x, y) {
        const tileTypes = ['lava', 'ash', 'volcanic_rock', 'obsidian'];
        const weights = [0.2, 0.4, 0.3, 0.1];
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < tileTypes.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                return {
                    type: tileTypes[i],
                    walkable: tileTypes[i] !== 'lava',
                    decoration: this.getTileDecoration(tileTypes[i])
                };
            }
        }
        
        return { type: 'ash', walkable: true, decoration: null };
    }

    generateCelestialTile(x, y) {
        const tileTypes = ['crystal', 'floating_rock', 'energy_field', 'void'];
        const weights = [0.4, 0.3, 0.2, 0.1];
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < tileTypes.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                return {
                    type: tileTypes[i],
                    walkable: tileTypes[i] !== 'void',
                    decoration: this.getTileDecoration(tileTypes[i])
                };
            }
        }
        
        return { type: 'crystal', walkable: true, decoration: null };
    }

    getTileDecoration(tileType) {
        const decorations = {
            grass: ['flower', 'bush', 'small_tree'],
            stone: ['crack', 'moss', 'crystal'],
            water: ['ripple', 'bubble', 'reflection'],
            dirt: ['root', 'small_rock', 'grass_patch'],
            rock: ['crack', 'mineral', 'lichen'],
            snow: ['icicle', 'snow_pile', 'frozen_water'],
            mountain: ['peak', 'cliff', 'cave_entrance'],
            cave: ['stalagmite', 'stalactite', 'crystal_formation'],
            forest: ['tree', 'fallen_log', 'mushroom'],
            mystical: ['magical_aura', 'floating_light', 'ancient_rune'],
            clearing: ['sunlight', 'butterfly', 'deer_track'],
            lava: ['fire_particle', 'smoke', 'magma_bubble'],
            ash: ['ash_pile', 'charred_remains', 'smoke_trail'],
            volcanic_rock: ['crack', 'mineral_vein', 'heat_distortion'],
            obsidian: ['sharp_edge', 'reflection', 'dark_glow'],
            crystal: ['sparkle', 'color_shift', 'energy_pulse'],
            floating_rock: ['levitation', 'gravity_field', 'magical_glow'],
            energy_field: ['energy_wave', 'power_surge', 'magical_barrier'],
            void: ['darkness', 'star_field', 'reality_distortion']
        };
        
        const tileDecorations = decorations[tileType] || [];
        if (tileDecorations.length > 0 && Math.random() < 0.3) {
            return tileDecorations[Utils.random(0, tileDecorations.length - 1)];
        }
        
        return null;
    }

    addObstacles(map, level) {
        const obstacleCount = Math.floor(level * 0.5) + 5;
        
        for (let i = 0; i < obstacleCount; i++) {
            const x = Utils.random(5, map.width - 6);
            const y = Utils.random(5, map.height - 6);
            
            const obstacle = {
                x: x,
                y: y,
                type: this.getRandomObstacleType(level),
                walkable: false
            };
            
            map.obstacles.push(obstacle);
            map.tiles[y][x].walkable = false;
            map.tiles[y][x].obstacle = obstacle;
        }
    }

    getRandomObstacleType(level) {
        const region = this.getRegionForLevel(level);
        const regionData = this.regions.get(region);
        
        const obstacleTypes = {
            medieval: ['wall', 'fence', 'barrel', 'cart'],
            mountain: ['boulder', 'cliff', 'fallen_tree', 'rock_formation'],
            forest: ['tree', 'fallen_log', 'bush', 'mystical_barrier'],
            volcanic: ['lava_pool', 'ash_pile', 'volcanic_rock', 'fire_pit'],
            celestial: ['crystal_formation', 'energy_barrier', 'floating_debris', 'void_portal']
        };
        
        const types = obstacleTypes[regionData.theme] || obstacleTypes.medieval;
        return types[Utils.random(0, types.length - 1)];
    }

    addSpawnPoints(map, level) {
        // Punto di spawn principale per il giocatore
        const spawnX = Math.floor(map.width / 2);
        const spawnY = Math.floor(map.height / 2);
        
        map.spawnPoints.push({
            x: spawnX,
            y: spawnY,
            type: 'player',
            level: level
        });
        
        // Punti di spawn per i nemici
        const enemySpawnCount = Math.floor(level * 0.8) + 3;
        
        for (let i = 0; i < enemySpawnCount; i++) {
            let x, y;
            let attempts = 0;
            
            do {
                x = Utils.random(10, map.width - 11);
                y = Utils.random(10, map.height - 11);
                attempts++;
            } while (this.isNearSpawnPoint(x, y, map.spawnPoints) && attempts < 50);
            
            if (attempts < 50) {
                map.spawnPoints.push({
                    x: x,
                    y: y,
                    type: 'enemy',
                    level: level,
                    enemyType: this.getRandomEnemyType(level)
                });
            }
        }
    }

    isNearSpawnPoint(x, y, spawnPoints) {
        for (const spawn of spawnPoints) {
            const distance = Utils.distance(x, y, spawn.x, spawn.y);
            if (distance < 20) {
                return true;
            }
        }
        return false;
    }

    getRandomEnemyType(level) {
        const region = this.getRegionForLevel(level);
        const regionData = this.regions.get(region);
        
        if (regionData.enemies.length > 0) {
            return regionData.enemies[Utils.random(0, regionData.enemies.length - 1)];
        }
        
        return 'orc'; // Default
    }

    addExitPoints(map, level) {
        // Punto di uscita per il livello successivo
        const exitX = Utils.random(5, map.width - 6);
        const exitY = Utils.random(5, map.height - 6);
        
        map.exitPoints.push({
            x: exitX,
            y: exitY,
            type: 'next_level',
            level: level + 1
        });
        
        // Punto di uscita per tornare al livello precedente (se non è il primo)
        if (level > 1) {
            const backX = Utils.random(5, map.width - 6);
            const backY = Utils.random(5, map.height - 6);
            
            map.exitPoints.push({
                x: backX,
                y: backY,
                type: 'previous_level',
                level: level - 1
            });
        }
    }

    generateEnemies(level) {
        const enemies = [];
        const region = this.getRegionForLevel(level);
        const regionData = this.regions.get(region);
        
        // Genera nemici normali
        const enemyCount = Math.floor(level * 0.6) + 5;
        
        for (let i = 0; i < enemyCount; i++) {
            const enemyType = regionData.enemies[Utils.random(0, regionData.enemies.length - 1)];
            const x = Utils.random(50, 800);
            const y = Utils.random(50, 600);
            
            const enemy = EnemyFactory.createEnemy(enemyType, x, y, level);
            enemies.push(enemy);
        }
        
        return enemies;
    }

    isBossLevel(level) {
        // Boss ogni 10 livelli
        return level % 10 === 0;
    }

    generateBoss(level) {
        const region = this.getRegionForLevel(level);
        const regionData = this.regions.get(region);
        
        if (regionData.boss) {
            const bossType = this.getBossType(region);
            const x = 400; // Centro della mappa
            const y = 300;
            
            const boss = EnemyFactory.createEnemy(bossType, x, y, level);
            console.log(`Boss generato: ${boss.name} al livello ${level}`);
            
            return boss;
        }
        
        return null;
    }

    getBossType(region) {
        const bossTypes = {
            'valdoria': 'orc',
            'tharok': 'golem',
            'myr': 'phoenix',
            'khar': 'dragon',
            'aeloria': 'elemental'
        };
        
        return bossTypes[region] || 'orc';
    }

    generateItems(level) {
        const items = [];
        const itemCount = Math.floor(level * 0.3) + 3;
        
        for (let i = 0; i < itemCount; i++) {
            const item = this.generateRandomItem(level);
            if (item) {
                items.push(item);
            }
        }
        
        return items;
    }

    generateRandomItem(level) {
        const itemTypes = ['weapon', 'armor', 'potion', 'material'];
        const weights = [0.2, 0.2, 0.4, 0.2];
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < itemTypes.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                return this.createItem(itemTypes[i], level);
            }
        }
        
        return null;
    }

    createItem(type, level) {
        // Placeholder per la creazione di item
        return {
            type: type,
            level: level,
            name: `${type} Lv.${level}`,
            rarity: this.getRandomRarity(),
            stats: this.generateItemStats(type, level)
        };
    }

    getRandomRarity() {
        const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const weights = [0.5, 0.3, 0.15, 0.04, 0.01];
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < rarities.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                return rarities[i];
            }
        }
        
        return 'common';
    }

    generateItemStats(type, level) {
        const stats = {};
        
        switch (type) {
            case 'weapon':
                stats.attack = 10 + (level * 2);
                stats.speed = Utils.random(80, 120);
                break;
            case 'armor':
                stats.defense = 5 + level;
                stats.resistance = Utils.random(5, 15);
                break;
            case 'potion':
                stats.healAmount = 50 + (level * 10);
                break;
            case 'material':
                stats.value = Utils.random(10, 50);
                break;
        }
        
        return stats;
    }

    update(deltaTime) {
        // Aggiorna il tempo del giorno
        this.timeOfDay += (deltaTime * this.timeSpeed) / this.dayLength;
        if (this.timeOfDay >= 24) {
            this.timeOfDay = 0;
        }
        
        // Aggiorna il meteo
        this.weatherTimer += deltaTime;
        if (this.weatherTimer >= this.weatherDuration) {
            this.changeRandomWeather();
            this.weatherTimer = 0;
        }
        
        // Aggiorna gli eventi
        this.eventTimer += deltaTime;
        if (this.eventTimer >= this.eventInterval) {
            this.triggerRandomEvent();
            this.eventTimer = 0;
        }
    }

    changeWeather(newWeather) {
        this.weather = newWeather;
        console.log(`Meteo cambiato: ${newWeather}`);
        
        // Applica effetti del meteo
        this.applyWeatherEffects(newWeather);
    }

    changeRandomWeather() {
        const region = this.getRegionForLevel(this.currentLevel);
        const regionData = this.regions.get(region);
        
        if (regionData.weather && regionData.weather.length > 0) {
            const randomWeather = regionData.weather[Utils.random(0, regionData.weather.length - 1)];
            this.changeWeather(randomWeather);
        }
    }

    applyWeatherEffects(weather) {
        // Placeholder per gli effetti del meteo
        switch (weather) {
            case 'rain':
                console.log('Effetto pioggia: visibilità ridotta');
                break;
            case 'storm':
                console.log('Effetto tempesta: movimento rallentato');
                break;
            case 'snow':
                console.log('Effetto neve: terreno scivoloso');
                break;
            case 'fog':
                console.log('Effetto nebbia: raggio visivo limitato');
                break;
        }
    }

    changeMusic(musicTrack) {
        // Placeholder per il cambio di musica
        console.log(`Cambiata musica: ${musicTrack}`);
    }

    triggerRandomEvent() {
        const events = [
            'enemy_invasion',
            'treasure_discovery',
            'weather_change',
            'npc_encounter',
            'special_boss'
        ];
        
        const randomEvent = events[Utils.random(0, events.length - 1)];
        console.log(`Evento attivato: ${randomEvent}`);
        
        // Gestisci l'evento
        this.handleEvent(randomEvent);
    }

    handleEvent(eventType) {
        switch (eventType) {
            case 'enemy_invasion':
                this.handleEnemyInvasion();
                break;
            case 'treasure_discovery':
                this.handleTreasureDiscovery();
                break;
            case 'weather_change':
                this.changeRandomWeather();
                break;
            case 'npc_encounter':
                this.handleNPCEncounter();
                break;
            case 'special_boss':
                this.handleSpecialBoss();
                break;
        }
    }

    handleEnemyInvasion() {
        console.log('Invasione nemica! Nemici extra generati.');
        // Genera nemici extra
    }

    handleTreasureDiscovery() {
        console.log('Tesoro scoperto! Loot migliorato per questo livello.');
        // Migliora il loot
    }

    handleNPCEncounter() {
        console.log('Incontro con NPC! Missione disponibile.');
        // Genera una missione
    }

    handleSpecialBoss() {
        console.log('Boss speciale apparso! Ricompense extra disponibili.');
        // Genera un boss speciale
    }

    getTimeOfDay() {
        const hour = Math.floor(this.timeOfDay);
        const minute = Math.floor((this.timeOfDay % 1) * 60);
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    isDay() {
        return this.timeOfDay >= 6 && this.timeOfDay <= 18;
    }

    isNight() {
        return this.timeOfDay < 6 || this.timeOfDay > 18;
    }

    getDifficultyMultiplier() {
        switch (this.difficulty) {
            case 'easy': return 0.7;
            case 'normal': return 1.0;
            case 'extreme': return 1.5;
            default: return 1.0;
        }
    }

    toJSON() {
        return {
            currentRegion: this.currentRegion,
            currentLevel: this.currentLevel,
            difficulty: this.difficulty,
            weather: this.weather,
            timeOfDay: this.timeOfDay
        };
    }

    fromJSON(data) {
        this.currentRegion = data.currentRegion || 'valdoria';
        this.currentLevel = data.currentLevel || 1;
        this.difficulty = data.difficulty || 'normal';
        this.weather = data.weather || 'clear';
        this.timeOfDay = data.timeOfDay || 0;
    }

    // Metodi per asset grafici
    async loadBackgroundAssets() {
        if (!window.GameAssets) {
            console.warn('🎨 GameAssets non disponibile, uso sfondi di fallback');
            return;
        }

        try {
            console.log('🎨 Caricamento sfondi delle regioni...');
            
            for (const [regionId, region] of this.regions) {
                console.log(`🎨 Tentativo caricamento sfondo per ${region.name}: ${region.background}`);
                
                if (region.backgroundType === 'svg') {
                    try {
                        const backgroundImage = await window.GameAssets.createSVGElement(
                            region.background, 
                            800, 
                            600
                        );
                        this.backgroundImages.set(regionId, backgroundImage);
                        console.log(`✅ Sfondo SVG caricato per ${region.name}: ${region.background}`);
                    } catch (error) {
                        console.error(`❌ Errore caricamento sfondo SVG per ${region.name}:`, error);
                        console.error(`   Percorso file: ${region.background}`);
                        console.error(`   Errore completo:`, error);
                    }
                } else if (region.background && region.background.includes('.png')) {
                    try {
                        console.log(`🔄 Tentativo caricamento PNG: ${region.background}`);
                        const backgroundImage = await window.GameAssets.createImageElement(
                            region.background, 
                            800, 
                            600
                        );
                        this.backgroundImages.set(regionId, backgroundImage);
                        console.log(`✅ Sfondo PNG caricato per ${region.name}: ${region.background}`);
                    } catch (error) {
                        console.error(`❌ Errore caricamento sfondo PNG per ${region.name}:`, error);
                        console.error(`   Percorso file: ${region.background}`);
                        console.error(`   Errore completo:`, error);
                        
                        // Prova a verificare se il file esiste
                        this.checkFileExists(region.background);
                    }
                }
            }
            
            console.log('🎨 Tutti gli sfondi caricati con successo!');
            
        } catch (error) {
            console.error('❌ Errore nel caricamento degli sfondi:', error);
        }
    }

    // Metodo per verificare l'esistenza di un file
    async checkFileExists(filePath) {
        try {
            const response = await fetch(filePath, { method: 'HEAD' });
            if (response.ok) {
                console.log(`✅ File trovato: ${filePath}`);
            } else {
                console.error(`❌ File non trovato (${response.status}): ${filePath}`);
            }
        } catch (error) {
            console.error(`❌ Errore verifica file: ${filePath}`, error);
        }
    }

    // Metodo per disegnare lo sfondo della regione corrente
    drawBackground(ctx, cameraX = 0, cameraY = 0) {
        const region = this.regions.get(this.currentRegion);
        if (!region) return;

        if (this.backgroundImages.has(this.currentRegion)) {
            // Disegna lo sfondo caricato (SVG o PNG)
            const backgroundImage = this.backgroundImages.get(this.currentRegion);
            ctx.drawImage(backgroundImage, 0, 0, 800, 600);
        } else if (region.background && region.background.includes('.png')) {
            // Prova a caricare l'immagine PNG al volo
            this.loadBackgroundOnDemand(region);
            this.drawFallbackBackground(ctx, region);
        } else {
            // Fallback: disegna un gradiente colorato
            this.drawFallbackBackground(ctx, region);
        }
    }

    // Metodo di fallback per sfondi non caricati
    drawFallbackBackground(ctx, region) {
        let gradient;
        
        switch (region.theme) {
            case 'medieval':
                gradient = ctx.createLinearGradient(0, 0, 800, 600);
                gradient.addColorStop(0, '#228B22');
                gradient.addColorStop(0.5, '#32CD32');
                gradient.addColorStop(1, '#90EE90');
                break;
            case 'forest':
                gradient = ctx.createLinearGradient(0, 0, 800, 600);
                gradient.addColorStop(0, '#006400');
                gradient.addColorStop(0.5, '#228B22');
                gradient.addColorStop(1, '#32CD32');
                break;
            case 'mountain':
                gradient = ctx.createLinearGradient(0, 0, 800, 600);
                gradient.addColorStop(0, '#696969');
                gradient.addColorStop(0.5, '#A9A9A9');
                gradient.addColorStop(1, '#D3D3D3');
                break;
            case 'volcanic':
                gradient = ctx.createLinearGradient(0, 0, 800, 600);
                gradient.addColorStop(0, '#8B0000');
                gradient.addColorStop(0.5, '#DC143C');
                gradient.addColorStop(1, '#FF4500');
                break;
            case 'celestial':
                gradient = ctx.createLinearGradient(0, 0, 800, 600);
                gradient.addColorStop(0, '#191970');
                gradient.addColorStop(0.5, '#4169E1');
                gradient.addColorStop(1, '#87CEEB');
                break;
            default:
                gradient = ctx.createLinearGradient(0, 0, 800, 600);
                gradient.addColorStop(0, '#2F4F4F');
                gradient.addColorStop(0.5, '#708090');
                gradient.addColorStop(1, '#B0C4DE');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
    }

    // Metodo per ottenere informazioni sull'asset della regione
    getRegionAssetInfo(regionId) {
        const region = this.regions.get(regionId);
        if (!region) return null;
        
        return {
            name: region.name,
            description: region.description,
            background: region.background,
            backgroundType: region.backgroundType,
            theme: region.theme
        };
    }

    // Carica uno sfondo al volo se necessario
    async loadBackgroundOnDemand(region) {
        if (!window.GameAssets || !region.background) return;
        
        try {
            if (region.background.includes('.png')) {
                const backgroundImage = await window.GameAssets.createImageElement(
                    region.background, 
                    800, 
                    600
                );
                this.backgroundImages.set(region.id, backgroundImage);
                console.log(`🎨 Sfondo PNG caricato al volo per ${region.name}`);
            }
        } catch (error) {
            console.error(`❌ Errore caricamento al volo per ${region.name}:`, error);
        }
    }
}

// Esporta la classe per uso globale
window.GameWorld = GameWorld;
