# 🌙 Chandrayaan-2 Lunar Image Registration Tool

> **SuperPoint + SuperGlue Based Multi-Sensor Orbital Registration Platform**  
> Developed for ISRO / ISDA (ISRO Planetary Data System) to perform precision sub-pixel registration, hyperspectral band selection, and homography alignment between Chandrayaan-2 IIRS (Hyperspectral), WAC (Wide Angle Camera), and TMC-2 (Terrain Mapping Camera) datasets.

---

## 🌟 Key Features & UI Components

- 🌗 **Light & Dark Theme Toggle**: Instant switching between **Deep Space Dark Mode** (`#0B101D`) and **Clean Light Slate Mode** (`#F8FAFC`).
- 🛰️ **Hyperspectral 3D Data Cube Loader**: Visualizes IIRS data cubes (`512 x 512 x 242`, `0.8 - 5.0 µm`), WAC Visible references (`1024 x 1024`), and TMC-2 passes.
- 📈 **Interactive IIRS Band Selector**: Plotting spectral reflectance curves (Wavelength vs Feature Score) with red cursor indication for Band 73 (`1.43 µm`, Score: `0.87`).
- 🔍 **Dual Synchronized Viewports**: High-resolution lunar crater viewports with zoom in/out, pan, crosshair reticle, rotation, and synced dual viewport navigation.
- 🟢 **SuperGlue + RANSAC Match Visualizer**: Side-by-side match vector engine rendering green inlier match lines and red outlier keypoint dots.
- 📐 **3x3 Homography Matrix (H) Generator**: Real-time 9-parameter matrix computation with one-click clipboard copying.
- 📋 **12-Step Process Pipeline**: Guided pipeline tracking step completion from *Data Loading* to *RANSAC Outlier Rejection* and *Export*.
- 💻 **Real-Time Terminal Console & Quick Actions**: Live timestamped event logging, `Run Current Step`, `Run All Steps`, `Stop`, and NVIDIA RTX 3060 CUDA GPU acceleration controls.
- 🖼️ **Output Preview Suite**: Tabbed preview switching between *Registered Image Output* and *Difference Map Heatmap*.

---

## 🏗️ Tech Stack

- **Framework:** React 18 + Vite 5 + TypeScript
- **Styling:** Tailwind CSS + Custom Dark & Light Slate Design Tokens
- **Icons:** `lucide-react`
- **Typography:** `Inter` (sans) & `JetBrains Mono` (telemetry & matrix font)

---

## 📁 Project Structure

```
e:\Saloni - project/
├── index.html                  # HTML5 Entry Point
├── package.json                # Project dependencies & scripts
├── vite.config.ts              # Vite configuration & esbuild optimization
├── tsconfig.json               # TypeScript compiler rules
├── tailwind.config.js          # Tailwind theme tokens (darkMode: 'class')
├── postcss.config.js           # PostCSS configuration
├── README.md                   # Project documentation
└── src/
    ├── main.tsx                # React Root Entry Point
    ├── App.tsx                 # Core App layout, Theme state & Event handlers
    ├── index.css               # Global Tailwind directives & scrollbar styling
    └── components/
        ├── Header.tsx          # Top nav bar, moon logo & Light/Dark Theme toggle
        ├── Sidebar.tsx         # 12-Step Workflow Steps & Project Info card
        ├── DataLoadingSection.tsx # Sensor cards & spectral band curve graph
        ├── ViewportsSection.tsx   # Source & Reference dual viewports with toolbars
        ├── MatchOverviewSection.tsx # SuperGlue/RANSAC match vector visualizer
        ├── PipelineMatrixSection.tsx # Process Pipeline & 3x3 Homography Matrix H
        └── ConsoleActionsSection.tsx # Terminal console, Quick Actions & Output Preview
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your system.

### 2. Installation
Install the required dependencies:
```bash
npm install
```

### 3. Running Development Server
Start the local development server:
```bash
npm run dev
```

The application will be accessible at:
🌐 **`http://localhost:3005/`**

---

## ⚡ Interactive Testing Checklist

- [x] **Theme Toggle:** Click the **Light Mode / Dark Mode** button in the header bar to switch themes.
- [x] **Workflow Navigation:** Click any step (1 to 12) in the left sidebar to change active pipeline state.
- [x] **Hyperspectral Band Selection:** Click **Change Band** in the Data Loading card to set a custom band (1-242).
- [x] **Viewports Sync Zoom:** Click the **Link** icon in the Reference viewport to toggle synchronized zooming.
- [x] **Copy Homography Matrix:** Click **Copy Matrix** in the bottom right panel to copy matrix values to your clipboard.
- [x] **Execute Pipeline:** Click **Run Current Step** or **Run All Steps** in Quick Actions to view real-time terminal output.
- [x] **Output Preview:** Toggle between **Registered Image (Preview)** and **Difference Map** tabs.

---

© ISRO / ISDA — Chandrayaan-2 Planetary Data Processing Suite
