# Cyber Assistant

A modern web application featuring an AI-powered chatbot and dashboard for cybersecurity assistance.

## Features

- 🤖 **Chatbot Page**: Interactive AI chatbot powered by DeepSeek AI via OpenRouter (Free!)
- 📊 **Dashboard Page**: Control center with statistics, activity feed, and quick actions
- 🎨 **Modern UI**: Beautiful dark theme with purple/blue gradients
- ⚡ **Fast**: Built with React + Vite for optimal performance

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up OpenRouter (Free Access):
   - **Option A (Free - No API key needed)**: The app works with `'free'` as the API key by default
   - **Option B (Recommended)**: Get a free API key from [OpenRouter](https://openrouter.ai) for better rate limits
     - Sign up at https://openrouter.ai (free)
     - Get your API key from the dashboard
     - Create a `.env` file in the root directory
     - Add your API key (optional, but recommended):
```
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

## Important Security Note

## API Configuration

This app uses **OpenRouter** to access DeepSeek models for free. OpenRouter provides:
- ✅ Free access to DeepSeek models
- ✅ CORS support (works directly from browser)
- ✅ No API key required (uses 'free' by default)
- ✅ Optional API key for better rate limits

⚠️ **Security Note**: 
- API keys in the frontend can be viewed by anyone inspecting your code
- For production, consider using a backend API proxy
- Never commit `.env` files to version control

## Project Structure

```
src/
├── components/
│   └── Navigation.jsx    # Navigation bar component
├── pages/
│   ├── Chatbot.jsx       # Chatbot page with OpenRouter (DeepSeek) integration
│   └── Dashboard.jsx     # Dashboard page
├── App.jsx               # Main app with routing
└── main.jsx              # Entry point
```

## Technologies Used

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- OpenRouter API (accessing DeepSeek models)
