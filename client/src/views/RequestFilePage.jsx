import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'

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
  Row,
} from 'reactstrap'

// core components
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Context from '../Helpers/Context'
import getWeb3 from '../Helpers/getWeb3'
import Ownership from '../contracts/Ownership.json'
import BigNumber from 'bignumber.js';

const RequestFilePage = () => {
  const { contextValue } = useContext(Context)

  let requestsMade = 0

  const[requested, setRequested] = useState()

  const [contracts, setContracts] = useState({
    contract: {},
  })

  const [showTable, setShowTable] = useState(false)

  const [inputs, setInputs] = useState({
    hash: '',
  })

  const [fileNames, setFileNames] = useState([])

  const getFileNames = async () => {
    const response = await axios('http://localhost:5000/api/fileNames')
    const info = []
    for (let i = 0; i < response.data.files.length; ++i)
      info.push(response.data.files[i])
    console.log(info)
    setFileNames(info)
  }

  const handleInputChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setInputs({
      ...inputs,
      [e.target.name]: value,
    })
  }

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
        getFileNames()
      } catch (error) {
        console.log('Error')
      }
    }
    init()
  }, [contextValue.web3.networkId])

  const handleSubmit = async () => {
    const myBigInt = BigNumber(inputs.hash, 16);
    const requested = await contracts.contract.methods.requestAccess(myBigInt, 7).send({
      from: contextValue.web3.accounts[0],
    })
    requestsMade++;
    setRequested(requested);
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
              <Row>
                <Col xs="6">
                  <Card className="p-4 card-stats">
                    <CardHeader>
                      <h1>File Request</h1>
                    </CardHeader>
                    <CardBody>
                      <label>File Hash</label>
                      <Input
                        name="hash"
                        onChange={handleInputChange}
                        value={inputs.hash}
                        type="text"
                        color="primary"
                      />
                      <Button
                        type="button"
                        className="btn-round"
                        color="info"
                        onClick={handleSubmit}
                      >
                        Request File
                      </Button>
                    </CardBody>
                    <CardFooter>
                      {'Debugging - Requests Made: ' + requestsMade}
                      {requested !== '' && requested === true &&
                      'Request Made'}
                      {requested !== '' && requested === false &&
                      'Request Denied'}
                    </CardFooter>
                  </Card>
                </Col>
                <Col xs="6">
                  <Card className="p-4 card-stats">
                    <CardHeader>
                      <h1>Files</h1>
                    </CardHeader>
                    <CardBody>
                      <Button
                        onClick={async () => {
                          setShowTable(!showTable)
                        }}
                      >
                        Get Files List
                      </Button>
                      {showTable && (
                        <table className="table ">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fileNames.map((file, index) => (
                              <tr key={index + 'fileRow'}>
                                <th scope="row">{index}</th>
                                <td>{file.file_name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </CardBody>
                    <CardFooter></CardFooter>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default RequestFilePage
