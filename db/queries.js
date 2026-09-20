const pool = require("./pool");

async function getAllGames(){
  const {rows} = await pool.query(`
    SELECT g.id, g.title, g.year_of_release,
      ge.name AS genre,
      d.name AS developer
    FROM games g
    JOIN genres ge ON g.genre_id = ge.id
    JOIN developers d ON g.developer_id = d.id
    ORDER BY g.title
    `);
  return rows;
}

async function getGameById(id) {
  const {rows} = await pool.query(`
    SELECT g.id, g.title, g.year_of_release,
      ge.name AS genre,
      d.name AS developer
    FROM games g
    JOIN genres ge ON g.genre_id = ge.id
    JOIN developers d ON g.developer_id = d.id
    WHERE g.id = $1;
    `, [id]);
    return rows[0];
}

async function addGame({title, genre_id, developer, year_of_release}) {

  const client = await pool.connect();

  try{
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO developers (name) VALUES ($1)
      ON CONFLICT (LOWER(name)) DO UPDATE SET name = developers.name
      RETURNING id`,
      [developer.trim()]
    );
    const developer_id= rows[0].id;

    await client.query("INSERT INTO games (title, genre_id, developer_id, year_of_release) VALUES ($1, $2, $3, $4)", [title, genre_id, developer_id, year_of_release]);

    await client.query("COMMIT");
  }catch(err){
    await client.query("ROLLBACK");
    throw(err);
  }finally{
    client.release();
  }
}

async function updateGame(id, {title, genre_id, developer, year_of_release}) {
  const client = await pool.connect();

  try{
    await client.query("BEGIN");

    const {rows} = await client.query(
      `INSERT INTO developers (name) VALUES ($1)
      ON CONFLICT (LOWER(name)) DO UPDATE SET name = developers.name
      RETURNING id`, [developer.trim()]
    );

    const developer_id = rows[0].id;

    await client.query(
      `UPDATE games 
      SET title = $1,
          genre_id = $2,
          developer_id = $3,
          year_of_release = $4
      WHERE id = $5`, 
      [title, genre_id, developer_id, year_of_release, id]
    );
    await client.query("COMMIT");
  }catch(err){
    await client.query("ROLLBACK");
    throw err;
  }finally{
    client.release();
  }
}

async function deleteGameById(id) {
  await pool.query(`DELETE FROM games g WHERE g.id = $1`, [id]);
}

// cols
async function getAllGenres() {
  const {rows} = await pool.query("SELECT id, name FROM genres;");
  return rows;
}

module.exports = {getAllGames, 
                  getGameById, 
                  addGame, 
                  updateGame, 
                  deleteGameById,
                  getAllGenres};