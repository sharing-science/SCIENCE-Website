import React, { useState } from "react";

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

const UploadFilePage = () => {
  const [uploadInput, setUploadInput] = useState();

  const fileUploaded = (e) => {
    e.target.files ? console.log(e.target.files) : console.log("problem");

    setUploadInput(e.target.files);
  };

  return (
    <>
      <NavBar />
      <div className="wrapper">
        <img
          alt="..."
          className="dots"
          src={require("assets/img/dots.png").default}
        />
        <img
          alt="..."
          className="path"
          src={require("assets/img/path4.png").default}
        />
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
                              {uploadInput ? "File Uploaded" : "Upload File"}
                              <Input type="file" onChange={fileUploaded} />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              placement="right"
                              target="UploadFileButton"
                            >
                              {uploadInput
                                ? uploadInput[0].name +
                                  " was successfully uploaded"
                                : "Click to upload your file"}
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
                        Click to submit your file
                      </UncontrolledTooltip>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default UploadFilePage;
