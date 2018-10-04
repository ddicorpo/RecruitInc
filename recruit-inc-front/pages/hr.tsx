import * as React from 'react';
import Header from '../components/Header'

interface IHRState {
    data: String | {}
}

class App extends React.Component <any, IHRState> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: "looking... (please wait a coupe of seconds)"
        }
    }

    componentDidMount() {
        return fetch("http://localhost:6969/api/github/candidate/hr/37780cb5a0cd8bbedda4c9537ebf348a6e402baf/montreal")
            .then((response) => {
                return Promise.resolve(response.text())
            })
            .then(data => {
                this.setState({data});
                console.log("state", data);
            });
    }
    render(){
        return (
            <div>
                <Header />
                <p>Hi from HR</p>
                <p>Here is a list of dev candidate in a specific location (Montreal): </p>
                <p>{JSON.stringify(this.state.data)}</p>
            </div>
        );
    }
}


export default App;