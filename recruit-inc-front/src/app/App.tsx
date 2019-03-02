import * as React from 'react';
import * as ReactDOM from 'react-dom';
import WholePageContainer from './components/WholePageContainer';
import 'font-awesome/css/font-awesome.min.css';
declare let module: any;

ReactDOM.render(<WholePageContainer />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
