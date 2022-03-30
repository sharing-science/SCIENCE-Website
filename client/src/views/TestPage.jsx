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
  Row,
} from 'reactstrap'

// core components
import NavBar from 'components/NavBar'
import Footer from 'components/Footer'
import Context from 'Helpers/Context'
import getWeb3 from 'Helpers/getWeb3'
import CollaborationEvent from '../contracts/CollaborationEvent.json'

const TestPage = () => {
  // This is the context which is information distributed over the whole application
  // contextValue.loggedIn true or false
  // contextValue.web3.accounts[0], this is the address of the logged in account
  // Don't have to worry about this
  const { contextValue } = useContext(Context)

  // This is a hook of all of the contract instances
  const [contracts, setContracts] = useState({
    contract: {},
  })

  const [statesAnswer, setStatesAnswer] = useState('No Value')

  // This runs when the webpage opens, this will connect to web3 and get instances of the contracts
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3()

        const Contract_instance = new web3.eth.Contract(
          CollaborationEvent.abi,
          CollaborationEvent.networks[contextValue.web3.networkId] &&
            CollaborationEvent.networks[contextValue.web3.networkId].address,
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

  const getStates = async () => {
    const states = await contracts.contract.methods
      ._getCollaborationState()
      .call()
    setStatesAnswer(states)
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
              <Row>
                <Col xs="6">
                  <Card className="p-4 card-stats">
                    <CardHeader>
                      <Button onClick={getStates}>
                        get collaboration state
                      </Button>
                    </CardHeader>
                    <CardBody>{statesAnswer}</CardBody>
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

export default TestPage
