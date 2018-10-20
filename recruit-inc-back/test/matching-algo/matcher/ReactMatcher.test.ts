import { expect } from "chai";
import 'mocha';
import {IProcessedSourceFile, ReactMatcher} from "../../../src/matching-algo/matcher/ReactMatcher";
import {dataEntry} from "../data-model/GitProjectInputExample"
import { projectOutput } from "../data-model/GitProjectOutputExample"
import { IGitProjectOutput } from "../../../src/matching-algo/data-model/output-model/IGitProjectOutput";
import { Technologies } from "../../../src/matching-algo/data-model/output-model/Technologies";
describe('Test react matching algorithm', () => {

    it('Should return the correct output object', () => {
        // GIVEN
        const reactMatcher: ReactMatcher = new ReactMatcher(dataEntry, Technologies.React);

        // WHEN

        const computedOutput: IGitProjectOutput = reactMatcher.execute();
        // THEN
        expect(JSON.stringify(computedOutput) === JSON.stringify(projectOutput));
    });


    it('Should detect whether a person has made commits react', () => {
        // GIVEN
        const reactMatcher: ReactMatcher = new ReactMatcher(dataEntry, Technologies.React);
        const sourceFiles: IProcessedSourceFile[] = reactMatcher.sourceFilePathToParse(dataEntry.projectInputs[0]);
        const sourceFileText: string = sourceFiles[0].filetext;

        // WHEN
        const isReactFound: boolean = reactMatcher.isTechnologyFound(sourceFileText);
        console.log("(isTechnologyFound) React Technologie in a react file: ", isReactFound);

        // THEN
        // We expect to find react in our dataEntry object
        expect(isReactFound).to.equal(true);
    });

    it('Should properly count the number of lines', () => {
        // GIVEN
        const reactMatcher: ReactMatcher = new ReactMatcher(dataEntry, Technologies.React);



        // WHEN
        let numberOfLines: number = 0;

        for (const commit of dataEntry.projectInputs[0].applicantCommits) {

            numberOfLines += reactMatcher.countNumberOfLinesInSingleFileCommits(commit.files, ["js", "ts"], "frontend/src/");
        }

        // THEN
        // We expect to find react in our dataEntry object
        expect(numberOfLines).to.be.equal(570);
    });

});

