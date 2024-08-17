let mongoose = require("mongoose");
let controller = {};


controller.findByQuery = (model, query, limit, skip, sort) => {
    try {
        let queryObj = query || {};
        let sortObj = sort || { _id:-1 };
        let limitVal = limit || 10000;
        let skipVal = skip || 0;
        return model
            .find(queryObj)
            .skip(skipVal)
            .limit(limitVal)
            .sort(sortObj)
    } catch (error) {
        return error;
    }
};


controller.findOne = (model, query, sort, skip) => {
    try {
        let queryObj = query || {};
        let sortObj = sort || { _id:-1 };
        let skipVal = skip || 0;
        return model
            .findOne(queryObj)
            .skip(skipVal)
            .sort(sortObj)
    } catch (error) {
        console.log(error);
    }
};

controller.createOne = (model, document) => {
    try {
        return model.create(document);
    } catch (error) {
        console.log(error);
    }
};


controller.aggregateQuery = (model, pipeline, options) => {
    try {
        return model.aggregate(pipeline, options).allowDiskUse(true);
    } catch (error) {
        console.log(error);
    }
};

module.exports = controller;
