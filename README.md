# Ballot Pulse

This is my submission for VTHacks 12!

## Inspiration

I am a political junkie, and now that it is election season I cannot stop listening to the news and hawking the latest polls. Past election behavior can give a strong indicator to the zeitgeist of the nation and what to expect in the future. I love looking at this information, but I often struggled to quickly find this election data. I'd have to search "2008 election results Virginia", and navigate 3 pages to find what I was looking for. This application fixes that nuisance. 

## What it does

**Ballot Pulse** is a one-stop-shop for all presidential election and election-related data visualizations going back to the 2000 election. You can view results in all kinds of formats such as viewing state-wide results in solid color (like a generic electoral college map). You can enable _gradient-mode_ to gain insight into how close a state or county was. You can view differentials between parties from election to election. And most uniquely, you can compare demographic data such as voter turnout, population, education, and income to how people voted that year. Ballot Pulse gives you insight into past elections like no other election reporting platform.

## How I built it

For the data I sourced election results from **MIT Election Lab** and demographic data from **Census.gov**.

For the data visualization, I used the mapping features of D3.js.

For parsing the data and transforming it into a usable format, I used Python.

For developing a frontend, I used React.js and TypeScript.

## Challenges I ran into

Sourcing election and election-related data (such as demographics) was a major challenge. This data is sprawled across the internet and the United States census website, and pulling it together, parsing it, and collating it into a usable format for this application was difficult and time-consuming. 

## Accomplishments that I'm proud of

Getting the demographic information to be visualized after starting from an enormous spreadsheet of data (it was over 700 columns long), was very satisfying. Additionally, deciphering a way to show the correlation between demographic data and election results was difficult, but I am very pleased with the ultimate functionality of this feature.

## What I learned

I had never made map visualizations or used D3 before, so gaining familiarity with that was challenging but rewarding. I also learned a lot about election data history like the fact that just about as many people voted for Hillary Clinton as did voted for 3rd party candidates in Utah in 2016.

## What's next for Ballot Pulse

With just a day and a half to build this, I wasn't able to shove every feature I wanted to in. I want to add visualizations for other kinds of data such as race or more unexpected measures such as gasoline prices. I also want to add a feature for users to be able to zoom in on particular states.
