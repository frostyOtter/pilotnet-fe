#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Update package.json
cat > package.json << EOL
{
  "name": "nextjs-fastapi",
  "version": "0.2.0",
  "private": true,
  "scripts": {
    "fastapi-dev": "pip3 install -r requirements.txt && python3 -m uvicorn api.index:app --reload",
    "next-dev": "next dev",
    "dev": "concurrently \"npm run next-dev\" \"npm run fastapi-dev\"",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@types/node": "22.7.5",
    "@types/react": "18.3.11",
    "@types/react-dom": "18.3.1",
    "autoprefixer": "10.4.20",
    "concurrently": "^9.0.1",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.2.3",
    "next": "^14.2.13",
    "postcss": "^8.4.47",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tailwindcss": "3.4.14",
    "typescript": "5.6.3",
    "glob": "^10.3.10",
    "rimraf": "^5.0.10"
  },
  "overrides": {
    "glob": "^10.3.10",
    "rimraf": "^5.0.10",
    "eslint": "^8.0.0",
    "@humanwhocodes/object-schema": "@eslint/object-schema",
    "@humanwhocodes/config-array": "@eslint/config-array"
  },
  "resolutions": {
    "glob": "^10.3.10",
    "rimraf": "^5.0.10",
    "eslint": "^8.0.0",
    "inflight": "^2.0.0",
    "@humanwhocodes/object-schema": "@eslint/object-schema",
    "@humanwhocodes/config-array": "@eslint/config-array"
  }
}
EOL

echo "package.json has been updated."

# Remove existing node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Install dependencies
npm install --force

echo "Dependencies have been installed."

# Run npm ls to check specific packages
echo "Checking specific package versions:"
npm ls @humanwhocodes/object-schema @humanwhocodes/config-array eslint

echo "Setup complete. Please test your application to ensure everything is working correctly."