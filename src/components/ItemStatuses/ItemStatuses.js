import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';

import s from './ItemStatuses.scss';

const ItemStatuses = ({
                          itemId, save, closeLink, tgModal,
                      }) => (
    <Row className="my-3">
        <Col md="4">
            <Button color="success" className="w-100" onClick={save}>Save</Button>
        </Col>
        <Col md="4">
            <Link to={`/app/${closeLink}`}>
                <Button color="secondary" className="w-100">Close</Button>
            </Link>
        </Col>
        {itemId !== 'new' &&
        <Col md="4">
            <Button color="danger" className="w-100" onClick={tgModal}>Delete</Button>
        </Col>
        }
    </Row>
);

export default ItemStatuses;
