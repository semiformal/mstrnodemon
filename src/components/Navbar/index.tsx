import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { STORE_TODO, STORE_ROUTER } from '../../constants/stores';
import { RouterStore } from '../../stores/RouterStore';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, NavLink } from 'react-router-dom';
// import { withRouter } from 'react-router-dom';
// import { Header, Content, Footer } from 'antd/lib/layout';
import styled from 'styled-components';
import { shadow } from '../../styles/style-utils';

@inject(STORE_TODO, STORE_ROUTER)
@observer
export class Navbar extends React.Component<any, any> {

    render() {
        // let router =  this.props.router;
        // let props = this.props;

        const LayoutHeader = styled(Layout.Header)`
            height: 48px;
            background: white;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        `;

        const LayoutContent = styled(Layout.Content)`
            background: rgb(240,240,240);  
        `;

        const LayoutFooter = styled(Layout.Footer)`
            background: white;
            margin-top: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        `;

        const MenuStyled = styled(Menu as any)`
            border-bottom: 0;
        `;

        return (
            <Layout className="layout" >
                <LayoutHeader className="header" >
                    <div className="logo" />
                    <MenuStyled
                        mode="horizontal"
                        selectedKeys={[this.props.router.location.pathname]}
                    // style={{ lineHeight: '64px' }}
                    >
                        {/* <Menu.Item key="/"><Link to="/">Home</Link></Menu.Item> */}
                        <Menu.Item key="/monitor"><Link to="/monitor">Monitor</Link></Menu.Item>
                        <Menu.Item key="/hosting"><a href="http://masternodes.work">Hosting</a></Menu.Item>
                    </MenuStyled>
                </LayoutHeader>
                <LayoutContent
                    style={{ padding: '12px 50px' }}
                    className="content"
                >
                    {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb> */}
                    {/* <div style={{ padding: 24, minHeight: 280 }}>{this.props.children}</div> */}
                    {this.props.children}
                </LayoutContent>
                <LayoutFooter style={{ textAlign: 'center' }} className="footer">
                    Copyright 2018 © C2CV Holdings, LLC. All rights reserved.<br /><br />
                    With $PAC Launch just starting we are working on finishing our
                    Terms and Privacy Policy.
                </LayoutFooter>
            </Layout>
        );
        // return (
        //     <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>{this.props.children}</div>
        // );
    }
}

// export const Navbar = withRouter(props => <NavbarInner {...props}/>);
