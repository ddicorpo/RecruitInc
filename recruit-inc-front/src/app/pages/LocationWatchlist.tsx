import * as React from 'react';
import {Logger} from "../Logger";

interface IWatchlistInfo {
   location: string,
   scanned: number,
   totalDev: number

}

class LocationWatchList extends React.Component<any, {watchlistInfo: IWatchlistInfo[], textValue: string}> {
    
    private watchlist : IWatchlistInfo[];
    private logger: Logger;
    
    
    constructor(props: any) {
        super(props);
        this.logger = new Logger();
        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleAdd = this.handleAdd.bind(this);

        this.state = { 
             watchlistInfo : [],
             textValue: ""
         };
    }


     componentDidMount(){
        this.watchlist = [
            {
            location: "Montreal",
            scanned: 456,
            totalDev: 9001
           },
           
            {
            location: "Venise",
            scanned: 256,
            totalDev: 7458
           }

       ];

         this.logger.info({
             class: 'LocationWatchlist',
             method: 'componentDidMount',
             action: 'Loaded the watchlist to the component state',
             params: { watchlist: this.watchlist },
         });
       this.setState({
         watchlistInfo : this.watchlist
       });

     }


    private handleAdd(): void{
        const location: string = this.state.textValue;
        const arrayClone: IWatchlistInfo[] = this.state.watchlistInfo.slice();
        this.logger.info({
            class: 'LocationWatchlist',
            method: 'handleAdd',
            action: 'Calling the backend to add a new location on the watchlist',
            params: { location },
        });
        arrayClone.push({
            location,
            scanned: 0,
            totalDev: 0
        });

        this.setState({
           watchlistInfo: arrayClone
          });
    }

    private handlePause(location:string): void{
      //call backend
        this.logger.info({
            class: 'LocationWatchlist',
            method: 'handlePause',
            action: 'Calling the backend to pause a location on the watchlist',
            params: { location },
        });
      console.log("handlePause",location);
       
    }
    
    private handleDelete(location:string): void{
        //call backend
        this.logger.info({
            class: 'LocationWatchlist',
            method: 'handleDelete',
            action: 'Calling the backend to remove a location from the watchlist',
            params: { location },
        });
        console.log("handleDelete",location);
    }

    private handleTextInput(event:any): void{
        this.setState({
            textValue: event.target.value
          });
    }

    private renderTable(): JSX.Element {
        const tableContent: JSX.Element[] = [];

        for (const tableLine of this.state.watchlistInfo) {
            tableContent.push(
                <tr>
                    {
                        <td>{tableLine.location}</td>
                    }
                    {
                        <td>{tableLine.scanned}</td>
                    }
                    {
                        <td>{tableLine.totalDev}</td>
                    }
                    {
                        <td><i onClick={()=> this.handlePause(tableLine.location)} className="mdi mdi-pause"/></td>
                    }
                    {
                        <td><i onClick={()=> this.handleDelete(tableLine.location)} className="mdi mdi-close"/></td>
                    }

                </tr>);
        }


        return (
            <table className="table">
                <thead className="thead-light">
                <tr>
                    <th scope="col">Location</th>
                    <th scope="col">Scanned</th>
                    <th scope="col">Total developers</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                {tableContent}
                </tbody>
            </table>
        )
    }


    render() {
        
        return (
                <div className="container-fluid">
                    <div className="page-header">
                        <h2 className="header-title">Location Watchlist (Not Ready)</h2>
                    </div>

                    {/*This is only to have to elements blur while we finish the construction*/}
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="blur-svg">
                        <defs>
                            <filter id="blur-filter">
                                <feGaussianBlur stdDeviation="3"></feGaussianBlur>
                            </filter>
                        </defs>
                    </svg>

                    {/*To remove this div when construction is finish*/}
                    <div className="blur">

                        <div className="card blur">
                            <div className="card-header border bottom">
                                <h4 className="card-title">Search and Add</h4>
                            </div>
                            <div className="card-body">
                                <div className="row m-t-30">
                                    <div className="col-md-4">
                                        <div className="p-h-10">
                                            <div className="form-group">
                                                <label className="control-label">Add city to watchlist</label>
                                                <input onChange={this.handleTextInput} type="text" className="form-control" placeholder="City"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="p-h-10">
                                            <div className="form-group">
                                                <label className="control-label">&nbsp;</label>
                                                <button onClick= {this.handleAdd} id="save" className="btn btn-success form-control"
                                                        type="button">Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                       <div className="card">
                            <div className="card-header border bottom">
                                <h4 className="card-title">Watchlist</h4>
                            </div>
                            <div className="card-body">
                                {this.renderTable()}
                            </div>
                        </div>

                    </div>
                    
                </div>
        );
    }
}

export default LocationWatchList;