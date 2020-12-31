//require moment to get time a message was sent
const moment = require('moment');

//setting a function to give the infomation to be displayed
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
} 

//exporting this module
module.exports = formatMessage;