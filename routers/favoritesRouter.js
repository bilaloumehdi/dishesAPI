const favoritesRouter = require('express').Router();
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');
const {
    getFavorites,
    addFavorites,
    modifyFavorites,
    deleteFavorites,
    addFavorite,
    modifyFavorite,
    deleteFavorite } = require('../controllers/favorites');


favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, getFavorites)
    .post(cors.corsWithOptions, authenticate.verifyUser, addFavorites)
    .put(cors.corsWithOptions, authenticate.verifyUser, modifyFavorites)
    .delete(cors.corsWithOptions, authenticate.verifyUser, deleteFavorites)


favoritesRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .post(cors.corsWithOptions, authenticate.verifyUser, addFavorite)
    .put(cors.corsWithOptions, authenticate.verifyUser, modifyFavorite)
    .delete(cors.corsWithOptions, authenticate.verifyUser, deleteFavorite)


module.exports = favoritesRouter;