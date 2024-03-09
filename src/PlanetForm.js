import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import './PlanetForm.css'; // Import CSS file

const PlanetForm = () => {
  const { control, handleSubmit, setValue } = useForm();
  const [bodies, setBodies] = useState([]);
  const [bodiesFilter, setBodiesFilter] = useState([]);
  const [bodiesContent, setBodiesContent] = useState();
  const [submittedData, setSubmittedData] = useState(null);

  const fetchData = () => {
    // Fetch data from the API
    axios.get('https://api.le-systeme-solaire.net/rest/bodies/')
      .then(response => {
        setBodies(response.data.bodies);
        setBodiesFilter(response.data.bodies);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const filterList = (value) => {
    let filteredBodies = bodies;
    if (value.gravity !== undefined) {
      filteredBodies = filteredBodies.filter(body => body.gravity === parseFloat(value.gravity));
    }
    if (value.isPlanet !== undefined) {
      filteredBodies = filteredBodies.filter(body => body.isPlanet === value.isPlanet);
    }
    setBodiesFilter(filteredBodies);
    console.log(filteredBodies)
  };

  const handleBodySelect = (data) => {
    const filteredContent = bodies.filter(body => body.id == data);
    console.log('data is', filteredContent[0])
    setBodiesContent(filteredContent[0])
  };
  const onSubmit = (data) => {
    filterList(data);
    setSubmittedData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div class='solar-syst'>
        <div class='sun'></div>
        <div class='mercury'></div>
        <div class='venus'></div>
        <div class='earth'></div>
        <div class='mars'></div>
        <div class='jupiter'></div>
        <div class='saturn'></div>
        <div class='uranus'></div>
        <div class='neptune'></div>
        <div class='pluto'></div>
        <div class='asteroids-belt'></div>
        <div class='content'>
          <label style={{'display': 'flex', 'justifyContent': 'space-between'}}>
          <h1>RHOBS Challenge</h1>
          <img class="logo" src="./logo.png" alt="Description de l'image" />
          </label>
          <form onSubmit={handleSubmit(onSubmit)}>

            <label>
            <span class="label-text">Is Planet:</span> 
              <Controller
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setValue('isPlanet', e.target.checked);
                      handleSubmit(onSubmit)();
                    }}
                  />
                  
                )}
                name="isPlanet"
              />
            </label>
            <br />
            <label>
              Gravity:
              <Controller
                control={control}
                render={({ field }) => (
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.1"
                    onChange={(e) => {
                      setValue('gravity', e.target.value);
                      handleSubmit(onSubmit)();
                    }}
                  />
                )}
                name="gravity"
              />
               {submittedData && (
              <label for="range">{submittedData.gravity}</label> )}
            </label> 
            <br/>
            <label>
              Select Body:
              <select onChange={(e) => handleBodySelect(e.target.value)}>
                <option value="">Select a body</option>
                {bodiesFilter.map(body => (
                  <option key={body.id} value={body.id}>
                    {body.englishName}
                  </option>
                ))}
              </select>
            </label>
          </form>
          <br />
          {bodiesContent && (
            <div class="contentText">
              <h2>Bienvenue sur : {bodiesContent.name}</h2>
              <p><strong>Discovered by:</strong> {bodiesContent.discoveredBy}</p>
              <p><strong>Discovery date:</strong> {bodiesContent.discoveryDate}</p>
              <p><strong>Mean radius:</strong> {bodiesContent.meanRadius} km</p>
              <p><strong>Gravity:</strong> {bodiesContent.gravity} m/s²</p>
              <p><strong>Semimajor axis:</strong> {bodiesContent.semimajorAxis} km</p>
              <p><strong>Orbital eccentricity:</strong> {bodiesContent.eccentricity}</p>
              <p><strong>Inclination:</strong> {bodiesContent.inclination}°</p>
              {/* Ajoutez d'autres attributs ici */}

            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default PlanetForm;
