import * as React from 'react';
import './style.css';
import styled from 'styled-components';
import { shadow } from '../../styles/style-utils';

let LegendDiv = styled.div`
    max-width: 500px;
    min-width: 300px;    
    background: #F9F9F9;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    margin-top: 20px;
    margin-left: 0px;
    border-radius: 6px;    
    ${shadow()}
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
        <HeaderDiv>ActiveTime</HeaderDiv>
        <TextDiv>
            Node has not been active for more than # of Masternodes * 2.6 minutes
        </TextDiv>
        <HeaderDiv>Status</HeaderDiv>
        <TextDiv>
            Node status is not ENABLED or WATCHDOG_EXPIRED
        </TextDiv>
        <HeaderDiv>Protocol</HeaderDiv>
        <TextDiv>
            Node protocol is older than the is allowed. Node requires update.
        </TextDiv>
    </LegendDiv>);
