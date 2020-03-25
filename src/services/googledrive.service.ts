
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

    private async getMimeTypeByFileExtension(filename) {
        const ext = path.extname(filename);
        let driveMimeType = ""
        let fileMimeType = ""
        switch (ext) {
            case ".doc":   
            case ".dot":   
            case ".docx":   
            case ".dotx":   
            case ".docm":   
            case ".dotm": 
                driveMimeType = "application/vnd.google-apps.document"
                break;
            case ".xls":  
            case ".xlt":  
            case ".xla":  
            case ".xlsx":  
            case ".xltx": 
                driveMimeType = "application/vnd.google-apps.spreadsheet"
                break;
            case ".ppt":  
            case ".pot":  
            case ".pps":  
            case ".ppa":  
            case ".pptx":  
            case ".potx":  
            case ".ppsx":  
                driveMimeType = "application/vnd.google-apps.presentation"
                break;
            default :
                driveMimeType = "application/vnd.google-apps.presentation"
                break;
        }
        switch(ext) {
            case ".doc":  
                fileMimeType =  "application/msword" 
                break;
            case ".dot":  
                fileMimeType =  "application/msword" 
                break;
            case ".docx": 
                fileMimeType =  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                break;
            case ".dotx": 
                fileMimeType =  "application/vnd.openxmlformats-officedocument.wordprocessingml.template" 
                break;
            case ".docm": 
                fileMimeType =  "application/vnd.ms-word.document.macroEnabled.12" 
                break;
            case ".dotm": 
                fileMimeType =  "application/vnd.ms-word.template.macroEnabled.12" 
                break;
            case ".ppt":  
                fileMimeType =   "application/vnd.ms-powerpoint" 
                break;
            case ".pot":  
                fileMimeType =   "application/vnd.ms-powerpoint" 
                break;
            case ".pps":  
                fileMimeType =   "application/vnd.ms-powerpoint" 
                break;
            case ".ppa":  
                fileMimeType =   "application/vnd.ms-powerpoint" 
                break;
            case ".pptx": 
                fileMimeType =   "application/vnd.openxmlformats-officedocument.presentationml.presentation" 
                break;
            case ".potx": 
                fileMimeType =   "application/vnd.openxmlformats-officedocument.presentationml.template" 
                break;
            case ".ppsx": 
                fileMimeType =   "application/vnd.openxmlformats-officedocument.presentationml.slideshow" 
                break;
            case ".xls":  
                fileMimeType =   "application/vnd.ms-excel" 
                break;
            case ".xlt":  
                fileMimeType =   "application/vnd.ms-excel" 
                break;
            case ".xla":  
                fileMimeType =   "application/vnd.ms-excel" 
                break;
            case ".xlsx": 
                fileMimeType =   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                break;
            case ".xltx": 
                fileMimeType =   "application/vnd.openxmlformats-officedocument.spreadsheetml.template" 
                break;

        }
        return {driveMimeType, fileMimeType}
    }

    public async moveFileToDrive(file){
        const drive = google.drive({version: 'v3', auth: GoogleOAuth2.auth});
        const mimeTypes = this.getMimeTypeByFileExtension(file.originalname)
        const fileMetadata = {
            'name': file.originalname,
            'parents': ['1sJXaKeKyHr6qv5AJWmLR8sitDTWX-G3Q'],
            'mimeType' : (await mimeTypes).driveMimeType
        };
        if(!fs.existsSync(path.join(rootPath,file.path))){
            return {
                error: true,
                message: "File doesnot exist!"
            }
        }
        const media = {
            mimeType: (await mimeTypes).fileMimeType,
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

