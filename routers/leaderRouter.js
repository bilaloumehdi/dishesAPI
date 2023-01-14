const express = require('express');
const leaderRouter = express.Router();
const bodyParser = require('body-parser');
const authenticate= require('../authenticate');
// models
const Leader = require('../models/leaders') ;
const cors = require('./cors');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Leader.find({})
        .then((leader) => {
            res.statusCode =200 ;
            res.setHeader('Content-Type','application/json');
            res.json(leader)
        },(err)=> next(err))
        .catch(err => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leader.create(req.body)
        .then((leader) => {
            res.statusCode =200 ;
            res.setHeader('content-Type','application/json');
            res.json(leader)
        },(err)=> next(err))
        .catch(err => next(err))
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leader.deleteMany({})
        .then((leader) => {
            res.statusCode =200 ;
            res.setHeader('content-Type','application/json');
            res.json(leader)
        },(err)=> next(err))
        .catch(err => next(err))
    });

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Leader.findById(req.params.leaderId)
        .then((leader) => {
            res.statusCode =200 ;
            res.setHeader('content-Type','application/json');
            res.json(leader)
        },(err)=> next(err))
        .catch(err => next(err))})
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leader.findByIdAndUpdate(req.params.leaderId,{ $set: req.body },{ $new:true })
        .then((leader) => {
            res.statusCode =200 ;
            res.setHeader('content-Type','application/json');
            res.json(leader)
        },(err)=> next(err))
        .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.send(`Post operation not supported on /leaders/${req.params.leaderId}`)
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leader.findByIdAndRemove(req.params.leaderId)
        .then((leader) => {
            res.statusCode =200 ;
            res.setHeader('content-Type','application/json');
            res.json(leader)
        },(err)=> next(err))
        .catch(err => next(err))
    });
module.exports = leaderRouter;