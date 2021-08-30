import { useState, useEffect } from 'react';

const useGetPlanets = () => {
  const [planetsData, setPlanetData] = useState();
  useEffect(() => {
    fetch('https://findfalcone.herokuapp.com/planets').then((response) =>
      response.json().then((data) => {
        setPlanetData(data);
      })
    );
  }, []);
  return [planetsData, setPlanetData];
};

const useVehiclesData = ({ successPlanet, isFail, selectedData }) => {
  const [vehiclesData, setVehiclesData] = useState();
  useEffect(() => {
    if (!successPlanet && !isFail && Object.keys(selectedData).length === 0)
      fetch('https://findfalcone.herokuapp.com/vehicles').then((response) =>
        response.json().then((data) => {
          setVehiclesData(data);
        })
      );
  }, [successPlanet, isFail, selectedData]);
  return [vehiclesData, setVehiclesData];
};

const useGetToken = () => {
  const [token, setToken] = useState();
  useEffect(() => {
    fetch('https://findfalcone.herokuapp.com/token', {
      method: 'POST',
      headers: { Accept: 'application/json' },
    }).then((response) =>
      response.json().then((data) => {
        setToken(data?.token);
      })
    );
  }, []);
  return [token];
};

export { useGetPlanets, useVehiclesData, useGetToken };
