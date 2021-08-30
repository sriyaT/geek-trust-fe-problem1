import React, { useState, useEffect } from 'react';
import { Destination } from './destination';
import { Vehicle } from './vehicle';
import FinalMessage from './finalMessage';

import { useGetPlanets, useVehiclesData, useGetToken } from '../customHooks';

import './styles/index.css';

const handleDestinationChange = ({
  value,
  group,
  setSelectedData,
  selectedData,
  type,
  setVehiclesData,
  vehiclesData,
}) => {
  const newData = { ...selectedData };
  if (!newData[group]) newData[group] = {};
  if (type === 'vehicle') {
    const previousValue = newData[group][type];
    const newVehicleData = vehiclesData.map((item) => {
      if (item.name === value?.name)
        return {
          ...item,
          total_no: item?.total_no - 1,
        };
      if (item.name === previousValue?.name)
        return {
          ...item,
          total_no: item?.total_no + 1,
        };
      return item;
    });
    setVehiclesData(newVehicleData);
  }
  newData[group][type] = value;
  setSelectedData(newData);
};

const renderDestination = ({
  index,
  planetsData,
  vehiclesData,
  setSelectedData,
  selectedData,
  setVehiclesData,
}) => {
  const group = `group_${index}`;
  return (
    <div key={index} className='destination-item'>
      <h2>Destination {index + 1}</h2>
      <Destination
        planetsData={planetsData}
        selectedData={selectedData}
        group={group}
        handleDestinationChange={(value) =>
          handleDestinationChange({
            value,
            group,
            setSelectedData,
            selectedData,
            type: 'planet',
          })
        }
      />
      {selectedData[group] && selectedData[group].planet && (
        <Vehicle
          vehiclesData={vehiclesData}
          group={group}
          selectedValue={selectedData[group].vehicle}
          selectedPlanet={selectedData[group].planet}
          handleDestinationChange={(value) =>
            handleDestinationChange({
              value,
              group,
              setSelectedData,
              selectedData,
              type: 'vehicle',
              setVehiclesData,
              vehiclesData,
            })
          }
        />
      )}
    </div>
  );
};

const renderNav = () => (
  <nav>
    <div className='side-nav'>
      <span>Reset |</span>
      <span> GeekTrust Home</span>
    </div>
    <h1>Finding Falcona !</h1>
  </nav>
);

const handleFindFalcone = ({ payload, setSuccessPlanet, setIsFail }) => {
  fetch('https://findfalcone.herokuapp.com/find', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) =>
    response.json().then((data) => {
      if (data?.status === 'success') setSuccessPlanet(data?.planet_name);
      if (data?.status === 'false') setIsFail(true);
    })
  );
};

const resetApp = ({ setSelectedData, setSuccessPlanet, setIsFail }) => {
  setSelectedData({});
  setSuccessPlanet(null);
  setIsFail(false);
};

const Home = () => {
  const [successPlanet, setSuccessPlanet] = useState(null);
  const [isFail, setIsFail] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [timeTaken, setTimeTaken] = useState(0);

  const [planetsData] = useGetPlanets();
  const [vehiclesData, setVehiclesData] = useVehiclesData({
    successPlanet,
    isFail,
    selectedData,
  });
  const [token] = useGetToken();

  useEffect(() => {
    let result = 0;
    Object.keys(selectedData).forEach((group) => {
      const item = selectedData[group];
      if (item?.planet && item?.vehicle) {
        result += Number(item?.planet?.distance) / Number(item?.vehicle?.speed);
      }
    });
    setTimeTaken(result);
  }, [selectedData]);

  if (successPlanet || isFail) {
    return (
      <>
        {renderNav()}
        <FinalMessage
          isFail={isFail}
          successPlanet={successPlanet}
          timeTaken={timeTaken}
          resetApp={() =>
            resetApp({ setSelectedData, setSuccessPlanet, setIsFail })
          }
        />
      </>
    );
  }
  return (
    <div>
      {renderNav()}
      <h4>Select Planets you want to search in :</h4>
      <div className='destination-container'>
        {[...new Array(4)].map((item, index) => {
          return renderDestination({
            index,
            planetsData,
            vehiclesData,
            setVehiclesData,
            setSelectedData,
            selectedData,
          });
        })}
        <div>
          <span>Time taken: {timeTaken}</span>
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            let planet_names = [];
            let vehicle_names = [];
            Object.keys(selectedData).forEach((group) => {
              selectedData[group].planet &&
                planet_names.push(selectedData[group].planet?.name);
              selectedData[group].vehicle &&
                vehicle_names.push(selectedData[group].vehicle?.name);
            });
            const payload = { planet_names, vehicle_names, token };
            if (planet_names?.length === 4 && vehicle_names.length === 4)
              handleFindFalcone({
                payload,
                setSuccessPlanet,
                setIsFail,
              });
          }}
        >
          Find Falcone!
        </button>
      </div>
    </div>
  );
};

export default Home;
