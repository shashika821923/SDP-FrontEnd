import React from 'react';

function HomePageComponent() {
  function getContent() {
    console.log('hit');
    return 'home page';
  }

  return (
    <div>
      {getContent()}
    </div>
  );
}

export default HomePageComponent;
