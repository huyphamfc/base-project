import React from 'react';

import GlobalStyles from './GlobalStyles';
import Auth from './Auth';
import GetData from './GetData';

function App() {
  return (
    <GlobalStyles>
      <main>
        <Auth />
        <GetData />
      </main>
    </GlobalStyles>
  );
}

export default App;
