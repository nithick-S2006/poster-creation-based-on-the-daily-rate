# SwarnaPost – Sri Chairman Jewellers Daily Rate Poster & WhatsApp Broadcaster
### ஸ்ரீ சேர்மன் சுவர்ண போஸ்டர்

A high-performance, jewellery-themed web application designed for **Sri Chairman Jewellers**, Rasipuram. It allows the shop owner to enter daily gold and silver rates, fine-tune text alignment and sizes in real time, automatically retrieve today's date in `Asia/Kolkata` timezone, generate an authentic 1080 × 1920 Ultra-HD rate poster, and broadcast it via WhatsApp status or direct messages within 60 seconds.

---

## 🌟 Key Features

1. **Pixel-Perfect Poster Recreation**:
   - Faithful recreation of the original Sri Chairman Jewellers poster.
   - Deep luxury black textured background with ornate gold borders & corner filigree.
   - Distinct **GOLD RATE** and **SILVER RATE** framed sections with metallic badges.
   - Stacked 3D gold bullion coin illustrations and silver bar/anklet artwork.
   - Sparkling glitter rate boxes with 3D metallic typography (`₹12,985`, `₹190`).
   - Dynamic Indian Rupee comma formatting (supports 5, 6, and 7-digit numbers without cropping or overlap).

2. **Rate & Date Axis and Font Size Fine-Tuner**:
   - Visual sliders and 5px precision D-pad arrows (`▲`, `▼`, `◀`, `▶`) to adjust the exact X and Y coordinates and text sizes for Gold Rate, Silver Rate, and Date.
   - Live HMR canvas updates with one-click restore button to revert to calibrated defaults.
   - Optional adjustable background mask for custom framing.

3. **Dynamic Rates & Live Calculations**:
   - **Gold Rate Input (22K)**: Real-time calculation of 1 gram and 1 sovereign (8 grams / பவுன்).
   - **Silver Rate Input**: Real-time calculation of 1 gram and 1 kilogram bar.
   - Quick stepper buttons (`±10`, `±50`, `±100` for Gold; `±1`, `±5` for Silver).

3. **Automatic Date Management**:
   - Automatically retrieves today's date formatted as `DD-MM-YYYY` using `Asia/Kolkata` timezone.
   - Optional manual date override with native date picker.

4. **1-Click WhatsApp Sharing Workflow**:
   - **Mobile / Supported Browsers**: Uses native Web Share API (`navigator.canShare({ files: [file] })`) to attach the actual PNG image directly to WhatsApp.
   - **Desktop / Web Fallback**: Automatically downloads `SRI_CHAIRMAN_JEWELLERS_DAILY_RATE_DD-MM-YYYY.png`, copies image to clipboard, and opens WhatsApp Web with the recipient phone number and a pre-formatted bilingual caption.
   - Optional WhatsApp Business Cloud API support.

5. **Daily Rate Archive & History**:
   - Records date, gold rate, silver rate, generation timestamp, and poster filename.
   - Displays 24-hour price trend indicators (▲ Up / ▼ Down / — Same).
   - Prevents accidental duplicates for the same date.
   - 1-click "Load into Editor", "Download Previous Poster", and "Export to CSV".

6. **Comprehensive Settings Panel**:
   - English & Tamil Shop Name (`ஸ்ரீ சேர்மன் ஜூவல்லர்ஸ்`).
   - Address Lines & Footer thank-you message.
   - Custom Logo upload with preview & reset to original.
   - Dual Poster Modes:
     - **Original Poster Match**: Authentic 3D embossed diamond title and original artwork.
     - **Custom Modular Layered**: Customizable Tamil Unicode typography (`Noto Sans Tamil`, `Mukta Malar`, `Baloo Thambi 2`, `Anek Tamil`).
   - Storage mode toggle: Browser LocalStorage (offline-ready) or Java Spring Boot REST API.

---

## 🏗️ Project Architecture

