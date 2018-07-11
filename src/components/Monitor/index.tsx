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
import { NodeTable } from './NodeTable';
import { NodeCount } from './NodeCount';
import { MonitorLegend } from './MonitorLegend';
import styled from 'styled-components';
import { shadow } from '../../styles/style-utils';

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
    a3: allMasternodes(skip: 2000) {
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
    a4: allMasternodes(skip: 3000) {
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
    a5: allMasternodes(skip: 4000) {
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
    a6: allMasternodes(skip: 5000) {
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
    a7: allMasternodes(skip: 6000) {
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
    a8: allMasternodes(skip: 7000) {
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
    const PromoDiv = styled.div`
      width: 400px;      
      background-color: white;
      padding: 20px;
      border-radius: 6px;      
      ${shadow()}
    `;
    return (
      <div>
        <Row>
          <Col span={11} offset={1}>
            <PromoDiv>
              Enjoy this site and want to see more updates?
              <br />Support the $PAC Innovation team and vote!<br />
              <a target="_blank" href="https://masternodes.work/innovation">https://masternodes.work/innovation</a>
            </PromoDiv>
          </Col>
        </Row>
        <br />
        <Row>
          <NodeCount key="Counts" />
        </Row>
        <Row>
          <NodeTable key="Table" data={this.props.nodes} />
        </Row>
        <Row>
          {/* <Col span={22} offset={1}>
            The data and status on this page does not consider every factor involved in Masternode status.
              However, what it does display should be mostly accurate. If you see any errors or incorrect status
              please contact me on&nbsp;
              <a target="_blank" href="http://discordapp.com">discord</a> @ <b>semiformal#9897</b><br />
            <br />
          </Col> */}
          <Col span={22} offset={1}>
          <br/>
            If you see any errors or incorrect status please contact me on&nbsp;
              <a target="_blank" href="http://discordapp.com">discord</a> @ <b>semiformal#9897</b><br />            
          </Col>
        </Row>
        <Row>
          <MonitorLegend />
        </Row>

      </div>);
  }

  // Not needed?
  // getContent(row: number, col: number, data: Array<Masternode>) {      
  //   return _.values(data[row])[col];    
  // }  

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
    return (
    <div><h1>ERROR</h1>
        <div>Sorry! Backend data service is offline. <br/>Error Message: {data.error && data.error.message}</div>
    </div>);
  }
  let allMasternodes = _.union(data.a1, data.a2, data.a3, data.a4, data.a5, data.a6, data.a7, data.a8);

  if (Boolean(allMasternodes)) {
    return (
      <RenderData nodes={allMasternodes} />
    );
  }

  return <div>Something awful</div>;
});