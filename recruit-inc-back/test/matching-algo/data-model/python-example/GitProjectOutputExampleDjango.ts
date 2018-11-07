import {IGitProjectSummary} from "../../../../src/matching-algo/data-model/output-model/IGitProjectSummary";
import { IGitProjectOutput } from "../../../../src/matching-algo/data-model/output-model/IGitProjectOutput";
import { ILanguageOutput } from "../../../../src/matching-algo/data-model/output-model/ILanguageOutput";
import { IFrameworkOutput } from "../../../../src/matching-algo/data-model/output-model/IFrameworkOutput";
import { Technologies } from "../../../../src/matching-algo/data-model/output-model/Technologies";

const frameworkOutputDjango : IFrameworkOutput = {
    technologyName: Technologies.Django,
    linesOfCode: 212,
    numberOfCommits: 3
};

const languagesOutput : ILanguageOutput = {
    languageOrFramework: Technologies.Python,
    linesOfCode: 212,
    numberOfCommits: 3,
    frameworks: [frameworkOutputDjango]

};

const projectOutputGit : IGitProjectOutput = {
    projectName: "Django-React-04",
    languageOutput : [languagesOutput]
}
export const projectOutput : IGitProjectSummary = {
    totalOutput: [languagesOutput],
    projectsOutput: [projectOutputGit]
};