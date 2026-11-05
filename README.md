# Human Skills frontend

## Google sign-in setup

Google sign-in uses Google Identity Services. The frontend receives an ID token from Google, and the backend verifies it against the same OAuth client ID. Creating the OAuth client is free and does not require a billing account.

### 1. Create the OAuth client

1. Open the [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. Configure the **OAuth consent screen** under **APIs & Services** (called **Google Auth Platform** in newer versions of the console):
   - User type: **External**
   - App name and support email
   - Scopes: only the defaults `openid`, `email` and `profile`. These do not require verification by Google.
3. Go to **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:5173` and the production URL, which must use `https://`
   - Authorized redirect URIs: none are needed
4. Copy the client ID. It ends with `.apps.googleusercontent.com`.

### 2. Configure the environment

Use the same client ID in both projects:

| Project | Where | Variable |
| --- | --- | --- |
| Frontend | `.env` | `VITE_GOOGLE_CLIENT_ID=<client id>` |
| Backend | `.env` locally, environment variable in production | `GOOGLE_CLIENT_ID=<client id>` |

Restart the Vite dev server and the backend after changing `.env`, since neither reloads it while running.

### 3. Allow users to sign in

While the app has the publishing status **Testing**, only the accounts listed under **Test users** (maximum 100) can sign in. Everyone else gets an "Access blocked" error. Add the team members there, or select **Publish app** to allow all Google accounts. Avoid uploading a logo on the consent screen, as that requires brand verification.

### Behaviour

- The first Google sign-in creates a **student** account from the name and verified email in the Google account.
- If a local account with the same email already exists, Google sign-in is refused and the user is asked to sign in with email and password. Accounts are not linked.
- If the client ID is missing or still a placeholder, the button shows "Google sign-in is unavailable" instead of failing.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
