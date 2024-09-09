# Snake by dream0ver

## Overview

This project is an Electron-based game that runs on both Windows and macOS. The instructions below will guide you on how to run the game in development mode and package the game for different platforms.

## Running in Development Mode

1. Clone the repository to your local machine.
2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Run locally using the command:

   ```bash
   npm start
   ```

## Building for Production

You can package the game for different operating systems using the following commands:

1. Windows: To build the game for Windows:

   ```bash
   npm run make-windows
   ```

2. Windows: To build the game for Mac OS:

   ```bash
   npm run make-osx
   ```

The packaged game files will be stored in the dist folder.
