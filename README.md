### Project Calendar Web

A project calendar web application scaffold built with **React + TypeScript**

---

### Requirements

- **Node.js** >= 18  
- **npm** (bundled with Node.js)  
- **Git** (to clone the repository)  
- Recommended editor: **VS Code** with **ESLint** and **Prettier** extensions

---

### Quick start

1. Clone the repository:
   ```bash
   git clone git@github.com:USERNAME/project-calendar-web.git
   cd project-calendar-web
   ```

2. Make the setup script executable and run it:
   ```bash
   chmod +x setup-react.sh
   ./setup-react.sh
   ```
   The script will:
   - verify Node.js and npm;
   - run `npm install`;
   - add TypeScript and React type definitions if needed;
   - create `tsconfig.json` if missing;
   - install ESLint and Prettier with TypeScript/React plugins;
   - create `.eslintrc.json` and `.prettierrc` if missing;
   - add helpful npm scripts (`lint`, `lint:fix`, `format`, `check:format`) to `package.json` when absent.

3. Run the app:
    ```bash
    npm run dev
---

### Installed / expected dependencies

- Runtime dependencies: defined in `package.json` under `dependencies` (e.g., `react`, `react-dom`) — depend on chosen template.
- Dev dependencies added by setup script:
  - typescript
  - @types/react
  - @types/react-dom
  - eslint
  - prettier
  - eslint-config-prettier
  - eslint-plugin-prettier
  - @typescript-eslint/eslint-plugin
  - @typescript-eslint/parser
  - eslint-plugin-react
  - eslint-plugin-react-hooks

---

### Useful npm scripts (added if missing)

- Start / Dev:
  ```bash
  npm run dev
- Build:
  ```bash
  npm run build
- Lint:
  ```bash
  npm run lint
  ```
  Runs ESLint on `src/**/*.{ts,tsx}`.
- Auto-fix lint:
  ```bash
  npm run lint:fix
  ```
  Runs ESLint with `--fix`.
- Format:
  ```bash
  npm run format
  ```
  Formats files with Prettier: `src/**/*.{ts,tsx,js,jsx,json,css,md}`.
- Check format:
  ```bash
  npm run check:format
  ```
  Verifies formatting without changing files.

---

### Recommended editor settings (VS Code)

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
These settings enable format-on-save and run ESLint fixes on save (Ctrl+S).

---

### Project structure

- **src/** — React source code (`.tsx`, `.ts`)  
- **public/** — static files  
- **tsconfig.json** — TypeScript configuration  
- **package.json** — dependencies and scripts  
- **.eslintrc.json** — ESLint rules  
- **.prettierrc** — Prettier config  
- **setup-react.sh** — environment setup script

---

### License

MIT