import React, { useContext, useEffect, useState } from 'react'

// reactstrap components
import {
  Button,
  Container,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Input,
  Table,
} from 'reactstrap'

// core components
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Context from '../Helpers/Context'
import getWeb3 from '../Helpers/getWeb3'
import Rating from '../contracts/Rating.json'

const CommitteePage = () => {
  const { contextValue } = useContext(Context)

  const [contracts, setContracts] = useState({
    contract: {},
  })
  
  const [reports, setReports] = useState([]);
  const [newMember, setNewMember] = useState();
  const [applied, setApplied] = useState();
  const [numMembers, setNumMembers] = useState();

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3()
        const Contract_instance = new web3.eth.Contract(
          Rating.abi,
          Rating.networks[contextValue.web3.networkId] &&
          Rating.networks[contextValue.web3.networkId].address,
        )

        setContracts((c) => ({
          ...c,
          contract: Contract_instance,
        }))
      } catch (error) {
        console.log('Error')
      }
    }
    init()
  }, [contextValue.web3.networkId])


  const handleSubmit = async () => {
    contracts.contract.methods.getReports().call({
      from: contextValue.web3.accounts[0],
    }).then((allReports) => {
      setReports(allReports);
      console.log('allReports:', allReports);
    });
    console.log('num Reports:', await contracts.contract.methods.getNumReports().call());
  }

  const [id, setId] = useState('');

  const handleIdChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      setId(value);
    }
  };

  const handleSubmit2 = async () => {
    let acceptedReport = reports[id]
    await contracts.contract.methods
      .approveOrDismiss(acceptedReport.reportId, true)
      .send({
        from: contextValue.web3.accounts[0],
      })
  }

  const handleSubmit3 = async () => {
    let deniedReport = reports[id]
    await contracts.contract.methods
      .approveOrDismiss(deniedReport.reportId, false)
      .send({
        from: contextValue.web3.accounts[0],
      })
  }

  const handleApply = async () => {
    setApplied(true);
    await contracts.contract.methods.applyCM(contextValue.web3.accounts[0]).send({
      from: contextValue.web3.accounts[0],
    }).then((decision) => {
      setNewMember(decision);
      console.log('return apply:', decision);
    });
  }

  const [flag, setFlag] = useState(false);
  const handleGetNumbers = async () => {
    await contracts.contract.methods.getNumMembers().call({
      from: contextValue.web3.accounts[0],
    }).then((num) => {
      setNumMembers(num);
      console.log('number members:', num);
    });
    setFlag(true);
  }

  return (
    <>
      <NavBar />
      <div className="wrapper register-page">
        <div className="page-header">
          <div className="page-header-image" />
          <div className="content">
            <img
              alt="..."
              className="path"
              src={require('../assets/img/waves.png').default}
            />
            <Container>
              <Col xs="8">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Reports List</h1>
                  </CardHeader>
                  <CardBody>
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      onClick={handleSubmit}
                    >
                      See Reports
                    </Button>
                    {reports && (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th className="text-center">#</th>
                            {/* <th>Requester</th>
                            <th>Action</th> */}
                            {/* <th>ID</th> */}
                            <th>Defendant</th>
                            <th>Reporter</th>
                            <th>Hash</th>
                            <th>Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.map((report) => (
                            <tr key={report.reportId}>
                              <td>{report.reportId}</td>
                              <td>{report.defendant}</td>
                              <td>{report.reporter}</td>
                              <td>{report.cid}</td>
                              <td>{report.reason}</td>
                            </tr>
                          ))
                          }
                        </tbody>
                      </Table>
                    )}
                  </CardBody>
                  <CardFooter></CardFooter>
                </Card>
              </Col>
            </Container>
            <Container>
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Vote Valid Report</h1>
                  </CardHeader>
                  <CardBody>
                    <label>Request #</label>
                    <Input
                      name="Index"
                      onChange={handleIdChange}
                      value={id}
                      type="number"
                      color="primary"
                    />
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      onClick={handleSubmit2}
                    >
                      Submit
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Container>
            <Container>
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Vote Invalid Report</h1>
                  </CardHeader>
                  <CardBody>
                    <label>Request #</label>
                    <Input
                      name="Index"
                      onChange={handleIdChange}
                      value={id}
                      type="number"
                      color="primary"
                    />
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      onClick={handleSubmit3}
                    >
                      Submit
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Container>
            <Container>
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Not a Member? Apply Here</h1>
                  </CardHeader>
                  <CardBody>
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      onClick={handleApply}
                    >
                      Apply
                    </Button>
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      onClick={handleGetNumbers}
                    >
                      Get Number of Committee Members
                    </Button>
                  </CardBody>
                  <CardFooter>
                  <div>{applied && newMember  && 'Congratulations, you are now a member!'}</div>
                  <div>{applied && newMember === false  && 'Sorry, your reputation is too low.'}</div>
                  <div>{flag && `There are ${numMembers} committee members`}</div>
                  </CardFooter>
                </Card>
              </Col>
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default CommitteePage
