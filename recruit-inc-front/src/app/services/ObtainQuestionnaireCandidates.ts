import { baseService } from './baseService';
import { Routes } from '../Routes';
import axios from 'axios';

export class ObtainQuestionnaireCandidates extends baseService{

    constructor() {
        super();
        this.serviceName = Routes.ObtainQuestionnaireCandidates;
        this.serviceAddress = this.buildServiceAddress(Routes.ObtainQuestionnaireCandidates);
    }



    public execute(): any {

        return axios.request({
            url: this.serviceAddress,
            method: 'get',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        });
    }
}