```
d:\SHOP RATE POSTER\
├── frontend/                     # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── public/
│   │   └── assets/               # 1080x1920 poster templates, logo, 3D illustrations
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx        # Brand header with IST clock and status pill
│   │   │   ├── RateForm.tsx      # Gold, silver, date, whatsapp inputs & buttons
│   │   │   ├── PosterCanvas.tsx  # Live 1080x1920 canvas viewport & zoom controls
│   │   │   ├── HistorySection.tsx# Rate archive table, trend analysis & CSV export
│   │   │   ├── SettingsModal.tsx # Shop details, logo upload & API settings
│   │   │   ├── HelpModal.tsx     # Section 14 testing checklist & user guide
│   │   │   ├── PosterPreviewModal.tsx # Fullscreen HD zoom modal
│   │   │   └── WhatsAppGuideModal.tsx # WhatsApp sharing guidance modal
│   │   ├── utils/
│   │   │   ├── posterRenderer.ts # High-res 1080x1920 HTML5 Canvas rendering engine
│   │   │   ├── whatsappShare.ts  # Web Share API + WhatsApp Web integration
│   │   │   ├── dateUtils.ts      # Asia/Kolkata timezone & Indian currency formatting
│   │   │   ├── storage.ts        # LocalStorage persistence & history management
│   │   │   └── apiService.ts     # Spring Boot REST API synchronization client
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── App.tsx               # Main Dashboard application
│   │   └── index.css             # Luxury metallic gold & silver CSS styling
│   └── vite.config.ts            # Vite bundler configuration
│
├── backend/                      # Java Spring Boot 3 REST API Backend
│   ├── src/main/java/com/srichairman/jewellers/
│   │   ├── config/CorsConfig.java
│   │   ├── controller/RateController.java
│   │   ├── controller/SettingsController.java
│   │   ├── model/DailyRate.java
│   │   ├── model/ShopSettings.java
│   │   ├── repository/DailyRateRepository.java
│   │   ├── repository/ShopSettingsRepository.java
│   │   ├── service/DailyRateService.java
│   │   ├── service/ShopSettingsService.java
│   │   └── SriChairmanJewellersApplication.java
│   ├── src/main/resources/application.yml
│   ├── Dockerfile
│   └── pom.xml
│
├── docker-compose.yml            # Docker stack for Spring Boot + MySQL 8.0
└── test_outputs/                 # Verified test render outputs
```

---

## 🚀 How to Run the Application

### 1. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in any web browser.

### 2. Backend (Java Spring Boot)
The frontend works 100% out-of-the-box using browser LocalStorage. To run the Spring Boot REST backend:

**Option A: Local Maven Run**
```bash
cd backend
mvn spring-boot:run
```
Backend runs on **`http://localhost:8080/api`** with automatic H2 database fallback.

**Option B: Docker Compose (Spring Boot + MySQL 8.0)**
```bash
docker compose up -d
```

---

## 🧪 Specification Verification (Section 14 Tests)

All 7 core test scenarios specified in the requirements have been verified:

| Test | Action | Expected Output | Status |
| :--- | :--- | :--- | :---: |
| **Test 1** | Enter Gold: 12985, Silver: 190 | Poster displays `₹12,985` and `₹190` | ✅ Verified |
| **Test 2** | Change Gold to 13050 | Only Gold changes to `₹13,050` | ✅ Verified |
| **Test 3** | Change Silver to 200 | Only Silver changes to `₹200` | ✅ Verified |
| **Test 4** | Refresh the website | All prices, drafts, and settings persist | ✅ Verified |
| **Test 5** | Generate today's poster | Current Asia/Kolkata date appears automatically | ✅ Verified |
| **Test 6** | Download poster | PNG downloads as `SRI_CHAIRMAN_JEWELLERS_DAILY_RATE_DD-MM-YYYY.png` | ✅ Verified |
| **Test 7** | Share on WhatsApp | Native share / WhatsApp Web opens with recipient and image | ✅ Verified |
