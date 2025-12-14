# Kata Sweet Shop Management System

A full-stack web application for managing a sweet shop inventory, built with TypeScript, Express, React, and SQLite. This project demonstrates Test-Driven Development (TDD), clean coding practices, and modern development workflows.

## 🎯 Features

### Backend API (RESTful)
- **User Authentication**: JWT-based authentication with registration and login
- **Sweets Management**: Full CRUD operations for sweets
- **Search & Filter**: Search sweets by name, category, or price range
- **Inventory Management**: Purchase and restock functionality
- **Role-Based Access**: Admin and regular user roles with appropriate permissions
- **Database**: PostgreSQL with proper schema and indexes

### Frontend Application (SPA)
- **Modern UI**: Beautiful, responsive design with gradient themes
- **User Authentication**: Login and registration pages
- **Dashboard**: Display all available sweets with real-time updates
- **Search & Filter**: Real-time search and filtering capabilities
- **Purchase Functionality**: Purchase sweets with quantity selection
- **Admin Panel**: 
  - Add new sweets
  - Edit existing sweets
  - Delete sweets
  - Restock inventory
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **Testing**: Jest with Supertest

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS3 with modern design patterns

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**

**Note**: This project uses SQLite, so no separate database server installation is required!

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Incubyte
```

### 2. Database Setup

**No manual database setup required!** SQLite database will be automatically created and initialized when you start the backend server.

The database file (`sweet_shop.db`) will be created in the `backend` directory automatically on first run.

### 3. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```bash
# Windows PowerShell
Copy-Item env.example .env

# Linux/Mac
cp env.example .env
```

4. Update the `.env` file (optional - defaults work for development):
```env
PORT=3001
DATABASE_PATH=./sweet_shop.db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Note**: The database will be automatically created at the path specified in `DATABASE_PATH` (default: `./sweet_shop.db`).

5. Start the backend server:
```bash
npm run dev
```

The backend API will be running on `http://localhost:3001`

### 4. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file if you need to customize the API URL:
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start the frontend development server:
```bash
npm start
# or
npm run dev
```

The frontend application will be running on `http://localhost:3000`

### 5. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 🧪 Running Tests

### Backend Tests

From the `backend` directory:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Frontend Tests

From the `frontend` directory:

```bash
npm test
```

## 📁 Project Structure

```
Incubyte/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   │   └── __tests__/    # Service tests
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth middleware
│   │   ├── database/         # Database connection & schema
│   │   ├── types/            # TypeScript type definitions
│   │   └── index.ts          # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React Context providers
│   │   ├── services/         # API service layer
│   │   ├── types/            # TypeScript type definitions
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Application entry point
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (Protected - Requires Authentication)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets (query params: name, category, minPrice, maxPrice)
- `GET /api/sweets/:id` - Get sweet by ID
- `POST /api/sweets/:id/purchase` - Purchase a sweet (decreases quantity)

### Admin Only
- `POST /api/sweets` - Create a new sweet
- `PUT /api/sweets/:id` - Update a sweet
- `DELETE /api/sweets/:id` - Delete a sweet
- `POST /api/sweets/:id/restock` - Restock a sweet (increases quantity)

## 👤 Default Admin User

To create an admin user:

1. Register a user through the application (at `/register`)
2. Update the user role to admin using one of these methods:

**Option A: Using SQLite CLI**
```bash
# Open the database
sqlite3 backend/sweet_shop.db

# Update the user role
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

# Exit
.quit
```

**Option B: Using a SQLite GUI tool** (like DB Browser for SQLite)
- Open `backend/sweet_shop.db`
- Run: `UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';`

## 🎨 Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Admin Panel
![Admin Panel](screenshots/admin-panel.png)

*Note: Screenshots should be added to a `screenshots/` directory in the repository.*

## 🤖 My AI Usage

### AI Tools Used

Throughout the development of this project, I utilized **GitHub Copilot** and **Claude (Anthropic)** as AI coding assistants to accelerate development and ensure code quality.

### How AI Was Used

1. **Project Structure & Boilerplate**:
   - Used AI to generate initial project structure and configuration files (package.json, tsconfig.json, vite.config.ts)
   - Generated boilerplate code for Express routes, controllers, and services
   - Created TypeScript type definitions and interfaces

2. **Test Generation**:
   - Leveraged AI to generate comprehensive unit tests for service layers (authService, sweetService)
   - Used AI suggestions for test case scenarios and edge cases
   - Generated mock data and test fixtures

3. **Code Implementation**:
   - Used AI to implement authentication middleware and JWT token handling
   - Generated database query functions with proper error handling
   - Created React components with proper TypeScript typing
   - Implemented form validation and error handling patterns

4. **UI/UX Design**:
   - Used AI suggestions for modern CSS styling and responsive design patterns
   - Generated gradient themes and color schemes
   - Created component layouts and structure

5. **Documentation**:
   - Used AI to draft README sections and API documentation
   - Generated code comments and JSDoc annotations

6. **Debugging & Refactoring**:
   - Used AI to identify and fix TypeScript type errors
   - Refactored code for better readability and maintainability
   - Optimized database queries and API endpoints

### Reflection on AI Impact

**Positive Impacts**:
- **Speed**: AI significantly accelerated the development process, especially for boilerplate code and repetitive patterns
- **Best Practices**: AI suggestions helped maintain consistent coding standards and follow industry best practices
- **Learning**: AI provided educational value by suggesting alternative approaches and explaining complex concepts
- **Error Prevention**: AI caught potential bugs and type errors early in the development process

**Challenges & Considerations**:
- **Code Review**: All AI-generated code was thoroughly reviewed and tested to ensure it met project requirements
- **Customization**: AI suggestions were customized to fit the specific needs of the project
- **Understanding**: I made sure to understand every piece of code before integrating it, rather than blindly accepting suggestions
- **Testing**: All AI-generated code was tested to ensure it works correctly in the project context

**Responsible Usage**:
- All AI-generated code was reviewed, tested, and modified as needed
- I maintained full understanding of the codebase and made architectural decisions independently
- AI was used as a tool to enhance productivity, not as a replacement for critical thinking
- All commits where AI was used include proper co-author attribution

### AI Co-Authorship

Following the project requirements, all commits where AI tools were used include co-author attribution in the commit message. Example:

```
feat: Implement user authentication endpoints

Used AI assistant to generate initial boilerplate for controllers
and services, then manually added validation logic and error handling.

Co-authored-by: GitHub Copilot <copilot@github.com>
```

## 📝 Development Workflow

This project follows Test-Driven Development (TDD) principles:

1. **Red**: Write a failing test
2. **Green**: Write the minimum code to make the test pass
3. **Refactor**: Improve the code while keeping tests green

The commit history demonstrates this pattern, especially in the backend service layer tests.

## 🚢 Deployment

### Backend Deployment

The backend can be deployed to platforms like:
- Heroku
- AWS (EC2, Elastic Beanstalk)
- Railway
- Render
- DigitalOcean

Ensure environment variables are properly configured in your deployment platform.

### Frontend Deployment

The frontend can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

Build the frontend before deployment:
```bash
cd frontend
npm run build
```

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed as part of the Incubyte TDD Kata challenge.

## 🙏 Acknowledgments

- Express.js community for excellent documentation
- React team for the amazing framework
- PostgreSQL community for robust database solutions
- All open-source contributors whose packages made this project possible

---

**Note**: This project was developed following TDD principles with AI assistance. All code has been reviewed, tested, and is production-ready.

