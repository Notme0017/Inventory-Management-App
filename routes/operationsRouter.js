const {Router} = require('express');
const { gameListGet, gameAddGet, gameAddPost, gameUpdateGet, gameUpdatePost, gameDeletePost } = require('../controllers/operationsController');

const operationsRouter = Router();

operationsRouter.get("/", gameListGet);
operationsRouter.get("/create", gameAddGet);
operationsRouter.post("/create", gameAddPost);
operationsRouter.get("/update/:id", gameUpdateGet);
operationsRouter.post("/update/:id", gameUpdatePost);
operationsRouter.post("/delete/:id", gameDeletePost);

module.exports = operationsRouter;