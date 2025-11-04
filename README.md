# Book Catalog App

A full-stack **Book Catalog** application built with **Next.js**, **React**, **NextAuth**, **Prisma**, and **Google Sign-In** for authentication. Users can manage their book collection, including adding, viewing, deleting, and filtering books.

---

## Features

- User authentication with **NextAuth**:
  - Google OAuth Sign-In
  - Email & Password login via Credentials Provider
- **Book Management**:
  - Add, view, and delete books
  - Filter books by title, author, or genre
  - Only shows books associated with the logged-in user
- **Responsive UI**:
  - Works on both desktop and mobile
  - Styled with Tailwind CSS
- **Server-side and Client-side authentication checks** to protect routes

---

### How Authentication Works

1. **User logs in**
   - User can log in using **Email & Password** (Credentials Provider)
   - OR sign in using **Google account** (Google Provider)

2. **NextAuth verifies the credentials**
   - If using credentials, the email & password are checked in the database (hashed passwords using bcrypt)
   - If using Google, NextAuth receives user info via Google OAuth callback

3. **User session created using JWT**
   - Session strategy is `jwt` so no server-side session storage is needed
   - The JWT token contains user details including `id`, `email`, and `name`

4. **User ID is attached to JWT callback**
   - Ensures API routes can fetch authenticated user data
   - This allows restricting book records to only logged-in users

5. **Protected Routes**
   - Users cannot access `/book` or API routes without authentication
   - Middleware checks session before allowing access

6. **Logout**
   - Clicking logout clears the session and redirects user to the login page



## Setup Instructions (Local Development)

1. **Clone the repository**:

```bash
git clone https://github.com/haroon64/book-catalog-app-Scaylar-Assessment.git
cd book-catalog-app
````
2. **Install dependencies:

```bash
npm install

```
3. **Setup Prisma
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
4. Create .env local file at the root of the project:
  
  DATABASE_URL="postgresql://neondb_owner:npg_mPZyFeNBg01h@ep-cool-rice-ae0ja3t8-pooler.c-2.us-east-2.aws.neon.tech/Book-catalog-db?sslmode=require&channel_binding=require"
  NEXTAUTH_URL="http://localhost:3000"
  NEXTAUTH_SECRET="1/hhkr4xY2MotyV2hHILnZN6sogDQz+NSnwp5teaAJc="
  GOOGLE_CLIENT_ID="969864524820-jbsieu66rn3nq08gr28k1tjnd75c4uvh.apps.googleusercontent.com"
  GOOGLE_CLIENT_SECRET="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"
  NEXT_PUBLIC_BASE_URL=http://localhost:3000
  NODE_ENV="production"
5. Run the development server
   ```bash
   npm run dev
   ```
6. Open your browser and visit:
   http://localhost:3000

