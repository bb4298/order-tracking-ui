import React, { FC, Fragment } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";

import {  Button, Col, Row, Typography, Layout } from 'antd';
import './styles.scss'

const Container: FC = () => {

    let navigate = useNavigate();

    const navigatePage = (pageName: string) => {
        navigate(pageName);
    }

    return (
        <Layout className='container'>
            <Row className='container__row'>
                <Col className='container__column' span={10} offset={7}>
                    <Typography.Title level={1} style={{ margin: 0 }}>BAEMIN ORDER TRACKING SERVICE</Typography.Title>
                </Col>

            </Row>
            <Row className='container__row'>
                <Col className='container__column' span={8}><Button type="primary" onClick={() => { navigatePage("/user") }}>Go to User Page</Button></Col>
                <Col className='container__column' span={8}><Button type="primary" onClick={() => { navigatePage("/merchant") }}>Go to Merchant Page</Button></Col>
                <Col className='container__column' span={8}><Button type="primary" onClick={() => { navigatePage("/driver") }}>Go to Driver Page</Button></Col>
            </Row>
        </Layout>
    );
}

export default Container;
