import FileController from './controllers/file.controller';

class AppRouter {
    private static readonly API_PATH: String = "/api/v1";
    public static init(fastify: any):any {
        fastify.get('/', (request, reply) => {
            reply.send("Welcome to GOOGLE API SERVICE") ;
        })  
        fastify.post('/upload', FileController.upload) 
    }
}

export default AppRouter;