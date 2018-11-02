import * as React from 'react';
import Header from '../components/Header'

class App extends React.Component {
    state = {
        username: '',
        data: ''
    };

    constructor(props: any) {
        super(props);
        this.state = {
            username: ``,
            data: ''
        }
    }

    handleChange(event: any) {
        this.setState({username: event.target.value});
    }

    componentDidMount() {
        let url: string = window.location.href;
        let platform :string = url.substring(url.indexOf("platform=") + 9,  url.indexOf("&"));
        let code: string = url.substring(url.indexOf("code=") + 5);

        console.log(platform);
        if(code != null) {
            return fetch(`http://localhost:6969/api/oauth/oauthcode/${platform}/${code}`)
                .then((response) => {
                    return Promise.resolve(response.text())
                })
                .then(data => {
                    this.setState({data});
                });
        }
        return;
    }

    render(){
        return (
            <div>
                <Header />
                <br/>
                {/*<form>*/}
                    {/*Recruit.Inc Username: <input type="text" name="username" value={this.state.username} onChange={this.handleChange.bind(this)}/>*/}
                {/*</form>*/}
                {/*<p>Information for: {this.state.username}</p>*/}
                {/*<p>You can login to the following platforms to allow Recruit.Inc to assess your skills.</p>*/}
                <a style={{display: "table-cell"}} href={"https://bitbucket.org/site/oauth2/authorize?client_id=thwTU3aUh8ZBQNXyXA&response_type=code"}>
                    BitBucket
                </a><br/>
                <a style={{display: "table-cell"}} href={"https://github.com/login/oauth/authorize?client_id=1908c6dc58ef2187341f&redirect_uri=http://localhost:3000/profile?username="+this.state.username+"?platform=github"}>
                    Github
                </a>
                <br/>
                <a style={{display: "table-cell"}} href={"https://gitlab.com/oauth/authorize?client_id=cf78ad0e83e8c8f5e4cc8b60ef0250e1d1a299cd9f3ec91ec9d54399eb52e102&redirect_uri=http://localhost:3000/profile?username="+this.state.username+"?platform=gitlab&response_type=code"}>
                    Gitlab
                </a>
                <p>{JSON.stringify(this.state.data)}</p>
            </div>
        );
    }
}

export default App;