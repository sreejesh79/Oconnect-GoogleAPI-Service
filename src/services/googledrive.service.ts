
import * as path from "path";
import * as fs from "fs";
import { google } from "googleapis";
import GoogleOAuth2 from '../googleoauth2';

export default class GoogleDriveService {
    private static _singleton: boolean = true;
    private static _instance: GoogleDriveService;
    constructor() {
        if (GoogleDriveService._singleton) {
            throw new SyntaxError("This is a singleton class. Please use UserService.instance instead!");
        }
    }

    public static get instance(): GoogleDriveService{
        if (!this._instance) {
            this._singleton = false;
            this._instance = new GoogleDriveService();
            this._singleton = true;
        }
        return this._instance;
    }

    private getNewFileName (file) {
        const ext = path.extname(file.originalname);
            const filename = path.basename(file.originalname, ext)
           return filename + '-' + Date.now() + ext
    }
    public async moveFileToDrive(file){
        console.log(GoogleOAuth2.auth)
        const drive = google.drive({version: 'v3', auth: GoogleOAuth2.auth});
        const fileMetadata = {
            'name': this.getNewFileName(file),
            'parents': ['1sJXaKeKyHr6qv5AJWmLR8sitDTWX-G3Q'],
            'mimeType' : 'application/vnd.google-apps.presentation'
        };

        const media = {
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            body: fs.createReadStream("../test1.pptx")
        };
        try{

            const uploadedFile = await drive.files.create({
                auth: GoogleOAuth2.auth.tokens,
                media: media,
                requestBody: fileMetadata
            })
            return uploadedFile.data
        } catch(e) {
            return e;
        }
    }
    public async uploadFile(req: any): Promise<any> {
        try {
            console.log("My FIle ",req.file);
            
            const uploadedFile = await this.moveFileToDrive(req.file);
            console.log(uploadedFile);
            return req.file;
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
        

    }
}

