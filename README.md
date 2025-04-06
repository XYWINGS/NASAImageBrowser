
# 🚀 NASA Image Explorer — React + Vite

🌐 **Live Demo**: [nasaimagebrowser.netlify.app](https://nasaimagebrowser.netlify.app)

This React application allows you to explore images from NASA's public APIs, showcasing:

- Mars Rover Photos  
- EPIC (Earth Polychromatic Imaging Camera) Imagery  
- Astronomy Picture of the Day (APOD)

---

## 🛠️ Project Setup

### 📋 Prerequisites
- [Node.js](https://nodejs.org/) and npm installed on your system.

### 📦 Installation

Clone this repository:
```bash
git clone https://github.com/XYWINGS/NASAImageBrowser.git
```

Navigate to the project directory and install dependencies:
```bash
cd NASAImageBrowser
npm install
```

Add your NASA API key to a `.env` file:
```env
VITE_NASA_API_KEY=your_api_key_here
```

---

## 🚀 Usage

Start the development server:
```bash
npm start
```

This starts a local server at **[http://localhost:3000](http://localhost:3000)**. The app auto-reloads on code changes.

### 🔎 Explore the App:
- Navigate between **Mars Rovers**, **EPIC**, and **APOD** sections.
- In **Mars Rovers**, select a rover to view images from it.
- **EPIC** shows real-time Earth images from the DSCOVR satellite.
- **APOD** shows a new astronomy image with an explanation daily.

---

## 🏗️ Build for Deployment

To create a production build:
```bash
npm run build
```

This generates a `dist/` folder with the production-ready app.

---

## 🔌 APIs Used

| API | Description | Example Date |
|-----|-------------|--------------|
| [Mars Rover Photos API](https://api.nasa.gov/) | Curiosity rover photos | `2024-02-19` |
| [EPIC API](https://epic.gsfc.nasa.gov/) | Earth images | `2024-03-26` |
| [APOD API](https://api.nasa.gov/) | Astronomy Picture of the Day | Any Date |

---

## ⚠️ Challenges Faced

- **API Rate Limits**: NASA APIs have usage limits that can be exceeded.
- **Error Handling**: Needed to gracefully handle failed requests or network issues.
- **Data Caching**: To improve performance and reduce API usage.

### ✅ Solutions

- **Rate Limit Awareness**: Added logic to respect limits and show messages when exceeded.
- **Error Handling**: Implemented error boundaries and fallback messages.
- **Caching**: Considered local storage or memory caching for high-use data like APOD.

---

## 🧪 Running Tests

Run test cases with:
```bash
npx jest src/HomePage.test.js
npx jest src/MarsImages.test.js
npx jest src/PictureoftheDay.test.js
```