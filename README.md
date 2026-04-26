


# Agentic Premier League Problem Statement 1
https://github.com/user-attachments/assets/f10269cc-f108-48c4-bed5-31315e2b4e54

# SquadUp: Agentic Premier League App

**SquadUp** is a live match-time mobile application designed to enhance the stadium experience for groups. It combines real-time cricket data, agentic AI for personalized challenges, and group-based rewards to make watching the game at the stadium more interactive and fun.

## 🚀 Key Features

- **Live Match Tracking**: Real-time scores and match events scraped directly from live sources.
- **Agentic AI Orchestrator**: An intelligent system that generates dynamic challenges based on the current match state (e.g., predicting the next boundary or wicket).
- **Squad Lobby & Lobby System**: Create or join squads with friends using unique codes.
- **Interactive Challenges**: Real-time trivia and prediction games that award points to the squad.
- **Reward System**: Claim stadium-specific rewards (like food discounts) using points earned from challenges.
- **Interactive Stadium Map**: Visualize your squad members' locations within the stadium.
- **Match Memory**: A post-match summary of your squad's achievements and highlights.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS with custom design tokens
- **Data Scraping**: Cheerio-based web scraping for real-time match data
- **AI**: Gemini-powered agentic logic for challenge generation
- **Deployment**: Docker & Google Cloud Run

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/deepaksah22/Google_APL_PS1.git
   cd Google_APL_PS1/squadup
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

## ☁️ Deployment (Cloud Run)

The application is containerized using Docker and optimized for deployment on Google Cloud Run.

### Build and Push to Container Registry
```bash
docker build -t gcr.io/[PROJECT_ID]/squadup .
docker push gcr.io/[PROJECT_ID]/squadup
```

### Deploy to Cloud Run
```bash
gcloud run deploy squadup \
  --image gcr.io/[PROJECT_ID]/squadup \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

## 🤖 AI Agents

- **Prediction Agent**: Analyzes match momentum to suggest high-probability prediction challenges.
- **Crowd Reward Agent**: Monitors squad activity and match highlights to trigger contextual rewards.
- **Nav Agent**: Helps coordinate group exits and stadium navigation using real-time data.

---
*Built with ❤️ by Deepak Sah*
