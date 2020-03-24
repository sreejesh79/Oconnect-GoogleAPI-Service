import * as fs from 'fs';
import * as readline from 'readline-sync';
import { google } from 'googleapis';
import * as path from 'path';

class GoogleOAuth2 {

    private static readonly CREDENTIALS_PATH: string = path.join(__dirname, '../credentials.json') ;
    private static readonly TOKEN_PATH: string = path.join(__dirname, '../token.json') ;
    private static readonly SCOPES: Array<string> = [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/presentations'
    ]

    public static auth: any = {};

    private static oAuth2Client: any = {};

    public static async authInit():Promise<any> {
        try {
            const creds: any = fs.readFileSync(this.CREDENTIALS_PATH);
            this.auth = await this.authorize(JSON.parse(creds));
            return this.auth;
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }    
    }

    private static async authorize(creds: any): Promise<any> {
        const {client_secret, client_id, redirect_uris} = creds.installed;
        this.oAuth2Client = new google.auth.OAuth2 (
            client_id, client_secret, redirect_uris[0]
        );

        try {
            const token: any = fs.readFileSync(this.TOKEN_PATH);
            this.oAuth2Client.setCredentials(JSON.parse(token));
            return this.oAuth2Client;
        } catch (e) {
            return this.getAccessToken();
        }
    }

    private static async getAccessToken(): Promise<any> {
        const authUrl = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
          });
          console.log('Authorize this app by visiting this url:', authUrl);
        /*  const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });*/
          try {
                const code: any = await readline.question('Enter the code from that page here: ');
            // readline.close();
            const token: any = await this.oAuth2Client.getToken(code);
            console.log(token);
            this.oAuth2Client.setCredentials(token);
            fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(token));

          return this.oAuth2Client;
          } catch (e) {
            return {
                error: true,
                message: e.message
            }
          }
          
    }
}

export default GoogleOAuth2;