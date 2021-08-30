import React, { useState, useEffect } from 'react';

export const Destination = ({
  planetsData,
  handleDestinationChange,
  selectedData,
  group,
}) => {
  let selectedValue = null;
  const displayPlanetsData = planetsData?.filter((item) => {
    const name = item.name;
    let alreadySelected = false;
    Object.keys(selectedData).forEach((groupItem) => {
      const planet = selectedData[groupItem]?.planet?.name;
      if (name === planet && groupItem !== group) alreadySelected = true;
      if (groupItem === group && name === planet) selectedValue = planet;
    });
    return !alreadySelected;
  });
  return (
    <select
      onChange={(e) => {
        handleDestinationChange(JSON.parse(e.target.value));
      }}
    >
      <option value={''}>Select</option>
      {displayPlanetsData?.map((item, index) => {
        return (
          <option
            key={index}
            value={JSON.stringify(item)}
            selected={item.name === selectedValue}
          >
            {item.name}
          </option>
        );
      })}
    </select>
  );
};
