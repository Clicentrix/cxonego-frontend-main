# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with Hot Module Replacement (HMR) and some ESLint rules.

# Table of Contents

1.  [Installation](#installation)
2.  [Usage](#usage)
3.  [Features](#features)
4.  [Contributing](#contributing)
5.  [Tech](#tech)
6.  [Documentaion](#documentation)
7.  [Authors](#authors)

# Installation <a id="installation"></a>

## Local Setup

1. clone the repo

   ```
   git clone <link>
   ```

   <!-- 2. Add .env file with the following variables.

      ```
      JWT_SECRET=
      DOMAIN_NAME=
      ``` -->

2. run `yarn` install all necessary dependancies.
3. run `yarn run dev` run the project

## To check prettier, linter, typescript errors

```
yarn prettier --write .
yarn lint
yarn tsc --noEmit

//

# Usage <a id="usage"></a>

## Project Modules

The project is structured as follows:

- **src/**: Contains all the source code for the application.
  - **components/**: Contains reusable components.
    - **auth/**: Components related to authentication (e.g., `loginComponent.tsx`, `signupComponent.tsx`).
    - **dashboard/**: Components for the dashboard (e.g., `activitiesDashboard.tsx`, `leadsDashboard.tsx`).
    - **layout/**: Layout components for the application (e.g., `layoutComponent.tsx`).
    - **notification/**: Components for notifications (e.g., `Notification.tsx`).
    - **userProfile/**: User profile related components (e.g., `userProfile.tsx`).
    - **subscription/**: Components related to subscription management (e.g., `subscription.tsx`).
  - **redux/**: Contains Redux slices and store configuration.
  - **services/**: Contains service configurations (e.g., `firebaseConfig.ts`).
  - **styles/**: Contains CSS styles for the application.
  - **utilities/**: Contains utility functions and data arrays.
  - **pages/**: Contains page components (e.g., `dashboard/index.tsx`).

  - .eslintrc.cjs
  - .gitignore
  - index.html
  - package.json
  - README.md
  - sonar-project.properties
  - tsconfig.json
  - tsconfig.node.json
  - vercel.json
  - vite.config.json

## Naming Convention

- components : PascalCase
- constants : UPPERCASE
- variables/functions : camelCase

## Features <a id="features"></a>

- CRUD for all modules
- Tables with records having search, sort, pagination functionality
- File Upload
- Authentication
- Export data in xlsx

## Contributing <a id="contributing"></a>

[Installation](#installation)

### Git Branching

- `main` - stable production code.
- `feature/feature-name` - feature related code. New feature branches will be based on `dev` branch. After feature is ready it will be merged in the `main`.

## Tech Stack <a id="tech"></a>

**Node:** JS Runtime(22.9.0)

**Typescript:** Programming Language

**React:** Framework(18.2.0)

## Authors
```
