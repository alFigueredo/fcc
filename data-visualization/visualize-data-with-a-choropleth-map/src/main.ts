import "./style.css";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const section = d3.select("#app").append("section");

const heading = section.append("heading");

heading
  .append("h1")
  .attr("id", "title")
  .text("United States Educational Attainment");

heading
  .append("div")
  .attr("id", "description")
  .text(
    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
  );

const svg = section.append("svg").attr("height", 600).attr("width", 960);

section
  .append("div")
  .attr("id", "source")
  .html(
    `Source: <a href="https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx">USDA Economic Research Service</a>`
  );

const tooltip = section
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

const path = d3.geoPath();

const x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

const schemeGreens9 = d3.schemeGreens[9];

const color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range([...Array(schemeGreens9.length).keys()]);

const g = svg
  .append("g")
  .attr("class", "key")
  .attr("id", "legend")
  .attr("transform", "translate(0, 40)");

g.selectAll("rect")
  .data(
    color.range().map((colorIndex) => {
      const d = color.invertExtent(colorIndex);
      if (d[0] === null) d[0] = x.domain()[0];
      if (d[1] === null) d[1] = x.domain()[1];
      return d;
    })
  )
  .enter()
  .append("rect")
  .attr("height", 8)
  .attr("x", (d) => x(d[0]!))
  .attr("width", (d) => (d[0] && d[1] ? x(d[1]) - x(d[0]) : x(NaN)))
  .attr("fill", (d) => schemeGreens9[color(d[0]!)]);

g.append("text")
  .attr("class", "caption")
  .attr("x", x.range()[0])
  .attr("y", -6)
  .attr("fill", "#000")
  .attr("text-anchor", "start")
  .attr("font-weight", "bold");

g.call(
  d3
    .axisBottom(x)
    .tickSize(13)
    .tickFormat((x) => Math.round(Number(x)) + "%")
    .tickValues(color.domain())
)
  .select(".domain")
  .remove();

const EDUCATION_FILE =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const COUNTY_FILE =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

interface CountyFile {
  fips: number;
  state: string;
  area_name: string;
  bachelorsOrHigher: number;
}

Promise.all([d3.json(COUNTY_FILE), d3.json(EDUCATION_FILE)])
  .then((data) => ready(data[0] as TopoJSON.Topology, data[1] as CountyFile[]))
  .catch((err) => console.log(err));

const ready = (us: TopoJSON.Topology, education: CountyFile[]) => {
  svg
    .append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(
      topojson.feature(
        us,
        us.objects
          .counties as TopoJSON.GeometryCollection<GeoJSON.GeoJsonProperties>
      ).features
    )
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("data-fips", (d) => d.id!)
    .attr("data-education", (d) => {
      const result = education.filter((obj) => obj.fips === d.id);
      if (result[0]) return result[0].bachelorsOrHigher;
      console.log("could find data for: ", d.id);
      return 0;
    })
    .attr("fill", (d) => {
      const result = education.filter((obj) => obj.fips === d.id);
      if (result[0]) return schemeGreens9[color(result[0].bachelorsOrHigher)];
      return schemeGreens9[color(0)];
    })
    .attr("d", path)
    .on("mouseover", function (event, d) {
      tooltip.style("opacity", 0.9);
      tooltip
        .html(() => {
          const result = education.filter((obj) => obj.fips === d.id);
          if (result)
            return (
              result[0]["area_name"] +
              ", " +
              result[0]["state"] +
              ": " +
              result[0].bachelorsOrHigher +
              "%"
            );
          return "0";
        })
        .attr("data-education", () => {
          const result = education.filter((obj) => obj.fips === d.id);
          if (result[0]) return result[0].bachelorsOrHigher;
          return 0;
        })
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));

  svg
    .append("path")
    .datum(
      topojson.mesh(
        us,
        us.objects.states as TopoJSON.GeometryCollection,
        (a, b) => a !== b
      )
    )
    .attr("class", "states")
    .attr("d", path);
};
