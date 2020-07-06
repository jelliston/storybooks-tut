const moment = require('moment')

module.exports = {

    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    // function takes in the card string and then length we want to limit it to
    truncate: function (str, len) {
        // this logic reduces the string to the desired length and adds on '...' at end
        if (str.length > len && str.length > 0) {
            let new_str = str + ' '
            new_str = str.substr(0, len)
            new_str = new_str.length > 0 ? new_str : str.substr(0, len)
            return new_str + '...'
        }
        return str
    },

    //this helper looks for anything in <html> tags and replaces it with nothing
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    }
}