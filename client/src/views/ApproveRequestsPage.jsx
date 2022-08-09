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
  Table,
} from 'reactstrap'

// core components
import NavBar from 'components/NavBar'
import Footer from 'components/Footer'
import Context from 'Helpers/Context'
import getWeb3 from 'Helpers/getWeb3'
import Ownership from '../contracts/Ownership.json'

const ApproveRequestsPage = () => {
  const { contextValue } = useContext(Context)

  const [contracts, setContracts] = useState({
    contract: {},
  })

  const [fileIDs, setFileIDs] = useState('')

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

  const getFiles = async () => {
    const fileCount = await contracts.contract.methods.getFileCounter().call()
    const answer = []
    for (let i = 0; i < fileCount; ++i) {
      let fileOwner = await contracts.contract.methods.getFileOwner(i).call()
      if (fileOwner === contextValue.web3.accounts[0]) {
        answer.push(i)
      }
    }
    return answer
  }
  const handleSubmit = async () => {
    const files = await getFiles()
    const answer = []
    for (let i = 0; i < files.length; ++i) {
      let reqs = await contracts.contract.methods.getFileRequests(i).call()
      answer.push(reqs)
    }
    setFileIDs(answer)
  }

  const fulfillRequest = async (fileID, requestID, approve) => {
    await contracts.contract.methods
      .fulfillRequest(fileID, requestID, approve)
      .send({ from: contextValue.web3.accounts[0] })
    await handleSubmit()
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
              src={require('assets/img/waves.png').default}
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
                    {fileIDs && (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th className="text-center">#</th>
                            <th>Requester</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fileIDs.map((value0, key0) =>
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
                          )}
                        </tbody>
                      </Table>
                    )}
                  </CardBody>
                  <CardFooter></CardFooter>
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
