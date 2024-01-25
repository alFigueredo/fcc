import "./style.css";
import * as d3 from "d3";
import { colorbrewer } from "./colorbrewer";

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((data) => {
    const globalData: GlobalTemperature = data as GlobalTemperature;
    build(globalData);
  })
  .catch((err) => console.log(err));

interface GlobalTemperature {
  baseTemperature: number;
  monthlyVariance: MontlyVariance[];
}

interface MontlyVariance {
  year: number;
  month: number;
  variance: number;
}

const build = (data: GlobalTemperature) => {
  data.monthlyVariance.forEach((val: MontlyVariance) => (val.month -= 1));

  const section = d3.select("#app").append("section");

  const heading = section.append("heading");

  heading
    .append("h1")
    .attr("id", "title")
    .text("Monthly Global Land-Surface Temperature");

  heading
    .append("h3")
    .attr("id", "description")
    .html(
      `${data.monthlyVariance[0].year} - ${
        data.monthlyVariance[data.monthlyVariance.length - 1].year
      }: base temperature ${data.baseTemperature}&#8451;`
    );

  const fontSize = 16;
  const width = 5 * Math.ceil(data.monthlyVariance.length / 12);
  const height = 33 * 12;
  const padding = {
    left: 9 * fontSize,
    right: 9 * fontSize,
    top: 1 * fontSize,
    bottom: 8 * fontSize,
  };

  const tip = section
    .append("div")
    .attr("class", "d3-tip")
    .attr("id", "tooltip")
    .style("opacity", 0);

  const svg = section
    .append("svg")
    .attr("width", width + padding.left + padding.right)
    .attr("height", height + padding.top + padding.bottom);

  const yScale = d3
    .scaleBand()
    .domain(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"])
    .rangeRound([0, height])
    .padding(0);

  const yAxis = d3
    .axisLeft(yScale)
    // .scale(yScale)
    .tickValues(yScale.domain())
    .tickFormat((month) => {
      const date = new Date(0);
      date.setUTCMonth(parseInt(month));
      const format = d3.utcFormat("%B");
      return format(date);
    })
    // .tickSize(10, 1)
    .tickSize(9);

  svg
    .append("g")
    .classed("y-axis", true)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding.left},${padding.top})`)
    .call(yAxis)
    .append("text")
    .text("Months")
    .style("text-anchor", "middle")
    .attr("transform", `translate(${-7 * fontSize},${height / 2})rotate(-90)`)
    .attr("fill", "black");

  const xScale = d3
    .scaleBand()
    .domain(data.monthlyVariance.map((val) => val.year.toString()))
    .range([0, width])
    .padding(0);

  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(xScale.domain().filter((year) => parseInt(year) % 10 === 0))
    .tickFormat((year) => {
      const date = new Date(0);
      date.setUTCFullYear(parseInt(year));
      const format = d3.utcFormat("%Y");
      return format(date);
    })
    .tickSize(9);

  svg
    .append("g")
    .classed("x-axis", true)
    .attr("id", "x-axis")
    .attr("transform", `translate(${padding.left},${height + padding.top})`)
    .call(xAxis)
    .append("text")
    .text("Years")
    .style("text-anchor", "middle")
    .attr("transform", `translate(${width / 2},${3 * fontSize})`)
    .attr("fill", "black");

  const legendColors = colorbrewer.RdYlBu[11].reverse();
  const legendWidth = 400;
  const legendHeight = 300 / legendColors.length;

  const variance = data.monthlyVariance.map((val) => val.variance);
  const minTemp = data.baseTemperature + Math.min.apply(null, variance);
  const maxTemp = data.baseTemperature + Math.max.apply(null, variance);

  const legendThreshold = d3
    .scaleThreshold()
    .domain(
      ((min, max, count) => {
        const array = [];
        const step = (max - min) / count;
        const base = min;
        for (let i = 1; i < count; i++) array.push(base + i * step);
        return array;
      })(minTemp, maxTemp, legendColors.length)
    )
    .range([...Array(legendColors.length).keys()]);

  const legendX = d3
    .scaleLinear()
    .domain([minTemp, maxTemp])
    .range([0, legendWidth]);

  const legendXAxis = d3
    .axisBottom(legendX)
    .tickSize(10)
    .tickValues(legendThreshold.domain())
    .tickFormat(d3.format(".1f"));

  const legend = svg
    .append("g")
    .classed("legend", true)
    .attr("id", "legend")
    .attr(
      "transform",
      `translate(${padding.left},${
        padding.top + height + padding.bottom - 2 * legendHeight
      })`
    );

  legend
    .append("g")
    .selectAll("rect")
    .data(
      legendThreshold.range().map((colorIndex) => {
        const d = legendThreshold.invertExtent(colorIndex);
        if (d[0] === null) d[0] = legendX.domain()[0];
        if (d[1] === null) d[1] = legendX.domain()[1];
        return d;
      })
    )
    .enter()
    .append("rect")
    .style("fill", (d) => legendColors[legendThreshold(d[0]!)])
    .attr("x", (d) => legendX(d[0]!))
    .attr("y", 0)
    .attr("width", (d) =>
      d[0] && d[1] ? legendX(d[1]) - legendX(d[0]) : legendX(NaN)
    )
    .attr("height", legendHeight);

  legend
    .append("g")
    .attr("transform", `translate(${0},${legendHeight})`)
    .call(legendXAxis);

  svg
    .append("g")
    .classed("map", true)
    .attr("transform", `translate(${padding.left},${padding.top})`)
    .selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => data.baseTemperature + d.variance)
    .attr("x", (d) => xScale(d.year.toString())!)
    .attr("y", (d) => yScale(d.month.toString())!)
    .attr("width", (_) => xScale.bandwidth())
    .attr("height", (_) => yScale.bandwidth())
    .attr(
      "fill",
      (d) => legendColors[legendThreshold(data.baseTemperature + d.variance)]
    )
    .on("mouseover", function (event, d) {
      const date = new Date(d.year, d.month);
      const str = `<span class='date'>${d3.utcFormat("%Y - %B")(
        date
      )}</span><br /><span class='temperature'>${d3.format(".1f")(
        data.baseTemperature + d.variance
      )}&#8451;</span><br /><span class='variance'>${d3.format("+.1f")(
        d.variance
      )}&#8451;</span>`;
      tip.attr("data-year", d.year);
      tip
        .html(str)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
      tip.style("opacity", 0.9);
    })
    .on("mouseout", function () {
      tip.style("opacity", 0);
    });
};
