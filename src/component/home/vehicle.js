import React from 'react';

export const Vehicle = ({
  vehiclesData,
  group,
  handleDestinationChange,
  selectedValue,
  selectedPlanet,
}) => {
  return (
    <div className='vehicle-container'>
      {vehiclesData?.map((item, index) => {
        const count = item.total_no;
        const validRange = selectedPlanet.distance <= item.max_distance;
        const disabled =
          !validRange || (count <= 0 && selectedValue?.name !== item.name);
        return (
          <div key={index}>
            <input
              type='radio'
              name={group}
              value={JSON.stringify(item)}
              disabled={disabled}
              key={group}
              onChange={(e) =>
                handleDestinationChange(JSON.parse(e.target.value))
              }
            />
            {`${item.name}(${item.total_no})`}
          </div>
        );
      })}
    </div>
  );
};
