import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Ensure we import GeoJSON types from TypeScript's built-in types
import { FeatureCollection } from "geojson";

interface CountyGeoJsonMapProps {
  countiesGeoJson: FeatureCollection; // GeoJSON for counties
  statesGeoJson: FeatureCollection; // GeoJSON for state boundaries
  colorFunction: (d: any) => string;
  tooltipFunction: (d: any) => string; // HTML string
}

const CountyGeoJsonMap: React.FC<CountyGeoJsonMapProps> = ({ countiesGeoJson, statesGeoJson, colorFunction, tooltipFunction }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null); // Tooltip reference

  useEffect(() => {
    if (countiesGeoJson && statesGeoJson) {
      const width = 900;
      const height = 600;

      // Select the SVG element
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "white");

      // Create a projection and path generator
      const projection = d3.geoAlbersUsa().fitSize([width, height], countiesGeoJson)
      const pathGenerator = d3.geoPath().projection(projection);

      // Clear any existing paths before re-drawing
      svg.selectAll("*").remove();

      // Create the tooltip div
      const tooltip = d3.select(tooltipRef.current)
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("pointer-events", "none"); // Ensures tooltip doesn't interfere with mouse events

      // Bind the countiesGeoJson data to SVG paths (counties)
      svg.selectAll(".county")
        .data(countiesGeoJson.features)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("d", pathGenerator as any) // Path generator's d attribute
        .attr("fill", colorFunction)
        .attr("stroke", "#000")
        .attr("stroke-width", 1) // Thin stroke for county borders
        .on("mouseover", function (event: any, d: any) {
          // Show the tooltip on hover
          tooltip.style("visibility", "visible")
            .html(tooltipFunction(d)); // Assuming the county name is in the "NAME" property
        })
        .on("mousemove", function (event: any) {
          // Position the tooltip near the mouse cursor
          tooltip.style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
          // Hide the tooltip when not hovering
          tooltip.style("visibility", "hidden");
        });

      // Add state boundaries on top with thicker stroke
      svg.selectAll(".state")
        .data(statesGeoJson.features)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", pathGenerator as any)
        .attr("fill", "none") // No fill for states, just the outline
        .attr("stroke", "#000") // Black stroke for state borders
        .attr("stroke-width", 3); // Thicker stroke for state borders
    }
  }, [countiesGeoJson, statesGeoJson, colorFunction, tooltipFunction]);

  return (
    <div className="">
      {/* SVG for the map */}
      <svg ref={svgRef}></svg>
      {/* Tooltip element */}
      <div ref={tooltipRef}></div>
    </div>
  );
};

export default CountyGeoJsonMap;
