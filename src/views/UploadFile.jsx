import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";

const UploadFile = () => {
  return (
    <>
      <NavBar />
      <div className="wrapper">
        <section className="section">
          <Container>
            <Row>
              <Col md="6">
                <Card className="card-plain">
                  <CardHeader>
                    <h1 className="profile-title text-left">File Upload</h1>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label>File Name</label>
                            <Input type="text" />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <Button
                              className="btn-round"
                              color="primary"
                              data-placement="right"
                              id="UploadFileButton"
                              type="button"
                            >
                              Upload File
                              <Input type="file" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              placement="right"
                              target="UploadFileButton"
                            >
                              Click to upload your file
                            </UncontrolledTooltip>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Button
                        className="btn-round float-right"
                        color="primary"
                        data-placement="right"
                        id="SubmitFilesButton"
                        type="button"
                      >
                        Submit
                      </Button>
                      <UncontrolledTooltip
                        delay={0}
                        placement="right"
                        target="SubmitFilesButton"
                      >
                        Click to upload your file
                      </UncontrolledTooltip>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
              <Col className="ml-auto" md="4">
                <div className="info info-horizontal pt-4">
                  <div className="icon icon-primary">
                    <i className="tim-icons icon-square-pin" />
                  </div>
                  <div className="description">
                    <h4 className="info-title">Find us at the office</h4>
                    <p>
                      RPI, <br />
                      Troy, <br />
                      USA
                    </p>
                  </div>
                </div>
                <div className="info info-horizontal">
                  <div className="icon icon-primary">
                    <i className="tim-icons icon-mobile" />
                  </div>
                  <div className="description">
                    <h4 className="info-title">Give us a ring</h4>
                    <p>
                      Landline <br />
                      123456789 <br />
                      Mon - Fri, 8:00-22:00
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default UploadFile;
