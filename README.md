# Haven - 

Haven is a full-stack web application designed to serve as a cozy digital library. Imagine Notion meets Goodreads and Letterboxd, but away from all the junk that makes it feel like a social media abyss. 
I want a simple and intuitive interface for users to track and engage with creative media (movies, books, etc.), share theri favourites, and write down theri thoughts. I want this to feel like a personal space, but a clogged social media drain.



## Current Features

*   **User Authentication:** Secure user registration and login.
*   **Search:** Search for books/movies using an external API (likely Google Books or similar).
*   **Library Management:** Add items to a personal library, view the library, and potentially update/delete entries.

## Tech Stack

*   **Backend:** Python, Flask, SQLAlchemy, PostgreSQL (implied by migrations)
*   **Frontend:** React, TypeScript, Tailwind CSS

## Technical Details

*   **Backend Framework:** Flask with Flask-SQLAlchemy for ORM and Flask-Migrate for database migrations.
*   **Database:** PostgreSQL (as configured in `config.py`)
*   **Authentication:** JWT-based authentication using Flask-JWT-Extended. Passwords hashed using `werkzeug.security`.
*   **Data Validation:** Pydantic schemas used for request/response validation in API routes.
*   **External APIs:** Uses the Open Library Search API (`openlibrary.org`) for searching books and retrieving metadata/cover images.
*   **Search Logic:** Combines results from the local database and the external Open Library API, prioritizing local entries and avoiding duplicates based on ISBN.
*   **Configuration:** Managed via environment variables loaded using Pydantic `BaseSettings`.
*   **Database Schema:** Includes tables for `User`, `Book`, and `LibraryEntry` (joining Users and Books with reading status, rating, notes).

## Workflow / Frontend-Backend Interaction

The application follows a standard client-server model where the React frontend communicates with the Flask backend via a RESTful API (likely prefixed with `/api`). Authentication is handled using JWTs, which the frontend must include in the `Authorization` header for protected endpoints.

**1. User Registration:**
   - **FE:** User submits username, email, and password via a registration form.
   - **FE -> BE:** Sends `POST /api/auth/register` with user data.
   - **BE:** Validates input using `UserCreate` schema. Checks if username/email already exists. Hashes the password. Creates a new `User` record in the database.
   - **BE -> FE:** Returns `201 Created` with public user data (`UserPublic` schema) on success, or an error (e.g., `409 Conflict`) if the user exists.
   - **FE:** Displays success/error message, may redirect to login page.

**2. User Login:**
   - **FE:** User submits email and password via a login form.
   - **FE -> BE:** Sends `POST /api/auth/login` with credentials.
   - **BE:** Validates input using `UserLogin` schema. Finds the user by email. Verifies the password hash using `user.check_password()`.
   - **BE -> FE:** Returns `200 OK` with a JWT access token on success, or `401 Unauthorized` on failure.
   - **FE:** Stores the JWT (e.g., in local storage). Updates application state to reflect logged-in status. Redirects to a protected area (e.g., dashboard or library).

**3. Searching for Books:**
   - **FE:** User types a query into a search bar.
   - **FE -> BE:** Sends `GET /api/search/books?query={search_term}` (including the JWT in `Authorization: Bearer <token>` header).
   - **BE:** Verifies JWT. Searches the local `books` table based on title/author. Calls the external Open Library API (`services/book_api.py`) for more results. Filters external results if the book (by ISBN) already exists locally. Combines and formats results.
   - **BE -> FE:** Returns `200 OK` with a list of book objects (containing metadata, cover URL, and source - 'local' or 'external').
   - **FE:** Displays the list of search results to the user.

**4. Adding a Book to Library:**
   - **FE:** User clicks an "Add" button on a book from the search results.
   - **FE -> BE:** Sends `POST /api/library/entries` (including JWT) with data identifying the book (e.g., `local_book_id` or `external_id`, title, author, ISBN, etc.).
   - **BE:** Verifies JWT. Validates input (using `LibraryEntryCreate` schema - *assumed*). Checks if the book (by ISBN or external ID) exists in the local `books` table. If not, creates a new `Book` record using the provided/fetched data. Creates a new `LibraryEntry` record linking the `user.id` and the `book.id`, setting a default status (e.g., 'Want to Read').
   - **BE -> FE:** Returns `201 Created` with the details of the newly created library entry, or an error (e.g., `409 Conflict` if the entry already exists).
   - **FE:** Displays a confirmation message. May update the UI to reflect the book being in the library.

**5. Viewing Personal Library:**
   - **FE:** User navigates to their library page.
   - **FE -> BE:** Sends `GET /api/library/entries` (including JWT).
   - **BE:** Verifies JWT. Fetches all `LibraryEntry` records associated with the `user.id` from the database, potentially joining with `Book` data to include book details.
   - **BE -> FE:** Returns `200 OK` with a list of the user's library entries (including book details and status).
   - **FE:** Renders the list of books in the user's library, grouped by status or with filtering options.

*(Note: Update/Delete operations on library entries would follow a similar pattern using `PUT/PATCH` or `DELETE` requests to `/api/library/entries/{entry_id}`)*
