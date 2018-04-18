import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { STORE_ROUTER } from '../../constants/stores';
import { RouterStore } from '../../stores/RouterStore';
// import { Layout, Menu, Breadcrumb } from 'antd';
// import { Link } from 'react-router-dom';
// import { withRouter } from 'react-router-dom';
// import { Header, Content, Footer } from 'antd/lib/layout';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { NodeTableStatus } from './NodeTableStatus';
import { Icon } from 'antd';
import * as classnames from 'classnames';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as qs from 'qs';
import styled, { StyledFunction } from 'styled-components';
import { shadow } from '../../styles/style-utils';

@inject(STORE_ROUTER)
export class NodeTable extends React.Component<any, any> {

    private customDiv: StyledFunction<any & React.HTMLProps<HTMLInputElement>> = styled.div;

    // TODO: use real stypes and types
    private ProtocolCell = this.customDiv`
        color: ${(props: any) => props.updated ? '#237804' : '#ad2102'};
    `;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = { width: 0, height: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        let ipliststring = qs.parse(this.props.router.location.search.substr(1)).iplist;
        let iparray: string[] = [];
        let tableData = this.props.data as any[];
        let nMnCount = tableData.length;

        let shouldShowMore = this.state.width >= 660;

        let protocolCount = {};
        let nRank = 1;
        let nTenthNetwork = nMnCount / 10;
        let currTime = moment().unix().valueOf();
        tableData = _.sortBy(tableData, 'lastpaidblock');
        tableData = _.map(tableData, (item: any, idx: number) => {

            let sigTime = item.lastseen - item.activeseconds;
            let issues: string[] = [];

            // Currently WATCHDOG_EXPIRED is permited due to active sporks
            if (item.status !== 'ENABLED') {
                issues.push('Status');
            }

            // check protocol version
            // if (item.protocol <= 70212) {
            //     issues.push('Protocol');
            // }

            protocolCount[item.protocol] = (protocolCount[item.protocol] || 0) + 1;

            // TODO: it's in the list (up to 8 entries ahead of current block to allow propagation) -- so let's skip it
            // if(mnpayments.IsScheduled(mnpair.second, nBlockHeight)) continue;

            if ((sigTime + (nMnCount * 2.6 * 60)) > currTime) {
                issues.push('ActiveTime');
            }

            // TODO: make sure it has at least as many confirmations as there are masternodes
            // if(GetUTXOConfirmations(mnpair.first) < nMnCount) continue;

            let rank = 99999;
            let top10 = false;
            if (issues.length === 0) {
                rank = nRank++;
                top10 = Boolean(nRank < nTenthNetwork);
            }

            let newItem = _.clone(item);
            _.assign(newItem, {
                sigTime: item.lastseen + item.activeseconds,
                top10: top10,
                rank: rank,
                issues: issues
            });

            return newItem;
        });

        let nCount = _.filter(tableData, (item: any) => item.issues.length === 0).length;
        nRank = 1;
        let isUpgrading = nCount < (nMnCount / 3);
        tableData = _.each(tableData, (item: any, idx: number) => {

            if (isUpgrading) {
                item.issues = _.filter(item.issues, (item2: any) => item2 !== 'ActiveTime');
            }

            if (item.issues.length === 0) {
                item.rank = nRank++;
                item.top10 = Boolean(nRank < nTenthNetwork);
            }
        });

        let columns = [{
            Header: 'IP',
            accessor: 'ip',
            minWidth: 120,
            maxWidth: 150,
            Cell: row => row.value.split(':')[0]
        }, {
            Header: 'Status',
            accessor: 'status',
            minWidth: 50,
            maxWidth: 200
        }, {
            Header: 'Protocol',
            accessor: 'protocol',
            minWidth: 40,
            Cell: row => <this.ProtocolCell updated={row.value >= 70213}>{row.value}</this.ProtocolCell>
            // show: shouldShowMore
        },
        {
            Header: 'Last Paid',
            id: 'lastpaidtime',
            accessor: d => d.lastpaidtime === 0 ? 'Never' : d.lastpaidtime,
            minWidth: 120,
            maxWidth: 120,
            filterable: false,
            Cell: row => this._timeToDuration(row.value, true, false),
            sortMethod: (a, b, desc) => {
                // force null, undefined, and 0 to the future
                a = (a === null || a === undefined || a === 'Never') ? -Infinity : a;
                b = (b === null || b === undefined || b === 'Never') ? -Infinity : b;
                // Return either 1 or -1 to indicate a sort priority
                if (a > b) {
                    return 1;
                }
                if (a < b) {
                    return -1;
                }
                // returning 0 or undefined will use any subsequent column sorting methods as a tiebreaker
                return 0;
            }
        },
        {
            Header: 'Active Time',
            accessor: 'activeseconds',
            minWidth: 150,
            maxWidth: 150,
            show: shouldShowMore,
            filterable: false,
            Cell: (row) => {
                const dur = moment.duration(row.value * 1000);
                return `
                ${this._getUnit(dur, 'd', true)}
                ${this._getUnit(dur, 'h', true)}
                ${this._getUnit(dur, 'm', true)}`;
            }
        },
        {
            Header: 'Last Seen',
            accessor: 'lastseen',
            minWidth: 120,
            maxWidth: 120,
            show: shouldShowMore,
            filterable: false,
            Cell: (row) => this._timeToDuration(row.value),
        },
        {
            Header: 'Payable',
            accessor: 'rank',
            minWidth: 60,
            maxWidth: 120,
            filterable: false,
            Cell: (row) => (
                <div className={classnames({ 'NodeTable-top10': false })}>
                    {row.original.top10 && row.original.issues.length === 0 ?
                        <Icon type="check" className="NodeTable-top10-check" /> :
                        row.value === 99999 ?
                            <Icon type="close" className="NodeTable-top10-close" /> :
                            row.value}
                </div>
            )
        },
        {
            Header: 'issues',
            accessor: 'issues',
            filterable: false,
            show: shouldShowMore,
            maxWidth: 200,
            Cell: (row) => (<div >{row.value.join(', ')}</div>)
        },
        {
            Header: 'Payee',
            accessor: 'payee',
            show: shouldShowMore,
            maxWidth: 300
        }];

        if (!_.isEmpty(ipliststring)) {
            _.each(ipliststring.split(','), d => iparray.push(d));
            tableData =
                _.filter(tableData, value => _.some(iparray, ip => _.includes(value.ip, ip)));
        }

        tableData = _.sortBy(tableData, 'rank');

        const StyledTable = styled(ReactTable) `
            background: white !important;
            border-radius: 6px;                              
            ${shadow()}
        `;

        const UpgradeStatus = styled.div`
            margin-top: 3px;
            padding: 2px;
            padding-left: 10px;
            font-weight: bold;                        
            background: white !important;
            border-radius: 6px;                              
            ${shadow()}
        `;

        let ProtocolCount = styled.span`
            font-weight: normal;
        `;

        let s = (
            <div>Protocol Counts:&nbsp;
                {_.map(
                    _.keys(protocolCount),
                    (item) =>
                        <span key={item}>
                            &nbsp;&nbsp;{item}:&nbsp;
                            <ProtocolCount key={item}>{protocolCount[item]}</ProtocolCount>
                        </span>
                )}

            </div>);

        let upgradeMessage = isUpgrading ? (
            <UpgradeStatus>
                Network is currently upgrading.&nbsp;
                The ActiveTime requirement is no longer applied.&nbsp;
                Qualifying ({nCount}) is less than Total / 3 ({Math.round(nMnCount / 3)}).<br />
                {s}
            </UpgradeStatus>) :
            null;

        return (
            <div>
                {upgradeMessage}
                <NodeTableStatus data={this.props.data} />
                <StyledTable
                    className={'-highlight -striped'}
                    data={tableData}
                    columns={columns}
                    defaultPageSize={20}
                    filterable={true}
                    defaultFilterMethod={(filter, row, column) => {
                        const id = filter.pivotId || filter.id;
                        return (row[id] !== undefined
                            ? _.startsWith(_.toLower(String(row[id])), _.toLower(filter.value))
                            : true);
                    }}
                />
            </div>
        );
    }

    private _getUnit =
        (dur: moment.Duration, unit: moment.unitOfTime.Base, hideIfNull: boolean = false): string => {
            let val = dur.get(unit);
            return hideIfNull && val === 0 ? '' : `${val}${unit}`;
        }

    private _timeToDuration = (value, showMinutes: boolean = true, showSeconds: boolean = true) => {
        if (value === 'Never') {
            return 'Never';
        } else {
            let paidTime = moment.unix(value).utc();
            let dur = moment.duration(moment.utc().diff(paidTime));
            return `
                ${this._getUnit(dur, 'd', true)}
                ${this._getUnit(dur, 'h', true)}
                ${showMinutes ? this._getUnit(dur, 'm', true) : ''}
                ${showSeconds ? this._getUnit(dur, 's', true) : ''}`;
        }
    }

}
