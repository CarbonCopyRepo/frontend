# CarbonCopy frontend repo

### Useful Docs:
  * Styling:
    * [Clean Code Javascript](https://github.com/ryanmcdermott/clean-code-javascript)
    * [Naming Cheatsheet](https://github.com/kettanaito/naming-cheatsheet)
  * Testing:
    * [Jest:](https://jestjs.io/) Unit Testing
    * [Testing Library:](https://testing-library.com/) Adds some useful unit test calls
    * [Playwright:](https://playwright.dev/docs/intro) E2E Testing
  * Config:
    * [Husky:](https://typicode.github.io/husky/) Adds linting, tests and all sorts of fun things to your commits
   
  * Misk:
    * [Followed Bulletproof React](https://github.com/alan2207/bulletproof-react) 
 




# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
