import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
// import { STORE_TODO, STORE_ROUTER } from '../../constants/stores';
// import { RouterStore } from '../../stores/RouterStore';
// import { Layout, Menu, Breadcrumb } from 'antd';
// import { Link } from 'react-router-dom';
// import { withRouter } from 'react-router-dom';
// import { Header, Content, Footer } from 'antd/lib/layout';
import { Icon } from 'antd';
import * as moment from 'moment';
import * as _ from 'lodash';

export class NodeTableStatus extends React.Component<any, any> {

    private interval: any;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = { currTime: moment.utc() };
    }

    componentDidMount() {
        this.interval = setInterval(this._tick, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        let updatedTime = moment.unix(Number(_.max(_.map(this.props.data, 'updatetime'))));
        let diff = this.state.currTime.diff(updatedTime) / 1000;
        let alertStyle = {};
        let oldData = diff > 10 * 60;
        if (oldData) {
            alertStyle = { color: '#d22', fontWeight: 'bold' };
        }
        let refreshPage = () => {
            window.location.reload();
        };

        return (
            <div style={{ display: 'flow-root' }}>
                <span style={alertStyle}>
                    Data from: {updatedTime.fromNow()}&nbsp;
                </span>
                {(oldData ?
                    <a onClick={refreshPage} style={{ paddingLeft: '5px', color: 'black' }}>
                        <Icon type="sync" /> refresh for new data
                    </a>
                    : null)
                }
                <span className="NodeTable-legend NodeTable-right">
                    <Icon type="check" className="NodeTable-top10-check" /> = Able to receive reward
                </span>
            </div >
        );
    }

    private _tick = () => {
        this.setState({ currTime: moment.utc() });
    }

}