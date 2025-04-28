# NC News API

# NC News Backend

A RESTful API for the NC News application, allowing users to post, comment on, and like articles. Built with Node.js, Express, and PostgreSQL/NoSQL, this server-side application provides all necessary endpoints to support a dynamic frontend.

Front-end: https://roaring-churros-864840.netlify.app/
Back-end: https://ncnews-clfh.onrender.com/api


Table of Contents

- Features
- Tech Stack
- Prerequisites
- Installation
- Environment Variables
- Database Setup
- Running the Server
- Testing
- API Endpoints

 Features

- Create, read, update, and delete articles
- Post, edit, and delete comments
- Upvote/downvote articles and comments
- Pagination, sorting, and filtering of results

Tech Stack

- Runtime & Framework: Node.js, Express
- Database: PostgreSQL (via `pg`)
- Testing: Jest, Supertest, jest-extended, jest-sorted
- Code Quality: ESLint, Husky Git hooks
- Deployment: Supabase

Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [PostgreSQL](https://www.postgresql.org/) v12 or higher
- npm

Installation

Clone the repository:

   git clone https://github.com/kennethogbeifun/be-nc-news.git
   cd be-nc-news
   
Install dependencies:
   
   npm install

 Environment Variables

TO use this API, two .env files must be made.
.env.test and .env.development
Copy into the .env.development file the line PGDATABASE=nc_news
and the line PGDATABASE=nc_news_test into .env.test

Database Setup

Initialize the PostgreSQL database schema and seed with sample data:


npm run setup-dbs
npm run seed


Running the Server

- Development Mode (with hot reload):
  
  npm run dev
  
- Production Mode**:
  
  npm start
  

Server will be accessible at `http://localhost:<PORT>`.

## Testing

Run the full test suite with:

npm test


Tests cover endpoints behavior, error handling, and data integrity.

API Endpoints

app.get("/api", getListOfEndpoints);

app.get("/api/topics", getListOfTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);




TO use this API, two .env files must be made.
.env.test and .env.development
Copy into the .env.development file the line PGDATABASE=nc_news
and the line PGDATABASE=nc_news_test into .env.test

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
