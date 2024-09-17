# Pompette

Pompette is a powerful DMX lighting control application built with **Angular**, **Node.js**, and packaged with **Electron** to provide a cross-platform desktop experience. This project allows users to create, test, monitor, and manage DMX fixtures, as well as design and execute complex lighting sequences. Whether you're a lighting technician or an enthusiast, Pompette provides all the tools you need to bring your DMX lighting setup to life.

## Features

- **Fixture Management**: Easily create and configure custom DMX fixtures.
- **Testing & Monitoring**: Test and monitor your fixtures in real-time.
- **Lighting Sequences**: Create dynamic lighting sequences and control multiple fixtures simultaneously.
- **Cross-platform**: Packaged with Electron, Pompette works on Windows, macOS, and Linux.
- **Modern Web Technologies**: Built using Angular for the frontend and Node.js for the backend, ensuring a robust, scalable, and responsive application.

## Getting Started

### Prerequisites

Before getting started, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Angular CLI](https://angular.io/cli)
- [Electron](https://www.electronjs.org/)

### Development Setup

To run the application in development mode, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/pompette.git
    cd pompette
    ```

2. **Install dependencies**:
    ```bash
    npm install
    cd server
    npm install
    ```

3. **Start the Node.js server**:
    ```bash
    cd server
    node server.js
    ```

4. **Start the Angular frontend**:
    In a separate terminal, run:
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/` to view the application. The app will automatically reload if you make any changes to the source files.

### Building the Application

To build the application for production:

1. **Build the Angular application**:
    ```bash
    ng build --prod
    ```

2. **Package with Electron**:
    After building the Angular app, you can create a distributable for Windows (or other platforms) using Electron.

    For Windows:
    ```bash
    npm run dist:win
    ```

    The build artifacts will be stored in the `dist_electron/` directory. This will create a production-ready executable for distribution.

