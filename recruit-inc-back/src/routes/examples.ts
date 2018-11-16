/*
 * This class is a demo, how we can implement the CRUD operation
 */
import { Request, Response } from 'express';

export class Examples {
  public routes(app): void {
    app.route('/api/hi').get((req: Request, res: Response) => {
      // Sample ENV toggle... do not use for feature toggle
      if (process.env.NODE_ENV === 'production') {
        res.status(404).send('Disabled in Production');
      } else {
        res.status(200).send('Bonjour/Hi');
      }
    });
  }
}
