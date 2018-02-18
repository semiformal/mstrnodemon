import * as React from 'react';
import './style.css';
import styled from 'styled-components';

const LegendDiv = styled.div`
    width: 600px;
    height: 200px;
    background: #d9d9d9;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    margin-top: 10px;
    margin-left: 20px;
    border-radius: '4px 4px 0 0;
`;

const HeaderDiv = styled.div`
    font-weight: bold;
`;

const TextDiv = styled.div`
    margine-left: 10px;
`;

export const MonitorLegend = () => (
    <LegendDiv>
        Legend
        <hr />
        <HeaderDiv style={{ fontWeight: 'bold' }}>ActiveTime</HeaderDiv>
        <TextDiv style={{ marginLeft: '10px' }}>
            Node has not been active for more than # of Masternodes * 2.5 minutes
        </TextDiv>
        <HeaderDiv style={{ fontWeight: 'bold' }}>Status</HeaderDiv>
        <TextDiv style={{ marginLeft: '10px' }}>
            Node status is not ENABLED or WATCHDOG_EXPIRED
        </TextDiv>
        <HeaderDiv style={{ fontWeight: 'bold' }}>Protocol</HeaderDiv>
        <TextDiv style={{ marginLeft: '10px' }}>
            Node protocol is older than the is allowed. Node requires update.
        </TextDiv>
    </LegendDiv>);