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
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Context from '../Helpers/Context'
import getWeb3 from '../Helpers/getWeb3'
import Ownership from '../contracts/Ownership.json'

const CheckAccessPage = () => {
  const { contextValue } = useContext(Context)

  const [contracts, setContracts] = useState({
    contract: {},
  })

  const [answer, setAnswer] = useState('')
  const [owner, setOwner] = useState('')
  const [fileCount, setFileCount] = useState('')

  const [inputs1, setInputs1] = useState({
    hash: '',
    address: '0x123',
  })
  const [inputs2, setInputs2] = useState({
    hash: '',
  })

  const handleInputChange1 = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setInputs1({
      ...inputs1,
      [e.target.name]: value,
    })
  }

  const handleInputChange2 = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setInputs2({
      ...inputs2,
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

  const handleSubmit1 = async () => {
    console.log('hash:', inputs1.hash);
    const res = await contracts.contract.methods
      .checkAccess(inputs1.hash, inputs1.address)
      .call()
    setAnswer(res)
  }
  const handleSubmit2 = async () => {
    console.log('hash:', inputs2.hash);
    const own = await contracts.contract.methods
      .getFileOwner(inputs2.hash)
      .call()
    setOwner(own)
  }
  const handleSubmit3 = async () => {
    const count = await contracts.contract.methods
      .getFileCounter()
      .call()
    setFileCount(count)
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
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Check Access</h1>
                  </CardHeader>
                  <label>File Hash</label>
                  <Input
                    name="hash"
                    onChange={handleInputChange1}
                    value={inputs1.hash}
                    type="text"
                    color="primary"
                  />
                  <label>Account Address</label>
                  <Input
                    name="address"
                    onChange={handleInputChange1}
                    value={inputs1.address}
                    type="text"
                    color="primary"
                  />
                  <CardBody>
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      onClick={handleSubmit1}
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
            <Container>
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Get Owner</h1>
                  </CardHeader>
                  <label>File Hash</label>
                  <Input
                    name="hash"
                    onChange={handleInputChange2}
                    value={inputs2.hash}
                    type="text"
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
                    {owner !== '' && 'The Owner is ' + owner}
                  </CardFooter>
                </Card>
              </Col>
            </Container>
            <Container>
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Get File Counter</h1>
                  </CardHeader>
                  
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
                    {fileCount !== '' && 'The file count is ' + fileCount}
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
