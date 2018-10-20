import {Technologies} from "./Technologies"
import {ICodeOutput} from "./ICodeOutput";
export interface IFrameworkOutput extends ICodeOutput{
    technologieName: Technologies,
}