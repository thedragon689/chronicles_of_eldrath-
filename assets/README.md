# 🎨 Chronicles of Eldrath - Asset Grafici

Questo documento descrive tutti gli asset grafici creati per il gioco Chronicles of Eldrath.

## 📁 Struttura delle Cartelle

```
assets/
├── characters/          # Personaggi giocabili
├── backgrounds/         # Sfondi delle regioni
├── enemies/            # Nemici e creature
├── ui/                 # Elementi dell'interfaccia
├── effects/            # Effetti visivi e particelle
├── assets-config.js    # Configurazione centralizzata
└── README.md           # Questo file
```

## 🧙‍♂️ Personaggi Giocabili

### 1. **Mago** (`mage.svg`)
- **File**: `assets/characters/mage.svg`
- **Design**: Tunica viola, cappello a punta, bastone magico
- **Colori**: Viola (#4a148c), Oro (#ffd700), Blu (#4fc3f7)
- **Dimensioni**: 64x64 pixel
- **Caratteristiche**: Ornamenti magici, effetti glow

### 2. **Arciere** (`archer.svg`)
- **File**: `assets/characters/archer.svg`
- **Design**: Giacca di cuoio, arco, frecce nella faretra
- **Colori**: Marrone (#8d6e63), Verde (#50c878), Oro (#ffd700)
- **Dimensioni**: 64x64 pixel
- **Caratteristiche**: Cappello da cacciatore, equipaggiamento da caccia

### 3. **Cavaliere** (`knight.svg`)
- **File**: `assets/characters/knight.svg`
- **Design**: Armatura completa, elmo, spada e scudo
- **Colori**: Grigio (#bdbdbd), Marrone (#8d6e63), Oro (#ffd700)
- **Dimensioni**: 64x64 pixel
- **Caratteristiche**: Armatura dettagliata, merli, visiera

### 4. **Valkiria** (`valkyrie.svg`)
- **File**: `assets/characters/valkyrie.svg`
- **Design**: Veste dorata, ali divine, lancia
- **Colori**: Oro (#ffd700), Bianco (#ffffff), Blu (#4fc3f7)
- **Dimensioni**: 64x64 pixel
- **Caratteristiche**: Ali divine, aura magica, corona

## 🏰 Sfondi delle Regioni

### 1. **Valdoria** (`valdoria.svg`)
- **File**: `assets/backgrounds/valdoria.svg`
- **Design**: Castello medievale, montagne, foreste
- **Dimensioni**: 800x600 pixel
- **Elementi**: Castello con torri, montagne sfumate, alberi, sentiero
- **Atmosfera**: Soleggiata, medievale, fantasy

### 2. **Foresta di Myr** (`foresta-myr.svg`)
- **File**: `assets/backgrounds/foresta-myr.svg`
- **Design**: Foresta oscura e misteriosa
- **Dimensioni**: 800x600 pixel
- **Elementi**: Alberi giganti, muschio, funghi, luci magiche
- **Atmosfera**: Oscura, misteriosa, magica

## 👹 Nemici e Creature

### 1. **Orco** (`orc.svg`)
- **File**: `assets/enemies/orc.svg`
- **Design**: Creatura verde, minacciosa, armatura
- **Dimensioni**: 48x48 pixel
- **Caratteristiche**: Zanne, occhi rossi, mazza, armatura
- **Tipo**: Nemico melee

### 2. **Drago** (`dragon.svg`)
- **File**: `assets/enemies/dragon.svg`
- **Design**: Creatura leggendaria con ali e fiamme
- **Dimensioni**: 64x64 pixel
- **Caratteristiche**: Ali, coda, fiamme, scaglie, artigli
- **Tipo**: Boss

## ⚙️ Utilizzo nel Gioco

### Integrazione con JavaScript

```javascript
// Carica la configurazione degli asset
import { GameAssets } from './assets/assets-config.js';

// Ottieni informazioni su un personaggio
const mage = GameAssets.getCharacterById('mage');
console.log(mage.name); // "Mago"

// Precarica tutti gli asset
await GameAssets.preloadAssets();

// Crea elemento SVG per il canvas
const mageCanvas = await GameAssets.createSVGElement(mage.svg, 64, 64);
```

### Nel Canvas del Gioco

```javascript
// Disegna un personaggio
const character = GameAssets.getCharacterById('mage');
const characterImg = await GameAssets.createSVGElement(character.svg);
ctx.drawImage(characterImg, x, y);

// Disegna uno sfondo
const background = GameAssets.getBackgroundById('valdoria');
const bgImg = await GameAssets.createSVGElement(background.svg, 800, 600);
ctx.drawImage(bgImg, 0, 0);
```

## 🎨 Specifiche Tecniche

### Formato SVG
- **Standard**: SVG 1.1
- **ViewBox**: Ottimizzato per le dimensioni specificate
- **Gradienti**: Linear e radial per profondità visiva
- **Filtri**: Effetti glow e ombre per realismo

### Ottimizzazioni
- **Dimensioni**: Ridotte per performance web
- **Colori**: Palette fantasy coerente
- **Stile**: Design pixel-art ispirato ai giochi classici
- **Accessibilità**: Contrasti adeguati e forme riconoscibili

## 🔧 Personalizzazione

### Modificare i Colori
```svg
<!-- Esempio: Cambiare il colore del mago -->
<linearGradient id="robeGradient">
  <stop offset="0%" style="stop-color:#YOUR_COLOR;stop-opacity:1" />
  <stop offset="100%" style="stop-color:#YOUR_COLOR2;stop-opacity:1" />
</linearGradient>
```

### Aggiungere Nuovi Asset
1. Crea il file SVG nella cartella appropriata
2. Aggiungi la configurazione in `assets-config.js`
3. Aggiorna questo README
4. Testa l'integrazione nel gioco

## 📱 Responsive Design

Tutti gli asset sono progettati per:
- **Desktop**: Risoluzioni standard (800x600, 1024x768)
- **Tablet**: Adattamento automatico delle dimensioni
- **Mobile**: Ridimensionamento proporzionale

## 🚀 Performance

### Best Practices
- **Precaricamento**: Tutti gli asset vengono precaricati all'avvio
- **Caching**: Utilizzo del sistema di cache del browser
- **Compressione**: File SVG ottimizzati per dimensioni minime
- **Lazy Loading**: Caricamento on-demand per asset non critici

### Metriche Target
- **Tempo di caricamento**: < 2 secondi
- **Dimensioni totali**: < 500KB per tutti gli asset
- **FPS**: Mantenere 60 FPS durante il rendering

## 🐛 Risoluzione Problemi

### Asset non visibili
1. Verifica i percorsi dei file
2. Controlla la console per errori di caricamento
3. Verifica che il file SVG sia valido
4. Controlla le dimensioni del canvas

### Performance scarse
1. Riduci le dimensioni degli asset
2. Semplifica i gradienti complessi
3. Rimuovi filtri non essenziali
4. Utilizza la compressione SVG

## 📞 Supporto

Per problemi o richieste di asset:
1. Controlla questo README
2. Verifica la configurazione in `assets-config.js`
3. Testa nel browser con la console aperta
4. Controlla i log di caricamento

---

**Creato per Chronicles of Eldrath** 🎮✨🎨
**Versione**: 1.0
**Data**: Agosto 2024
