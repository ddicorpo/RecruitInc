import * as React from 'react';
import Header from '../../components/Header'

interface IGithubLoginState {
    data: String | {}
}

class App extends React.Component <any, IGithubLoginState> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: "Please log in for me to be able to get info from Github"
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
            return fetch(`http://localhost:6969/api/oauth/oauthcode/github/${code}`)
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
                <p>If not automatically redirected click login to Github.</p>
                <a href="https://github.com/login/oauth/authorize?client_id=1908c6dc58ef2187341f">
                    Login to Github
                </a><br/>
                <p>{JSON.stringify(this.state.data)}</p>
            </div>
        );
    }
}

export default App;