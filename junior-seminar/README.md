# MyBookShelf
MyBookShelf is a smart bookshelf web app designed for readers to search, organize, reflect, and track their reading journeys. It features AI-generated reflection prompts, book recommendations, and custom bookshelf organization powered by Gemini, Redis caching, and Google Books API.

## 🔗 Links
- Live App: [Insert in week 9](insert in week 9)
- Demo Video: [Watch on Loom](Insert in week 9)
- Final Presentation: View Slides](Insert in week 9)
- 📁 Frontend Repo [(GitHub)](https://github.com/Adaora-Igwe-MetaU-Capstone/MyBookShelf/tree/main/frontend/my-bookshelf)
- 📁 Backend Repo [(GitHub)]( https://github.com/Adaora-Igwe-MetaU-Capstone/MyBookShelf/tree/main/backend)
 ## Preview
 ## Links
Project plan [(doc)](https://docs.google.com/document/d/1g8-Vpt5ZTz0TbIbMZ1tTdJlUGBq1ECdgRArEm5Ux-DM/edit?tab=t.0)
## Features
- Search for books using Google Books API
- Add books to your personal library
- Organize books by "Currently Reading", "Want to Read", and "Finished"
- Write and read reviews from other users
- View average ratings from Google Books
- Get AI-generated reflection prompts after finishing books
- Set and track reading goals
- Receive personalized book recommendations
- View curated book sections by genre and popularity
- User authentication with session management
- Router-based navigation with protected routes
- Offline syncing
- Clean, responsive UI for desktop and mobile
- Dynamic modals for book details
- Realtime features and toast notifications for smooth UX
- Links to shop books
- more...

## 🛠️ Tech Stack
Frontend
- React + Vite
- React Router
- Toastify (Notifications)
- Custom CSS + Responsive Design

Backend
- Node.js + Express
- Redis (Prompt Cache + Index)
- Gemini API (Google GenAI)
- Prisma + PostgreSQL
- IndexDB
- dotenv for secure config

  ## ⚙️ Installation & Setup
1. Clone Repos

```bash
git clone https://github.com/Adaora-Igwe-MetaU-Capstone/MyBookShelf/tree/main/frontend/my-bookshelf
git clone https://github.com/Adaora-Igwe-MetaU-Capstone/MyBookShelf/tree/main/backend
```
2. Install Dependencies
 ```bash
bashcd my-bookshelf
npm install
cd ../backend
npm install
  ```
### 🌐 Environment Variable
Create a .env file in the root directory of the backend with the following variables:
Run App Locally
### Backend
```bash
cd backend
npm run dev
```
### Frontend
```bash
cd frontend/spot-on
npm run dev
```
## Author
Adaora Michelle Igwe
## Resources
- Google Books API https://developers.google.com/books
- Gemini API https://ai.google.dev/
- Redis: https://redis.io/
- Node.js: https://nodejs.org/en/
- Express: https://expressjs.com/
- Prisma: https://www.prisma.io/
- React Router: https://reactrouter.com/
and more..
