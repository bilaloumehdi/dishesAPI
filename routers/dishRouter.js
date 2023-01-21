const express = require('express');
const dishRouter = express.Router();
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const {
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
} = require('../controllers/dishes');


dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, getDishes)
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, addDishes)
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, ModifyDishes)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deleteDishes);


dishRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, getDish)
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, addDish)
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,ModifyDish)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,deleteDish)

dishRouter.route('/:dishId/comments')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors,getComments)
    .post(cors.corsWithOptions, authenticate.verifyUser,addComments)
    .put(cors.corsWithOptions, authenticate.verifyUser,ModifyComments)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,deleteComments)

dishRouter.route('/:dishId/comments/:commentId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors,getComment)
    .post(cors.corsWithOptions, authenticate.verifyUser,addComment)
    .put(cors.corsWithOptions, authenticate.verifyUser, modifyComment)
    .delete(cors.corsWithOptions, authenticate.verifyUser, deleteComment);
    
module.exports = dishRouter;