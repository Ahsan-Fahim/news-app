
import { createServer, Server as HttpServer } from 'http'
import express from 'express';
import { initRestRoutes } from './routes';
import { port, environment } from '../config/globals'
import Logger from '../core/Logger';

export class Server {
  private readonly _app: express.Application = express();
  private readonly _server: HttpServer;

  public constructor() {
    this._server = createServer(this._app)

    initRestRoutes(this._app);
  }

  public listen(): void {

    Logger.info(`server starting on port ${port} in ${environment} mode`)

    this._server.listen(port, () => {
      Logger.info(`server started on port ${port} in ${environment} mode`)
    });

    this._server.on('listening', () => {
      Logger.info(`node server is listening on port ${port} in ${environment} mode`)
    })
  }

  /**
   * Get Express app
   *
   * @returns {express.Application} Returns Express app
   */
  public get app(): express.Application {
    return this._app;
  }
}
