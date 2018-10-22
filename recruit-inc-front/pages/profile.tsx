import * as React from 'react';
import Header from '../components/Header'

interface IProfileState {
    data: String | {}
}

class App extends React.Component <any, IProfileState> {

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
            return fetch(`http://localhost:6969/api/bitbucket/applicant/${accessToken}/philbeaudry`)
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
                <p>You can login to the following platforms to allow Recruit.Inc to assess your skills.</p>
                <a style={{display: "table-cell"}} href={"OAuth/bitbucket"} target="_blank">
                    BitBucket
                </a><br/>
                <a style={{display: "table-cell"}} href={"OAuth/github"} target="_blank">
                    Github
                </a><br/>
                <a style={{display: "table-cell"}} href={"OAuth/gitlab"} target="_blank">
                    Gitlab
                </a>
                <p>{JSON.stringify(this.state.data)}</p>
            </div>
        );
    }
}

export default App;