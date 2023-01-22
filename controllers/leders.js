
const Leader = require('../models/leaders');
const getLeaders = (req, res, next) => {
    Leader.find({})
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader)
        }, (err) => next(err))
        .catch(err => next(err))
}

const addLeaders = (req, res, next) => {
    Leader.create(req.body)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('content-Type', 'application/json');
            res.json(leader)
        }, (err) => next(err))
        .catch(err => next(err))
}
const modifyLeaders = (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
}
const deleteLeaders = (req, res, next) => {
    Leader.deleteMany({})
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('content-Type', 'application/json');
            res.json(leader)
        }, (err) => next(err))
        .catch(err => next(err))
}

const getLeader = (req, res, next) => {
    Leader.findById(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('content-Type', 'application/json');
            res.json(leader)
        }, (err) => next(err))
        .catch(err => next(err))
}
const addLeader = (req, res, next) => {
    Leader.findByIdAndUpdate(req.params.leaderId, { $set: req.body }, { $new: true })
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('content-Type', 'application/json');
            res.json(leader)
        }, (err) => next(err))
        .catch(err => next(err))
}
const modifyLeader = (req, res, next) => {
    res.statusCode = 403;
    res.send(`Post operation not supported on /leaders/${req.params.leaderId}`)
}
const deleteLeader = (req, res, next) => {
    Leader.findByIdAndRemove(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('content-Type', 'application/json');
            res.json(leader)
        }, (err) => next(err))
        .catch(err => next(err))
}

module.exports = {
    getLeaders,
    addLeaders,
    modifyLeaders,
    deleteLeaders,
    getLeader,
    addLeader,
    modifyLeader,
    deleteLeader,
}

