![image](https://github.com/user-attachments/assets/bec5ff9d-9776-418d-a0b4-c9028e405f17)

# Choredo Web App

This is a chore todo web app to track, complete, and manage chores. Users can also browse and clone public chores from the community, and earn rewards for completing their reoccurring chores.

## Vite TypeScript Project

This project is a Vite-powered TypeScript application designed to run on Node.js 20. It includes various configurations to serve the app locally and build for production. 

## Features

- **Development Mode**: Runs locally with backend running locally on `localhost:7730`.
- **Production Mode**: Points to a hosted backend on Heroku.
- **Builds**: Creates optimized production builds.
- **Preview**: Preview the production build locally.

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (version 20)
- **npm** (comes with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ZackLeaman/choredo-fe.git
   cd choredo-fe
   ```

2. Install dependencies:

    ```bash
    npm install

## Environment Variables

This project uses environment variables defined in .env files.

- `.env.development`
  For local development, the backend will be pointed to localhost:7730:
  ```
  VITE_BACKEND=http://localhost:7730
  ```

- `.env`
  For production, the backend will be pointed to the hosted Heroku instance:
  ```
  VITE_BACKEND=https://choredo-be-e8c454b7c00e.herokuapp.com
  ```
The Vite project will automatically load the appropriate .env file depending on the environment.

## Running the Project

  ### Development Mode

  - To run the project locally with the development configuration (pointing to localhost:7730 for the backend):
    ```bash
    npm run dev
    ```
    This will start the local development server and the app will be available at http://localhost:5173/choredo-fe/.

  ### Production Mode
  
  - To run the project in production mode (pointing to the hosted backend):
    ```bash
    npm run prod
    ```
    This will serve the app with production settings. Make sure the .env file is correctly set for production before running this.

## Building the Project

- To build the project for production:

  ```bash
  npm run build
  ```
  This will create an optimized production build in the dist/ folder.

### Previewing the Production Build
- After building the project, you can preview it locally:

  ```bash
  npm run preview
  ```
  This will start a local server to serve the built app, allowing you to test it before deployment.

## Scripts

- Start the development server with local backend (points at localhost:7730) and serve on http://localhost:5173/choredo-fe/.
  ```bash
  npm run dev
  ```
- Start the production server with backend (Heroku) and serve on http://localhost:5173/choredo-fe/.
  ```bash
  npm run prod
  ```
- Build the app for production.
  ```bash
  npm run build
  ```
- Preview the production build locally and serve on http://localhost:5173/choredo-fe/.
  ```bash
  npm run preview
  ```
