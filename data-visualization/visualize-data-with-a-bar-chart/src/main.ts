import "./style.css";
import * as d3 from "d3";

const svg = d3.select("#app").append("svg").attr("id", "svg");

const tooltip = d3
  .select("#app")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    const dataArray: [string, number][] = data.data;
    build(dataArray);
  })
  .catch((e) => console.log(e));

const build = (data: [string, number][]) => {
  const years = data.map((item: [string, number]) => {
    let quarter;
    switch (item[0].substring(5, 7)) {
      case "01":
        quarter = "Q1";
        break;
      case "04":
        quarter = "Q2";
        break;
      case "07":
        quarter = "Q3";
        break;
      case "10":
        quarter = "Q4";
        break;
    }
    return `${item[0].substring(0, 4)} ${quarter}`;
  });

  const yearsDate: Date[] = data.map(
    (item: [string, number]) => new Date(item[0])
  );

  let xMax = new Date(d3.max(yearsDate)!);
  xMax.setMonth(xMax.getMonth() + 3);
  let xMin = d3.min(yearsDate)!;

  const xScale = d3.scaleTime().domain([xMin, xMax]).range([0, 800]);

  const xAxis = d3.axisBottom(xScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(60, 400)");

  const gdp = data.map((item: [string, number]) => item[1]);

  let gdpMax: number = d3.max(gdp)!;

  const linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, 400]);

  const scaledGDP = gdp.map((item: number) => linearScale(item));

  const yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([400, 0]);

  const yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(60, 0)");

  d3.select("svg")
    .selectAll("rect")
    .data(scaledGDP)
    .enter()
    .append("rect")
    .attr("data-date", (_d: number, i: number) => data[i][0])
    .attr("data-gdp", (_d: number, i: number) => data[i][1])
    .attr("class", "bar")
    .attr("x", (_d: number, i: number) => xScale(yearsDate[i]))
    .attr("y", (d: number) => 400 - d)
    .attr("width", 800 / 275)
    .attr("height", (d: number) => d)
    .attr("index", (_d: number, i: number) => i)
    .attr("transform", "translate(60, 0)")
    .on("mouseover", function (_event, _d) {
      let i: number = parseInt(this.getAttribute("index")!);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          years[i] +
            "<br>" +
            "$" +
            gdp[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
            " Billion"
        )
        .attr("data-date", data[i][0])
        .style("left", (i * 800) / 275 + 30 + "px")
        .style("top", 400 - 100 + "px")
        .style("transform", "translateX(60px)");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", 80)
    .text("Gross Domestic Product");
};
