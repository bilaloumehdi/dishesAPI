const express = require('express');
const leaderRouter = express.Router();
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');


const cors = require('./cors');
const {
    getLeaders,
    addLeaders,
    modifyLeaders,
    deleteLeaders,
    getLeader,
    addLeader,
    modifyLeader,
    deleteLeader } = require('../controllers/leders');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, getLeaders)
    .post(authenticate.verifyUser, authenticate.verifyAdmin, addLeaders)
    .put(authenticate.verifyUser, authenticate.verifyAdmin, modifyLeaders)
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, deleteLeaders);

leaderRouter.route('/:leaderId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, getLeader)
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, addLeader)
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, modifyLeader)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deleteLeader);


module.exports = leaderRouter;