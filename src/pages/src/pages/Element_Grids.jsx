import * as React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

import PageBreadcrumb from '../componets/PageBreadcrumb';

export default function Element_Grids() {
  return (
    <>
    <div className="themebody-wrap">
        {/* breadcrumb start */}
        <PageBreadcrumb pagename="Grid" />
        {/* breadcrumb end */}
        {/* theme body start */}
        <div className="theme-body cdxshopping-cart">
            <Container fluid>
                <Row >
                    <Col sm={12}>
                        <Card>
                            <Card.Header>
                                <h4>grid options</h4>
                            </Card.Header>
                            <Card.Body className="card-body">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">xs
                                                <br />
                                                <span className="fw-normal">&lt;576px</span>
                                            </th>
                                            <th scope="col">sm
                                                <br />
                                                <span className="fw-normal">≥576px</span>
                                            </th>
                                            <th scope="col">md
                                                <br />
                                                <span className="fw-normal">≥768px</span>
                                            </th>
                                            <th scope="col">lg
                                                <br />
                                                <span className="fw-normal">≥992px</span>
                                            </th>
                                            <th scope="col">xl
                                                <br />
                                                <span className="fw-normal">≥1200px</span>
                                            </th>
                                            <th scope="col">xxl
                                                <br />
                                                <span className="fw-normal">≥1400px</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th className="text-nowrap" scope="row">Container <code className="fw-normal">max-width</code>
                                            </th>
                                            <td>None (auto)</td>
                                            <td>540px</td>
                                            <td>720px</td>
                                            <td>960px</td>
                                            <td>1140px</td>
                                            <td>1320px</td>
                                        </tr>
                                        <tr>
                                            <th className="text-nowrap" scope="row">Class prefix</th>
                                            <td>
                                                <code>.col-</code>
                                            </td>
                                            <td>
                                                <code>.col-sm-</code>
                                            </td>
                                            <td>
                                                <code>.col-md-</code>
                                            </td>
                                            <td>
                                                <code>.col-lg-</code>
                                            </td>
                                            <td>
                                                <code>.col-xl-</code>
                                            </td>
                                            <td>
                                                <code>.col-xxl-</code>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-nowrap" scope="row"># of columns</th>
                                            <td colSpan="6">12</td>
                                        </tr>
                                        <tr>
                                            <th className="text-nowrap" scope="row">Gutter width</th>
                                            <td colSpan="6">1.5rem (.75rem on left and right)</td>
                                        </tr>
                                        <tr>
                                            <th className="text-nowrap" scope="row">Custom gutters</th>
                                            <td colSpan="6">
                                                <a href="/docs/5.0/layout/gutters/">Yes</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-nowrap" scope="row">Nestable</th>
                                            <td colSpan="6">
                                                <a href="#nesting">Yes</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-nowrap" scope="row">Column ordering</th>
                                            <td colSpan="6">
                                                <a href="/docs/5.0/layout/columns/#reordering">Yes</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={12}>
                        <Card>
                            <Card.Header>
                                <h4>Grid Column</h4>
                            </Card.Header>
                            <Card.Body className="card-body grid-exa">
                                <Row>
                                    <Col sm={7}>
                                        <span>col 7</span>
                                    </Col>
                                    <Col sm={5}>
                                        <span>col 5</span>
                                    </Col>
                                    <Col sm={4}>
                                        <span>col 4</span>
                                    </Col>
                                    <Col sm={6}>
                                        <span>col 6</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={6}>
                                        <span>col 6</span>
                                    </Col>
                                    <Col sm={6}>
                                        <span>col 6</span>
                                    </Col>
                                    <Col sm={4}>
                                        <span>col 4</span>
                                    </Col>
                                    <Col sm={4}>
                                        <span>col 4</span>
                                    </Col>
                                    <Col sm={4}>
                                        <span>col 4</span>
                                    </Col>
                                    <Col sm={3}>
                                        <span>col 3</span>
                                    </Col>
                                    <Col sm={3}>
                                        <span>col 3</span>
                                    </Col>
                                    <Col sm={3}>
                                        <span>col 3</span>
                                    </Col>
                                    <Col sm={3}>
                                        <span>col 3</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                    <Col sm={1}>
                                        <span>col 1</span>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={12}>
                        <Card>
                            <Card.Header>
                                <h4>Equal width Column</h4>
                            </Card.Header>
                            <Card.Body className="card-body grid-exa">
                                <div className="row">
                                    <Col sm={6}>
                                        <span>col 6</span>
                                    </Col>
                                    <Col sm={6}>
                                        <span>col 6</span>
                                    </Col>
                                    <Col sm={4}>
                                        <span>col 4</span>
                                    </Col>
                                    <Col sm={4}>
                                        <span>col 4</span>
                                    </Col>
                                    <Col sm={4}>
                                        <span>col 4</span>
                                    </Col>
                                    <Col sm={3}>
                                        <span>col 3</span>
                                    </Col>
                                    <Col sm={3}>
                                        <span>col 3</span>
                                    </Col>
                                    <Col sm={3}>
                                        <span>col 3</span>
                                    </Col>
                                    <Col sm={3}>
                                        <span>col 3</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                    <Col sm={2}>
                                        <span>col 2</span>
                                    </Col>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={12}>
                        <Card>
                            <Card.Header>
                                <h4>Responsive Column</h4>
                            </Card.Header>
                            <Card.Body className="card-body grid-exa">
                                <div className="row">
                                    <Col md={8}>
                                        <span>col-md-8</span>
                                    </Col>
                                    <Col md={4}>
                                        <span>col-md-4</span>
                                    </Col>
                                    <Col md={6}>
                                        <span>col-md-6 </span>
                                    </Col>
                                    <Col md={6}>
                                        <span>col-md-6</span>
                                    </Col>
                                    <Col xl={4} lg={6}>
                                        <span>col-xl-4 col-lg-6</span>
                                    </Col>
                                    <Col xl={4} lg={6}>
                                        <span>col-xl-4 col-lg-6</span>
                                    </Col>
                                    <Col xl={4} lg={6}>
                                        <span>col-xl-4 col-lg-6</span>
                                    </Col>
                                    <Col xl={3} lg={4} md={6}>
                                        <span>col-xl-3 col-lg-4 col-md-6</span>
                                    </Col>
                                    <Col xl={3} lg={4} md={6}>
                                        <span>col-xl-3 col-lg-4 col-md-6</span>
                                    </Col>
                                    <Col xl={3} lg={4} md={6}>
                                        <span>col-xl-3 col-lg-4 col-md-6</span>
                                    </Col>
                                    <Col xl={3} lg={4} md={6}>
                                        <span>col-xl-3 col-lg-4 col-md-6</span>
                                    </Col>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
        {/* theme body end */}
    </div>
    
</>
  )
}
