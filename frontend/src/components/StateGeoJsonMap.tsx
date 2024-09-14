import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Ensure we import GeoJSON types from TypeScript's built-in types
import { FeatureCollection } from "geojson";

interface StateGeoJsonMapProps {
  statesGeoJson: FeatureCollection; // GeoJSON for state boundaries
}

const StateGeoJsonMap: React.FC<StateGeoJsonMapProps> = ({ statesGeoJson }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null); // Tooltip reference

  useEffect(() => {
    if (statesGeoJson) {
      const width = 800;
      const height = 600;

      // Select the SVG element
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "white");

      // Create a projection and path generator
      const projection = d3.geoMercator().fitSize([width, height], statesGeoJson);
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

      svg.selectAll(".state")
        .data(statesGeoJson.features)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", pathGenerator as any) // Path generator's d attribute
        .attr("fill", "blue")
        .attr("stroke", "#000")
        .attr("stroke-width", 1) // Thin stroke for county borders
        .on("mouseover", function (event, d) {
          // Show the tooltip on hover
          tooltip.style("visibility", "visible")
            .text(d.properties?.name); // Assuming the county name is in the "NAME" property
        })
        .on("mousemove", function (event) {
          // Position the tooltip near the mouse cursor
          tooltip.style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
          // Hide the tooltip when not hovering
          tooltip.style("visibility", "hidden");
        });
    }
  }, [statesGeoJson]);

  return (
    <div>
      {/* SVG for the map */}
      <svg ref={svgRef}></svg>
      {/* Tooltip element */}
      <div ref={tooltipRef}></div>
    </div>
  );
};

export default StateGeoJsonMap;
