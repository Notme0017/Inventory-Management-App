const {Router} = require("express");
const {getGamesByGenre, deleteGenreByIdPost, addGenreGet, addGenrePost} = require("../controllers/genreController");
const genreRouter = Router();

genreRouter.get("/", getGamesByGenre);
genreRouter.get("/add", addGenreGet);
genreRouter.post("/add", addGenrePost);
genreRouter.post("/delete/:id", deleteGenreByIdPost);

module.exports = genreRouter;