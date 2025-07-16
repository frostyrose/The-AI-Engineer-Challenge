# Front End

## How to Run Locally

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to use the app.

## Features
- Retrowave-themed, dark mode chat interface
- Enter your OpenAI API key (kept private in your browser)
- Enter a developer message and a user message
- Streams responses from the backend in real time

## Notes
- The frontend connects to the backend at `/api/chat` (make sure your backend is running)
- For best results, run both the backend and frontend locally
- The UI is optimized for clarity, accessibility, and a pleasant user experience
