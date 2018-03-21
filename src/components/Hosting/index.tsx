import * as React from 'react';
import './style.css';
import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { STORE_TODO, STORE_ROUTER } from '../../constants/stores';
import { RouterStore } from '../../stores/RouterStore';

@inject(STORE_ROUTER)
@observer
export class Hosting extends React.Component {

  render() {
    const router = this.props[STORE_ROUTER] as RouterStore;

    return (
      <div className="App">         
        Hosting things here <br />               
      </div>
    );
  }
    
}
