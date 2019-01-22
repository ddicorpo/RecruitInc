import { IGithubUser } from '../data-extraction/github/api-entities/IGithubUser';
import { RequiredClientInformation } from './RequiredClientInformation';
import { RepositoryQueue } from "./queues/RepositoryQueue";
import { TreeQueue } from "./queues/TreeQueue";
import { CommitQueue } from "./queues/CommitQueue";
import { DownloadQueue } from "./queues/DownloadQueue";
import { FilesAffectedByQueue } from "./queues/FilesAffectedByQueue";

export class Controller {
  private static _instance: Controller;

  public constructor() {

  }
  public static get_instance() {
    return this._instance || (this._instance = new this());
  }
  private repoQueue: RepositoryQueue = RepositoryQueue.get_instance();
  private treeQueue: TreeQueue = TreeQueue.get_instance();
  private commitQueue: CommitQueue = CommitQueue.get_instance();
  private downloadQueue: DownloadQueue = DownloadQueue.get_instance();
  private filesAffectedByQueue: FilesAffectedByQueue = FilesAffectedByQueue.get_instance();


  public populate(users: IGithubUser[]){
    for(let user of users){
      let prospect: RequiredClientInformation = new RequiredClientInformation(
          user,
          '',
          '',
          '',
          '',
          ''
      );
      this.repoQueue.enqueue(prospect);
    }
  }

  //main method, runs all the queues and finds the information
  public execute(){

  }

  public executeRepo(){
    try{
      while(this.repoQueue.size() > 0){
        this.repoQueue.processNextQuery();
      }
    }
    catch(e){
      throw e;
    }
  }

  public executeTree(){
    try{
      while(this.treeQueue.size() > 0){
        this.treeQueue.processNextQuery();
      }
    }
    catch(e){

    }
  }

  public executeCommit(){
    try{
      while(this.commitQueue.size() > 0){
        this.commitQueue.processNextQuery();
      }
    }
    catch(e){

    }
  }

  public executeFilesAffected(){
    try{
      while(this.filesAffectedByQueue.size() > 0){
        this.filesAffectedByQueue.processNextQuery();
      }
    }
    catch(e){

    }
  }

  public executeDownload(){
    try{
      while(this.downloadQueue.size() > 0){
        this.downloadQueue.processNextQuery();
      }
    }
    catch(e){

    }
  }


  //load back all queues from DB
  public reloadQueues(){

  }

  public storeQueues(){

  }

}
