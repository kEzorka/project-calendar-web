#!/usr/bin/env bash

# Colors for output
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
NC="\033[0m" # No Color

echo -e "${YELLOW}=== Project Calendar Web: React + TypeScript Setup ===${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js is not installed. Please install it (>= 18) and rerun this script.${NC}"
  exit 1
else
  echo -e "${GREEN}✔ Node.js found: $(node -v)${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
  echo -e "${RED}npm is not installed. Please install it and rerun this script.${NC}"
  exit 1
else
  echo -e "${GREEN}✔ npm found: $(npm -v)${NC}"
fi

# Ensure package.json exists
if [ ! -f package.json ]; then
  echo -e "${RED}package.json not found. Make sure you cloned an existing React project or initialized one (Vite/CRA).${NC}"
  exit 1
fi

# Install project dependencies
echo -e "${YELLOW}Installing project dependencies...${NC}"
npm install

# Install TypeScript and React type definitions
echo -e "${YELLOW}Adding TypeScript and React type definitions...${NC}"
npm install --save-dev typescript @types/react @types/react-dom

# Create tsconfig.json if missing (safe defaults for React 17+/18 with JSX transform)
if [ ! -f tsconfig.json ]; then
  echo -e "${YELLOW}tsconfig.json not found. Creating a default one...${NC}"
  npx tsc --init --jsx react-jsx --esModuleInterop --resolveJsonModule --strict
  # Ensure moduleResolution is node16/bundler-friendly
  node - <<'EOF'
const fs = require('fs');
const ts = JSON.parse(fs.readFileSync('tsconfig.json','utf8'));
ts.compilerOptions = ts.compilerOptions || {};
ts.compilerOptions.target = ts.compilerOptions.target || "ES2020";
ts.compilerOptions.module = ts.compilerOptions.module || "ESNext";
ts.compilerOptions.moduleResolution = ts.compilerOptions.moduleResolution || "Node";
ts.compilerOptions.baseUrl = ts.compilerOptions.baseUrl || ".";
ts.include = ts.include || ["src"];
fs.writeFileSync('tsconfig.json', JSON.stringify(ts, null, 2));
EOF
  echo -e "${GREEN}✔ tsconfig.json created${NC}"
else
  echo -e "${GREEN}✔ tsconfig.json already exists${NC}"
fi

# Install ESLint and Prettier
echo -e "${YELLOW}Installing ESLint and Prettier...${NC}"
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks

# Create ESLint config if missing
if [ ! -f .eslintrc.json ]; then
  echo -e "${YELLOW}Creating .eslintrc.json...${NC}"
  cat > .eslintrc.json <<EOL
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "plugins": ["react", "@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error"
  },
  "settings": {
    "react": { "version": "detect" }
  },
  "env": { "browser": true, "es2021": true }
}
EOL
  echo -e "${GREEN}✔ .eslintrc.json created${NC}"
else
  echo -e "${GREEN}✔ .eslintrc.json already exists${NC}"
fi

# Create Prettier config if missing
if [ ! -f .prettierrc ]; then
  echo -e "${YELLOW}Creating .prettierrc...${NC}"
  cat > .prettierrc <<EOL
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
EOL
  echo -e "${GREEN}✔ .prettierrc created${NC}"
else
  echo -e "${GREEN}✔ .prettierrc already exists${NC}"
fi

# Add useful npm scripts via Node (no extra CLI deps)
echo -e "${YELLOW}Adding npm scripts (lint, lint:fix, format, check:format)...${NC}"
node - <<'EOF'
const fs = require('fs');
const path = 'package.json';
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.lint = pkg.scripts.lint || 'eslint "src/**/*.{ts,tsx}"';
pkg.scripts["lint:fix"] = pkg.scripts["lint:fix"] || 'eslint "src/**/*.{ts,tsx}" --fix';
pkg.scripts.format = pkg.scripts.format || 'prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"';
pkg.scripts["check:format"] = pkg.scripts["check:format"] || 'prettier --check "src/**/*.{ts,tsx,js,jsx,json,css,md}"';
fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
EOF
echo -e "${GREEN}✔ npm scripts updated${NC}"

# Final hints
echo -e "${GREEN}=== Setup complete! ===${NC}"
echo -e "Start the app with ${YELLOW}npm run dev${NC} (Vite) or ${YELLOW}npm start${NC} (CRA)."
echo -e "Lint: ${YELLOW}npm run lint${NC} | Auto-fix: ${YELLOW}npm run lint:fix${NC} | Format: ${YELLOW}npm run format${NC}"
echo -e "Tip: enable format-on-save and eslint fix-on-save in your editor for instant feedback."
