// description: Experimenting with charts suitable for displaying MENTORd metrics
// contributors: Danielle Martin,


function lineChart(dataset) {
    const width = 600;
    const height = 300;
    const padding = 60;
  
    const xScale = d3.scaleTime()
      .domain(d3.extent(dataset, d => d.gDate))
      .range([padding, width]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d.glucose)])
      .range([height - padding, 0]);
  
    const line = d3.line()
      .x(d => xScale(d.gDate))
      .y(d => yScale(d.glucose));
  
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    svg.append("path")
      .datum(dataset)
      .attr("class", "line")
      .attr("d", line);
  
    const xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeDay.every(1))
      .tickFormat(d3.timeFormat("%a. %b %d"));
  
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);
  
    const yAxis = d3.axisLeft(yScale);
  
    svg.append("g")
      .attr("class", "axis y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

const tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");

    tooltip.append("rect")
    .attr("width", 80)
    .attr("height", 40)
    .attr("fill", "white")
    .attr("stroke", "black");

    tooltip.append("text")
    .attr("x", 40)
    .attr("y", 20)
    .style("text-anchor", "middle");

    svg.selectAll(".dot")
    .data(dataset)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.gDate))
    .attr("cy", d => yScale(d.glucose))
    .attr("r", 5)
    .attr("opacity", 0)
    .on("mouseover", function(d) {
        const x = xScale(d.gDate);
        const y = yScale(d.glucose);
        tooltip.attr("transform", `translate(${x},${y})`);
        tooltip.select("text").text(`Glucose: ${d.glucose}`);
        tooltip.style("display", "block");
    })
    .on("mouseout", function() {
        tooltip.style("display", "none");
    })
    
  };

  
  function init() {
    Promise.all([
        d3.csv("chart-glucose-data.csv", d => ({
            gDate: new Date(+d.year, +d.month - 1, +d.day, +d.time),
            glucose: +d.glucose
        })),
        d3.csv("chart-meal-data.csv", d => ({
            mDate: new Date(+d.year, +d.month - 1, +d.day, +d.time),
            meal: d.meal
    
        }))
    ]).then(([data1, data2]) => {
        const data = [...data1, ...data2]; //merge the datasets
        console.table(data1, ["mDate", "meal"]);
        console.table(data2, ["gDate", "glucose"]);
        lineChart(data);
    }).catch(error => {
      console.log(error);
    });
  }
  
  window.onload = init;
  
