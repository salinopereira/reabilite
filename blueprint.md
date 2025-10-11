# ReabilitePro Blueprint

## Overview

ReabilitePro is a modern web application designed to help users with their rehabilitation process. It will feature a user-friendly interface for patients and tools for professionals to monitor progress. The application is built entirely with Next.js, leveraging API Routes for backend functionality, and is designed to be deployed on Firebase App Hosting.

## Style and Design Guide

*   **Colors**: A professional and calming color palette will be used, focusing on blues, greens, and whites.
*   **Typography**: Clean and readable fonts.
*   **Layout**: Modern, responsive, and intuitive layout.
*   **Iconography**: Use of icons to improve usability.

## Current Plan: Refactor for Firebase App Hosting

Refactor the project to use Next.js API Routes for backend functionality, making it compatible with Firebase App Hosting.

### Steps:

1.  **Update `blueprint.md`**: Document the new architecture and plan.
2.  **Create API Route**: Create a new API route at `src/app/api/hello/route.ts` to handle backend logic.
3.  **Remove Python Backend**: Delete the `backend` directory and its contents (`main.py`, `requirements.txt`).
4.  **Update `.idx/dev.nix`**: Remove Python from the development environment to simplify the setup.
5.  **Clean up project structure**: Remove unnecessary files and configurations related to the old Python backend.
6.  **Update `src/app/page.tsx`**: Add a button to the main page that calls the new API route and displays the result.
7.  **Add Firebase Configuration**: Add the necessary Firebase configuration to the project.
8.  **Deploy to Firebase App Hosting**: Deploy the application.
