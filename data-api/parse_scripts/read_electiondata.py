import csv
import json

def pad_with_zeroes(number, total_length):
    number_str = str(number)
    number_of_zeroes = total_length - len(number_str)
    padded_number = '0' * number_of_zeroes + number_str
    return padded_number

# example output for state JSON
"""
{
    "2000": {
        "candidates": [
            {
                "name": "George W. Bush",
                "party": "republican"
            },
            etc.
        ],
        "results": {
            "01": {
                "republican": 823482,
                "democrat": 328342,
                "total": 11212032,
            }
        }
    }
}

"""

with open("../raw_data/countypres_2000-2020.csv") as f:
    reader = csv.reader(f, delimiter=',')
    next(reader, None) # skip header
    state_data = {
        str(year): {"candidates": [], "results": {}} for year in range(2000, 2024, 4)
    }
    i = 0
    for row in reader:
        year = row[0]
        fips = pad_with_zeroes(row[4], 5)
        state_fp = fips[0:2]
        county_fp = fips[2:]
        candidate = row[6].lower()
        candidate = ' '.join(map(lambda name: name[0].upper() + name[1:], candidate.split()))
        party = row[7].lower()
        votes = int(row[8])
        
        year_data = state_data[year]
        candidates = year_data["candidates"]
        results = year_data["results"]
        if len(list(filter(lambda x: x["name"] == candidate, candidates))) == 0:
            candidates.append({
                "name": candidate,
                "party": party
            })
        if state_fp not in results:
            results[state_fp] = {"total": 0}
        state_results = results[state_fp]
        if party not in state_results:
            state_results[party] = 0
        state_results[party] += votes
        state_results["total"] += votes

        if fips not in results:
            results[fips] = {"total": 0}
        county_results = results[fips]
        if party not in county_results:
            county_results[party] = 0
        county_results[party] += votes
        county_results["total"] += votes
            
    
    for year in state_data:
        with open(f"../data/{year}_state_election_results.json", "w") as fo:
            fo.write(json.dumps(state_data[year]))
