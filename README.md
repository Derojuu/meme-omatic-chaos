🎴 MemeCard – Multiplayer Meme Card Game

MemeCard is a real-time multiplayer meme reaction game built with Next.js, React, Node.js, PostgreSQL, and Socket.IO.

Players join a game room, take turns setting funny situations, and respond with meme cards from their hand. Everyone votes on the funniest response – laughter guaranteed 😂.

✨ Features

🔑 Create & Join Rooms – share a unique code with friends

🎭 Player-Set Situations – one player per round sets a scenario

🎴 Meme Card Hands – each player gets random meme cards to play

🔥 Real-Time Gameplay – cards, votes, and scores update live

🏆 Scoring System – funniest meme wins the round

📱 Mobile-First UI – optimized for quick play on phones

🎮 Game Flow

Lobby – One player creates a room, others join with the code.

Round Start – A Leader is chosen, types a funny situation.

Play Phase – Other players drop a meme card from their rack.

Reveal & Voting – Cards flip, everyone votes for the funniest.

Scoring – Winner gets a point, Leader rotates, next round begins.

🛠 Tech Stack

Frontend: Next.js, React, TailwindCSS

Backend: Node.js (API Routes), Socket.IO for realtime

Database: PostgreSQL (Supabase for hosting)

Hosting: Vercel (frontend) + Supabase (backend/DB)

📊 Database Schema

Games → tracks game sessions
Players → player info, scores, hands
Rounds → situations + round winners
Plays → submitted meme cards + votes
MemeCards → stored meme assets

🚀 Getting Started
Prerequisites

Node.js 18+

PostgreSQL (local or Supabase)

Installation
git clone https://github.com/yourusername/memecard.git
cd memecard
npm install

Database Setup (Prisma Example)
npx prisma migrate dev --name init
npx prisma db seed

Running the App
npm run dev


App runs on http://localhost:3000
 🎉

🔮 Future Plans

Custom meme uploads

Emoji reactions + live chat

AI-generated situations

Global leaderboard

🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss.

📜 License

MIT License – free to use, modify, and share.
