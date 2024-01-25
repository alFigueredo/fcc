import "./style.css";
import * as d3 from "d3";

const DATASET = {
  TITLE: "Video Game Sales",
  DESCRIPTION: "Top 100 Most Sold Video Games Grouped by Platform",
  FILE_PATH:
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
};

const section = d3.select("#app");

const heading = section.append("heading");

heading.append("h1").attr("id", "title").text(DATASET.TITLE);

heading.append("div").attr("id", "description").text(DATASET.DESCRIPTION);

const tooltip = section
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

const width = 960;
const height = 570;

const svg = section
  .append("svg")
  .attr("id", "tree-map")
  .attr("width", width)
  .attr("height", height);

const fader = (color: string) => d3.interpolateRgb(color, "#fff")(0.2);

const schemeCategory20 = [
  "#1f77b4",
  "#aec7e8",
  "#ff7f0e",
  "#ffbb78",
  "#2ca02c",
  "#98df8a",
  "#d62728",
  "#ff9896",
  "#9467bd",
  "#c5b0d5",
  "#8c564b",
  "#c49c94",
  "#e377c2",
  "#f7b6d2",
  "#7f7f7f",
  "#c7c7c7",
  "#bcbd22",
  "#dbdb8d",
  "#17becf",
  "#9edae5",
].map(fader);

const color = d3
  .scaleOrdinal<number>()
  .range([...Array(schemeCategory20.length).keys()]);

const treemap: d3.TreemapLayout<DataSet> = d3
  .treemap()
  .size([width, height])
  .paddingInner(1) as d3.TreemapLayout<DataSet>;

interface DataSet {
  name: string;
  children: DataSet[];
  category: string;
  value: string;
  id: string;
}

d3.json(DATASET.FILE_PATH)
  .then((data) => ready(data as DataSet))
  .catch((err) => console.log(err));

const ready = (data: DataSet) => {
  const root = d3
    .hierarchy(data)
    .eachBefore(
      (d) =>
        (d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name)
    )
    .sum(sumBySize)
    .sort((a, b) => b.height - a.height || b.value! - a.value!);

  const rootRect = treemap(root);

  const cell = svg
    .selectAll("g")
    .data(rootRect.leaves())
    .enter()
    .append("g")
    .attr("class", "group")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  cell
    .append("rect")
    .attr("id", (d) => d.data.id)
    .attr("class", "tile")
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("fill", (d) => schemeCategory20[color(d.data.category)])
    .on("mousemove", function (event, d) {
      tooltip.style("opacity", 0.9);
      tooltip
        .html(
          `Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`
        )
        .attr("data-value", d.data.value)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));

  cell
    .append("text")
    .attr("class", "tile-text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", (_, i) => 13 + i * 10)
    .text((d) => d);

  const categories = root.leaves().map((nodes) => nodes.data.category);
  const categoriesFiltered = categories.filter(
    (category, index, self) => self.indexOf(category) === index
  );

  const legendWidth = 500;

  const legend = section
    .append("svg")
    .attr("id", "legend")
    .attr("width", legendWidth);

  const legendOffset = 10;
  const legendRectSize = 15;
  const legendHSpacing = 150;
  const legendVSpacing = 10;
  const legendTextXOffset = 3;
  const legendTextYOffset = -2;
  const legendElemsPerRow = Math.floor(legendWidth / legendHSpacing);

  const legendElem = legend
    .append("g")
    .attr("transform", `translate(60,${legendOffset})`)
    .selectAll("g")
    .data(categoriesFiltered)
    .enter()
    .append("g")
    .attr("transform", (_, i) => {
      return (
        "translate(" +
        (i % legendElemsPerRow) * legendHSpacing +
        "," +
        (Math.floor(i / legendElemsPerRow) * legendRectSize +
          legendVSpacing * Math.floor(i / legendElemsPerRow)) +
        ")"
      );
    });

  legendElem
    .append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .attr("class", "legend-item")
    .attr("fill", (d) => schemeCategory20[color(d)]);

  legendElem
    .append("text")
    .attr("x", legendRectSize + legendTextXOffset)
    .attr("y", legendRectSize + legendTextYOffset)
    .text((d) => d);
};

const sumBySize = (d: DataSet) => Number(d.value);
