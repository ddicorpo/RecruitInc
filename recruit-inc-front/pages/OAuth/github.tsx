import * as React from 'react';
import Header from '../../components/Header'

interface IGithubLoginState {
    data: String | {}
}

class App extends React.Component <any, IGithubLoginState> {

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
                <a style={{display: "table-cell"}} href="https://bitbucket.org/site/oauth2/authorize?client_id=thwTU3aUh8ZBQNXyXA&response_type=token" target="_blank">
                    BitBucket
                </a><br/>
                <a style={{display: "table-cell"}} href="https://github.com/login/oauth/authorize?client_id=1908c6dc58ef2187341f" target="_blank">
                    Github
                </a><br/>
                <a style={{display: "table-cell"}} href="https://gitlab.com/oauth/authorize?client_id=cf78ad0e83e8c8f5e4cc8b60ef0250e1d1a299cd9f3ec91ec9d54399eb52e102&redirect_uri=http://localhost:3000/profile&response_type=token" target="_blank">
                    Gitlab
                </a>
                <p>{JSON.stringify(this.state.data)}</p>
            </div>
        );
    }
}

export default App;