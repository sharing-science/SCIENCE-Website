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
import Rating from '../contracts/Rating.json'


function Report() {
    const [defendant, setDefendant] = useState('');
    const [cid, setCid] = useState('');
    const [reason, setReason] = useState('');
    //const [reporter, setReporter] = useState('');
    let reportID = 0;

    const handleDefendant = (event) => {
        setDefendant(event.target.value);
    };

    const handleCID = (event) => {
        setCid(event.target.value);
    };

    const handleReason = (event) => {
        setReason(event.target.value);
    };
    
    const { contextValue } = useContext(Context)

    const [contracts, setContracts] = useState({
      contract: {},
    })
  
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

    function handleSubmit(event) {
        // Create report
        reportID = contracts.contract.methods.createReport(defendant, cid, contextValue.web3.accounts[0], reason).send({
            from: contextValue.web3.accounts[0],
        })

        // Maybe do something to report to user
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
                    <h1>Report File Misuse</h1>
                  </CardHeader>
                  <CardBody>
                    <div className="Get-CID">
                      <label>Defendant Address</label>
                      <Input type="text" value={defendant} onChange={handleDefendant} />
                      </div>

                    <div className="Get-CID">
                      <label>File Hash</label>
                      <Input type="text" value={cid} onChange={handleCID} />
                      </div>

                    <div className="Get-CID">
                      <label>Reason</label>
                      <Input type="text" value={reason} onChange={handleReason} />
                      </div>

                      <Button
                        type="button"
                        className="btn-round"
                        color="info"
                        onClick={handleSubmit}
                        disabled={!cid || !defendant || !reason}
                      >
                        Report
                      </Button>
                  </CardBody>
                  <CardFooter>
                    {reportID !== 0 && 'Successfully sent report ID: ' && reportID}
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


export default Report;