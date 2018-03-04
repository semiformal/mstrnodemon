import * as React from 'react';
import './style.css';
import { Button, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import { STORE_MONITOR } from '../../constants/stores';
import { MonitorStore } from '../../stores/MonitorStore';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { NodeTable } from '../NodeTable';
import { NodeCount } from '../NodeCount';
import { MonitorLegend } from './MonitorLegend';

// virtualized
import 'react-virtualized/styles.css';
import { Grid, Table, Column, defaultTableRowRenderer } from 'react-virtualized';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const MN_QUERY = gql`
  query {
    a1: allMasternodes {
      id,
      status,
      outpoint,
      activeseconds,
      id,
      ip,
      lastpaidblock,
      lastpaidtime,
      lastseen,
      payee,
      protocol,
      updatetime 
    }
    a2: allMasternodes(skip: 1000) {
      id,
      status,
      outpoint,
      activeseconds,
      id,
      ip,
      lastpaidblock,
      lastpaidtime,
      lastseen,
      payee,
      protocol,
      updatetime 
    }
  }
`;

type Masternode = {
  id: string;
  status: string;
  outpoint: string;
  activeseconds: number;
  ip: string;
  lastpaidblock: number;
  lastpaidtime: number;
  lastseen: number;
  payee: string;
  protocol: number;
  updatetime: number;
};

type Response = {
  allMasternodes: Array<Masternode>;
};

// @inject(STORE_MONITOR)
// @observer
// class Monitor extends React.Component {

//   render() {
//     const monStore = this.props[STORE_MONITOR] as MonitorStore;

//     return (
//       <div className="App">      
//         [Monitor things here <br />
//         <Button type="primary" onClick={monStore.increment}>Button {monStore.thecount}</Button>
//         allNodes()
//       </div>
//     );
//   }

// }
// { nodes, columnIndex, key, parent, rowIndex, style }: any

// }

// export interface GridContext {
//   actions: Array<Masternode>;
// }

class RenderData extends React.Component<any, any> {

  static childContextTypes = {
    nodes: PropTypes.array
  };

  constructor(props: any, context: any) {
    super(props, context);
  }

  getChildContext() {
    return {
      nodes: this.props.nodes
    };
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={22} offset={1}>
            The data and status on this page does not consider every factor involved in Masternode status.
              However, what it does display should be mostly accurate. If you see any errors or incorrect status
              please contact me on&nbsp;
              <a target="_blank" href="http://discordapp.com">discord</a> @ <b>semiformal#9897</b><br />
            <br />
          </Col>
        </Row>
        <Row>
          <NodeCount key="Counts" />
        </Row>
        <Row>
          <NodeTable key="Table" data={this.props.nodes} />
        </Row>
        <Row>
          <MonitorLegend />
        </Row>

      </div>);

    // [
    //   (
    //     <div key="Intro" style={{ maxWidth: '600px' }}>
    //       The data and status on this page does not consider every factor involved in Masternode status.
    //       However, what it does display should be mostly accurate. If you see any errors or incorrect status
    //       please contact me on&nbsp;
    //       <a target="_blank" href="http://discordapp.com">discord</a> @ <b>semiformal#9897</b><br />
    //       <br />
    //     </div>
    //   ),
    //   <NodeCount key="Counts" /> ,
    //   <NodeTable key="Table" data={this.props.nodes} /> ,
    //   (
    //     <div key="Legend">
    //       The
    //   </div>)
    // ];
  }

  getContent(row: number, col: number, data: Array<Masternode>) {
    return _.values(data[row])[col];
  }

}

export const allNodes = graphql<any>(MN_QUERY, {});

export default allNodes(({ data: data }) => {
  if (!data) {
    return <div>Data is bad</div>;
  }
  if (Boolean(data.loading)) {
    return <div>Loading</div>;
  }
  if (Boolean(data.error)) {
    return <div><h1>ERROR</h1><div>{data.error}</div></div>;    
  }
  let allMasternodes = _.union(data.a1, data.a2);
  
  if (Boolean(allMasternodes)) {
    return (
      <RenderData nodes={allMasternodes} />
    );
  }

  return <div>Something awful</div>;
});