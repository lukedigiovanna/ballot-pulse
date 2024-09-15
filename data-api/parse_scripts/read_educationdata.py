import csv
import json

years = [2012, 2016, 2020, 2022]

def read_int(v):
    try:
        return int(v)
    except:
        return 0

def read_float(v):
    try:
        return float(v)
    except:
        return 0

for year in years:
    with open(f"../raw_data/ACSST5Y{year}.S1501-Data.csv") as f:
        reader = csv.reader(f)
        next(reader, None) # skip header
        next(reader, None) # skip header
        i = 0
        data = {}
        for row in reader:
            fips = row[0][-5:]

            if year == 2012:
                pop18to24 = read_int(row[2])
                male18to24 = read_int(row[4])
                female18to24 = read_int(row[6])

                lessThanHS18to24 = read_float(row[8])
                hs18to24 = read_float(row[14])
                someCollege18to24 = read_float(row[20])
                bachelorsOrHigher18to24 = read_float(row[26])

                pop25 = read_int(row[32])
                male25 = read_int(row[34])
                female25 = read_int(row[36])

                lessThan925 = read_float(row[38])
                hs9to1225 = read_float(row[44])
                hs25 = read_float(row[50])
                someCollegeNoAss25 = read_float(row[56])
                associates25 = read_float(row[62])
                bachelors25 = read_float(row[68])
                grad25 = read_float(row[74])

                earnings = read_int(row[188])
            elif year == 2016:
                pop18to24 = read_int(row[2])
                male18to24 = read_int(row[6])
                female18to24 = read_int(row[10])

                lessThanHS18to24 = read_float(row[16])
                hs18to24 = read_float(row[28])
                someCollege18to24 = read_float(row[40])
                bachelorsOrHigher18to24 = read_float(row[52])

                pop25 = read_int(row[62])
                male25 = read_int(row[66])
                female25 = read_int(row[70])

                lessThan925 = read_float(row[76])
                hs9to1225 = read_float(row[88])
                hs25 = read_float(row[100])
                someCollegeNoAss25 = read_float(row[112])
                associates25 = read_float(row[124])
                bachelors25 = read_float(row[136])
                grad25 = read_float(row[148])

                earnings = read_int(row[698])
            else:
                pop18to24 = read_int(row[2])
                male18to24 = read_int(row[258])
                female18to24 = read_int(row[514])

                lessThanHS18to24 = read_float(row[132])
                hs18to24 = read_float(row[134])
                someCollege18to24 = read_float(row[136])
                bachelorsOrHigher18to24 = read_float(row[138])

                pop25 = read_int(row[12])
                male25 = read_int(row[268])
                female25 = read_int(row[524])

                lessThan925 = read_float(row[142])
                hs9to1225 = read_float(row[144])
                hs25 = read_float(row[146])
                someCollegeNoAss25 = read_float(row[148])
                associates25 = read_float(row[150])
                bachelors25 = read_float(row[152])
                grad25 = read_float(row[154])

                earnings = read_int(row[118])



            lessThanHS25 = lessThan925 + hs9to1225
            someCollege25 = someCollegeNoAss25 + associates25
            bachelorsOrHigher25 = bachelors25 + grad25 

            totalPop = pop18to24 + pop25
            totalMale = male18to24 + male25
            totalFemale = female18to24 + female25

            
            # print(fips, totalPop, totalMale, totalFemale, earnings)

            lessThanHS = (lessThanHS18to24 * pop18to24 + lessThanHS25 * pop25) / totalPop
            hs = (hs18to24 * pop18to24 + hs25 * pop25) / totalPop
            someCollege = (someCollege18to24 * pop18to24 + someCollege25 * pop25) / totalPop
            bachelors = (bachelorsOrHigher18to24 * pop18to24 + bachelorsOrHigher25 * pop25) / totalPop
            
            total = lessThanHS + hs + someCollege + bachelors

            county_data = {
                "population": totalPop,
                "male_population": totalMale,
                "female_population": totalFemale,
                "median_income": earnings,
                "less_than_hs": lessThanHS,
                "hs": hs,
                "some_college": someCollege,
                "bachelors_or_higher": bachelors
            }

            data[fips] = county_data
        
        with open(f"../data/{year}_education.json", "w") as fo:
            fo.write(json.dumps(data))