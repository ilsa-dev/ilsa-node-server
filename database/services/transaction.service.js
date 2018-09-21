
const {insertDocuments, updateDocument, findDocuments} = require("../provider/mongodb.provider");

//insert transaction
insertTransaction = (transaction, bets) => {

    if(!transaction.recordId){
        throw new Error("Transaction recordId not present");
    }

    if(bets.length === 0){
        throw new Error("Transaction has no bets");
    }

    //make sure transaction uses the date today at server
    transaction.transactionDate = new Date();
    transaction.__systemHeader = transaction.__systemHeader ? transaction.__systemHeader : {};
    transaction.__systemHeader.type = 'transaction';

    var toInsert = [transaction];

    bets.forEach((bet) =>{
        bet.transaction = transaction.recordId;
        bet.transactionDate = transaction.transactionDate;
        bet.__systemHeader = bet.__systemHeader ? bet.__systemHeader : {};
        bet.__systemHeader.type = 'bet';
        toInsert.push(bet);
    });

    return insertDocuments(toInsert);

};
//get transaction

//search bets
searchBets = async (transactionDate, raffleCode, number) => {

    let query = {'__systemHeader.type' : 'bet'};

    if(transactionDate && transactionDate !== 'ALL'){
        query.transactionDate = new Date(transactionDate);
    }
    if(raffleCode && raffleCode !== 'ALL'){
        query.raffleCode = raffleCode;
    }

    if(number && number !== 'ALL'){
        query.number = number;
    }

    let docs = await findDocuments(query, {number : 1});

    let total = 0;
    docs.forEach((d)=>{
        total += d.amount;
    });


    return {
        total: total,
        bets : docs
    }

};


module.exports = {insertTransaction, searchBets};