import { History } from 'history';
import { observable, action } from 'mobx';
import { computed } from 'mobx';
import { ObservableArray } from 'mobx/lib/types/observablearray';

export class MonitorStore {
  @observable
  public thecount: number;
  public nodes: Array<any>;

  constructor(history?: History) {       
    this.nodes = observable<any>([]);
  }

  getNodes  = (): Array<any> => {
    return this.nodes;
  }

}

export default MonitorStore;
