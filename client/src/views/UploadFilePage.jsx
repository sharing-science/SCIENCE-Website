import React, { useState } from "react";
import axios from "axios";

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
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const UploadFilePage = () => {
  const [uploadInput, setUploadInput] = useState();
  const [fileName, setFileName] = useState("xyz");

  const fileUploaded = (e) => {
    if (!e.target.files) {
      console.log("Error Uploading File");
    }
    setUploadInput(e.target.files);
  };

  const submitDownloadFile = () => {
    axios({
      url: "http://localhost:5000/?filename=" + fileName, //your url
      method: "GET",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  };
  const submitFile = () => {
    // Create an object of formData
    const formData = new FormData();
    // Update the formData object
    formData.append('file', uploadInput[0]);
    formData.append('filename', uploadInput[0].name);

    // Request made to the backend api
    // Send formData object
    axios.post("http://localhost:5000/", formData);
  };

  return (
    <>
      <NavBar />
      <div className="wrapper">
        <img
          alt="..."
          className="path"
          src={require("../assets/img/path4.png").default}
        />
        <section className="section">
          <Container>
            <Row>
              <Col md="6">
                <Card className="card-plain">
                  <CardHeader>
                    <h1 className="profile-title text-left">
                      File Upload and Download
                    </h1>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col md="6">
                          <h1>Upload</h1>
                          <FormGroup>
                            <Button
                              className="btn-round"
                              color="info"
                              data-placement="right"
                              id="UploadFileButton"
                              type="button"
                            >
                              {uploadInput ? "File Uploaded" : "Upload File"}
                              <Input type="file" onChange={fileUploaded} />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              placement="left"
                              target="UploadFileButton"
                            >
                              {uploadInput
                                ? uploadInput[0].name +
                                  " was successfully uploaded"
                                : "Click to upload your file"}
                            </UncontrolledTooltip>
                            <Button
                              className="btn-round"
                              color="info"
                              data-placement="right"
                              id="SubmitFilesButton"
                              type="button"
                              onClick={submitFile}
                            >
                              Submit
                            </Button>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <h1>Download</h1>
                          <FormGroup>
                            Filename
                            <Input
                              type="text"
                              onChange={(e) => setFileName(e.target.value)}
                              value={fileName}
                            />
                            <Button
                              className="btn-round mt-4"
                              color="info"
                              data-placement="right"
                              type="button"
                              onClick={submitDownloadFile}
                            >
                              Submit
                            </Button>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6"></Col>
                      </Row>
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
