const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;



const getAll =  (req, res) => {
    //swagger.tags=['Users']
    mongodb
    .getDatabase()
    .db()
    .collection('users')
    .find()
    .toArray((err, users) => {
        if(err) {
            res.status(400).json({message: err});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    });
};

const getSingle = (req, res) => {
    //swagger.tags=['Users']
    const userId = new ObjectId(req.params.id);
    mongodb
    .getDatabase()
    .db()
    .collection('users')
    .find({_id: userId})
    .toArray((err, result) => {
        if (err) {
            res.status(400).json({message: err});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result[0]);
    });
};

const createUser = async (req, res) => {
    //swagger.tags=['Users']
    const user = {
        diagnosis: req.body.diagnosis,
        medication: req.body.medication,
        name: req.body.name,
        lastName: req.body.lastName,
        place: req.body.place,
        quantity: req.body.quantity,
        payment: req.body.payment,
    };
    const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        req.status(500).json(response.error || 'Some error occured while updating the user.')
    }
};

const updateUser = async (req, res) => {
    //swagger.tags=['Users']
    const userId = new ObjectId(req.params.id);
    const user = {
        diagnosis: req.body.diagnosis,
        medication: req.body.medication,
        name: req.body.name,
        lastName: req.body.lastName,
        place: req.body.place,
        quantity: req.body.quantity,
        payment: req.body.payment,
    };
    const response = await mongodb.getDatabase().db().collection('users').replaceOne({_id: userId }, user);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        req.status(500).json(response.error || 'Some error occured while updating the user.');
    }
};

const deleteUser = async (req, res) => {
    //swagger.tags=['Users']
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('users').deleteOne({_id: userId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        req.status(500).json(response.error || 'Some error occured while updating the user.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};

