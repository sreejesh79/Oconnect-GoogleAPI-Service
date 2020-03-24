import * as fastify from 'fastify';
import GoogleOAuth2 from './googleoauth2';
import AppRouter from './routes';

class App {

    public server: any = fastify({ logger: true })
    public async start(): Promise<any> {
        try {
            const auth: any = await GoogleOAuth2.authInit();
            if ( !auth.error ) {
                this.server.log.info(`google auth ${JSON.stringify(auth)}`);
                AppRouter.init(this.server);
                await this.server.listen(3000);
                this.server.log.info(`server listening on ${this.server.server.address().port}`)
            } else {
                this.server.log.error(auth)
            }
            
          } catch (err) {
            this.server.log.error(err)
            process.exit(1)
          }
        }
    
}

const app: any = new App();
app.start();

