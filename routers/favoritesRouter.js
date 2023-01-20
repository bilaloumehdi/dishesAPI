const favoritesRouter = require('express').Router();
const Favorites = require('../models/favorites');
const Dish = require('../models/dishes');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');
const favorites = require('../models/favorites');
favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                return res.status(200).json({ success: true, status: favorites });
            })
    }).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // if the user has already favorites 
        const dishArray = [...req.body];

        if (dishArray.length == 0) {
            return res.status(200).json({ success: true, status: 'there is no dishes to add' })
        }
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                let doesDishExists ;
                let dishNotFound = false ;
                if (favorites) {
                    //dish does exist ?
                    dishArray.forEach(dish => {
                    
                        doesDishExists = favorites.dishes.indexOf(dish._id);
                        if (doesDishExists !== -1) {
                            return;
                        }
                        Dish.findById(dish._id)
                            .then(dish => {
                                if (!dish) {      
                                    dishNotFound =true ;              
                                    return ;
                                }
                            })
                    })
                    if (doesDishExists !== -1) {
                        return res.status(400).json({ success: false, status: `Dish(s) already exists` })
                    }
                    if (dishNotFound){
                        return res.status(404).json({ success: false, status: 'One of the dishes does not exist' })
                    }
                    favorites.dishes.push(...dishArray);
                    favorites.save()
                        .then(favorite => {
                            Favorites.findOne({ user: favorite.user })
                                .then(favorites => {
                                    return res.status(200).json(favorites);
                                })
                        }).catch(err => {
                            next(err)
                        })
                } // the user does not have any favorites yet 
                else {
                    let favorites = new Favorites();
                    favorites.user = req.user._id;
                    dishArray.forEach(dish => {
                        Dish.findById(dish._id)
                            .then(dish => {
                                if (!dish) {
                                    return res.status(404).json({ success: true, status: 'one of dishes does not exist' });
                                }
                            })
                    })
                    favorites.dishes.push(...dishArray);
                    favorites.save()
                        .then(favorite => {
                            Favorites.findOne({ user: favorite.user })
                                .then(favorites => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    return res.json(favorites);
                                })
                        })
                }
            })
    }).put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.send(`Put operation not supported on /favorites`)
    }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.deleteMany({ user: req.user._id })
            .then((favorites) => {
                return res.status(200).json({ success: true, status: 'favorites are deleted successfully' })
            }).catch(error => {
                error = new Error('dishes does not deleted from favorites ');
                err.status = 500;
                return next(err);
            })
    })
favoritesRouter.route('/:dishId')
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // verify if the dish exists
        Dish.findById(req.params.dishId)
            .then(dish => {
                if (!dish) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                // verify if the dish is already in the user favorites
                Favorites.findOne({ user: req.user._id })
                    .then(favorites => {
                        if (favorites) {
                            const doesDishExists = favorites.dishes.indexOf(req.params.dishId);

                            if (doesDishExists !== -1) {
                                err = new Error('Dish ' + req.params.dishId + ' already exists');
                                err.status = 400;
                                return next(err);

                            } else {
                                favorites.dishes.push(req.params.dishId);
                                favorites.save()
                                    .then(favorites => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        return res.json(favorites);
                                    })
                            }
                        }// the user has no favorites yet
                        else {
                            let favorite = new Favorites();
                            favorite.user = req.user._id;
                            favorite.dishes.push(req.params.dishId);

                            favorite.save()
                                .then(favorite => {

                                    Favorites.findOne({ user: favorite.user })
                                        .then(favorites => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            return res.json(favorites);
                                        })
                                })
                        }
                    })
            })
    }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({user: req.user._id})
        .then(favorites => {
            favorites.dishes.remove(req.params.dishId);
            favorites.save()
                .then(favorites => {
                    return res.status(200).json({ success: true, status: favorites })
                })
        })
    })


module.exports = favoritesRouter;