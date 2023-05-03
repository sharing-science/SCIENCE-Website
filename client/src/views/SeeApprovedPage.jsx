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
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Context from '../Helpers/Context'
import getWeb3 from '../Helpers/getWeb3'
import Ownership from '../contracts/Ownership.json'

const SeeApprovedPage = () => {
  const { contextValue } = useContext(Context)

  const [contracts, setContracts] = useState({
    contract: {},
  })

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

  const handleSubmit = async () => {
    contracts.contract.methods.getAllAllowed().call({
      from: contextValue.web3.accounts[0],
    }).then((allPerms) => {
      setPerms(allPerms);
      console.log('allPerms:', allPerms);
    });
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
                    <h1>Approved List</h1>
                  </CardHeader>
                  <CardBody>
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      onClick={handleSubmit}
                    >
                      See Approved
                    </Button>
                    {perms && (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th className="text-center">#</th>
                            {/* <th>Requester</th>
                            <th>Action</th> */}
                            {/* <th>ID</th> */}
                            <th>File Hash</th>
                            <th>Requester</th>
                            <th>Permission</th>
                            <th>Timed</th>
                            <th>Days</th>
                            {/* <th>Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                        {perms.map((perm) => (
                          <tr key={perm.id}>
                          <td>{perm.id}</td>
                          <td>{perm.fileID}</td>
                          <td>{perm.user}</td>
                          <td>{perm.fileType}</td>
                          <td>{perm.isTimed ? 'Yes' : 'No'}</td>
                          <td>{perm.time}</td>
                        </tr>
                        ))}
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

export default SeeApprovedPage
