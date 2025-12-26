# 🏠 MyHouseOS Interface - Dashboard Domotique Moderne

## 📋 Description

Interface web de contrôle et de supervision centralisée pour l'écosystème **MyHouseOS**. Développée avec **Next.js 16**, cette application permet de piloter vos dispositifs domotiques (ESP32/M5Stack) via une interface intuitive, réactive et connectée en temps réel.

Ce projet transforme votre navigateur en un **centre de commande intelligent** qui communique avec le serveur MyHouseOS pour :

- Visualiser l'état des capteurs (température, présence) en temps réel
- Contrôler physiquement les appareils (lumières, portes, chauffage)
- Consulter l'historique complet des événements de la maison
- Gérer les workflows et scénarios d'automatisation
- Sécuriser l'accès via une interface d'authentification

## ✨ Fonctionnalités

### 🖥️ Interface de Supervision

- **Dashboard Dynamique** avec design card-based et thématique claire professionnelle.
- **Mises à jour en temps réel** via WebSocket :
  - 🌡️ Affichage de la température avec jauge animée.
  - 💡 État des lumières (On/Off) avec feedback visuel.
  - 🚪 État de la porte (Ouverte/Fermée).
  - ♨️ État du chauffage (Actif/Inactif).
- **Indicateur de connexion** : Statut du WebSocket avec reconnexion automatique.

### 🎮 Contrôle Interactif

- **Contrôles Rapides** : Boutons et interrupteurs (Switch) pour agir instantanément.
- **Gestion du Chauffage** : Sélecteur de température cible et gestion des modes Eco/Confort.
- **Log out sécurisé** : Gestion de session simple via cookies.

### 📝 Historique et Logs

- **Flux d'événements** : Liste détaillée des derniers changements d'état.
- **Codage couleur** : Identification rapide (jaune=lumière, vert=porte, orange=chauffage, bleu=température).
- **Timestamps** : Horodatage précis de chaque action pour une traçabilité totale.

### 📱 Design et Ergonomie

- **Sidebar de navigation** : Accès rapide aux différentes sections (Appareils, Workflows, Paramètres).
- **Responsive Design** : Interface optimisée pour Desktop, Tablettes et Mobiles.
- **Animations fluides** : Transitions douces et retours visuels immédiats lors des interactions.

## 🛠 Stack Technique

### Frameworks et Langages

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS 4](https://tailwindcss.com/)
- **Composants UI** : [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Icônes** : [Lucide React](https://lucide.dev/)

### Communication et State

- **API REST** : Communication avec le backend MyHouseOS (port 3000).
- **WebSocket** : Flux bi-directionnel pour les mises à jour instantanées.
- **Hooks** : `useWebSocket` pour la gestion de l'état global de la maison.

## ⚙️ Configuration Logicielle

### Paramètres de Connexion (`lib/api.ts` & `hooks/useWebSocket.ts`)

```typescript
// URL de l'API REST
const API_URL = "http://192.168.4.2:3000";

// URL du WebSocket
const WS_URL = "ws://192.168.4.2:3000/ws";

// Authentification par défaut
Authorization: "root:root";
```

### Scripts de Gestion

```bash
npm run dev      # Lancer le serveur de développement (Port 8080)
npm run build    # Compiler l'application pour la production
npm run start    # Lancer l'application compilée
```

## 🚀 Installation

### 1. Prérequis

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [Bun](https://bun.sh/)
- Le serveur MyHouseOS (M5Stack) actif sur le réseau

### 2. Installation des Dépendances

```bash
npm install
```

### 3. Configuration (Optionnel)

Pour modifier l'adresse du serveur sans toucher au code, créez un fichier `.env.local` :

```env
NEXT_PUBLIC_WS_URL=ws://192.168.4.2:3000/ws
```

### 4. Lancement

```bash
npm run dev
```

L'interface est alors accessible sur `http://localhost:8080`.

## 📱 Utilisation

### Navigation Principale

1.  **Tableau de Bord** : Vue d'ensemble et contrôles rapides.
2.  **Appareils** : Liste exhaustive des dispositifs connectés.
3.  **Workflows** : Gestion des automatisations.
4.  **Log out** : Déconnexion sécurisée.

### Contrôle des Appareils

- Basculez l'interrupteur d'une lumière : l'icône change de couleur et le serveur ESP32 reçoit l'ordre instantanément.
- Ajustez la température : la jauge se met à jour et l'historique enregistre la modification.

## 🌐 API et Communication

### Flux WebSocket (`WSMessage`)

L'interface écoute les messages au format JSON :

```json
// Initialisation (INIT)
{
  "type": "INIT",
  "data": { "temperature": "22.5", "light": true, "door": false, "heat": false }
}

// Mise à jour (UPDATE)
{
  "type": "UPDATE",
  "data": { "type": "LIGHT", "value": "true" }
}
```

### Appels REST (`lib/api.ts`)

- **POST** `/toggle/light` : Alterne l'état de l'éclairage.
- **POST** `/toggle/door` : Alterne l'état de la porte.
- **POST** `/toggle/heat` : Alterne l'état du chauffage.
- **GET** `/history` : Récupère la liste des derniers événements.

## 🎨 Interface Utilisateur

### Palette de Couleurs (Thème Clair)

```css
Fond principal : #ffffff (Blanc)
Primaire       : #2563eb (Bleu MyHouseOS)
Sidebar        : #ffffff (Bordure droite légère)
Texte          : #0f172a (Bleu nuit)
Muted          : #64748b (Gris ardoise)
Accent Bleu    : #3b82f6 (Light Blue)
```

### Structure du Dashboard

```
┌──────────────────────────────────────────┐
│ Sidebar      │ Header (Connexion, Alertes)│
├──────────────┤───────────────────────────┤
│ ● Dashboard  │                           │
│ ● Appareils  │   [ Jauge Température ]   │
│ ● Workflows  │                           │
│              │   [ Contrôles Rapides ]   │
│              │                           │
│ ● Log out    │   [ Historique Events ]   │
└──────────────┴───────────────────────────┘
```

## 🔄 Flux de Données

1.  **Action Utilisateur** → Clic sur un bouton de l'interface.
2.  **Appel API** → Envoi d'une requête POST au serveur MyHouseOS.
3.  **Traitement Serveur** → Le serveur ESP32 change l'état physique.
4.  **Broadcast WS** → Le serveur renvoie le nouvel état via WebSocket.
5.  **Update UI** → Le hook `useWebSocket` détecte le message et met à jour l'affichage sans recharger.

## 🐛 Dépannage

### Problème : La barre de navigation ne s'affiche pas

- Vérifiez que vous n'êtes pas sur `app/page.tsx` (redirigé vers `.old`).
- Assurez-vous d'être sur une route gérée par le groupe `(dashboard)`.

### Problème : "Disconnected" en rouge

- Le serveur MyHouseOS est-il allumé ?
- L'adresse IP dans `useWebSocket.ts` (192.168.4.2) est-elle correcte ?
- Êtes-vous sur le même réseau WiFi que le serveur ?

### Problème : Les commandes ne répondent pas

- Vérifiez l'authentification dans `lib/api.ts` (par défaut `root:root`).
- Regardez les logs de la console navigateur (F12) pour voir les erreurs 401 ou 404.

## 📄 Licence

Projet open source développé pour l'écosystème **MyHouseOS**.

---

**Version :** 0.1.0  
**Date :** Décembre 2025  
**Plateforme :** Next.js 16 / React 19
