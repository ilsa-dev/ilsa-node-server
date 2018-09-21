// accepts date object
function dateNoTime(timestamp) {
    const result = new Date(timestamp);
    result.setHours(0, 0, 0, 0);
    return result;
}

function currentDateMs(){
    return dateNoTime(new Date());
}

module.exports = { dateNoTime, currentDateMs };