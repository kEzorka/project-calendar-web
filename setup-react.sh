#!/usr/bin/env bash
set -euo pipefail

# Minimal robust setup script for a Vite React + TypeScript project.
# - Installs nvm and Node (recommended >= 22) when needed
# - Ensures npm is available
# - Runs npm install
# - Ensures TypeScript, React types, ESLint, Prettier + configs and helpful npm scripts
# - Adds dev script for Vite if missing
#
# Usage:
#   chmod +x setup-react.sh
#   ./setup-react.sh

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

info(){ printf "${YELLOW}==> %s${NC}\n" "$*"; }
ok(){ printf "${GREEN}✔ %s${NC}\n" "$*"; }
fail(){ printf "${RED}✖ %s${NC}\n" "$*"; exit 1; }

detect_pkg_manager(){
  if command -v apt-get >/dev/null 2>&1; then echo "apt";
  elif command -v dnf >/dev/null 2>&1; then echo "dnf";
  elif command -v yum >/dev/null 2>&1; then echo "yum";
  elif command -v pacman >/dev/null 2>&1; then echo "pacman";
  else echo ""; fi
}
PKG_MANAGER=$(detect_pkg_manager)

install_system_pkgs(){
  local pkgs=("$@")
  if [ -z "$PKG_MANAGER" ]; then
    fail "No supported package manager detected; please install: ${pkgs[*]}"
  fi
  info "Installing system packages: ${pkgs[*]} (may require sudo)"
  case "$PKG_MANAGER" in
    apt) sudo apt-get update -y && sudo apt-get install -y "${pkgs[@]}" ;;
    dnf) sudo dnf install -y "${pkgs[@]}" ;;
    yum) sudo yum install -y "${pkgs[@]}" ;;
    pacman) sudo pacman -Sy --noconfirm "${pkgs[@]}" ;;
  esac
}

# Ensure git
if ! command -v git >/dev/null 2>&1; then
  install_system_pkgs git
else
  ok "git: $(git --version | head -n1)"
fi

# Ensure curl or wget
if ! command -v curl >/dev/null 2>&1 && ! command -v wget >/dev/null 2>&1; then
  install_system_pkgs curl
fi

# Ensure basic build tools on Linux (optional)
case "$PKG_MANAGER" in
  apt) install_system_pkgs build-essential || true ;;
  dnf|yum) install_system_pkgs @development-tools || true ;;
  pacman) install_system_pkgs base-devel || true ;;
esac

# Node / nvm / npm
MIN_NODE_MAJOR=22
need_node_install=false

if command -v node >/dev/null 2>&1; then
  NODE_V=$(node -v 2>/dev/null || echo "")
  NODE_MAJOR=$(echo "${NODE_V#v}" | cut -d. -f1 || echo "0")
  if [ -z "$NODE_MAJOR" ] || [ "$NODE_MAJOR" -lt "$MIN_NODE_MAJOR" ]; then
    info "Found Node ${NODE_V}, but Node >= ${MIN_NODE_MAJOR} is recommended for modern Vite"
    need_node_install=true
  else
    ok "node: ${NODE_V}"
  fi
else
  info "node not found"
  need_node_install=true
fi

if [ "$need_node_install" = true ]; then
  # Install nvm if missing
  if [ ! -d "${HOME}/.nvm" ] && ! command -v nvm >/dev/null 2>&1; then
    info "Installing nvm..."
    if command -v curl >/dev/null 2>&1; then
      curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    else
      wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    fi
  fi

  # Load nvm in this shell
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck disable=SC1090
    . "$NVM_DIR/nvm.sh"
  fi

  if command -v nvm >/dev/null 2>&1; then
    info "Installing Node ${MIN_NODE_MAJOR} (LTS) via nvm..."
    nvm install "${MIN_NODE_MAJOR}"
    nvm alias default "${MIN_NODE_MAJOR}"
    nvm use "${MIN_NODE_MAJOR}"
    ok "node: $(node -v)"
  else
    # Fallback for Debian/Ubuntu: NodeSource
    if [ "$PKG_MANAGER" = "apt" ]; then
      info "Installing Node via NodeSource (fallback)..."
      curl -fsSL "https://deb.nodesource.com/setup_${MIN_NODE_MAJOR}.x" | sudo -E bash -
      sudo apt-get install -y nodejs
      ok "node: $(node -v 2>/dev/null || echo 'unknown')"
    else
      fail "nvm not available and no supported fallback for package manager: ${PKG_MANAGER}. Install Node.js >= ${MIN_NODE_MAJOR} manually."
    fi
  fi
fi

# Ensure npm exists
if ! command -v npm >/dev/null 2>&1; then
  if [ "$PKG_MANAGER" = "apt" ]; then
    info "Attempting to install npm via apt"
    sudo apt-get update -y
    sudo apt-get install -y npm
  else
    fail "npm not found; please install Node.js/npm (use nvm or your OS package manager)"
  fi
