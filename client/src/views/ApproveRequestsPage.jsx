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
import Ownership from '../contracts/Ownership.json'

const ApproveRequestsPage = () => {
  const { contextValue } = useContext(Context)

  const [contracts, setContracts] = useState({
    contract: {},
  })

  //const [fileIDs, setFileIDs] = useState('')
  const [perms, setPerms] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3()
        const Contract_instance = new web3.eth.Contract(
          Ownership.abi,
          Ownership.networks[contextValue.web3.networkId] &&
            Ownership.networks[contextValue.web3.networkId].address,
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

  // const getFiles = async () => {
  //   const accounts = await web3.eth.getAccounts();
  //   const address = accounts[0];
  //   const files = await contracts.contract.methods.getOwnersFiles(address).call();
  //   return files;
  // }

  // const getFileLength = async () => {
  //   const accounts = await web3.eth.getAccounts();
  //   const address = accounts[0];
  //   const filesLength = await contracts.contract.methods.getOwnerFileLength(address).call();
  //   return filesLength;
  // }

  // const fetchPerms = async () => {
  //   const allPerms = await contracts.contract.methods.getAllRequests().call();
  //   setPerms(allPerms);
  //   setFileIDs(allPerms);
  // }

  const handleSubmit = async () => {
    const allPerms = await contracts.contract.methods.getAllRequests().call();
    setPerms(allPerms);
    // setFileIDs(allPerms);
  }

  // const fulfillRequest = async (fileID, requestID, approve) => {
  //   await contracts.contract.methods
  //     .fulfillRequest(fileID, requestID, approve)
  //     .send({ from: contextValue.web3.accounts[0] })
  //   await handleSubmit()
  // }

  const [input, setInput] = useState({
    index: '',
  })

  const handleInputChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setInput({
      ...input,
      [e.target.name]: value,
    })
  }

  const [isAccepted, setIsAccepted] = useState('')
  const handleSubmit2 = async () => {
    let acceptedPerm = perms[input.index]
    const isAccepted = await contracts.contract.methods
      .fulfillRequest(acceptedPerm.fileID, acceptedPerm.id, true)
      .call()
    setIsAccepted(isAccepted)
  }

  const [isDenied, setIsDenied] = useState('')
  const handleSubmit3 = async () => {
    let acceptedPerm = perms[input.index]
    const isDenied = await contracts.contract.methods
      .fulfillRequest(acceptedPerm.fileID, acceptedPerm.id, false)
      .call()
    setIsDenied(isDenied)
  }
  // {perms.map((perm, index) => (
  //   <div key={index}>
  //     <p>id: {perm.id}</p>
  //     <p>user: {perm.user}</p>
  //     <p>fileType: {perm.fileType}</p>
  //     <p>isTimed: {perm.isTimed}</p>
  //     <p>time: {perm.time}</p>
  //     <p>deadline: {perm.deadline}</p>
  //     <p>isAllowed: {perm.isAllowed}</p>
  //   </div>
  // ))
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
                    <h1>Approve Requests</h1>
                  </CardHeader>
                  <CardBody>
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      onClick={handleSubmit}
                    >
                      See Requests
                    </Button>
                    {perms && (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th className="text-center">#</th>
                            {/* <th>Requester</th>
                            <th>Action</th> */}
                            <th>ID</th>
                            <th>FileID</th>
                            <th>Requester</th>
                            <th>Permission</th>
                            <th>Timed</th>
                            <th>Days</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {perms.map((perm, index) => (
                            <div key={index}>
                              <p>id: {perm.id}</p>
                              <p>user: {perm.user}</p>
                              <p>fileID: {perm.fileID}</p>
                              <p>fileType: {perm.fileType}</p>
                              <p>isTimed: {perm.isTimed}</p>
                              <p>time: {perm.time}</p>
                              <p>deadline: {perm.deadline}</p>
                              <p>isAllowed: {perm.isAllowed}</p>
                            </div>
                          ))
                          
                          
                          /* {fileIDs.map((value0, key0) =>
                            value0.map((value1, key1) => {
                              if (
                                value1 !==
                                '0x0000000000000000000000000000000000000000'
                              ) {
                                return (
                                  <tr key={'Requester' + key1}>
                                    <td className="text-center">{key0}</td>
                                    <td>{value1}</td>
                                    <td>
                                      <Button
                                        className="btn-icon btn-round"
                                        color="success"
                                        size="sm"
                                        onClick={() => {
                                          fulfillRequest(key0, key1, true)
                                        }}
                                      >
                                        <i className="fa fa-edit"></i>
                                      </Button>
                                      <Button
                                        className="btn-icon btn-round"
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                          fulfillRequest(key0, key1, false)
                                        }}
                                      >
                                        <i className="fa fa-times" />
                                      </Button>
                                    </td>
                                  </tr>
                                )
                              } else {
                                return ''
                              }
                            }),
                          )} */}
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
                    <h1>Accept Request</h1>
                  </CardHeader>
                  <label>Request #</label>
                  <Input
                    name="Index"
                    onChange={handleInputChange}
                    value={input.index}
                    type="number"
                    color="primary"
                  />
                  <CardBody>
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      onClick={handleSubmit2}
                    >
                      Submit
                    </Button>
                  </CardBody>
                  <CardFooter>
                    {isAccepted !== '' && 'The request was fulfilled: ' + isAccepted}
                  </CardFooter>
                </Card>
              </Col>
            </Container>
            <Container>
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Deny Request</h1>
                  </CardHeader>
                  <label>Request #</label>
                  <Input
                    name="Index"
                    onChange={handleInputChange}
                    value={input.index}
                    type="number"
                    color="primary"
                  />
                  <CardBody>
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      onClick={handleSubmit3}
                    >
                      Submit
                    </Button>
                  </CardBody>
                  <CardFooter>
                    {isDenied !== '' && 'The request was fulfilled: ' + isDenied}
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

export default ApproveRequestsPage
