import {ITechSourceFile} from "./ITechSourceFile";
import {Technologies} from "../output-model/Technologies";


export const techSourceFiles : ITechSourceFile[] = [
    {
        technology: Technologies.Git,
        sourceFileName: ".gitignore"
    },
    {
        technology: Technologies.React,
        sourceFileName : "package.json"
    },
    {
        technology: Technologies.Typescript,
        sourceFileName: "package.json"
    },
    {
        technology: Technologies.Django,
        sourceFileName: "requirements.txt"
    }
];