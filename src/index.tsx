import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { Router, Route, Switch, Redirect } from 'react-router';
import { Root } from './components/Root';
import { Navbar } from './components/Navbar';
// import { TodoApp } from './containers/TodoApp';
import { TodoModel } from './models/TodoModel';
import { TodoStore } from './stores/TodoStore';
import { RouterStore } from './stores/RouterStore';
import { MonitorStore } from './stores/MonitorStore';
import { STORE_TODO, STORE_ROUTER, STORE_MONITOR } from './constants/stores';
// import { TodoFilter } from './constants/todos';

import registerServiceWorker from './registerServiceWorker';
// import App from './components/App';
import { Home } from './components/Home';
import Monitor from './components/Monitor';
import { Hosting } from './components/Hosting';
import './index.css';

// Apollo stuff
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// enable MobX strict mode
useStrict(true);

// default fixtures for TodoStore
const defaultTodos = [
  new TodoModel('Use Mobx'),
  new TodoModel('Use React', true),
];

// prepare MobX stores
const history = createBrowserHistory();
const todoStore = new TodoStore(defaultTodos);
const routerStore = new RouterStore(history);
const monitorStore = new MonitorStore();
const rootStores = {
  [STORE_TODO]: todoStore,
  [STORE_ROUTER]: routerStore,
  [STORE_MONITOR]: monitorStore
};

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjdghvl9j63on0185hu1km26a' }),
  cache: new InMemoryCache()
});

// ReactDOM.render(
//   <App />,
//   document.getElementById('root') as HTMLElement
// );

// render react DOM
ReactDOM.render(
  <Provider key="b" {...rootStores} >
    <Root>
      <ApolloProvider client={client}>
        <Router history={history} >
          <Navbar>
            <Switch>
              <Route path="/" exact={true}>
                <Redirect                  
                  to={{
                    ...location,
                    pathname: '/monitor'
                  } as any}
                />
              </Route>
              <Route path="/monitor" component={Monitor} />
              <Route path="/hosting" component={Hosting} />
            </Switch>
          </Navbar>
        </Router>
      </ApolloProvider>
    </Root>
  </Provider >,
  document.getElementById('root')
);
registerServiceWorker();
