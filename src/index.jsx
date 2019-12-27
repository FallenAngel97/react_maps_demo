import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import store from "./reduxStore";

import "./index.less";
import Template from './components/Template';

class Index extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Template />
      </Provider>
    )
  }
}

ReactDOM.render(
  <Index />,
  document.getElementById('app')
)