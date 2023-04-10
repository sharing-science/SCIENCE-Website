import React, { useReducer } from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

//IDGAF
// import ApproveRequestsPage from './views/ApproveRequestsPage'
// import TokensPage from './views/TokensPage'

//ACTUAL PAGES
import LandingPage from './views/LandingPage'
import ContactUsPage from './views/ContactUsPage'
import ProfilePage from './views/ProfilePage'
import LoginPage from './views/LoginPage'
import Context from './Helpers/Context'
import RequestLimitedFilePage from './views/RequestLimitedFilePage'
import RequestFilePage from './views/RequestFilePage'
import CreateNewFilePage from './views/CreateNewFilePage'
import { contextReducer } from './Helpers/reducers'
import { getLocalStorageObject } from './Helpers/helperFunctions'
import { PrivateRoute, PublicRoute } from './Helpers/Routes'
import CheckAccessPage from './views/CheckAccessPage'
import SeeApprovedPage from './views/SeeApprovedPage'
import DownloadPage from './views/DownloadPage'
import ReportPage from './views/ReportPage'

// TESTING
import EnDeTest from './views/EnDeTest'
import Pinata from './views/Pinata'
// import Up from './views/uploadTest1'//!!!!!!!!!!!FFFFIIIXXX
// import Down from './views/downloadTest1'


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
          <PrivateRoute exact path="/request" component={RequestFilePage} />
          <PrivateRoute exact path="/limited" component={RequestLimitedFilePage} />
          <PrivateRoute exact path="/profile" component={ProfilePage} />
          <PrivateRoute exact path="/upload" component={CreateNewFilePage} />
          <PrivateRoute exact path="/check" component={CheckAccessPage} />
          <PrivateRoute exact path="/approved" component={SeeApprovedPage} />
          <PrivateRoute exact path="/download" component={DownloadPage} />
          <PrivateRoute exact path="/report" component={ReportPage} />

          {/* Testing */}
          <PrivateRoute exact path="/crypt" component={EnDeTest} />
          <PrivateRoute exact path="/pinata" component={Pinata} />

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
