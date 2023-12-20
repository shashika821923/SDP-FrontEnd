import React, { Fragment, useEffect, useState } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './global.css';
// import HomePageComponent from './homePage/home.page';
import _ from 'lodash';
import MainRoutes from './routes/main.routes';
import { auth } from './configurations/firebase';
import apiCalls from './loginPages/pages/serviceCalls/api.calls';

function App() {
  const [isSidePanelOpen, setSidePanelOpen] = useState(false); // Change the initial state to false
  const [urlLink, setUrlLink] = useState();
  const [usersInfo, setUsersInfo] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  const getUserInformation = (userid) => {
    apiCalls.getUserInformation(userid).then((userInfo) => setUsersInfo(userInfo));
  };

  useEffect(() => {
    getUserInformation();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('userId');
    if (usersInfo.length > 0) {
      setCurrentUser(usersInfo.find((x) => x.id == user));
    }
  }, [auth, usersInfo]);

  useEffect(() => {
    const currentPathname = window.location.pathname;
    const lastRoute = currentPathname.split('/').filter(Boolean).pop();
    setUrlLink(lastRoute);
  }, []);

  const toggleSidePanel = () => {
    setSidePanelOpen(!isSidePanelOpen);
  };

  const handleButtonClick = (url) => {
    window.open(`/${url}`, '_self');
  };

  const toggleSidePanelFromInside = () => {
    setSidePanelOpen(!isSidePanelOpen);
  };

  const buttonLabel = isSidePanelOpen ? 'Navigation' : 'Close';

  const styles = {
    app: {
      display: 'flex',
    },
    sidePanel: {
      width: isSidePanelOpen ? '200px' : '0',
      height: '100vh',
      backgroundImage: 'url("https://i.ibb.co/q9pmSSm/pexels-creative-vix-9754.jpg")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      color: 'white',
      transition: 'width 0.1s ease, margin-left 3s ease, opacity 0.4s ease',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1,
      opacity: isSidePanelOpen ? 1 : 0,
    },
    mainContent: {
      flexGrow: 1,
      padding: '0px',
      transition: 'margin-left 0.3s ease',
      marginLeft: isSidePanelOpen ? '200px' : '0',
    },
    buttonList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    navigationButton: {
      margin: '10px',
      padding: '12px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
      transition: 'background-color 0.3s',
    },
    cornerTrigger: {
      position: 'fixed',
      bottom: '20px', // Adjusted position to be at the bottom
      left: '20px',
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      zIndex: 2,
      border: 'none',
      background: 'rgba(255, 255, 255, 0.3)',
      padding: 0,
      fontSize: 0,
      overflow: 'hidden',
      visibility: isSidePanelOpen ? 'hidden' : 'visible',
      backgroundImage: 'url("https://i.ibb.co/1KkHqzN/image.png")',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      transition: 'transform 10s ease, opacity 3s ease',
      borderRadius: '20%',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      opacity: isSidePanelOpen ? 0 : 1,
    },
    cornerTriggerInsidePanel: {
      position: 'absolute',
      bottom: '20px', // Adjusted position to be below the buttons
      left: '20px',
      width: '32px',
      height: '32px',
      cursor: 'pointer',
      zIndex: 2,
      border: 'none',
      background: 'rgba(0, 255, 0, 0.1)',
      padding: 0,
      fontSize: 0,
      overflow: 'hidden',
      backgroundImage: 'url("https://i.ibb.co/bL2wdV8/icons8-thumbnail-view.gif")',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      transition: 'transform 10s ease, opacity 3s ease',
      borderRadius: '20%',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      opacity: isSidePanelOpen ? 1 : 0, // Updated opacity property
    },
  };

  function buttonList() {
    return (
      <ul style={styles.buttonList}>
        {currentUser.userType == 3 && (
          <li>
            <button style={styles.navigationButton} type="button" onClick={() => handleButtonClick('dashboard')}>
              Dashboard
            </button>
          </li>
        )}
        <li>
          <button style={styles.navigationButton} type="button" onClick={() => handleButtonClick('complainListing')}>
            Complain listing
          </button>
        </li>
        <li>
          <button style={styles.navigationButton} type="button" onClick={() => handleButtonClick('addComplain')}>
            Add Complains
          </button>
        </li>
        {currentUser.userType == 3 && (
        <li>
          <button style={styles.navigationButton} type="button" onClick={() => handleButtonClick('userList')}>
            User list
          </button>
        </li>
        )}
        {currentUser.userType == 3 && (
        <li>
          <button style={styles.navigationButton} type="button" onClick={() => handleButtonClick('addOfficers')}>
            Add officers
          </button>
        </li>
        )}
        <li>
          <button style={styles.navigationButton} type="button" onClick={() => auth.signOut()}>
            Log out
          </button>
        </li>
      </ul>
    );
  }

  return (
    <div style={styles.app}>
      {!_.isUndefined(urlLink) && !_.isUndefined(currentUser) && urlLink != 'signup' && (
        <>
          <button style={styles.cornerTrigger} type="button" onClick={toggleSidePanel}>
            {buttonLabel}
          </button>
          <div style={styles.sidePanel}>
            <button style={styles.cornerTriggerInsidePanel} type="button" onClick={toggleSidePanelFromInside}>
              {buttonLabel}
            </button>
            {buttonList()}
          </div>
        </>
      )}
      <div style={styles.mainContent}>
        <MainRoutes />
      </div>
    </div>
  );
}

export default App;
