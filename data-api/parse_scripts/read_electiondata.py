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
        str(year): {"candidates": [], "national": {"popular_vote": {}, "electoral_vote": {}}, "results": {}} for year in range(2000, 2024, 4)
    }
    i = 0
    for row in reader:
        year = row[0]
        fips = pad_with_zeroes(row[4], 5)
        state_fp = fips[0:2]
        county_fp = fips[2:]
        candidate = row[6].lower()
        candidate = ' '.join(map(lambda name: name[0].upper() + name[1:], filter(lambda n: len(n) > 1, candidate.split())))
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

        # national_results = results["national"]
        # if party not in national_results:
        #     national_results[party] = 0
        # national_results[party] += votes
        # national_results["total"] += votes
            
    

    for year in state_data:
        national = state_data[year]["national"]
        ec = national["electoral_vote"]
        pv = national["popular_vote"]
        if year == "2000":
            ec["republican"] = 271
            ec["democrat"] = 266
            ec["other"] = 1
            pv["republican"] = 50456062
            pv["democrat"] = 50999897
            pv["green"] = 2882955
        elif year == "2004":
            ec["republican"] = 286
            ec["democrat"] = 251
            ec["other"] = 1
            pv["republican"] = 62040610
            pv["democrat"] = 59028444
        elif year == "2008":
            ec["republican"] = 173
            ec["democrat"] = 365
            pv["republican"] = 59948323
            pv["democrat"] = 69498516
        elif year == "2012":
            ec["republican"] = 206
            ec["democrat"] = 332
            pv["republican"] = 60933504
            pv["democrat"] = 65915795
            pv["libertarian"] = 1275971
        elif year == "2016":
            ec["republican"] = 304
            ec["democrat"] = 227
            ec["other"] = 7
            pv["republican"] = 62984828
            pv["democrat"] = 65853514
            pv["libertarian"] = 4489341
            pv["green"] = 1457218
        elif year == "2020":
            ec["republican"] = 232
            ec["democrat"] = 306
            pv["republican"] = 74216747
            pv["democrat"] = 81268867
            pv["libertarian"] = 1865720


            
        with open(f"../data/{year}_state_election_results.json", "w") as fo:
            fo.write(json.dumps(state_data[year]))
