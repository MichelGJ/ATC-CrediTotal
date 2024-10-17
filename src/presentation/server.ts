import express, { Router } from 'express';
import path from 'path';
import cors from 'cors';

interface Options {
  port: number;
  // routes: Router;
  public_path?: string;
}


export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  // private readonly routes: Router;

  constructor(options: Options) {
    const { port, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;

    this.configure();
  }

  private configure() {


    const corsOptions = {
      origin: '*', // Allow requests from your frontend
      optionsSuccessStatus: 200,       // Some legacy browsers choke on 204
    };


    //* Middlewares
    // Serve static files from the "public" directory
    this.app.use(express.static(path.join('public')));

    // Route to inject environment variables into the frontend
    this.app.get('/env.js', (req, res) => {
      res.setHeader('Content-Type', 'application/javascript');
      res.send(`window.env = {
        API_URL: "${process.env.API_URL}",
        WS_URL: "${process.env.WS_URL}"
    };`);
    });

    // Serve index.html for the root route
    this.app.get('/', (req, res) => {
      res.sendFile(path.join('public', 'index.html'));
    });

    this.app.use(cors(corsOptions));
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

    //* Public Folder
    this.app.use(express.static(this.publicPath));

    //* Routes
    // this.app.use( this.routes );

    //* SPA
    this.app.get(/^\/(?!api).*/, (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    });

  }

  public setRoutes(router: Router) {
    this.app.use(router);
  }


  async start() {

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });

  }

  public close() {
    this.serverListener?.close();
  }

}