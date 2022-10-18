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
} from 'reactstrap'

// core components
import NavBar from 'components/NavBar'
import Footer from 'components/Footer'
import Context from 'Helpers/Context'
import getWeb3 from 'Helpers/getWeb3'
import Ownership from '../contracts/Ownership.json'

const CheckAccessPage = () => {
  const { contextValue } = useContext(Context)

  const [contracts, setContracts] = useState({
    contract: {},
  })

  const [answer, setAnswer] = useState('')

  const [inputs, setInputs] = useState({
    fileID: '0',
    address: '0x123',
  })

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
      } catch (error) {
        console.log('Error')
      }
    }
    init()
  }, [contextValue.web3.networkId])

  const handleSubmit = async () => {
    const res = await contracts.contract.methods
      .checkAccess(inputs.fileID, inputs.address)
      .call()
    setAnswer(res)
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
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Check Access</h1>
                  </CardHeader>
                  <label>File ID</label>
                  <Input
                    name="fileID"
                    onChange={handleInputChange}
                    value={inputs.fileID}
                    type="number"
                    color="primary"
                  />
                  <label>Account Address</label>
                  <Input
                    name="address"
                    onChange={handleInputChange}
                    value={inputs.address}
                    type="text"
                    color="primary"
                  />
                  <CardBody>
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </CardBody>
                  <CardFooter>
                    {answer !== '' && 'The Answer is ' + answer}
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

export default CheckAccessPage