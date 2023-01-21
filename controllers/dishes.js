
const Dish = require("../models/dishes");

const getDishes = (req, res, next) => {
    Dish.find({})
        .populate('comments.author')
        .then(dish => {
            res.status(200).json(dish)
        })
        .catch(err => next(err))
}

const addDishes = (req, res, next) => {
    Dish.create(req.body)
        .then(dish => {
            res.status(200).json(dish)
        })
        .catch(err => next(err))
}

const ModifyDishes = (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
}

const deleteDishes = (req, res, next) => {
    Dish.deleteMany({})
        .then((dish) => {
            res.status(200).json(dish);
        })
}

const getDish = (req, res, next) => {
    Dish.findById(req.params.dishId)
        .populate("comments.author")
        .then(dish => {
            res.status(200).json(dish)
        })
}
const addDish = (req, res, next) => {
    res.statusCode = 403;
    res.send(`Post operation not supported on /dishes/${req.params.dishId}`)
}

const ModifyDish = (req, res, next) => {
    Dish.findByIdAndUpdate(req.params.dishId,
        { $set: req.body },
        { new: true })
        .then(dish => {
            res.status(200).json(dish)
        })
        .catch(err => next(err))
}

const deleteDish = (req, res, next) => {
    Dish.findByIdAndDelete(req.params.dishId)
        .then(dish => res.status(200).json(dish))
        .catch(err => next(err))
}

const getComments = (req, res, next) => {
    Dish.findById(req.params.dishId)
        .populate('comments.author')
        .then(dish => {
            if (!dish) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);

        })
        .catch(err => next(err))
}
const addComments = (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            if (dish != null) {
                req.body.author = req.user._id;

                dish.comments.push(req.body);
                dish.save()
                    .then((dish) => {
                        Dish.findById(dish._id)
                            .populate('comments.author')
                            .then((dish) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            })

                    });
            } else {
                const err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }).catch(err => next(err))
}
const ModifyComments = (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
}
const deleteComments = (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            if (dish != null) {
                dish.comments.forEach(comment => {
                    comment.remove()
                });
                dish.save()
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
}

const getComment =(req, res, next) => {
    Dish.findById(req.params.dishId)
        .populate('comments.author')
        .then(dish => {

            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json(dish.comments.id(req.params.commentId))
            } else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            } else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err))
}

const addComment = (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId
        + '/comments/' + req.params.commentId);
}
const modifyComment = (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then((dish) => {
            if (req.user._id.equals(dish.comments.id(req.params.commentId).author._id)) {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            Dish.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err))
                } else if (dish == null) {
                    const err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    const err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            } else {
                const err = new Error('You are not authorized to perform this operation')
                res.statusCode = 403;
                res.setHeader('content-Type', 'application/json');
                return next(err)

            }

        }, (err) => next(err))
        .catch((err) => next(err));
}
const deleteComment = (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then((dish) => {
            if (req.user._id.equals(dish.comments.id(req.params.commentId).author._id)) {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                } else if (dish == null) {
                    const err = new Error('Dish ' + req.params.dishId + ' not found');
                    res.statusCode = 404;
                    return next(err);
                } else {
                    const err = new Error('Comment ' + req.params.commentId + ' not found');
                    res.statusCode = 404;
                    return next(err);
                }
            } else {
                const err = new Error('You are not authorized to perform this operation')
                res.statusCode = 403;
                res.setHeader('content-Type', 'application/json');
                return next(err)
            }

        }, (err) => next(err))
        .catch((err) => next(err));
}

module.exports = {
    getDishes,
    addDishes,
    ModifyDishes,
    deleteDishes,
    getDish,
    addDish,
    ModifyDish,
    deleteDish,
    getComments,
    addComments,
    ModifyComments,
    deleteComments,
    getComment,
    addComment,
    modifyComment,
    deleteComment
}