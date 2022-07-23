const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const openurl = require('openurl');

const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/presentations'];
const TOKEN_PATH = 'token.json';
let oAuth2Client;

const googleAutorize = () => {
    fs.readFile('./credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        authorize(JSON.parse(content));
      });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken();
    oAuth2Client.setCredentials(JSON.parse(token));
    //callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
     // callback(oAuth2Client);
    });
  });
}
fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  fastify.get('/presentation/:presentationid', async (request, reply) => {
        // return request.params;
        console.log(oAuth2Client);
        const slides = google.slides({
            version: 'v1', 
            auth: oAuth2Client
        });
        const drive = google.drive
        const presentation = await slides.presentations.get({
            presentationId: request.params.presentationid
        })
        // return presentation;
        openurl.open(`https://docs.google.com/presentation/d/${request.params.presentationid}/edit`);
        return presentation;
  })

const start = async () => {
    try {
      await fastify.listen(3000)
      googleAutorize();
      fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }

  start();