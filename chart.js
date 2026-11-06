// Illustrative data: average annual total return decomposition for
// private real estate, by decade (income return vs. appreciation return).
// Figures are illustrative, styled after long-term NCREIF Property Index trends.
const data = [
  { decade: "1980s", income: 7.0, appreciation: 2.0 },
  { decade: "1990s", income: 6.0, appreciation: 1.5 },
  { decade: "2000s", income: 5.5, appreciation: 3.0 },
  { decade: "2010s", income: 4.5, appreciation: 5.0 },
  { decade: "2020s", income: 4.0, appreciation: 4.5 }
];

const keys = ["income", "appreciation"];
const labels = { income: "Income Return", appreciation: "Appreciation Return" };
const colors = { income: "#1F3A2E", appreciation: "#B08D57" };

const margin = { top: 20, right: 20, bottom: 65, left: 50 };
const width = 760 - margin.left - margin.right;
const height = 360 - margin.top - margin.bottom;

const container = d3.select("#chart");

const svg = container.append("svg")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .attr("width", "100%")
  .attr("height", "auto")
  .style("font-family", "Work Sans, sans-serif");

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleBand()
  .domain(data.map(d => d.decade))
  .range([0, width])
  .padding(0.35);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.income + d.appreciation) * 1.15])
  .range([height, 0]);

const stackGen = d3.stack().keys(keys);
const series = stackGen(data);

// Axes
g.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x))
  .call(axis => axis.select(".domain").attr("stroke", "#d8d0bd"))
  .selectAll("text")
  .attr("fill", "#24231F")
  .attr("font-size", "13px");

g.append("g")
  .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"))
  .call(axis => axis.select(".domain").attr("stroke", "#d8d0bd"))
  .selectAll("text")
  .attr("fill", "#24231F")
  .attr("font-size", "13px");

g.selectAll(".tick line").attr("stroke", "#e4ddcc");

// Tooltip element
const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip");

// Bars
g.selectAll("g.layer")
  .data(series)
  .join("g")
    .attr("class", "layer")
    .attr("fill", d => colors[d.key])
  .selectAll("rect")
  .data(d => d.map(v => ({ ...v, key: d.key })))
  .join("rect")
    .attr("x", d => x(d.data.decade))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .attr("stroke", "#FAF8F3")
    .attr("stroke-width", 1)
    .style("cursor", "pointer")
    .on("mouseenter", function (event, d) {
      d3.select(this).attr("opacity", 0.85);
      const value = d.data[d.key];
      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.data.decade}</strong><br>${labels[d.key]}: ${value.toFixed(1)}%`);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", (event.pageX + 14) + "px")
        .style("top", (event.pageY - 36) + "px");
    })
    .on("mouseleave", function () {
      d3.select(this).attr("opacity", 1);
      tooltip.style("opacity", 0);
    });

// Legend
const legend = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${height + margin.top + 46})`);

keys.forEach((key, i) => {
  const lg = legend.append("g").attr("transform", `translate(${i * 190}, 0)`);
  lg.append("rect").attr("width", 12).attr("height", 12).attr("fill", colors[key]);
  lg.append("text")
    .attr("x", 18).attr("y", 10)
    .attr("font-size", "13px")
    .attr("fill", "#24231F")
    .text(labels[key]);
});
