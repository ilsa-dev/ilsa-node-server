"use strict";

const {insertSimulatorEvent} = require("../database/provider/mysql.provider");

const API_BASE_URL = '/api';

// routing api
module.exports = function(app){

    app.post(API_BASE_URL + '/simulatorlog', async (req, res) => {

        const {
            learnerId,
            questionCode,
            eventName
        } = req.body;

        try {

            const result = await insertSimulatorEvent(learnerId, questionCode, eventName, new Date());
            console.log(result);
            return res.status(200).send();

        }
        catch (err) {
            res.status(500).send(err.message);
            logger.error(err.message);
        }
    });

};
