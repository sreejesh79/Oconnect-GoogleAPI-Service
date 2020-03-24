
import * as path from "path";
import * as fs from "fs";
import { google } from "googleapis";
import GoogleOAuth2 from '../googleoauth2';
import { rootPath } from '../../root';

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

    public async moveFileToDrive(file){
        const drive = google.drive({version: 'v3', auth: GoogleOAuth2.auth});
        const fileMetadata = {
            'name': file.originalname,
            'parents': ['1sJXaKeKyHr6qv5AJWmLR8sitDTWX-G3Q'],
            'mimeType' : 'application/vnd.google-apps.presentation'
        };
        if(!fs.existsSync(path.join(rootPath,file.path))){
            return {
                error: true,
                message: "File doesnot exist!"
            }
        }
        const media = {
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            body: fs.createReadStream(path.join(rootPath,file.path))
        };
        try{

            const uploadedFile = await drive.files.create({
                auth: GoogleOAuth2.auth,
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
            const uploadedFile = await this.moveFileToDrive(req.file);
            return uploadedFile;
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
        

    }
}

