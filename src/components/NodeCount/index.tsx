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
import styled from 'styled-components';
import { shadow } from '../../styles/style-utils';

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

        const NodeCountDiv = styled.div`
            color: white;
            background-color: #2E3644;
            padding: 20px;
            border-radius: 6px;      
            ${shadow()}
        `;

        const NodeCountSpan = styled.span`
            font-weight: 600;
            letter-spacing: 1px;
            padding-right: 0px;
        `;

        const counts = this.props.data;
        return (
            <NodeCountDiv>
                <NodeCountSpan>Total</NodeCountSpan>: {counts.count}&nbsp;<br />
                <NodeCountSpan>PreEnabled</NodeCountSpan>: {counts.PRE_ENABLED}&nbsp;&nbsp;
                <NodeCountSpan>Enabled</NodeCountSpan>: {counts.ENABLED}&nbsp;&nbsp;
                <NodeCountSpan>NewStart</NodeCountSpan>: {counts.NEW_START_REQUIRED}&nbsp;&nbsp;
                <NodeCountSpan>Watchdog</NodeCountSpan>: {counts.WATCHDOG_EXPIRED}&nbsp;&nbsp;
                <NodeCountSpan>PosBan</NodeCountSpan>: {counts.POSE_BAN}&nbsp;&nbsp;
                <NodeCountSpan>Expired</NodeCountSpan>: {counts.EXPIRED}&nbsp;&nbsp;
                <NodeCountSpan>Update</NodeCountSpan>: {counts.UPDATE_REQUIRED}
            </NodeCountDiv>);
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
        return <NodeCountInner data={counts} />;
    }

    return <div>Something awful</div>;
});
