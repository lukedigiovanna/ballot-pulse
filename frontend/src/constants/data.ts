import electionResults2000 from "../assets/2000_state_election_results.json";
import electionResults2004 from "../assets/2004_state_election_results.json";
import electionResults2008 from "../assets/2008_state_election_results.json";
import electionResults2012 from "../assets/2012_state_election_results.json";
import electionResults2016 from "../assets/2016_state_election_results.json";
import electionResults2020 from "../assets/2020_state_election_results.json";

const fpTable = {
    "ALABAMA": "01",        
    "ALASKA": "02",        
    "ARIZONA": "04",        
    "ARKANSAS": "05",        
    "CALIFORNIA": "06",        
    "COLORADO": "08",        
    "CONNECTICUT": "09",        
    "DELAWARE": "10",        
    "DISTRICT OF COLUMBIA": "11",        
    "FLORIDA": "12",        
    "GEORGIA": "13",        
    "HAWAII": "15",        
    "IDAHO": "16",        
    "ILLINOIS": "17",        
    "INDIANA": "18",        
    "IOWA": "19",        
    "KANSAS": "20",        
    "KENTUCKY": "21",        
    "LOUISIANA": "22",        
    "MAINE": "23",        
    "MARYLAND": "24",        
    "MASSACHUSETTS": "25",        
    "MICHIGAN": "26",        
    "MINNESOTA": "27",        
    "MISSISSIPPI": "28",        
    "MISSOURI": "29",        
    "MONTANA": "30",        
    "NEBRASKA": "31",        
    "NEVADA": "32",        
    "NEW HAMPSHIRE": "33",        
    "NEW JERSEY": "34",        
    "NEW MEXICO": "35",        
    "NEW YORK": "36",        
    "NORTH CAROLINA": "37",        
    "NORTH DAKOTA": "38",        
    "OHIO": "39",        
    "OKLAHOMA": "40",        
    "OREGON": "41",        
    "PENNSYLVANIA": "42",        
    "RHODE ISLAND": "44",        
    "SOUTH CAROLINA": "45",        
    "SOUTH DAKOTA": "46",        
    "TENNESSEE": "47",        
    "TEXAS": "48",        
    "UTAH": "49",        
    "VERMONT": "50",        
    "VIRGINIA": "51",        
    "WASHINGTON": "53",        
    "WEST VIRGINIA": "54",        
    "WISCONSIN": "55",        
    "WYOMING": "56"      
}

function stateNameToFP(name: string) {
    if (!name) {
        return name;
    }
    const up = name.toUpperCase();
    if (Object.hasOwn(fpTable, up)) {
        return (fpTable as any)[up];
    }
    else {
        throw Error("No state found with name " + name);
    }
}

const electionResults = {
    2000: electionResults2000,
    2004: electionResults2004,
    2008: electionResults2008,
    2012: electionResults2012,
    2016: electionResults2016,
    2020: electionResults2020,
}

export { electionResults };

export { electionResults2000, electionResults2004, electionResults2008, electionResults2012, 
    electionResults2016, electionResults2020
 };

export { stateNameToFP };
