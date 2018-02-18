import { History } from 'history';
import { RouterStore as BaseRouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { observable, action } from 'mobx';

export class RouterStore extends BaseRouterStore {
  @observable
  public thecount: number;

  constructor(history?: History) {
    super();
    if (history) {
      this.history = syncHistoryWithStore(history, this);
    }
    this.thecount = 0;
  }
  
  @action
  increment = (): void => {
    this.thecount++;
  }

}

export default RouterStore;
