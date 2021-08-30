import React from 'react';

const FinalMessage = ({ isFail, successPlanet, timeTaken, resetApp }) => {
  return (
    <div>
      <div>
        {!isFail
          ? 'Success! Congratulations on Finding Falcone. King Shan is mighty pleased.'
          : 'Failed! Falcone is not present in any of the selected planets.'}
      </div>
      {!isFail && (
        <>
          <br />
          <br />
          <div>Time taken: {timeTaken}</div>
          <div>Planet found: {successPlanet}</div>
        </>
      )}
      <br />
      <br />
      <div>
        <button onClick={resetApp}>Start Again</button>
      </div>
    </div>
  );
};

export default FinalMessage;
