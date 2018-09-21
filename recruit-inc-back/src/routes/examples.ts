/*
* This class is a demo, how we can implement the CRUD operation
*/
import { Request, Response } from "express";
import myData = require('../fakeStorage.json'); 
//load our local database file
export class Examples implements SampleInterface {

    public routes(app): void { 
        //received the express instance from app.ts file         
        app.route('/api/hi')
            .get((req: Request, res: Response) => {
                res.status(200).send(myData);
            })

        app.route('/api/:id')
        .get((req:Request, res: Response) => {
            let id = req.params.id;
            res.status(200).send(myData[id]);
        })
    }

    // Sample function testable with unit test
    sum(var1: number, var2: number) : number {
        return var1 + var2;
    }
}
// Sample interface
interface SampleInterface {
    sum(var1: number, var2: number) : number
}
