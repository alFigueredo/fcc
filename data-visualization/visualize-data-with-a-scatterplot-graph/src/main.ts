import "./style.css";
import * as d3 from "d3";

const margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60,
  },
  width = 920 - margin.left - margin.right,
  height = 630 - margin.top - margin.bottom;

const x = d3.scaleLinear().range([0, width]);

const y = d3.scaleTime().range([0, height]);

const color = d3.scaleOrdinal(d3.schemeCategory10);

const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));

const timeFormat = d3.timeFormat("%M:%S");

const yAxis = d3.axisLeft<Date>(y).tickFormat(timeFormat);

const tooltip = d3
  .select("#app")
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

const svg = d3
  .select("#app")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "graph")
  .attr("id", "svg")
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    const dataArray: [Runner] = data;
    build(dataArray);
  })
  .catch((e) => console.log(e));

interface Runner {
  Time: String;
  RaceTime: Date;
  Place: Number;
  Seconds: Number;
  Name: String;
  Year: number;
  Nationality: String;
  Doping: String;
  URL: String;
}

const build = (data: [Runner]) => {
  data.forEach((d: Runner) => {
    d.Place = +d.Place;
    let parsedTime = d.Time.split(":");
    d.RaceTime = new Date(
      1970,
      0,
      1,
      0,
      parseInt(parsedTime[0]),
      parseInt(parsedTime[1])
    );
  });
  x.domain([
    Number(d3.min(data, (d) => d.Year - 1)),
    Number(d3.max(data, (d) => d.Year + 1)),
  ]);

  // y.domain(d3.extent(data, (d) => d.RaceTime));
  y.domain([
    Number(d3.min(data, (d) => d.RaceTime)),
    Number(d3.max(data, (d) => d.RaceTime)),
  ]);
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Year");

  svg
    .append("g")
    .attr("class", "y axis")
    .attr("id", "y-axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Best Time (minutes)");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -160)
    .attr("y", -44)
    .style("font-size", 18)
    .text("Time in Minutes");

  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 6)
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(d.RaceTime))
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.RaceTime)
    .style("fill", (d) => color(d.Doping ? "True" : ""))
    .on("mouseover", function (event, d) {
      tooltip.style("opacity", 0.9);
      tooltip.attr("data-year", d.Year);
      tooltip
        .html(
          `${d.Name}: ${d.Nationality}<br\>Y: ${d.Year}, Time: ${timeFormat(
            d.RaceTime
          )}${d.Doping ? "<br/><br/>" + d.Doping : ""}`
        )
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
    });

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .text("Doping in Professional Bicycle Racing");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2 + 25)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("35 Fastest times up Alpe d'Huez");

  var legendContainer = svg.append("g").attr("id", "legend");

  var legend = legendContainer
    .selectAll("#legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("transform", function (_, i) {
      return `translate(0, ${height / 2 - i * 20})`;
    });

  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text((d) =>
      d ? "Riders with doping allegations" : "No doping allegations"
    );
};
