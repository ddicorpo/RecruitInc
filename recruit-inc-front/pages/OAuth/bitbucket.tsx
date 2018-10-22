import * as React from 'react';
import Header from '../../components/Header'

interface IBitbucketLoginState {
    data: String | {}
}

class App extends React.Component <any, IBitbucketLoginState> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: "Please log in for me to be able to get info from Bitbucket"
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

        console.log("code: " + code);
        return;
    }

    render(){
        return (
            <div>
                <Header />
                <p>If not automatically redirected click login to BitBucket.</p>
                <a href="https://bitbucket.org/site/oauth2/authorize?client_id=thwTU3aUh8ZBQNXyXA&response_type=code">
                    Login to BitBucket
                </a><br/>
                <p>{JSON.stringify(this.state.data)}</p>
            </div>
        );
    }
}

export default App;