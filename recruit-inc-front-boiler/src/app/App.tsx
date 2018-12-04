import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MainWrapper from "./components/MainWrapper";
declare let module: any

ReactDOM.render(<MainWrapper />,
document.getElementById('root'));

if (module.hot) {
    module.hot.accept();
}