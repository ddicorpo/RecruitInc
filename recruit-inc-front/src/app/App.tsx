import * as React from 'react';
import * as ReactDOM from 'react-dom';
import WholePageContainer from "./components/WholePageContainer";
declare let module: any

ReactDOM.render(<WholePageContainer />,
document.getElementById('root'));

if (module.hot) {
    module.hot.accept();
}