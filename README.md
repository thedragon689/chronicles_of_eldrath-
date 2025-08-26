# 🎮 Chronicles of Eldrath - RPG Fantasy

Un gioco RPG fantasy completo con sistema di asset grafici avanzato, personaggi personalizzabili e un mondo vasto da esplorare.

## ✨ Caratteristiche Principali

- 🎨 **Sistema Asset Completo** - SVG per personaggi/nemici, PNG per scenari
- 👤 **4 Classi di Personaggio** - Mago, Arciere, Cavaliere, Valkiria
- 🏞️ **5 Regioni di Gioco** - Dal livello 1 al 100
- 👹 **Sistema Nemici** - Orchi, draghi e creature fantasy
- 🎵 **Sistema Audio** - Musica e effetti sonori
- 🎯 **Sistema di Combattimento** - Abilità e statistiche avanzate

## 🚀 Come Iniziare

### Requisiti
- Browser moderno con supporto HTML5
- Server web locale (opzionale)

### Installazione Rapida
```bash
# Clona il repository
git clone https://github.com/tuousername/chronicles-of-eldrath.git

# Entra nella directory
cd chronicles-of-eldrath

# Avvia server locale (opzionale)
python3 -m http.server 8000

# Apri nel browser
open http://localhost:8000
```

### Test degli Asset
```bash
# Apri la pagina di test
open http://localhost:8000/test-assets.html

# Esegui test completo
# Clicca "🚀 Esegui Test Completo"
```

## 🎨 Asset Grafici

### Personaggi (SVG)
- **Mago** - Incantesimi elementali e controllo
- **Arciere** - Attacco a distanza e furtività  
- **Cavaliere** - Combattimento corpo a corpo e difesa
- **Valkiria** - Guerriera mistica e supporto

### Scenari (PNG)
- **Valdoria** - Terre fertili medievali
- **Monti di Tharok** - Catene montuose
- **Foresta di Myr** - Bosco sacro magico
- **Desolazione di Khar** - Terre vulcaniche
- **Isole di Aeloria** - Arcipelago fluttuante

### Nemici (SVG)
- **Orco** - Creatura verde con ascia e scudo
- **Drago** - Creatura leggendaria con ali e fuoco

## 🏗️ Architettura

```
chronicles-of-eldrath/
├── index.html              # Pagina principale
├── js/                     # Script JavaScript
│   ├── main.js            # Inizializzazione
│   ├── game.js            # Logica di gioco
│   ├── world.js           # Mondo e regioni
│   ├── characters.js      # Sistema personaggi
│   ├── enemies.js         # Sistema nemici
│   ├── classes.js         # Classi base
│   ├── ui.js              # Interfaccia utente
│   ├── audio-manager.js   # Gestione audio
│   └── utils.js           # Utility
├── assets/                 # Asset grafici
│   ├── assets-config.js   # Configurazione asset
│   ├── characters/        # SVG personaggi
│   └── enemies/           # SVG nemici
├── scenari/               # Immagini scenari
├── styles/                # Fogli di stile CSS
├── avatar/                # Immagini avatar
└── musica/                # File audio
```

## 🧪 Test e Debug

### Pagina di Test
- **`test-assets.html`** - Test completo del sistema asset
- **Verifica caricamento** di tutti gli SVG e PNG
- **Test mondo di gioco** e regioni
- **Console di debug** integrata

### Debug Console
```javascript
// Comandi di debug disponibili
debugGame()           // Stato del gioco
testCharacterCreation() // Test creazione personaggio
spawnEnemy('orc', 100, 100) // Genera nemico
changeRegion('myr')   // Cambia regione
```

## 🔧 Sviluppo

### Tecnologie Utilizzate
- **HTML5** - Struttura e canvas
- **CSS3** - Stili e animazioni
- **JavaScript ES6+** - Logica di gioco
- **SVG** - Grafica vettoriale personaggi/nemici
- **Canvas API** - Rendering dinamico

### Struttura del Codice
- **Modulare** - Ogni sistema in file separato
- **Orientato agli oggetti** - Classi per ogni entità
- **Event-driven** - Sistema di eventi per interazioni
- **Asset-driven** - Configurazione centralizzata degli asset

## 📚 Documentazione

- **`SCENARI_ISSUE.md`** - Problemi e soluzioni implementate
- **`IMPLEMENTAZIONE_COMPLETATA.md`** - Riepilogo completo
- **`CORREZIONE_URGENTE.md`** - Correzioni applicate

## 🎯 Roadmap

### Prossime Funzionalità
- [ ] Sistema di salvataggio avanzato
- [ ] Multiplayer locale
- [ ] Editor di livelli
- [ ] Sistema di quest
- [ ] Inventario avanzato

### Miglioramenti Tecnici
- [ ] WebGL per rendering 3D
- [ ] Service Worker per offline
- [ ] PWA (Progressive Web App)
- [ ] Database locale IndexedDB

## 🤝 Contribuire

1. **Fork** il repository
2. **Crea** un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** le modifiche (`git commit -m 'Add AmazingFeature'`)
4. **Push** al branch (`git push origin feature/AmazingFeature`)
5. **Apri** una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 🙏 Ringraziamenti

- **Asset grafici** - Creati con design fantasy originale
- **Musica** - Composizioni originali per il gioco
- **Community** - Feedback e suggerimenti per il miglioramento

---

**🎮 Buon divertimento nell'esplorazione di Eldrath!** ✨

*Creato con ❤️ per gli amanti dei giochi RPG fantasy*
