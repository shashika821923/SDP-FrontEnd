import React, { useState } from 'react';
import './App.css';
// import HomePageComponent from './homePage/home.page';
import MainRoutes from './routes/main.routes';

function App() {
  const [isSidePanelOpen, setSidePanelOpen] = useState(true);

  const toggleSidePanel = () => {
    setSidePanelOpen(!isSidePanelOpen);
  };

  const closeSidePanel = () => {
    setSidePanelOpen(false);
  };

  const handleButtonClick = () => {
    // Automatically hide the side panel when any button is pressed
    closeSidePanel();
  };
  const buttonLabel = isSidePanelOpen ? 'Navigation' : '';

  const styles = {
    app: {
      display: 'flex',
    },
    sidePanel: {
      width: isSidePanelOpen ? '200px' : '0',
      height: '100vh',
      backgroundImage: 'url("https://i.ibb.co/QYxVdTk/6912484-green-desktop-background.jpg")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      color: 'white',
      transition: 'width 0.3s ease, margin-left 0.3s ease, opacity 0.3s ease', // Updated transition
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1,
      opacity: isSidePanelOpen ? 1 : 0, // Updated opacity property
    },
    mainContent: {
      flexGrow: 1,
      padding: '20px',
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
      top: 20,
      left: 20,
      width: '60px',
      height: '60px',
      cursor: 'pointer',
      zIndex: 2,
      border: 'none',
      background: 'rgba(255, 255, 255, 0.7)',
      padding: 0,
      fontSize: 0,
      overflow: 'hidden',
      visibility: isSidePanelOpen ? 'hidden' : 'visible',
      backgroundImage: 'url("https://i.ibb.co/1KkHqzN/image.png")',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      transition: 'transform 0.3s ease, opacity 0.3s ease', // Updated transition
      borderRadius: '50%',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      opacity: isSidePanelOpen ? 0 : 1, // Updated opacity property
    },
    cornerTriggerInsidePanel: {
      width: '40px',
      height: '40px',
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'rgba(255, 255, 255, 0.7)',
      overflow: 'hidden',
      cursor: 'pointer',
      borderRadius: '50%',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      opacity: isSidePanelOpen ? 0 : 1, // Updated opacity property
      transition: 'opacity 0.3s ease', // Updated transition
    },
  };

  const buttonList = (
    <ul style={styles.buttonList}>
      <li>
        <button style={styles.navigationButton} type="button" onClick={handleButtonClick}>
          Button 1
        </button>
      </li>
      <li>
        <button style={styles.navigationButton} type="button" onClick={handleButtonClick}>
          Button 2
        </button>
      </li>
      <li>
        <button style={styles.navigationButton} type="button" onClick={handleButtonClick}>
          Button 3
        </button>
      </li>
      <li>
        <button style={styles.navigationButton} type="button" onClick={handleButtonClick}>
          Button 4
        </button>
      </li>
      <li>
        <button style={styles.navigationButton} type="button" onClick={handleButtonClick}>
          Button 5
        </button>
      </li>
    </ul>
  );

  return (
    <div style={styles.app}>
      <button style={styles.cornerTrigger} type="button" onClick={toggleSidePanel}>
        {buttonLabel}
      </button>
      <div style={styles.sidePanel}>
        <button style={styles.cornerTrigger} type="button" onClick={toggleSidePanel}>
          {/* You can customize the style for the corner trigger inside the panel */}
          {buttonLabel}
        </button>
        {buttonList}
      </div>
      <div style={styles.mainContent}>
        <MainRoutes />
      </div>
    </div>
  );
}

export default App;
