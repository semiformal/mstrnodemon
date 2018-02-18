import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
// import { STORE_TODO, STORE_ROUTER } from '../../constants/stores';
// import { RouterStore } from '../../stores/RouterStore';
// import { Layout, Menu, Breadcrumb } from 'antd';
// import { Link } from 'react-router-dom';
// import { withRouter } from 'react-router-dom';
// import { Header, Content, Footer } from 'antd/lib/layout';
import ReactTable from 'react-table';
import * as _ from 'lodash';

const COUNT_QUERY = gql`
  query {
    nodecount {
      count,
      PRE_ENABLED,
      ENABLED,
      EXPIRED,
      UPDATE_REQUIRED,
      WATCHDOG_EXPIRED,
      NEW_START_REQUIRED,
      POSE_BAN
    }
  }`;

type Response = {
    nodecount: any;
};

class NodeCountInner extends React.Component<any, any> {

    render() {
        const counts = this.props.data;
        return (
            <div className="NodeCount-counts">
             Total: {counts.count}&nbsp;<br/>
             PreEnabled: {counts.PRE_ENABLED}&nbsp;
             Enabled: {counts.ENABLED}&nbsp;
             NewStart: {counts.NEW_START_REQUIRED}&nbsp;
             Watchdog: {counts.WATCHDOG_EXPIRED}&nbsp;
             PosBan: {counts.POSE_BAN}&nbsp;
             Expired: {counts.EXPIRED}&nbsp;
             Update: {counts.UPDATE_REQUIRED}
            </div>);
    }

}

export const queryNode = graphql<{ nodecount: any }>(COUNT_QUERY, {});

export const NodeCount = queryNode(({ data: data }) => {
    if (!data) {
        return <div>Data is bad</div>;
    }
    if (Boolean(data.loading)) {
        return <div>Loading</div>;
    }
    if (Boolean(data.error)) {
        return <h1>ERROR</h1>;
    }
    if (Boolean(data.nodecount)) {
        let counts = data.nodecount;
        return <NodeCountInner data={counts}/>;
    }

    return <div>Something awful</div>;
});