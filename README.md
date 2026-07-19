# Derivative Duel

> A competitive 1v1 math game where players battle by solving derivative problems in real-time

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://www.mathbattle.xyz)
[![Frontend](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-61dafb?style=for-the-badge&logo=react)](https://vitejs.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

> [!NOTE]
> **Backend Service Status**: The backend server (Render.com) is currently spun down to save costs. The live demo frontend loads, but game functionality (matchmaking, questions) will not respond. To play, please clone the repo and run the backend locally.

## About This Project

**Derivative Duel** is a full-stack web application that gamifies calculus learning through competitive 1v1 matches. Players face off by solving derivative problems, with an ELO ranking system that dynamically adjusts question difficulty based on skill level.

**Live Demo:** [www.mathbattle.xyz](https://www.mathbattle.xyz)

---

## Key Features

- **Two Game Modes** - Random matchmaking and friend challenges
- **ELO Ranking System** - Dynamic difficulty scaling (1000-2000+ ELO)
- **Google Sign-In** - Secure OAuth authentication with JWT session management
- **Smooth Animations** - Countdown timers and transitions with Framer Motion
- **Auto-Generated Questions** - Calculus problems generated on-the-fly based on player skill
- **Competitive Format** - First to 3 rounds wins the match
- **Leaderboards** - Track top players and climb the ranks

---

## Architecture

This project uses a **decoupled frontend-backend architecture**:

![Architecture Diagram](https://raw.githubusercontent.com/Skriptiensolmija/mathbattle/master/docs/architecture.png)

### Frontend (This Repository)
- **Framework:** Vite + React
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Routing:** React Router
- **Deployment:** Vercel ([www.mathbattle.xyz](https://www.mathbattle.xyz))

### Backend (Separate Repository)
- **Framework:** FastAPI (Python)
- **Database:** MongoDB with Motor (async driver)
- **Authentication:** JWT tokens with Bcrypt
- **Math Engine:** SymPy for derivative calculation
- **Deployment:** Render.com
- **Repository:** *[Backend repo link - contact for access]*

---

## How It Works

### Game Flow

1. **Sign In** - Authenticate with Google, or continue as a guest
2. **Choose Mode** - Random opponent or friend match
3. **Countdown** - Animated 3-2-1 countdown
4. **Solve** - Derivative problem appears (e.g., "f(x) = x^5, find f'(4)")
5. **Battle** - First to answer correctly wins the round
6. **Victory** - First to 3 rounds wins the match

### ELO System

Questions adapt to player skill:

| ELO Range | Difficulty | Example Problem |
|-----------|------------|-----------------|
| < 1200 | Easy | `f(x) = x^2` |
| 1200-1500 | Medium | `f(x) = x^5 + 2x^3` |
| > 1500 | Hard | `f(x) = x^7 - 4x^5 + 3x^3 - 2x` |

**ELO Calculation:**
- Standard chess ELO formula (K-factor: 32)
- Winners gain ELO, losers lose ELO
- Larger swings when lower-ranked players beat higher-ranked opponents

---

## Tech Stack

### Frontend
```
React 18         - UI library
Vite             - Fast build tool
Tailwind CSS     - Utility-first styling
Framer Motion    - Animation library
Axios            - HTTP client
React Router     - Client-side routing
```

### Backend
```
FastAPI          - Modern Python web framework
MongoDB          - NoSQL database
Motor            - Async MongoDB driver
PyJWT            - JWT authentication
Bcrypt           - Password hashing
SymPy            - Symbolic mathematics
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (contact for access or deploy your own)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Skriptiensolmija/mathbattle.git
   cd mathbattle
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file in frontend/ directory
   cp .env.example .env
   ```

   Edit `.env` and set your backend URL:
   ```env
   VITE_API_URL=https://your-backend-url.com
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
mathbattle/
├── frontend/                 # React application (Vite)
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable UI components
│   │   ├── api.js          # API client & auth logic
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   ├── package.json
│   └── vite.config.js
├── DEVELOPMENT.md          # Developer setup guide
└── README.md              # This file
```

---

## API Integration

The frontend communicates with the backend via REST API:

### Authentication
- `POST /auth/google` - Sign in with Google
- `GET /user/profile` - Get user stats

### Game
- `POST /game/start` - Start new match
- `GET /game/question?match_id=xxx` - Get question
- `POST /game/answer` - Submit answer

### Leaderboard
- `GET /leaderboard` - Top 10 players

All authenticated endpoints require `Authorization: Bearer <token>` header.

---

## Design Choices

### Color Scheme
- **Primary:** Black and white - Clean, minimal, distraction-free
- **Accents:** Green (correct), Red (incorrect)

### UX Features
- Large, readable countdown (3-2-1)
- Instant feedback on answers
- Smooth page transitions
- Color-coded scores (you vs opponent)
- Responsive design (desktop-first)

---

## Future Enhancements

- [ ] Real-time WebSocket multiplayer
- [ ] More derivative types (chain rule, product rule, quotient rule)
- [ ] Practice mode with hints
- [ ] Match history and replays
- [ ] Friend list system
- [ ] Achievements and badges
- [ ] Sound effects and music
- [ ] Mobile app (React Native)
- [ ] Dark mode

---

## Performance

- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Bundle Size:** ~390KB (gzipped: ~121KB)

---

## Contributing

Contributions are welcome. Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Author

**Elias Leinonen**
- GitHub: [@Skriptiensolmija](https://github.com/Skriptiensolmija)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by competitive coding platforms like LeetCode and CodeWars
- Math rendering powered by browser's native MathML support
- Design inspiration from modern EdTech platforms

---

<div align="center">

**[Visit Live Site](https://www.mathbattle.xyz)** • **[Documentation](DEVELOPMENT.md)** • **[Report Bug](https://github.com/Skriptiensolmija/mathbattle/issues)**

</div>
