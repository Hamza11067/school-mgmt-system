# Project Context: School Management System

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS
- **State Management:** React Context API (AuthContext for user sessions)
- **Backend:** Node.js with Express
- **Database:** PostgreSQL (managed via pgAdmin)

## Core Database Schema
### Attendance Table
- `id`: Primary Key (UUID/Serial)
- `student_id`: Foreign Key (references students)
- `attendance_date`: Date (ISO format)
- `status`: String/Enum (Present, Absent, Late)
- `remarks`: Text (optional)

## Project Architecture & Preferences
- **Routing:** React Router for navigation.
- **Components:** Functional components with Hooks.
- **Styling:** Mobile-first responsive design using Tailwind utility classes.
- **Code Style:** Prioritize clean, modular components and dry (Don't Repeat Yourself) logic.
- **Security:** Use `.env` for sensitive credentials (ensure `.env` is in `.gitignore`).

## Active Tasks
1. Implementing Student CRUD operations.
2. Finalizing the date-based attendance tracking system.
3. Enhancing the UI with motion-animated transitions.

## Instructions for Gemini
- When suggesting code, use **Vite-compatible** syntax (no Create React App).
- Always include Tailwind CSS classes for styling.
- Assume the use of modern ES6+ features.
- If suggesting SQL, provide PostgreSQL-compatible queries.