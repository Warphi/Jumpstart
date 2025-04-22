# Jumpstart
[Project Trello](https://trello.com/b/aPryBw0U) & [DEPP Plan](https://docs.google.com/document/d/1sSkQtH8CpjV5AQ0ZSib9x_biALDgjlfDbpphQgzfmD4/edit?usp=sharing)

## Configuration Management

### Branching Strategy
- `main` (Production-ready code)
- `develop` (Integration branch for new features)
- `feature/*` (Feature development branches)
- `bugfix/*` (Bug fixes before merging into `develop`)
- `hotfix/*` (Critical fixes merged into `main`)

### Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit and push changes: `git commit -m "Add new feature"` -> `git push origin feature/your-feature`
3. Create a Pull Request to `develop`
4. Request a code review and merge once approved

### Running backend
Make sure you have Node.js installed and access to the database.

1. Navigate to backend/
2. Install dependencies with `npm install`
3. Create .env in backend/ from .env.example
4. Replace the MongoDB URI and Token secret with your own.
5. User `npm start` or `npm run dev` for development.
6. Interact using Postman, going to http://localhost:[port], or through frontend.

### Endpoints

#### POST /auth/register
Register a new user.

**Request Body (JSON):**
```json
{
  "email": "jack@jumpstart.com",
  "password": "yourPassword123"
}
```

#### POST /auth/login
Login a user.

**Request Body (JSON):**
```json
{
  "email": "jack@jumpstart.com",
  "password": "yourPassword123"
}
```