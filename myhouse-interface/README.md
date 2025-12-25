# MyHouse OS - Interface Web

Interface web moderne et temps réel pour contrôler votre système domotique MyHouse OS.

## 🚀 Fonctionnalités

- ✨ **Interface moderne** avec design futuriste et raffiné
- 🔄 **WebSocket temps réel** - Mises à jour instantanées de l'état des appareils
- 📱 **Responsive** - Fonctionne sur desktop, tablette et mobile
- 🎨 **shadcn/ui** - Composants accessibles et personnalisables
- ⚡ **Next.js 16** avec App Router et React Server Components
- 🌓 **Dark mode** automatique selon les préférences système

## 📋 Pages

- **Login** (`/login`) - Page de connexion sécurisée
- **Dashboard** (`/`) - Vue d'ensemble avec contrôles temps réel
  - Widget température avec gauge circulaire
  - Contrôles de chauffage (mode, température cible)
  - Indicateur de présence
  - Contrôles rapides (lumière, porte)
- **Appareils** (`/appareils`) - Gestion des dispositifs ESP32
- **Workflows** (`/workflows`) - Automatisations et règles

## 🛠️ Installation

```bash
# Installer les dépendances
bun install

# Lancer en développement (port 3001)
bun run dev

# Build pour production
bun run build

# Lancer en production (port 3001)
bun run start
```

L'interface sera accessible sur **http://localhost:3001**

## 🔌 Configuration

L'interface se connecte automatiquement au serveur backend sur :
- **WebSocket** : `ws://192.168.4.2:3000/ws`
- **API REST** : `http://192.168.4.2:3000`

Pour modifier ces URLs, éditez :
- `hooks/useWebSocket.ts` pour le WebSocket
- `lib/api.ts` pour l'API REST

## 📡 WebSocket

Le hook `useWebSocket` gère :
- Connexion automatique au WebSocket
- Reconnexion avec exponential backoff
- Réception des événements `INIT` (état initial) et `UPDATE` (changements)
- Parse automatique des valeurs (temperature: string, light/door/heat: boolean en string)

## 🎨 Personnalisation

### Couleurs

Les couleurs sont définies dans `app/globals.css` avec des variables CSS :
- Palette primaire : Bleu (#2563eb)
- Accent : Cyan (#06b6d4)
- Support du dark mode automatique

### Composants

Tous les composants UI sont dans `components/ui/` et personnalisables via Tailwind CSS.

## 📦 Technologies

- **Framework** : Next.js 16 (App Router)
- **UI** : shadcn/ui + Tailwind CSS
- **Icons** : Lucide React
- **Fonts** : Geist Sans + Geist Mono
- **Runtime** : Bun
- **Language** : TypeScript

## 🔐 Authentification

L'authentification est actuellement simplifiée (redirection vers dashboard).
Pour production, implémentez :
1. Vérification des credentials dans `app/login/page.tsx`
2. Gestion des tokens/sessions
3. Middleware de protection des routes

## 📱 Responsive

L'interface est entièrement responsive avec :
- Sidebar collapsible sur mobile
- Grilles adaptatives (grid-cols-1/2/3/4 selon la taille)
- Composants optimisés pour touch

## 🚀 Déploiement

### Docker

```bash
# Build l'image
docker build -t myhouse-interface .

# Run le conteneur
docker run -p 3001:3000 myhouse-interface
```

### Vercel

```bash
vercel deploy
```

## 📝 Structure

```
myhouse-interface/
├── app/
│   ├── (dashboard)/          # Route group avec layout sidebar
│   │   ├── page.tsx          # Dashboard principal
│   │   ├── appareils/        # Page appareils
│   │   └── workflows/        # Page workflows
│   ├── login/                # Page de connexion
│   ├── layout.tsx            # Layout root
│   └── globals.css           # Styles globaux
├── components/
│   ├── ui/                   # Composants shadcn/ui
│   ├── app-sidebar.tsx       # Sidebar de navigation
│   └── connection-status.tsx # Indicateur de connexion
├── hooks/
│   ├── useWebSocket.ts       # Hook WebSocket custom
│   └── use-mobile.ts         # Hook responsive (shadcn)
├── lib/
│   ├── api.ts                # Fonctions API REST
│   └── utils.ts              # Utilitaires (cn, etc.)
└── types/
    └── index.ts              # Types TypeScript
```

## 🐛 Debug

### WebSocket ne se connecte pas

1. Vérifiez que le serveur backend est lancé sur `192.168.4.2:3000`
2. Vérifiez la console du navigateur pour les erreurs
3. Le hook tente automatiquement de se reconnecter

### Erreurs de build

```bash
# Nettoyer et rebuild
rm -rf .next node_modules
bun install
bun run build
```

## 📄 License

Propriétaire - MyHouse OS Project
