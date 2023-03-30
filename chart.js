// description: Experimenting with charts suitable for displaying MENTORd metrics
// contributors: Danielle Martin,


function lineChart(glucoseData, mealData) {
    const width = 1200;
    const height = 300;
    const padding = 30;
  
    const xScale = d3.scaleTime()
      .domain(d3.extent(glucoseData, d => d.gDate))
      .range([padding, width]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(glucoseData, d => d.glucose)])
      .range([height - padding, padding]);
  
    const line = d3.line()
      .x(d => xScale(d.gDate))
      .y(d => yScale(d.glucose));
  
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    svg.append("path")
      .datum(glucoseData)
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
    .data(glucoseData)
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

    
    svg.selectAll(".meal")
    .data(mealData)
    .enter()
    .append("circle")
    .attr("class", "meal")
    .attr("r", 5)
    .style("fill", "red")
    .attr("cx", d => xScale(d.mDate))
    .attr("cy", d => {
      const glucose1 = glucoseData.find(g => g.gDate <= d.mDate);
      const glucose2 = glucoseData.find(g => g.gDate >= d.mDate);
      if (!glucose1 || !glucose2) {
        return height - padding;
      }
      const mealY = (glucose1.glucose - glucose2.glucose) / (glucose1.gDate - glucose2.gDate) * (d.mDate - glucose1.gDate) + glucose1.glucose;
      return yScale(mealY)
    })
    .on("mouseover", function(d) {
      const glucose1 = glucoseData.find(g => g.gDate <= d.mDate);
      const glucose2 = glucoseData.find(g => g.gDate >= d.mDate);
      if (!glucose1 || !glucose2) {
        return;
      }
      const mealY = (glucose1.glucose - glucose2.glucose) / (glucose1.gDate - glucose2.gDate) * (d.mDate - glucose1.gDate) + glucose1.glucose;
      const x = xScale(d.mDate);
      const y = yScale(mealY);
      tooltip.attr("transform", `translate(${x},${y})`);
      tooltip.select("text").text(`Meal: ${d.meal}`);
      tooltip.style("display", "block");
    })
    .on("mouseout", function() {
      tooltip.style("display", "none");
    });
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
    ]).then(([glucoseData, mealData]) => {
        const data = [glucoseData, mealData]; //merge the datasets
        console.table(glucoseData, ["mDate", "meal"]);
        console.table(mealData, ["gDate", "glucose"]);
        lineChart(glucoseData, mealData);
    }).catch(error => {
      console.log(error);
    });
  }
  
  window.onload = init;
  