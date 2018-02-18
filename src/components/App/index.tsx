import * as React from 'react';
import './App.css';
import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { STORE_TODO, STORE_ROUTER } from '../../constants/stores';
import { RouterStore } from '../../stores/RouterStore';

const logo = require('../../assets/logo.svg');

@inject(STORE_TODO, STORE_ROUTER)
@observer
class App extends React.Component {

  render() {
    const router = this.props[STORE_ROUTER] as RouterStore;

    return (
      <div className="App">         
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">                  
          To get started, edit <code>src/App.tsx</code> and save to reload.          
        </p>      
        <Button type="primary" onClick={router.increment}>Button {router.thecount}</Button>  
      </div>
    );
  }
    
}

export default App;
