
const Promotion = require('../models/promotions');

const getPromotions = (req, res, next) => {
    Promotion.find({})
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(promo)
        }, (err) => next(err))
        .catch(err => {
            next(err)
        })
}
const addPromotions = (req, res, next) => {
    Promotion.create(req.body)
        .then(promo => {
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, err => next(err))
        .catch(err => next(err))
}
const ModifyPromotions = (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
}
const deletePromotions = (req, res, next) => {
    Promotion.deleteMany({})
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch(err => next(err))
}

const getPromotion = (req, res, next) => {
    Promotion.findById(req.params.promoId)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err));
}

const addPromotion = (req, res, next) => {
    res.statusCode = 403;
    res.send(`Post operation not supported on /promotions/${req.params.promoId}`)
}

const ModifyPromotion = (req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promoId, { $set: req.body }, { new: true })
        .then(promo => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch(err => next(err))
}
const deletePromotion = (req, res, next) => {
    Promotion.findByIdAndRemove(req.params.promoId)
        .then(promo => {
            res.statusCode = 200;
            res.setHeader('content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch(err => next(err))
}


    module.exports = {
        getPromotions,
        addPromotions,
        ModifyPromotions,
        deletePromotions,
        getPromotion,
        addPromotion,
        ModifyPromotion,
        deletePromotion,
    }