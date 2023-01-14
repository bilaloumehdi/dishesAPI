const express = require('express');
const mongoose = require('mongoose') ;
const promoRouter = express.Router();
const bodyParser = require('body-parser');
const authenticate = require('../authenticate') ;
// models
const Promotion =require('../models/promotions') ;
const cors = require('./cors');

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Promotion.find({})
        .then((promo)=> {
            res.statusCode = 200 ;
            res.setHeader('Content-Type','application/json')
            res.json(promo)
        },(err)=> next(err))
        .catch(err => {
            console.log('error ',err.messag)
            next(err)
        })
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.create(req.body)
        .then(promo => {
            console.log('promo Created ', promo);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        },err => next(err))
        .catch(err=> next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.deleteMany({})
        .then((promo)=> {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo); 
        },(err)=> next(err))
        .catch(err => next(err)) 
    });

    // /:promId endpoint 
promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Promotion.findById(req.params.promoId)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.findByIdAndUpdate(req.params.promoId,{$set:req.body},{new:true})
        .then(promo => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        },(err)=> next(err))
        .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.send(`Post operation not supported on /promotions/${req.params.promoId}`)
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.findByIdAndRemove(req.params.promoId)
        .then(promo => {
            res.statusCode = 200;
            res.setHeader('content-Type', 'application/json');
            res.json(promo);
        },(err)=> next(err))
        .catch(err => next(err))
    });
module.exports = promoRouter;