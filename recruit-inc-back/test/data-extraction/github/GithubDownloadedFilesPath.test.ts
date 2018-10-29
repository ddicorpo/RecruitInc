import { expect} from 'chai';
import { describe, it} from 'mocha';
import {GithubDownloadedFilesPath} from "../../../src/data-extraction/github/githubDownloadedFilesPath";
import {IGithubUser} from "../../../src/data-extraction/github/api-entities/IGithubUser";


const fs = require('fs');

  describe.only('Write to file', () => {

    it('should write the contents of a downloaded file locally', function() {

        let test = new GithubDownloadedFilesPath();
        test.writeToFile("This is a test", "test/data-extraction/github/writeToFileTest.txt" );
        let exists : boolean = fs.existsSync("./test/data-extraction/github/writeToFileTest.txt");
        expect(exists).to.be.true;
        fs.unlinkSync("test/data-extraction/github/writeToFileTest.txt");
        exists = fs.existsSync("./test/data-extraction/github/writeToFileTest.txt");
        expect(exists).to.be.false;

    });
  });

