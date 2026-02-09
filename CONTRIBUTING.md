# Contributing to Derivative Duel

Thank you for considering contributing to Derivative Duel! This document provides guidelines for contributing to the project.

---

## 🤝 How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue with:
- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Browser/OS** information

**Example:**
```
Title: Login button doesn't respond on mobile Safari

Steps to Reproduce:
1. Open www.mathbattle.xyz on iPhone (iOS 16, Safari)
2. Click "Login"
3. Nothing happens

Expected: Login modal appears
Actual: No response

Browser: Safari 16.0, iOS 16.3
```

### Suggesting Features

Open an issue with:
- **Feature description** - What should it do?
- **Use case** - Why is this useful?
- **Mockups/examples** - Visual aid if applicable

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `master`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the code style
4. **Test thoroughly** - ensure nothing breaks
5. **Commit** with clear messages:
   ```bash
   git commit -m "Add: Dark mode toggle component"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** with description of changes

---

## 🎨 Code Style

### JavaScript/React

- **ES6+ syntax** - Use arrow functions, destructuring, etc.
- **Functional components** - Use hooks, not class components
- **Naming conventions:**
  - Components: `PascalCase` (e.g., `PlayRandom.jsx`)
  - Variables/functions: `camelCase` (e.g., `handleSubmit`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

**Example:**
```jsx
// Good ✅
const GameCard = ({ title, onClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return <button onClick={onClick}>{title}</button>;
};

// Bad ❌
class GameCard extends React.Component {
  constructor(props) { ... }
  render() { ... }
}
```

### CSS/Tailwind

- **Use Tailwind utilities** - Avoid custom CSS when possible
- **Responsive design** - Use `md:`, `lg:` breakpoints
- **Consistent spacing** - Use Tailwind's spacing scale (4, 8, 16, etc.)

**Example:**
```jsx
// Good ✅
<div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">

// Bad ❌
<div style={{ padding: '15px', backgroundColor: 'white' }}>
```

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Git
- Code editor (VSCode recommended)

### Setup

1. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mathbattle.git
   cd mathbattle
   ```

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with backend URL
   ```

4. **Run dev server:**
   ```bash
   npm run dev
   ```

5. **Access at:** http://localhost:5173

---

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test:
- [ ] Login/Register flow works
- [ ] Random match starts and completes
- [ ] Friend match code generation/joining
- [ ] Leaderboard displays correctly
- [ ] Responsive on mobile (use browser DevTools)
- [ ] No console errors
- [ ] Logout works

### Future: Automated Tests

We plan to add:
- **Jest** for unit tests
- **React Testing Library** for component tests
- **Cypress** for E2E tests

---

## 📝 Commit Messages

Follow the convention:
```
<Type>: <Short description>

<Optional detailed description>
```

**Types:**
- `Add:` - New feature
- `Fix:` - Bug fix
- `Update:` - Modify existing feature
- `Refactor:` - Code restructuring (no behavior change)
- `Docs:` - Documentation only
- `Style:` - Formatting, whitespace
- `Chore:` - Build process, dependencies

**Examples:**
```bash
git commit -m "Add: Dark mode toggle in settings"
git commit -m "Fix: Login button not responding on mobile Safari"
git commit -m "Update: Improve countdown animation timing"
git commit -m "Docs: Add API integration examples to README"
```

---

## 🌲 Branching Strategy

- `master` - Production code (deployed to Vercel)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

**Example:**
```bash
git checkout -b feature/practice-mode
git checkout -b fix/leaderboard-pagination
git checkout -b docs/api-examples
```

---

## 📂 File Structure Guidelines

### Adding New Pages

1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Update navbar if needed

**Example:**
```jsx
// frontend/src/pages/PracticeMode.jsx
export default function PracticeMode() {
  return <div>Practice Mode</div>;
}

// frontend/src/App.jsx
<Route path="/practice" element={<PracticeMode />} />
```

### Adding New Components

- Place in `frontend/src/components/`
- Export as default or named export
- Keep components small and focused

---

## 🚫 What NOT to Contribute

- **Breaking changes** without discussion
- **Large refactors** without prior approval
- **Backend code** (separate repository)
- **Unrelated features** (e.g., chat system for a math game)
- **Dependency updates** without testing

---

## 🔍 Code Review Process

1. **Automated checks** (none yet, but planned)
2. **Maintainer review** - Code quality, functionality
3. **Requested changes** - You may need to make updates
4. **Approval** - Maintainer approves PR
5. **Merge** - Integrated into `master` and deployed

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 💬 Questions?

- **Open an issue** for questions about contributing
- **Email:** [your-email@example.com] (optional)
- **Discord:** [Join our Discord] (optional)

---

## 🌟 Recognition

Contributors will be acknowledged in:
- `CONTRIBUTORS.md` (to be created)
- Release notes for significant contributions
- Special thanks in README

---

Thank you for making Derivative Duel better! 🎉
