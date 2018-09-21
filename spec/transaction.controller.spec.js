
const Client = require('node-rest-client').Client;
const uuid = require('uuid').v1;
const client = new Client();
const APP_URL = 'http://localhost:3000';

describe("transaction.controller.spec", function () {

    it("should insert a new transaction with bets", function (done) {

        let transaction = {
            recordId : uuid(), //transactionNumber
            transactionDate : new Date(),
        };

        let bets = [
            {
                recordId : uuid(),
                raffleCode : 'PM9S3',
                number : 101,
                amount : 10,
                prize : 6000
            },
            {
                recordId : uuid(),
                raffleCode : 'PM9S3',
                number : 391,
                amount : 5,
                prize : 3000
            },
            {
                recordId : uuid(),
                raffleCode : 'PM9S3',
                number : 999,
                amount : 1,
                prize : 600
            }
        ];

        let args = {
            data: {
                transaction,
                bets
            },
            headers : {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        console.log(JSON.stringify(transaction, null, 4));
        console.log(JSON.stringify(bets, null, 4));

        let url = APP_URL + "/api/v1/transact/new";

        let req = client.post(url, args, (data, response) => {

            expect(response.statusCode).toBe(200);

            if (response.statusCode !== 200) {
                return;
            }

            data = JSON.parse(data);

            console.log(JSON.stringify(data, null, 4));

            done();
        });

        req.on('error', (err) => {
            console.log('request error', err);
            done();
        });


    });
});