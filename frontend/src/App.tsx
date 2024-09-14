import React from 'react';
import CountyGeoJsonMap from './components/CountyGeoJsonMap';
import StateGeoJsonMap from './components/StateGeoJsonMap';

import { FeatureCollection  } from 'geojson';

import usCountiesGeoJsonData from './assets/counties_geo.json';
import useStatesGeoJsonData from './assets/states_geo.json';
import { ToggleSwitch } from './components/ToggleSwitch';

import { electionResults } from './constants/data';
import { stateNameToFP } from './constants/data';

import colors from './constants/colors';

import interpolate from "color-interpolate"

const usCountiesGeoJson = usCountiesGeoJsonData as FeatureCollection;
const usStatesGeoJson = useStatesGeoJsonData as FeatureCollection;

type CountryView = "county" | "state";

type ColorMode = "solid" | "gradient";

function App() {
  const [countryView, setCountryView] = React.useState<CountryView>("state");
  const [colorMode, setColorMode] = React.useState<ColorMode>("gradient");
  const [year, setYear] = React.useState<number>(2020);

  const colorFunction = React.useMemo(() => {
    console.log("recompute color function");
    return (d: any) => {
      const stateFP = stateNameToFP(d.properties.name as string);
      const electionData = (electionResults as any)[year]["results"][stateFP];
      const parties = Object.keys(electionData);
      parties.sort((party1, party2) => {
        return electionData[party2] - electionData[party1]
      });
      // total is always the first

      let color;
      if (Object.hasOwn(colors.parties, parties[1])) {
        color = (colors.parties as any)[parties[1]];
      }
      else {
        color =  colors.parties.other;
      }
      if (colorMode === "solid") {
        return color;  
      }
      else {
        const firstPlacePercent = electionData[parties[1]] / electionData["total"];
        const secondPlacePercent = electionData[parties[2]] / electionData["total"];
        const diff = firstPlacePercent - secondPlacePercent;
        const r = Math.max(Math.min(1, diff / 0.15), 0.2);
        const colormap = interpolate(["white", color]);
        return colormap(r);
      }
    }
  }, [year, colorMode]);

  const tooltipFunction = React.useMemo(() => {
    return (d: any) => {
      const div = document.createElement("div");
      div.className = "state-results";
      const title = document.createElement("h1");
      title.innerText = d.properties.name;
      div.appendChild(title);
      const stateFP = stateNameToFP(d.properties.name as string);
      const electionData = (electionResults as any)[year]["results"]
      const stateData = electionData[stateFP];
      const parties = Object.keys(stateData);
      parties.sort((party1, party2) => {
        return stateData[party2] - stateData[party1]
      });
      for (let i = 1; i < parties.length; i++) {
        const row = document.createElement("div");

        const p = document.createElement("p");
        p.innerText = parties[i];
        div.appendChild(p);
      }
      return div.outerHTML;
    }
  }, [year]);

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
      <div className="grid grid-rows-1 grid-cols-3 w-full justify-center">
        <div>
          {
            year > 2000 &&
            <p className="mt-2 text-start cursor-pointer text-blue-600 hover:text-purple-600" onClick={() => {setYear(year - 4)}}>
              {"<<"} {year - 4}
            </p>
          }
        </div>
        <h1 className="font-bold text-2xl text-center">
          { year } Election
        </h1>
        <div>
          {
            year < 2020 &&
            <p className="mt-2 text-end cursor-pointer text-blue-600 hover:text-purple-600" onClick={() => {setYear(year + 4)}}>
              {year + 4} {">>"}
            </p>
          }
        </div>
      </div>
      <div className="border-b-2 border-b-black w-full my-2" />

      <div className="flex">
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
        <div className="flex self-start mx-10 space-x-2">
          <ToggleSwitch isChecked={colorMode === "solid"} onToggle={() => {
            if (colorMode === "solid") {
              setColorMode("gradient");
            }
            else {
              setColorMode("solid");
            }
          }} />
          <h1 className="self-center font-bold text-lg">
            { colorMode === "gradient" ? "Gradient" : "Solid" } Colors
          </h1>
        </div>
      </div>
      {
        countryView === "county" ?
        <CountyGeoJsonMap countiesGeoJson={usCountiesGeoJson} statesGeoJson={usStatesGeoJson} />
        :
        <StateGeoJsonMap statesGeoJson={usStatesGeoJson} colorFunction={colorFunction} tooltipFunction={tooltipFunction}/>
      }
    </div>
  );
}

export default App;
