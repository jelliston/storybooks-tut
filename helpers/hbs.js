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
    },

    // floating is a Materialize class for the button
    editIcon: function (storyUser, loggedUser, storyID, floating = true) {   
        if (storyUser._id.toString() == loggedUser._id.toString()) {
            if (floating) {
                return `<a href="/stories/edit/${storyID}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            } else {
                return `<a href="/stories/edit/${storyID}"><i class="fas fa-edit"></i></a>`
            }
        } else {
            // we won't see the icon if the storyUser isn't the same as the loggedUser
            return ''
        }
    },
}