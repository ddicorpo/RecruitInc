import * as React from 'react';
import Header from '../components/Header'

class App extends React.Component {

	componentDidMount(){
		fetch("http://localhost:6969/api/hi")
			.then((response) => { return Promise.resolve(response.json()) })
			.then(data => {
				let items = data
				console.log("state", items)
			})
	}
	render(){
		return (
		<div>
 		<Header />;
 		<p>Hi from Index</p>
		 </div>
		);
	}
}


export default App;