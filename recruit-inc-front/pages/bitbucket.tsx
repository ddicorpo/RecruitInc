import * as React from 'react';
import Header from '../components/Header'

//This is recruit.inc id for BitBucket
const client_id : string = "LEz9DG5fYbhjLPneeW";

interface IBitbucketState {
    data: String | {}
}

class App extends React.Component <any, IBitbucketState> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: "Please log in for me to be able to get info from Bitbucket"
        }
    }

    componentDidMount() {
        let url: string = window.location.href;

        let start = url.indexOf("access_token=") + 13;
        let end = url.indexOf("&");
        let accessToken: string = url.substring(start, end);

        if(accessToken != null){
            return fetch(`http://localhost:6969/api/bitbucket/applicant/${accessToken}/23jams`)
                .then((response) => {
                    return Promise.resolve(response.text())
                })
                .then(data => {
                    this.setState({data});
                    console.log("state", data);
                });
        }
        return;
    }

    render(){
        return (
            <div>
                <Header />
                <p>Hi from BitBucket</p>
                <a href={`https://bitbucket.org/site/oauth2/authorize?client_id=${client_id}&response_type=token`}>
                    Login
                </a>
                <p>{JSON.stringify(this.state.data)}</p>
            </div>
        );
    }
}

export default App;