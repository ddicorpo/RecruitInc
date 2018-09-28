import * as React from 'react';
import Header from '../components/Header'

interface IAdminState {
    data: String | {}
}

class App extends React.Component <any, IAdminState> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: "There is no data fetched yet"
        }
    }

    componentDidMount() {
        fetch("http://localhost:6969/api/github/candidate/hr")
            .then((response) => {
                return Promise.resolve(response.json())
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
                <p>Here is a list of dev candidate in a specific location: </p>
                <p>{JSON.stringify(this.state.data)}</p>
            </div>
        );
    }
}


export default App;