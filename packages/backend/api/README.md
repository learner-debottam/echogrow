# EchoGrow Backend Auth API

## Endpoints

### POST /api/auth/signup
- Registers a new user.
- Body: `{ email: string, password: string, full_name?: string }`
- Response: `{ user }` or `{ error }`

### POST /api/auth/login
- Authenticates a user.
- Body: `{ email: string, password: string }`
- Response: `{ access_token, user }` or `{ error }`

### GET /api/auth/profile
- Fetches the authenticated user's profile.
- Header: `Authorization: Bearer <JWT>`
- Response: `{ profile }` or `{ error }`
