const graph = require('@microsoft/microsoft-graph-client')

module.exports = {
    getUserDetails: async function(accessToken) {
        const client = getAuthenticatedClient(accessToken)

        const user = await client.api('/me').get()
        return user
    }
}

function getAuthenticatedClient (accessToken) {
    //initialize graph client
    const client = graph.Client.init({
        //use the provided access token to authenticate requests
        authProvider: (done) => {
            done (null, accessToken)
        }
    })

    return client
}