import React from 'react';

function GetData() {
  const handleClick = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
      method: 'GET',
      credentials: 'include',
    }).then((res) => res.json().then((result) => console.log(result)));
  };

  return (
    <button onClick={handleClick} type="button">
      Get Data
    </button>
  );
}

export default GetData;
