import { expect } from 'chai';
import { describe, it } from 'mocha';
import { stubObject } from 'ts-sinon'; // for stubbing
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { DownloadClient } from "../../src/queue/clients/DownloadClient";

let downloadClient: DownloadClient;

describe('Test the downloadClient', () => {
    before(() => {
        const newUser: IGithubUser = {
            login: 'bill nye',
            createdAt: '',
            url: '',
            email: '',
        };
        let requiredInfo: RequiredClientInformation = new RequiredClientInformation(
            newUser,
            'testRepo',
            'bob',
            'path',
            '122',
            'montreal'
        );
        downloadClient = new DownloadClient(requiredInfo);

    });

    it('Check to make sure that the downloadClient constructor worked properly', () => {
        expect("bob").to.equal(downloadClient.owner);
        expect("testRepo").to.equal(downloadClient.repository);
        expect("bill nye").to.equal(downloadClient.login);
        expect("path").to.equal(downloadClient.path);
    });

});