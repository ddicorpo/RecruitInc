"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Header_1 = require("../components/Header");
class App extends React.Component {
    componentDidMount() {
        fetch("http://localhost:6969/api/hi")
            .then((response) => { return Promise.resolve(response.json()); })
            .then(data => {
            let items = data;
            console.log("state", items);
        });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Header_1.default, null),
            ";",
            React.createElement("p", null, "Hi from Index")));
    }
}
exports.default = App;
// export default () => (
// 	<div>
// 		<Header />
// 		<p>Hi from index</p>
// 	</div>
// )
