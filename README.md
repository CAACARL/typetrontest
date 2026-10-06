# TYPETRONTEST 🚀

A modern, TRON-inspired typing speed test application with code and text modes. Built with React, TypeScript, and Vite.

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=flat-square)

## ✨ Features

### 🎮 Gaming Aesthetic

- Retro-futuristic **TRON-inspired** design with neon green accents
- CRT scanline effects and grid backgrounds
- Glitch effects on logo
- Smooth animations and transitions

### 💻 Multiple Modes

- **Code Modes**: JavaScript, Python, Java, C++, PHP
- **Text Mode**: Classic typing test with punctuation levels
- **Smart Generation**: Realistic code syntax and natural text patterns

### 📊 Advanced Metrics

- **WPM**: Real-time words per minute calculation
- **Accuracy**: Keystroke-based precision tracking
- **Performance Graph**: Visualize WPM over time with SVG graphs
- **Combo System**: Color-coded streak tracking (10-100+ combos)
- **Error Tracking**: Monitor mistakes and corrections

### 🏆 Stats & Leaderboards

- **Top 3 Podium**: Champion showcase with gold/silver/bronze rankings
- **Filters**: Sort by language and duration
- **Game History**: Click any past game to view detailed stats
- **Local Storage**: Saves up to 20 recent tests

### ⚙️ Customization

- **Test Durations**: 15s, 30s, 60s, 120s
- **Player Profiles**: 12 unique icons
- **Sound Effects**: Retro gaming audio (toggle on/off)
- **Difficulty Levels**: Easy, Medium, Hard punctuation (text mode)

### 🎯 User Experience

- **Auto-scroll**: Monkeytype-style text windowing
- **Keyboard Shortcuts**: Enter to start, Escape to close modals
- **Responsive Design**: Works on all screen sizes
- **No Distractions**: Focused typing interface

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/typing-test.git
cd typing-test

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The production build will be in the `dist/` folder.

## 🎮 How to Use

1. **Select Duration**: Choose 15s, 30s, 60s, or 120s
2. **Choose Mode**: Pick a programming language or text mode
3. **Start**: Press Enter or click "START"
4. **Type Away**: Match the displayed text as accurately as possible
5. **View Results**: See your performance graph and stats
6. **Save Score**: Enter your name and pick an icon

## ⌨️ Keyboard Shortcuts

| Key               | Action                              |
| ----------------- | ----------------------------------- |
| `Enter`           | Start test / Continue to name input |
| `Escape`          | Close modals / Cancel               |
| `Click text area` | Focus input field                   |

## 📐 Project Structure

```
src/
├── components/          # React components
│   ├── modals/         # Modal dialogs
│   ├── Navbar.tsx      # Top navigation
│   ├── HUD.tsx         # Stats display
│   ├── TypingArea.tsx  # Main typing interface
│   ├── WpmGraph.tsx    # Performance graph
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAudio.ts     # Sound management
│   └── useLocalStorage.ts  # Persistent state
├── utils/              # Helper functions
│   ├── textGeneration.ts   # Text mode logic
│   └── codeGeneration.ts   # Code mode logic
├── types/              # TypeScript definitions
├── App.tsx             # Main application
└── App.css             # Styling

```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript 5.6** - Type safety
- **Vite 8.3** - Build tool & dev server
- **CSS3** - Custom styling (no frameworks)
- **Web Audio API** - Sound effects
- **LocalStorage API** - Data persistence

## 🎨 Design Features

- **Color Scheme**: Neon green (#00ff88) on dark blue/black
- **Fonts**:
  - Orbitron (headings, monospace)
  - Rajdhani (body text)
- **Effects**:
  - CRT scanlines
  - Grid perspective background
  - Glitch text animations
  - Neon glow shadows
  - Milestone celebration animations

## 📊 Metrics Explained

### WPM (Words Per Minute)

```
WPM = ((total_keystrokes / 5) - (errors / 5)) / (time_in_seconds / 60)
```

### Accuracy

```
Accuracy = (correct_keystrokes / total_keystrokes) × 100
```

Accounts for all keystrokes including deletions and corrections.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by Monkeytype and TypeRacer
- TRON aesthetic for the design
- Gaming culture for the retro vibes

---

_Happy typing! May your WPM be high and your accuracy be 100%_ 🎯
