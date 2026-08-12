Full-Stack Task Manager
A full-stack task management web application built with React, Flask, and SQLite. The application allows users to organize projects, create and manage tasks, track deadlines, assign priorities, and filter tasks through an interactive dashboard.
Features
Create and delete projects
Create, edit, and delete tasks
Mark tasks as completed
Assign tasks to specific projects
Set task priorities:
Low
Medium
High
Add due dates
Search tasks by name or project
Filter tasks by completion status
Filter tasks by priority
Dynamic dashboard statistics
Number of projects
Number of tasks
Number of completed tasks
Persistent data storage using SQLite
Responsive React interface
REST API communication between the frontend and backend
Tech Stack
Frontend
React
JavaScript
JSX
CSS
Vite
Backend
Python
Flask
Flask-CORS
Flask-SQLAlchemy
Database
SQLite
SQLAlchemy ORM
Development Tools
Git
GitHub
Visual Studio Code
Linux
npm
Python virtual environments
Project Structure
task-manager/


│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ProjectList.jsx
│   │   │   └── TaskList.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   └── app.py
│
├── .gitignore
└── README.md




How It Works
The application uses a React frontend that communicates with a Flask REST API.
React Frontend
      ↓
   REST API
      ↓
Flask Backend
      ↓
SQLAlchemy
      ↓
SQLite Database

When a user creates, edits, completes, or deletes a task, the React frontend sends a request to the Flask backend. Flask processes the request and updates the SQLite database.
The updated information is then returned to React and displayed in the user interface.
API Endpoints
Projects
GET     /api/projects
POST    /api/projects
DELETE  /api/projects/<project_id>

Tasks
GET     /api/tasks
POST    /api/tasks
PATCH   /api/tasks/<task_id>
DELETE  /api/tasks/<task_id>

Health Check
GET /api/health

Running the Project Locally
1. Clone the repository
git clone https://github.com/ramarthomas25/Full-stack-task-manager.git

Enter the project:
cd Full-stack-task-manager

Backend Setup
Move into the backend directory:
cd backend

Create a Python virtual environment:
python3 -m venv venv

Activate it:
source venv/bin/activate

Install the required Python packages:
pip install flask flask-cors flask-sqlalchemy

Start the Flask server:
python app.py

The backend should run at:
http://127.0.0.1:5000

You can verify that the API is running by visiting:
http://127.0.0.1:5000/api/health

Frontend Setup
Open another terminal and navigate to the frontend:
cd frontend

Install dependencies:
npm install

Start the Vite development server:
npm run dev

The application should then be available at:
http://localhost:5173

Example Task
A task can include information such as:
Task: Apply to Software Engineering Internship

Project: Internship Applications

Priority: High

Due Date: August 15, 2026

Status: Active

What I Learned
Building this project gave me hands-on experience with:
Full-stack web development
Building reusable React components
Managing React state
Using React hooks such as useState and useEffect
Creating REST APIs with Flask
Sending asynchronous HTTP requests with fetch
Implementing CRUD operations
Designing relational database models
Using SQLAlchemy to interact with a database
Connecting a frontend application to a backend API
Debugging frontend and backend applications
Using Git and GitHub for version control
Future Improvements
Potential improvements include:
User registration and login
Secure authentication
Individual user accounts
Task descriptions
Project editing
Sorting by deadline
Overdue task indicators
Dark mode
Production deployment
PostgreSQL database support
Author
Ramar Thomas
Computer Science Student at Norfolk State University
GitHub: ramarthomas25
