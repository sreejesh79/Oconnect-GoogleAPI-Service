import GoogleDriveService from '../services/googledrive.service';
export default class GoogleDriveController {
    public static async upload(request, reply) {
        const upload = await GoogleDriveService.instance.uploadFile(request);
        reply.send(upload);
    }
}