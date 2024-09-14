import React from 'react';
import CountyGeoJsonMap from './components/CountyGeoJsonMap';
import StateGeoJsonMap from './components/StateGeoJsonMap';

import { FeatureCollection  } from 'geojson';

import usCountiesGeoJsonData from './assets/counties_geo.json';
import useStatesGeoJsonData from './assets/states_geo.json';
import { ToggleSwitch } from './components/ToggleSwitch';


const usCountiesGeoJson = usCountiesGeoJsonData as FeatureCollection;
const usStatesGeoJson = useStatesGeoJsonData as FeatureCollection;

type CountryView = "county" | "state";

function App() {
  const [countryView, setCountryView] = React.useState<CountryView>("county");

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-center text-5xl font-bold">
        Election Data Inspector
      </h1>
      <h1 className=" text-blue-600 text-xl my-2">
        <a href="https://vote.gov/" target="_blank">
        🗳️ <span className="italic underline">REGISTER TO VOTE!</span> 🗳️
        </a>
      </h1>
      <ToggleSwitch isChecked={countryView === "county"} onToggle={() => {
        if (countryView === "county") {
          setCountryView("state");
        }
        else {
          setCountryView("county");
        }
      }} />
      {
        countryView === "county" ?
        <CountyGeoJsonMap countiesGeoJson={usCountiesGeoJson} statesGeoJson={usStatesGeoJson} />
        :
        <>this is broken.</>
        // <StateGeoJsonMap statesGeoJson={usStatesGeoJson} />
      }
    </div>
  );
}

export default App;
