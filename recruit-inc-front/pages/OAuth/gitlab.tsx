import * as React from 'react';
import Header from '../../components/Header'

interface IGitlabLoginState {
    data: String | {}
}

class App extends React.Component <any, IGitlabLoginState> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: "Please log in for me to be able to get info from Gitlab"
        }
    }

    componentDidMount() {

        let url: string = window.location.href;

        let start = url.indexOf("code=") + 5;
        let end = url.indexOf("&");
        let code: string;
        if(end == null){
            code = url.substring(start, end);
        }
        else{
            code = url.substring(start);
        }

        if(code != null) {
            return fetch(`http://localhost:6969/api/oauth/oauthcode/gitlab/${code}`)
                .then((response) => {
                    return Promise.resolve(response.text())
                })
                .then(data => {
                    this.setState({data});
                    console.log("state", data);
                });
        }

        console.log("code: " + code);
        return;
    }

    render(){
        return (
            <div>
                <Header />
                <p>If not automatically redirected click login to GitLab.</p>
                <a href="https://gitlab.com/oauth/authorize?client_id=cf78ad0e83e8c8f5e4cc8b60ef0250e1d1a299cd9f3ec91ec9d54399eb52e102&redirect_uri=http://localhost:3000/OAuth/gitlab&response_type=code">
                    Login to GitLab
                </a><br/>
                <p>{JSON.stringify(this.state.data)}</p>
            </div>
        );
    }
}

export default App;