import json

with open("../raw_data/counties_geo.json") as f:
    js = json.loads(f.read())
    good = []
    for feature in js["features"]:
        state_fp = int(feature["properties"]["STATEFP"])
        if state_fp == 2 or state_fp == 15 or state_fp > 56:
            continue
        good.append(feature)
    js["features"] = good
    with open("../data/counties_geo.json", "w") as fr:
        fr.write(json.dumps(js))