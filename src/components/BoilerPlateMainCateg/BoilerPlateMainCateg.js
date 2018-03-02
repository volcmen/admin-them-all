import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';


const ColorGetter = (status) => {
    switch (status) {
        case 'Active':
            return 'success';
        case 'Editing':
            return 'warning';
        case 'Deleted':
            return 'danger';
        default:
            return 'secondary';
    }
};

const ColGenerator = ({ elem, link }) => (
    <Col sm="3" className="my-2">
        <Link to={`/app/${link}/${elem._id}`}>
            <Card color={ColorGetter(elem.status)}>
                {elem.image && <CardImg src={elem.image} />}
                <CardBody>
                    {elem.title && <CardTitle>{elem.title}</CardTitle>}
                    {elem.description && <CardTitle>{elem.description}</CardTitle>}
                    {elem.firstName && <CardTitle>{`${elem.firstName} ${elem.lastName}`}</CardTitle>}
                    {elem.category && <CardTitle>{elem.category}</CardTitle>}
                    <CardSubtitle>{elem._id}</CardSubtitle>
                </CardBody>
            </Card>
        </Link>
    </Col>
);

const BoilerPlateMainCateg = ({ title, array, linkTo }) => (
    <section>
        <h1>{title}</h1>

        <Row>
            <Col sm="3">
                <Card body inverse color="info">
                    <CardBody>
                        <CardTitle>{`New ${title}`}</CardTitle>
                        <Link to={`/app/${linkTo}/new`}>
                            <Button color="secondary">Create</Button>
                        </Link>
                    </CardBody>
                </Card>
            </Col>
            {array && array.map(item => <ColGenerator elem={item} link={linkTo} key={item._id} />)}
        </Row>
    </section>
);

export default BoilerPlateMainCateg;
