import React, { useEffect, useState } from 'react';
import apiCalls from './serviceCalls/api.calls';

function LoginComponent() {
  const [initialMessage, setInitialMessage] = useState('');

  function checkUsernameandPassword() {
    apiCalls.checkUsernameandPassword().then((data) => setInitialMessage(data));
  }

  useEffect(() => {
    checkUsernameandPassword();
  }, []);

  return (
    <div>
      login page
      {initialMessage}
    </div>
  );
}

export default LoginComponent;
