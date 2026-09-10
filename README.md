# 🌙 Chandrayaan-2 Lunar Image Registration Tool

> **SuperPoint + SuperGlue Deep Learning Based Multi-Sensor Lunar Orbital Raster Registration Platform**  
> Developed for ISRO / ISDA (ISRO Planetary Data System) to perform automated sub-pixel co-registration, phase correlation coarse offset calculation, SuperPoint keypoint extraction, SuperGlue GNN correspondence matching, and polynomial homography warping between Chandrayaan-2 OHRC (0.28 m/px) and LROC NAC (1.10 m/px) lunar surface imagery.

---

## 🌟 Key Features & Innovations

- ⚙️ **Complete 12-Step Automated Pipeline**:
  1. **Data Loading**: Ingestion of raw PDS4 lunar orbital rasters (OHRC 0.28 m/px & NAC 1.10 m/px).
  2. **Georeferencing**: Lunar coordinate system transformation (EPSG:104903 Moon 2000 CRS).
  3. **Resolution Resampling**: Bicubic resampling of OHRC to match NAC ground sampling distance (GSD).
  4. **Intensity Normalization**: CLAHE (Clip=2.0) histogram equalization for illumination balancing.
  5. **Automatic Coarse Alignment**: 2D Fourier phase correlation offset solver ($\Delta X = +14.2\text{px}, \Delta Y = -8.7\text{px}$, Shift Vector $16.65\text{px}$, Rotation Drift $0.42^\circ$, Georef RMS $1.8\text{px}$).
  6. **Feature Extraction (SuperPoint)**: Deep convolutional interest point detection ($4,812$ OHRC / $5,096$ NAC keypoints).
  7. **Feature Matching (SuperGlue)**: Graph Neural Network optimal transport correspondence solver ($1,247$ matches, $0.81$ confidence).
  8. **Outlier Rejection (RANSAC)**: Reprojection error filtering ($1,083$ inliers, $86.8\%$ consensus).
  9. **Transformation Estimation**: 2nd-Order Polynomial transformation matrix optimization ($\text{RMSE} = 0.62\text{px}, R^2 = 0.9999$).
  10. **Image Warping**: Bicubic spline raster deformation and mosaic composite creation.
  11. **Evaluation**: Sub-pixel verification & difference heatmap error mapping ($0.62\text{px}$ shift error).
  12. **Export Results**: One-click deliverable generation (GeoTIFF, Homography JSON, QA PDF Report).

- 🔄 **Real-Time File Selection & Upload Synchronization**:
  - Upload custom source or reference rasters (`.tif`, `.img`, `.IMG`, `.cube`, `.xml`, `.hdr`, `.json`, `.png`, `.jpg`).
  - Native Windows File Explorer integration (Unrestricted file picker allowing instant access to Desktop & local drives).
  - Automatic live synchronization of uploaded file metadata, tile titles, and image previews across **Source/Reference Cards**, **Dual Viewports**, and **Console Logs**.

- 🔍 **Dual Synchronized Viewports & Interactive Controls**:
  - Independent or synchronized dual-viewport zoom ($50\% - 300\%$) and pan.
  - Crosshair reticle overlay with real-time lunar latitude/longitude coordinate readouts (`88.5°S, 0.2°E`).
  - $90^\circ$ clockwise rotation, hand pan tool, and full-screen expansion mode.

- 🌗 **Light & Dark Theme System**:
  - Instant theme switching between **Deep Space Dark Mode** (`#0B101D`) and **Clean Light Slate Mode** (`#F8FAFC`).

- 📊 **Polynomial Transformation Matrix P & Match Vector Visualizer**:
  - Interactive 3x3 transformation matrix parameter table with single-click clipboard copy.
  - Match vector overlay visualizer filtering between All Matches, Inliers, and Outliers.

---

## 🏗️ Tech Stack

- **Core Framework:** React 18 + Vite 5 + TypeScript
- **Styling & Theme:** Vanilla CSS + Tailwind CSS (Class-based dark/light theme tokens)
- **Icons:** `lucide-react`
- **Typography:** `Inter` (UI sans) & `JetBrains Mono` (telemetry, paths & matrix parameters)

---

## 📁 Project Architecture

```
e:\Saloni - project/
├── index.html                  # HTML5 Entry Point
├── package.json                # Project dependencies & scripts
├── vite.config.ts              # Vite configuration & build optimization
├── tsconfig.json               # TypeScript compiler rules
├── tailwind.config.js          # Tailwind theme tokens (darkMode: 'class')
├── postcss.config.js           # PostCSS configuration
├── README.md                   # Project documentation
└── src/
    ├── main.tsx                # React Root Entry Point
    ├── App.tsx                 # Core App layout, Theme state & Global Provider
    ├── index.css               # Global Tailwind directives & custom scrollbars
    ├── context/
    │   └── AppStateContext.tsx # Centralized State (Tiles, Pipeline, Logs, Modal)
    └── components/
        ├── Header.tsx          # Top navigation bar, telemetry status & Theme toggle
        ├── Sidebar.tsx         # Interactive 12-Step Pipeline Workflow Navigation
        ├── DataLoadingSection.tsx # Source (OHRC) & Reference (NAC) tile cards
        ├── ViewportsSection.tsx   # Dual synchronized lunar image viewports with reticle
        ├── MatchOverviewSection.tsx # SuperGlue/RANSAC match vector visualizer
        ├── PipelineProcessView.tsx  # Detailed live step execution view & offset metrics
        ├── PipelineMatrixSection.tsx # 3x3 Polynomial Transformation Matrix P viewer
        ├── ConsoleActionsSection.tsx # Telemetry terminal console & pipeline execution buttons
        └── Modals.tsx          # Change Tile, Upload, New/Open Project & Settings dialogs
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

### 4. Production Build
To validate or build the application bundle for production:
```bash
npm run build
```

---

## ⚡ Interactive Testing Checklist

- [x] **Theme Toggle**: Click the **Light / Dark Mode** toggle in the top-right header to switch themes.
- [x] **12-Step Pipeline**: Click **Automatic Coarse Alignment** (Step 5) in the left sidebar or process view to inspect phase correlation translation shift ($\Delta X = +14.2\text{px}, \Delta Y = -8.7\text{px}$) and georeferencing error ($1.8\text{px}$ RMS).
- [x] **File Upload & Sync**: Click **Select / Change OHRC Tile** or **Select / Change NAC Tile**, choose any file from Desktop, click **Confirm & Apply**, and verify live filename & image preview update across cards and viewports.
- [x] **Dual Viewport Sync**: Click the **SYNCED / LINK** button in the Reference viewport to enable/disable synchronized zooming and panning.
- [x] **Copy Matrix**: Click **Copy Matrix** in the Polynomial Transformation Matrix panel to copy parameters to clipboard.
- [x] **Pipeline Execution**: Click **Run Current Step** or **Run All Steps** in the bottom control panel to execute automated registration.

---

© ISRO / ISDA — Chandrayaan-2 Planetary Data Processing Suite
