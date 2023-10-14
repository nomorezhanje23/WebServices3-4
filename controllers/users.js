const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('users').find();
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    });
};

const getSingle = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid medical id to retrieve a profile.');
    }
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('users').find({_id: userId});
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users[0]);
    });
};

const createUser = async (req, res) => {
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
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid medical id to update profile.');
    }
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
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid medical id to delete profile.');
    }
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('users').delete({_id: userId });
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