fi

if ! command -v npm >/dev/null 2>&1; then
  fail "npm still not available. If you installed nvm, open a NEW terminal or run: export NVM_DIR=\"\$HOME/.nvm\" && . \"\$NVM_DIR/nvm.sh\" && nvm use"
else
  ok "npm: $(npm -v)"
fi

# Ensure package.json exists
if [ ! -f package.json ]; then
  fail "package.json not found. Run this script from project root or initialize with 'npm init -y'"
fi

info "Running npm install..."
npm install --no-audit --no-fund
ok "npm install finished"

# If Vite is present but no dev script, ensure dev -> vite
if grep -q '"vite"' package.json >/dev/null 2>&1 || grep -q '"vite":' package.json >/dev/null 2>&1; then
  if ! node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.dev ? 0 : 2)" 2>/dev/null; then
    info "Adding 'dev' script -> 'vite' to package.json"
    node -e "
const fs = require('fs');
const p = 'package.json';
const pkg = JSON.parse(fs.readFileSync(p,'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.dev = pkg.scripts.dev || 'vite';
fs.writeFileSync(p, JSON.stringify(pkg, null, 2));
console.log('dev script added');
"
    ok "dev script added"
  else
    ok "dev script present"
  fi
fi

# Ensure TypeScript and React types
info "Ensuring TypeScript and React types are devDependencies..."
npm install --save-dev typescript @types/react @types/react-dom

# Fix tsconfig.json if top-level strict present
if [ -f tsconfig.json ]; then
  node -e "const fs=require('fs'); const p='tsconfig.json'; let ts=JSON.parse(fs.readFileSync(p,'utf8')); if('strict' in ts && !('compilerOptions' in ts)){ ts.compilerOptions = ts.compilerOptions || {}; ts.compilerOptions.strict = ts.strict; delete ts.strict; fs.writeFileSync(p, JSON.stringify(ts, null, 2)); console.log('patched'); }" 2>/dev/null || true
  ok "tsconfig.json checked"
else
  info "Creating tsconfig.json with sensible defaults"
  npx tsc --init --jsx react-jsx --esModuleInterop --resolveJsonModule --strict
  node -e "const fs=require('fs');const p='tsconfig.json';if(fs.existsSync(p)){const ts=JSON.parse(fs.readFileSync(p,'utf8'));ts.compilerOptions=ts.compilerOptions||{};ts.compilerOptions.target=ts.compilerOptions.target||'ES2020';ts.compilerOptions.module=ts.compilerOptions.module||'ESNext';ts.compilerOptions.moduleResolution=ts.compilerOptions.moduleResolution||'Node';ts.compilerOptions.baseUrl=ts.compilerOptions.baseUrl||'.';ts.include=ts.include||['src'];fs.writeFileSync(p,JSON.stringify(ts,null,2));}"
  ok "tsconfig.json created"
fi

# Install ESLint, Prettier, plugins
info "Installing ESLint, Prettier and common plugins..."
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks

# Create ESLint config if missing (don't overwrite eslint.config.js)
if [ ! -f .eslintrc.json ] && [ ! -f eslint.config.js ]; then
  info "Creating .eslintrc.json"
  cat > .eslintrc.json <<'EOL'
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
  ok ".eslintrc.json created"
else
  ok "ESLint config present"
fi

# Create Prettier config if missing
if [ ! -f .prettierrc ]; then
  info "Creating .prettierrc"
  cat > .prettierrc <<'EOL'
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
EOL
  ok ".prettierrc created"
else
  ok ".prettierrc exists"
fi

# Ensure helpful npm scripts
info "Ensuring npm scripts: lint, lint:fix, format, check:format"
node -e "
const fs=require('fs');
const p='package.json';
const pkg=JSON.parse(fs.readFileSync(p,'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.lint = pkg.scripts.lint || 'eslint \"src/**/*.{ts,tsx}\"';
pkg.scripts['lint:fix'] = pkg.scripts['lint:fix'] || 'eslint \"src/**/*.{ts,tsx}\" --fix';
pkg.scripts.format = pkg.scripts.format || 'prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"';
pkg.scripts['check:format'] = pkg.scripts['check:format'] || 'prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"';
fs.writeFileSync(p, JSON.stringify(pkg, null, 2));
console.log('scripts ensured');
"
ok "npm scripts ensured"

chmod +x setup-react.sh || true

info "Setup finished. Next steps:"
echo "  npm run dev   # start Vite dev server"
echo "  npm run build # build for production"
info "If you installed nvm just now, open a NEW terminal or run:"
echo "  export NVM_DIR=\"\$HOME/.nvm\" && . \"\$NVM_DIR/nvm.sh\" && nvm use"