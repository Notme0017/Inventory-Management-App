const { Client } = require("pg")

const SQL = `

DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS developers;

CREATE TABLE genres(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE developers(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE UNIQUE INDEX developers_name_lower_idx ON developers (LOWER(name));

CREATE TABLE IF NOT EXISTS games(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  genre_id INTEGER NOT NULL REFERENCES genres(id),
  developer_id INTEGER NOT NULL REFERENCES developers(id),
  year_of_release INTEGER
);

INSERT INTO genres(name) 
VALUES
  ('Open World'), 
  ('RPG'), 
  ('Platformer');

INSERT INTO developers (name)
VALUES
  ('FromSoftware');

INSERT INTO games(title, genre_id, developer_id, year_of_release)
VALUES
  ('Elden Ring', 
  (SELECT id FROM genres WHERE name = 'Open World'),
  (SELECT id FROM developers WHERE name = 'FromSoftware'),
  '2022'
  );
`;

async function main() {
  const connectionString = process.argv[2];

  if(!connectionString){
    console.error("Use: node db/populatedb.js <connection-string>");
    process.exit(1);
  }

  console.log("seeding...");
  const isLocal = connectionString.includes("localhost");
  const client = new Client({
    connectionString,
    ssl: isLocal? false: {rejectUnauthorized: false},
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done");
}

main().catch((err) =>{
  console.error(err);
  process.exit(1);
});