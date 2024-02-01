const { google } = require('googleapis')
const apikeys = require('../../googleDriveAPI.json')
const SCOPE = ["https://www.googleapis.com/auth/drive"];



async function authorize()
{const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    )
      console.log("jwtClient before authorize", jwtClient);
      await jwtClient.authorize()
    return jwtClient
}
module.exports = authorize;