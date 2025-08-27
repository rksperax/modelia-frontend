# AI Studio - Image Generation Simulator

A modern React web application that simulates an AI-powered image generation studio. Upload images, describe your prompt, select styles, and generate amazing results with a beautiful, accessible interface.

## Features

### Image Upload & Processing
- Drag & drop or click to upload PNG/JPG files (≤10MB)
- Automatic client-side downscaling for images over 1920px
- Real-time image preview with removal functionality
- file validation and error handling

### Mock AI Generation
- Realistic API simulation with 1-2 second delays
- 20% simulated error rate with "Model overloaded" responses
- Automatic retry with exponential backoff (max 3 attempts)
- Request abortion capability with loading states

### Persistent History
- Local storage of last 5 generations
- Click any history item to restore settings
- Clear all history functionality

### Unit Test
- Setup with vitest and React testing library
- Wrote unit test for some components


## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd modelia-ai-studio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint