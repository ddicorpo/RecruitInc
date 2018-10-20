import { IGitProjectOutput } from "../../../src/matching-algo/data-model/output-model/IGitProjectOutput";
import { ILanguageOutput } from "../../../src/matching-algo/data-model/output-model/ILanguageOutput";
import { IFrameworkOutput } from "../../../src/matching-algo/data-model/output-model/IFrameworkOutput";
import { Technologies } from "../../../src/matching-algo/data-model/output-model/Technologies";

const frameworkOutputTypescript : IFrameworkOutput = {
    technologieName: Technologies.Typescript,
    lineOfCode: 313,
    numberOfCommits: 2
};

const frameworkOutputReact : IFrameworkOutput = {
    technologieName: Technologies.React,
    lineOfCode: 570,
    numberOfCommits: 5
};

const languagesOutput : ILanguageOutput = {
    languageOrFramework: Technologies.Javascript,
    lineOfCode: 1749,
    numberOfCommits: 5,
    frameworks: [frameworkOutputTypescript, frameworkOutputReact]
    
};

export const projectOutput : IGitProjectOutput = {
    projectName: "Django-React-04",
    languageOutput : [languagesOutput]
};