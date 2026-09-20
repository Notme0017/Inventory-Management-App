# Inventory Management App

A game inventory app built with Node.js, Express, EJS and PostgreSQL. Add, edit and delete games, organize them by genre, and browse everything in a clean, light-themed interface.

## Features

- **Browse games:** the homepage lists every game as a horizontal card showing title, genre, developer and year.
- **Add a game:** a validated form with a genre dropdown and a free-text developer field.
- **Update a game:** the same form, prefilled with the game's current values.
- **Delete a game:** with a confirmation prompt.
- **Genres page:** games grouped by genre, each genre in its own box.
- **Add a genre:** genre names are unique, case-insensitively ("rpg" and "RPG" are the same genre).
- **Delete a genre:** only allowed when the genre has no games. Genres that still have games cannot be deleted, and the UI hides the button for them.
- **Developers created automatically:** typing a new developer name creates it; typing an existing one (any casing) reuses it.
- **Validation:** server-side validation with `express-validator`, with errors shown in a tinted orange box.

## Tech Stack

- **Runtime / server:** Node.js, Express
- **Views:** EJS with shared partials (navbar, errors, genre dropdown)
- **Database:** PostgreSQL via `pg` (connection pool)
- **Validation:** express-validator
- **Styling:** plain CSS (custom properties, flexbox)

## Database Schema

```
genres
  id          INTEGER  PK, generated
  name        VARCHAR(255)  NOT NULL   (unique index on LOWER(name))

developers
  id          INTEGER  PK, generated
  name        VARCHAR(255)  NOT NULL   (unique index on LOWER(name))

games
  id               INTEGER  PK, generated
  title            TEXT     NOT NULL
  genre_id         INTEGER  NOT NULL  -> genres(id)
  developer_id     INTEGER  NOT NULL  -> developers(id)
  year_of_release  INTEGER
```

Design notes:

- Genre and developer are separate tables linked by foreign keys. Year stays a plain column on `games`.
- Adding or updating a game runs in a **transaction**: the developer is found or created, then the game row is written, so the two succeed or fail together.
- The foreign key on `genre_id` acts as a safety net that blocks deleting a genre still in use. The app also checks first to show a friendly message.

## Routes

| Method | Path | Description |
|---|---|---|
| GET | `/` | List all games |
| GET | `/create` | Add game form |
| POST | `/create` | Create a game |
| GET | `/update/:id` | Update form, prefilled |
| POST | `/update/:id` | Update a game |
| POST | `/delete/:id` | Delete a game |
| GET | `/genres` | Games grouped by genre |
| GET | `/genres/add` | Add genre form |
| POST | `/genres/add` | Create a genre |
| POST | `/genres/delete/:id` | Delete a genre (blocked if it has games) |

## Project Structure

```
.
├── app.js
├── controllers/
│   ├── operationsController.js   # game CRUD handlers
│   └── genreController.js        # genre handlers
├── db/
│   ├── pool.js                   # pg connection pool
│   ├── queries.js                # all SQL queries
│   └── populatedb.js             # schema + seed script
├── routes/
│   ├── operationsRouter.js
│   └── genreRouter.js
├── views/
│   ├── index.ejs
│   ├── addGame.ejs
│   ├── updateGame.ejs
│   ├── genres.ejs
│   ├── addGenre.ejs
│   └── partials/
│       ├── nav.ejs
│       ├── errors.ejs
│       └── genre.ejs
└── public/
    └── styles.css
```

## Getting Started

### Prerequisites

- Node.js
- A running PostgreSQL instance and an empty database

### Installation

```bash
git clone <your-repo-url>
cd Inventory-Management-App
npm install
```

### Configuration

Create a `.env` file in the project root with your database settings (never commit this file):

```
DATABASE_URL=postgresql://<user>:<password>@localhost:<port>/<your_database>
```

Match these names to whatever `db/pool.js` reads.

### Seed the database

```bash
node db/populatedb.js "postgresql://user:password@localhost:5432/your_database"
```

**Warning:** the seed script drops and recreates the `games`, `genres` and `developers` tables, so running it again erases existing data.

### Run the app

```bash
node app.js
```

Then open `http://localhost:8080`.

## Possible Future Improvements

- Game descriptions: add a `description TEXT` column to `games`, and open a detail view by clicking a card.
- Authentication, so only logged-in users can add, edit or delete.
- Developer management page (view and delete unused developers).
- Reassign games to another genre before deleting a genre.
- Retain form input after a failed validation.