import React from 'react';
import CountyGeoJsonMap from './components/CountyGeoJsonMap';
import StateGeoJsonMap from './components/StateGeoJsonMap';

import { FeatureCollection  } from 'geojson';

import usCountiesGeoJsonData from './assets/counties_geo.json';
import useStatesGeoJsonData from './assets/states_geo.json';
import { ToggleSwitch } from './components/ToggleSwitch';

import { electionResults } from './constants/data';
import { education } from './constants/data';
import { stateNameToFP } from './constants/data';

import colors from './constants/colors';

import interpolate from "color-interpolate"

const usCountiesGeoJson = usCountiesGeoJsonData as FeatureCollection;
const usStatesGeoJson = useStatesGeoJsonData as FeatureCollection;

type CountryView = "county" | "state";
type ColorMode = "solid" | "gradient";
type DataView = "data" | "correlation";
type Party = "Republican" | "Democrat";

const views = ["Election Results", "Turnout", "Adult Population", "Adults With Bachelors", "Median Income", "Adults With High School", "Adults With Some College", "Gender"];

function App() {
  const [countryView, setCountryView] = React.useState<CountryView>("state");
  const [colorMode, setColorMode] = React.useState<ColorMode>("gradient");
  const [year, setYear] = React.useState<number>(2020);
  const [diffMode, setDiffMode] = React.useState<boolean>(false);

  const [dataView, setDataView] = React.useState<DataView>("data");
  const [view, setView] = React.useState<string>(views[0]);

  const [party, setParty] = React.useState<Party>("Republican");

  React.useEffect(() => {
    if (view !== "Election Results") {
      if (year < 2012) {
        setYear(2012);
      }
      setCountryView("county");
    }
    else {
      setDataView("data");
    }
  }, [view])

  const keyPress = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      if (view !== "Election Results") {
        setYear(Math.max(2012, year - 4));
      }
      else {
        setYear(Math.max(2000, year - 4));
      }
    }
    else if (event.key === "ArrowRight") {
      setYear(Math.min(2020, year + 4));
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', keyPress);

    return () => {
      window.removeEventListener('keydown', keyPress);
    };
  }, [year]);

  const colorFunction = React.useMemo(() => {
    console.log("recompute color function");
    return (d: any) => {
      const fp = countryView === "state" ? stateNameToFP(d.properties.name as string) : d.properties.STATEFP + d.properties.COUNTYFP;
      const results = (electionResults as any)[year]["results"];
      if (!Object.hasOwn(results, fp)) {
        return "lightgray";
      }
      const electionData = results[fp];

      const corr = (R: number) => {
        if (dataView === "data") {
          return R;
        }
        else { // actually computing corr now
          let p;
          if (party === "Republican") {
            p = electionData["republican"] / electionData["total"];
          }
          else { // Democrat
            p = electionData["democrat"] / electionData["total"];
          }
          const T = Math.max(Math.min((p - 0.25) / 0.5, 1), 0);
          return Math.sin(T * Math.PI / 2) * Math.sin(R * Math.PI / 2);
          // return 1 - Math.sqrt(Math.abs((1 - R) * (1 - R) - (1 - T) * (1 - T)));
          // if (R > 0.6 && T > 0.6) {
          //   return 1;
          // }
          // else {
          //   return 0;
          // }
        }
      }

      const cmap = (map: any) => {
        if (dataView === "data") {
          return map;
        }
        else {
          if (party === 'Republican') {
            return interpolate(["white", colors.parties.republican]);
          }
          else { // Democrat
            return interpolate(["white", colors.parties.democrat]);
          }
        }
      }

      if (view !== "Election Results") {
        if (!Object.hasOwn(education, year)) {
          return "lightgray";
        }
        const data = (education as any)[year];
        if (!Object.hasOwn(data, fp)) {
          return "lightgray";
        }
        const countyData = data[fp];
        const bachelors = countyData["bachelors_or_higher"];
        const someCollege = bachelors + countyData["some_college"];
        const hs = someCollege + countyData["hs"];
        if (view === "Gender") {
          const mpop = countyData["male_population"];
          const fpop = countyData["female_population"];
          if (colorMode === "solid") {
            if (mpop > fpop) {
              return colors.genders.male;
            }
            else {
              return colors.genders.female;
            }
          }
          else {
            const tpop = mpop + fpop;
            const mpopR = mpop / tpop;
            const fpopR = fpop / tpop;
            const diff = Math.min(Math.max(Math.abs(mpopR - fpopR) / 0.1, 0.2), 1);
            const colormap = interpolate(["white", mpop > fpop ? colors.genders.male : colors.genders.female]);
            return colormap(diff);
          }
        }
        else if (view === "Median Income") {
          const income = countyData["median_income"];
          const R = corr(Math.min(Math.max(0, (income - 25000) / 40000), 1));
          const colormap = cmap(interpolate(["#cfe2f3", "#084594"]));
          return colormap(R);
        }
        else if (view === "Adult Population") {
          const population = countyData["male_population"] + countyData["female_population"];
          if (dataView === "correlation") {
            return cmap(null)(corr(Math.min(population / 200000, 1)))
          }
          if (population < 10000) {
            return "#deebf7"
          }
          else if (population < 50000) {
            return "#c6dbef"
          }
          else if (population < 200000) {
            return "#9ecae1";
          }
          else if (population < 1000000) {
            return "#3182bd";
          }
          else {
            return "#08519c";
          }
        }
        else if (view === "Adults With High School") {
          const R = corr(Math.min((hs - 75) / 18, 1));
          const colormap = cmap(interpolate(["#830404", "#cde9f5"]));
          return colormap(R); 
        }
        else if (view === "Adults With Some College") {
          const R = corr(Math.min((someCollege - 30) / 30, 1));
          const colormap = cmap(interpolate(["#830404", "#cde9f5"]));
          return colormap(R);
        }
        else if (view === "Adults With Bachelors") {
          const R = corr(Math.min((bachelors - 15) / 30, 1));
          const colormap = cmap(interpolate(["#deebf7", "#3182bd"]));
          return colormap(R);
        }
        else if (view === "Turnout") {
          
          const votes = electionData["total"];
          const population = countyData["male_population"] + countyData["female_population"];
          const turnout = votes / population;
          const R = corr(Math.max(Math.min((turnout - 0.4) / 0.4, 1), 0));
          const colormap = cmap(interpolate(["#deebf7", "#3182bd"]));
          return colormap(R);
        }
      }
      else { // Election Results
        const parties = Object.keys(electionData);
  
        if (diffMode) {
          if (year === 2000) {
            return colors.parties.undefined;
          }
          const previousElectionData = (electionResults as any)[year - 4]["results"][fp];
          if (!previousElectionData) {
            return colors.parties.undefined;
          }
          const diffs: any = {};
          parties.forEach((party) => {
            const thisProp = electionData[party] / electionData["total"];
            if (!Object.hasOwn(previousElectionData, party)) {
              diffs[party] = thisProp;
            }
            else {
              const pastProp = previousElectionData[party] / previousElectionData["total"];
              diffs[party] = thisProp - pastProp;
            }
          });
          parties.sort((party1, party2) => {
            return diffs[party2] - diffs[party1];
          });
          const color = (colors.parties as any)[parties[0]];
          if (colorMode === "solid") {
            return color;
          }
          else {
            const r = Math.max(Math.min(diffs[parties[0]] / 0.1, 1), 0.15);
            const colormap = interpolate(["white", color]);
            return colormap(r);
          }
        }
        else {
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
      }
    }
  }, [year, colorMode, countryView, diffMode, view, dataView, party]);

  const tooltipFunction = React.useMemo(() => {
    return (d: any) => {
      const div = document.createElement("div");
      div.className = "state-results";
      const title = document.createElement("h1");
      title.innerText = countryView === "state" ? d.properties.name : d.properties.NAME;
      div.appendChild(title);
      const fp = countryView === "state" ? stateNameToFP(d.properties.name as string) : d.properties.STATEFP + d.properties.COUNTYFP;
      const electionData = (electionResults as any)[year];
      
      if (!Object.hasOwn(electionData["results"], fp)) {
        const p = document.createElement("p");
        p.innerText = "No data found :(";
        div.appendChild(p);
        return div.outerHTML;
      }
      const stateData = electionData["results"][fp];

      if (view !== "Election Results") {
        if (!Object.hasOwn(education, year)) {
          return "lightgray";
        }
        const educationData = (education as any)[year];
        if (!Object.hasOwn(educationData, fp)) {
          const p = document.createElement("p");
          p.innerText = "No data found :(";
          div.appendChild(p);
          return div.outerHTML;
        }
        const stateData = electionData["results"][fp];

        const countyData = educationData[fp];
        const bachelors = countyData["bachelors_or_higher"];
        const someCollege = bachelors + countyData["some_college"];
        const hs = someCollege + countyData["hs"];
        const mpop = countyData["male_population"];
        const fpop = countyData["female_population"];
        const tpop = mpop + fpop;
        if (view === "Gender") {
          const mpp = document.createElement("p");
          mpp.innerText = `Males: ${mpop.toLocaleString()} (${Math.round(mpop / tpop * 1000) / 10}%)`
          const fpp = document.createElement("p");
          fpp.innerText = `Females: ${fpop.toLocaleString()} (${Math.round(fpop / tpop * 1000) / 10}%)`
          div.appendChild(mpp);
          div.appendChild(fpp);
        }
        else if (view === "Median Income") {
          const income = countyData["median_income"];
          const p = document.createElement("p");
          p.innerText = "$" + income.toLocaleString();
          div.appendChild(p);
        }
        else if (view === "Adult Population") {
          const population = countyData["male_population"] + countyData["female_population"];
          const p = document.createElement("p");
          p.innerText = population.toLocaleString();
          div.appendChild(p);
        }
        else if (view === "Adults With High School") {
          const percent = Math.round(hs);
          const p = document.createElement("p");
          p.innerText = percent + "%";
          div.appendChild(p);
        }
        else if (view === "Adults With Some College") {
          const percent = Math.round(someCollege);
          const p = document.createElement("p");
          p.innerText = percent + "%";
          div.appendChild(p);
        }
        else if (view === "Adults With Bachelors") {
          const percent = Math.round(bachelors);
          const p = document.createElement("p");
          p.innerText = percent + "%";
          div.appendChild(p);
        }
        else if (view === "Turnout") {
          const votes = stateData["total"];
          const turnout = votes / tpop;
          const p = document.createElement("p");
          p.innerText = Math.round(turnout * 100) + "%";
          div.appendChild(p);
          const p2 = document.createElement("p");
          p2.innerText = `${votes.toLocaleString()}/${tpop.toLocaleString()}`
          div.appendChild(p2);
        }
      }
      else { // Election Results
        const candidates = electionData["candidates"];
        const parties = Object.keys(stateData);
        parties.sort((party1, party2) => {
          return stateData[party2] - stateData[party1]
        });
        for (let i = 1; i < parties.length; i++) {
          const row = document.createElement("div");
          row.className = "row";
          const colorBar = document.createElement("div");
          colorBar.className = "color-bar";
          colorBar.style.backgroundColor = (colors.parties as any)[parties[i]];
          row.appendChild(colorBar);
          const p = document.createElement("p");
          for (let j = 0; j < candidates.length; j++) {
            if (candidates[j].party === parties[i]) {
              p.innerText = candidates[j].name;
              break;
            }
          }
          if (p.innerText.length === 0) {
            p.innerText = parties[i];
          }
          if (i === 1) {
            p.style.fontWeight = "bold";
          }
          const votes = stateData[parties[i]];
          const proportion = votes / stateData["total"];
          
          p.innerText += " (" + (Math.round(proportion * 1000) / 10) + "%"; 
          if (diffMode) {
            let diff = 0;
            if (year >= 2004) {
              const previousElectionResults = (electionResults as any)[year - 4]["results"][fp];
              if (Object.hasOwn(previousElectionResults, parties[i])) {
                const oldProp = previousElectionResults[parties[i]] / previousElectionResults["total"];
                diff = proportion - oldProp;
              }
            }
            if (diff >= 0) {
              p.innerText += ", +" + Math.round(diff * 1000) / 10 + "%";
            }
            else {
              p.innerText += ", " + Math.round(diff * 1000) / 10 + "%";
            }
          }
          p.innerText += ")"
          row.appendChild(p);
          div.appendChild(row);
          const voteCount = document.createElement("p");
          voteCount.className="vote-count";
          voteCount.innerText = "(" + votes.toLocaleString() + ")";
          div.appendChild(voteCount);
        }
      }
      return div.outerHTML;
    }
  }, [year, countryView, diffMode, view, dataView, party]);

  return (
    <div className="flex flex-col items-center p-4 max-w-5xl mx-auto">
      <h1 className="text-center text-6xl font-bold">
        Ballot Pulse
      </h1>
      <h1 className="font-bold text-xl">
        “A republic, if you can keep it” <span className="text-lg italic font-normal">-Benjamin Franklin</span>
      </h1>
      <h1 className=" text-blue-600 text-xl my-2">
        <a href="https://vote.gov/" target="_blank">
        🗳️ <span className="italic underline">REGISTER TO VOTE!</span> 🗳️
        </a>
      </h1>
      <div className="border-b-2 border-b-black w-full my-2 mt-4" />
      <div className="grid grid-rows-1 grid-cols-3 w-full justify-center">
        <div>
          {
            ((year > 2000 && view === "Election Results") || (year > 2012 && view !== "Election Results")) &&
            <p className="mt-2 text-start cursor-pointer text-blue-600 hover:text-purple-600" onClick={() => {
                if (view !== "Election Results") {
                  setYear(Math.max(2012, year - 4));
                }
                else {
                  setYear(Math.max(2000, year - 4));
                }
              }}>
              {"<<"} {year - 4}
            </p>
          }
        </div>
        <h1 className="font-bold text-3xl text-center">
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
      <div className="mb-4 grid grid-cols-3">
        <div className="flex justify-center items-center">
          <p className="h-fit mr-2 font-bold text-lg">
            Data View:
          </p>
          <select name="data-views" className="rounded-md px-2 py-1 w-[220px] border-[1.5px] border-black font-bold" onChange={(e) => {
            setView(e.target.value);
          }}>
            {
              views.map(view =>
                <option value={view}>{view}</option>
              )
            }
          </select>
        </div>
        <div className="flex self-start mx-10 space-x-2">
          <ToggleSwitch isChecked={dataView === "correlation"} disabled={view === "Election Results"} onToggle={() => {
            if (dataView === "data") {
              setDataView("correlation");
            }
            else {
              setDataView("data");
            }
          }} />
          <h1 className="self-center font-bold text-lg">
            { dataView === "data" ? "Raw Data" : "Election Correlation" }
          </h1>
        </div>
        <div className="flex self-start mx-10 space-x-2">
          <ToggleSwitch isChecked={party === "Democrat"} disabled={view === "Election Results" || dataView === "data" || view === "Gender"} onToggle={() => {
            if (party === "Republican") {
              setParty("Democrat");
            }
            else {
              setParty("Republican");
            }
          }} />
          <h1 className="self-center font-bold text-lg">
            { party } Correlation
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-3 w-full">
        <div className="flex self-start mx-10 space-x-2">
          <ToggleSwitch isChecked={countryView === "county"} disabled={view !== "Election Results"} onToggle={() => {
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
          <ToggleSwitch isChecked={colorMode === "solid"} disabled={false} onToggle={() => {
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
        <div className="flex self-start mx-10 space-x-2">
          <ToggleSwitch isChecked={diffMode} disabled={view !== "Election Results"} onToggle={() => {
            setDiffMode(!diffMode);
          }} />
          <h1 className="self-center font-bold text-lg">
            { diffMode ? "Diff" : "Absolute" } { view === "Election Results" ? "Votes" : "Values"}
          </h1>
        </div>
      </div>
      
      <div className="border-b-2 border-b-gray-400 w-full my-2" />

      <div className="grid grid-cols-2 w-full my-1">
          <div className="ml-8">
            <p className="text-left font-bold text-2xl">
              {
                (electionResults as any)[year]["candidates"].find((e: any) => e.party === "democrat")["name"]
              }
            </p>
            <p className="text-left italic text-lg mt-[-8px] text-gray-800">
              (Democrat)
            </p>
          </div>
          <div className="mr-8">
            <p className="text-right font-bold text-2xl mb-0">
             {
                (electionResults as any)[year]["candidates"].find((e: any) => e.party === "republican")["name"]
              }
            </p>
            <p className="text-right italic text-lg mt-[-8px] text-gray-800">
              (Republican)
            </p>
          </div>
      </div>

      {
        countryView === "county" ?
        <CountyGeoJsonMap countiesGeoJson={usCountiesGeoJson} statesGeoJson={usStatesGeoJson} colorFunction={colorFunction} tooltipFunction={tooltipFunction} />
        :
        <StateGeoJsonMap statesGeoJson={usStatesGeoJson} colorFunction={colorFunction} tooltipFunction={tooltipFunction}/>
      }

      <div className="border-b-2 border-b-gray-400 w-full my-2" />
      
      <h1 className="font-bold text-2xl">
        National Results
      </h1>
      
      <table className="national-results">
        <tr>
          <th>
            Party
          </th>
          <th>
            Candidate
          </th>
          <th>
            Electoral Votes
          </th>
          <th>
            Popular Vote
          </th>
        </tr>
        {
          (() => {
            const data = (electionResults as any)[year];
            const ev = data["national"]["electoral_vote"];
            const pv = data["national"]["popular_vote"];
            const candidates = data["candidates"].toSorted((cand1: any, cand2: any) => {
              if (!Object.hasOwn(pv, cand1.party)) {
                if (!Object.hasOwn(pv, cand2.party)) {
                  return 0;
                }
                else {
                  return 1;
                }
              }
              else {
                if (Object.hasOwn(pv, cand2.party)) {
                  return pv[cand2.party] - pv[cand1.party];
                }
                else {
                  return -1;
                }
              }
            });
            return candidates.map((candidate: any) => 
              <tr className={(Object.hasOwn(ev, candidate.party) && ev[candidate.party] >= 270) ? "win" : ""}>
                <td>
                  {candidate.party[0].toUpperCase() + candidate.party.substring(1)}
                </td>
                <td>
                  {candidate.name}
                </td>
                <td>
                  {ev[candidate.party] || 0}
                </td>
                <td>
                  {Object.hasOwn(pv, candidate.party) ? pv[candidate.party].toLocaleString() : 0}
                </td>
              </tr>
            )
          })()
        }
      </table>

      <div className="border-b-2 border-b-black w-full my-2" />

      <div>
        <span className="font-bold">A note about how correlation works:</span> areas with a high
        value of the selected data field and voted highly for the selected party show up in a 
        bright color. For example, selecting "Adult Population" and "Democrat Correlation" essentially
        show the areas with high population that voted for the Democrat in that election.
      </div>

      <div className="h-48"/>

      <p className="text-center italic">
        Made with love for VTHacks XII!
      </p>
    </div>
  );
}

export default App;
