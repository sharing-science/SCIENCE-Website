import React, { useReducer } from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import LandingPage from './views/LandingPage'
import ContactUsPage from './views/ContactUsPage'
import UploadFilePage from './views/UploadFilePage'
import ProfilePage from './views/ProfilePage'
import LoginPage from './views/LoginPage'
import SampleContract from './views/SampleContractPage'
import TokensPage from './views/TokensPage'
import TestPage from './views/TestPage'
import Context from './Helpers/Context'
import DataCommitteePage from './views/DataCommitteePage'
import ReportPage from './views/ReportPage'
import TeamPage from './views/TeamPage'
import RequestFilePage from './views/RequestFilePage'
import CreateNewFilePage from 'views/CreateNewFilePage'
import ApproveRequestsPage from 'views/ApproveRequestsPage'
import { contextReducer } from 'Helpers/reducers'
import { getLocalStorageObject } from 'Helpers/helperFunctions'
import { PrivateRoute, PublicRoute } from './Helpers/Routes'
import CheckAccessPage from 'views/CheckAccessPage'

const App = () => {
  const [contextValue, dispatchContextValue] = useReducer(contextReducer, {
    loggedIn: localStorage.getItem('loggedIn'),
    web3: getLocalStorageObject('web3'),
  })
  return (
    <Context.Provider value={{ contextValue, dispatchContextValue }}>
      <Router>
        <Switch>
          {/* Private Routes */}
          <PrivateRoute exact path="/upload" component={UploadFilePage} />
          <PrivateRoute exact path="/contract" component={SampleContract} />
          <PrivateRoute exact path="/request" component={RequestFilePage} />
          <PrivateRoute exact path="/profile" component={ProfilePage} />
          <PrivateRoute exact path="/tokens" component={TokensPage} />
          <PrivateRoute exact path="/test" component={TestPage} />
          <PrivateRoute exact path="/committee" component={DataCommitteePage} />
          <PrivateRoute exact path="/report" component={ReportPage} />
          <PrivateRoute exact path="/team" component={TeamPage} />
          <PrivateRoute exact path="/newFile" component={CreateNewFilePage} />
          <PrivateRoute exact path="/check" component={CheckAccessPage} />
          <PrivateRoute
            exact
            path="/approveRequests"
            component={ApproveRequestsPage}
          />

          {/* Public Routes */}
          <PublicRoute exact path="/login" component={LoginPage} />
          <PublicRoute exact path="/contact-us" component={ContactUsPage} />
          <PublicRoute path="/" component={LandingPage} />
        </Switch>
      </Router>
    </Context.Provider>
  )
}

export default App
