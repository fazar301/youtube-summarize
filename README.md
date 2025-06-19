# YouTube Summarizer

A web app that summarizes YouTube videos using AI.

## Features
- Paste any YouTube URL and get a concise summary in your chosen language
- Supports multiple languages
- Modern UI with Tailwind CSS

## Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd youtube-summarizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your OpenAI API key:
     ```bash
     cp .env.example .env
     # Edit .env and set OPENAI_API_KEY
     ```

4. **Run the app:**
   ```bash
   node app.js
   # or use nodemon for development
   ```

5. **Open in your browser:**
   - Visit [http://localhost:3005](http://localhost:3005)

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI or OpenRouter API key for language model access.

## License

MIT 