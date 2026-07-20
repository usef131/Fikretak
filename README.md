# Fikretak – Youth & Investors Platform

## Overview
**Fikretak** is a web-based platform that connects young entrepreneurs who have innovative project ideas with investors who are looking for promising opportunities to fund and support.

The platform aims to bridge the gap between ideas and investment by providing a space for collaboration, mentorship, and funding discovery.

---

## Problem Statement
Many young people have creative and valuable business ideas but face major challenges such as:
- Lack of funding
- Limited access to experienced mentors
- Difficulty reaching potential investors

At the same time, many investors struggle to find organized, reliable, and innovative startup ideas to invest in.

---

## Solution
Fikretak solves this problem by:
- Allowing entrepreneurs to showcase their ideas clearly and professionally
- Helping investors browse, filter, and discover projects easily
- Creating a bridge between ideas, funding, and professional guidance

---

## Target Users
- **Entrepreneurs:** Young people with startup ideas who need funding or advice
- **Investors:** Individuals or groups looking to invest in innovative projects

---

## Key Features (MVP)
- User registration and login (JWT auth, role selection: Entrepreneur / Investor)
- Project idea submission, editing, and browsing with search / filter / sort / pagination
- Investor "express interest" and investment interest flow
- Social feed: posts, likes, comments
- Follow / following system
- User profiles (entrepreneur & investor variants)

---

## Tech Stack
- **Frontend:** React 18, Vite, React Router, React-Bootstrap, Framer Motion
- **Backend:** Node.js, Express, JWT, bcryptjs
- **Database:** MongoDB (Mongoose)

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a connection string)

### Backend
```bash
cd backend
cp .env.example .env        # then fill in real values
npm install
npm run seed                # optional: seed sample data
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```
The Vite dev server proxies `/api` to `http://localhost:5002`.

---

## Environment Variables (`backend/.env`)
| Key | Description |
|-----|-------------|
| `PORT` | API port (default 5002) |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Allowed frontend origin (CORS) |
| `JWT_SECRET` | Long random secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |

> **Never commit `.env`.** It is git-ignored; use `.env.example` as the template.

---

## Team
Beshoy Hany Mikhael · Youssef Ahmed Ibrahim · Ahmed Ibrahim Abouabdou · Mahmoud Mostafa Elsonbaty · Rama Daif Allah · Hana Ali

---

## Future Enhancements
- Real-time messaging between users
- Email verification & password reset
- Online funding / payments
- Project rating and review system
- Notifications
