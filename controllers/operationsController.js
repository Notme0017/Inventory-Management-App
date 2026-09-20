const { getAllGames, getAllGenres, getGameById, addGame, updateGame, deleteGameById } = require("../db/queries")
const {body, validationResult, matchedData} = require("express-validator");

const validateGame = [
  body("title").trim()
      .isLength({min: 1}).withMessage(`Title cannot be empty`),
  
  body("genre_id")
      .isInt({min: 1}).withMessage("Please select a genre")
      .toInt(),

  body("developer").trim()
      .notEmpty().withMessage('Developer cannot be empty').bail()
      .isLength({max: 255}).withMessage("Developer name is too long"),

  body("year_of_release").trim()
      .isLength({min: 4}).withMessage("Enter a year")
      .isInt({min: 1900, max: new Date().getFullYear()}).withMessage(`Select a valid year between 1900 and ${new Date().getFullYear()}`)
      .toInt(),

];

exports.gameListGet = async (req, res, next) =>{
  try{
    const games = await getAllGames();

    res.render("index", {
      title: "Games",
      games: games,
    })
  }catch(err){
    next(err);
  }
};

exports.gameAddGet = async(req, res, next) =>{
  try{
    const genres = await getAllGenres();
    
    res.render("addGame", {
      title: "Add Games",
      genres: genres
    });
  }catch(err){
    next(err);
  }
};

exports.gameAddPost = [
  validateGame,
  async (req, res, next) =>{
    try{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        const genres = await getAllGenres();
        return res.status(400).render("addGame", {
          title: "Add Games",
          errors: errors.array(),
          genres: genres,
        });
      }
  
      const {title, genre_id, developer, year_of_release} = matchedData(req);
      await addGame({title, genre_id, developer, year_of_release});
      res.redirect("/");
    }catch(err){
      next(err);
    }
  },
];

exports.gameUpdateGet = async (req, res, next) =>{

  try{
    const genres = await getAllGenres();
    const id = +req.params.id;
    const game = await getGameById(id);
    res.render("updateGame", {
      title: "Update Game",
      game: game,
      genres: genres,
    });
  }catch(err){
    next(err);
  }
};

exports.gameUpdatePost = [
  validateGame,
  async(req, res, next) =>{
    try{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        const game = await getGameById(req.params.id);
        return res.status(400).render("updateGame", {
          title: "Update Game",
          game: game,
          genres: genres,
          errors: errors.array()
        });
      }

      const {title, genre_id, developer, year_of_release} = matchedData(req);
      await updateGame(req.params.id, {title, genre_id, developer, year_of_release});
      res.redirect("/");
    }
    catch(err){
      next(err);
    }
  }
];

exports.gameDeletePost = async (req, res, next) =>{
  try{
    deleteGameById(req.params.id);
    res.redirect("/");
  }catch(err){
    next(err);
  }
};