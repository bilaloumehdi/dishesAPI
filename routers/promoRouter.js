const express = require('express');
const mongoose = require('mongoose');
const promoRouter = express.Router();
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const {
    getPromotions,
    ModifyPromotions,
    addPromotions,
    deletePromotion,
    getPromotion,
    ModifyPromotion,
    addPromotion,
    deletePromotions } = require('../controllers/promotions');

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, getPromotions)
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, addPromotions)
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, ModifyPromotions)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deletePromotions);

// /:promId endpoint 
promoRouter.route('/:promoId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, getPromotion)
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, ModifyPromotion)
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, addPromotion)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deletePromotion);


module.exports = promoRouter;