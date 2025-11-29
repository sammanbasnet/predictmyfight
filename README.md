# PredictMyFight

A modern web application for predicting MMA fight outcomes using historical fighter statistics. Built with React and Vite.

## Features

- 🥊 Select two fighters from a curated database
- 📊 View detailed fighter statistics including:
  - Win/Loss record
  - Knockout and submission rates
  - Striking and takedown accuracy
- 🎯 AI-powered prediction algorithm based on historical performance
- 🎨 Beautiful, modern UI with dark theme and golden accents
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Select Fighter 1**: Click on the first fighter selector and choose a fighter from the dropdown
2. **Select Fighter 2**: Click on the second fighter selector and choose another fighter
3. **View Stats**: Once both fighters are selected, their detailed statistics will be displayed
4. **Predict Winner**: Click the "Predict Winner" button to see the prediction results
5. **Review Results**: The prediction shows win probabilities for both fighters and highlights the predicted winner

## Prediction Algorithm

The prediction algorithm uses a weighted scoring system based on:
- Win rate (30% weight)
- Knockout rate (20% weight)
- Submission rate (15% weight)
- Striking accuracy (20% weight)
- Takedown accuracy (15% weight)

## Project Structure

```
predictmyfight/
├── src/
│   ├── components/
│   │   ├── FighterSelector.jsx
│   │   ├── FighterStats.jsx
│   │   └── PredictionResult.jsx
│   ├── data/
│   │   └── fighters.js          # Fighter database
│   ├── styles/
│   │   ├── index.css           # Global styles
│   │   ├── App.css             # App component styles
│   │   └── components/         # Component-specific styles
│   │       ├── FighterSelector.css
│   │       ├── FighterStats.css
│   │       └── PredictionResult.css
│   ├── utils/
│   │   └── prediction.js       # Prediction algorithm
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features

## License

This project is part of an individual academic project.

