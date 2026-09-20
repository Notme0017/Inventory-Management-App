const { getGamesByGenre, deleteGenreById, countGamesInGenres, addGenre } = require("../db/queries")
const {body, validationResult, matchedData} = require("express-validator");

const validateGenre = [
  body("genre")
  .trim()
  .notEmpty().withMessage("Genre cannot be empty").bail()
  .isLength({ max: 255 }).withMessage("Genre name is too long").bail()
  .matches(/^[A-Za-z0-9 '&\/-]+$/).withMessage("Genre can only contain letters, numbers, spaces and - ' & /"),
]

exports.getGamesByGenre = async(req, res, next) =>{
  try{
    const genres = await getGamesByGenre();
    if(genres.length === 0) res.redirect("/");

    res.render("genres", {
      title: "Genres",
      genres: genres
    });
  }catch(err){
    throw(err);
  }
};

exports.deleteGenreByIdPost = async(req, res, next) =>{
  try{
    const id = req.params.id;

    const count = await countGamesInGenres(id);
    if(count > 0){
      const genres = await getGamesByGenre();
      return res.status(400).render("genres",
        {title: "Genres",
        genres: genres,
        errors: [{msg: "Can't delete a genre that still has games."}],}
      );
    }
    await deleteGenreById(req.params.id);
    res.redirect("/genres");
  }catch(err){
    next(err);
  }
};

exports.addGenreGet = async(req, res, next) =>{
  try{
    res.render("addGenre", {
      title: "Add Genre",
    });
  }catch(err){
    next(err);
  }
}

exports.addGenrePost = [
  validateGenre,
  async (req, res, next) =>{
    try{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).render("addGenre",{
          title: "Add Genre",
          errors: errors.array(),
        });
      }
      const genre = req.body.genre;
      await addGenre(genre);
      res.redirect("/");
    }catch(err){
      next(err);
    }
  }
]