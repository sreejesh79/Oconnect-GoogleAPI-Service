import GoogleDriveController from './controllers/googledrive.controller';
import multer from 'fastify-multer'
const upload = multer({ dest: 'uploads/' })

class AppRouter {
    private static readonly API_PATH: String = "/api/v1";
    public static init(fastify: any):any {
        fastify.get('/', (request, reply) => {
            reply.send("Welcome to GOOGLE API SERVICE") ;
        })  

        fastify.route({
            method: 'POST',
            url: '/upload',
            preHandler: upload.single('googlefile'),
            handler: GoogleDriveController.upload
          })
    }
}

export default AppRouter;