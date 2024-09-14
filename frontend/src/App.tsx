import React from 'react';
import CountyGeoJsonMap from './components/CountyGeoJsonMap';
import StateGeoJsonMap from './components/StateGeoJsonMap';

import { FeatureCollection  } from 'geojson';

import usCountiesGeoJsonData from './assets/counties_geo.json';
import useStatesGeoJsonData from './assets/states_geo.json';
import { ToggleSwitch } from './components/ToggleSwitch';

import { electionResults2000, electionResults2020 } from './constants/data';
import { stateNameToFP } from './constants/data';

import colors from './constants/colors';

const usCountiesGeoJson = usCountiesGeoJsonData as FeatureCollection;
const usStatesGeoJson = useStatesGeoJsonData as FeatureCollection;

type CountryView = "county" | "state";

function App() {
  const [countryView, setCountryView] = React.useState<CountryView>("state");

  return (
    <div className="flex flex-col items-center p-4 max-w-5xl mx-auto">
      <h1 className="text-center text-5xl font-bold">
        Election Data Inspector
      </h1>
      <h1 className=" text-blue-600 text-xl my-2">
        <a href="https://vote.gov/" target="_blank">
        🗳️ <span className="italic underline">REGISTER TO VOTE!</span> 🗳️
        </a>
      </h1>
      <div className="flex self-start mx-10 space-x-2">
        <ToggleSwitch isChecked={countryView === "county"} onToggle={() => {
          if (countryView === "county") {
            setCountryView("state");
          }
          else {
            setCountryView("county");
          }
        }} />
        <h1 className="self-center font-bold text-lg">
          { countryView === "county" ? "County" : "State" } View
        </h1>
      </div>
      {
        countryView === "county" ?
        <CountyGeoJsonMap countiesGeoJson={usCountiesGeoJson} statesGeoJson={usStatesGeoJson} />
        :
        <StateGeoJsonMap statesGeoJson={usStatesGeoJson} colorFunction={(d) => {
          const stateFP = stateNameToFP(d.properties.name as string);
          const electionData = (electionResults2020["results"] as any)[stateFP]
          if (electionData.democrat > electionData.republican) {
            return colors.parties.democrat;
          }
          else {
            return colors.parties.republican;
          }
          return colors.parties.other;
        }}/>
      }
    </div>
  );
}

export default App;
