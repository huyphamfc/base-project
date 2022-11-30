import React from 'react';

import GlobalStyles from './GlobalStyles';
import Login from './Login';
import GetData from './GetData';

function App() {
  return (
    <GlobalStyles>
      <main>
        <Login />
        <GetData />
      </main>
    </GlobalStyles>
  );
}

export default App;
