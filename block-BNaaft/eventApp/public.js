var moment = require('moment');

module.exports = {
    dateFormate: (date) => {
        return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    lowercase: (str) => {
        return `${str}`.toLowerCase();
    },
}