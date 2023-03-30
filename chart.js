// description: Experimenting with charts suitable for displaying MENTORd metrics
// contributors: Danielle Martin,
function formatTime(date) {
  return d3.timeFormat("%H:%M")(date);
}

function lineChart(glucoseData, mealData, exerciseData) {
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
      .tickFormat(d3.timeFormat("%a. %b %d %H"));
  
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
    .attr("width", 100)
    .attr("height", 50)
    .attr("fill", "white")
    .attr("stroke", "grey");

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
    .attr("r", 2)
    .attr("opacity", 1)
    .on("mouseover", function(d) {
      const x = xScale(d.gDate);
      const y = yScale(d.glucose);
      tooltip.attr("transform", `translate(${x},${y})`);
      tooltip.select("text")
          .html(`<tspan x="4em" dy="0">Glucose: ${d.glucose}</tspan>
           <tspan x="4em" dy="1.5em">Time: ${formatTime(d.gDate)}</tspan>`);
      tooltip.style("display", "block");
      tooltip.raise();
    })
    .on("mouseout", function() {
      tooltip.style("display", "none");
    })

    
    svg.selectAll(".meal")
    .data(mealData)
    .enter()
    .append("circle")
    .attr("class", "meal")
    .attr("r", 7)
    .style("fill", "blue")
    .attr("cx", d => xScale(d.mDate)) 
    .attr("cy", d => {
      const glucose1 = glucoseData.reduce((prev, curr) => {
        if (curr.gDate < d.mDate) {
          if (!prev || Math.abs(curr.gDate - d.mDate) < Math.abs(prev.gDate - d.mDate)) {
            return curr;
          }
        }
        return prev;
      }, null);
      const glucose2 = glucoseData.find(g => g.gDate >= d.mDate);
      if (!glucose1 || !glucose2) {
        return height - padding;
      }
      const mealY = (glucose1.glucose - glucose2.glucose) / (glucose1.gDate - glucose2.gDate) * (d.mDate - glucose1.gDate) + glucose1.glucose;
      return yScale(mealY); 
    })
    .on("mouseover", function(d) {
      const glucose1 = glucoseData.reduce((prev, curr) => {
    if (curr.gDate < d.mDate) {
      if (!prev || Math.abs(curr.gDate - d.mDate) < Math.abs(prev.gDate - d.mDate)) {
        return curr;
      }
    }
    return prev;
    }, null);
      const glucose2 = glucoseData.find(g => g.gDate >= d.mDate);
      if (!glucose1 || !glucose2) {
        return;
      }
      const mealY = (glucose1.glucose - glucose2.glucose) / (glucose1.gDate - glucose2.gDate) * (d.mDate - glucose1.gDate) + glucose1.glucose;
      const x = xScale(d.mDate);
      const y = yScale(mealY);
      tooltip.attr("transform", `translate(${x},${y})`);
      tooltip.select("text")
          .html(`<tspan x="4em" dy="0">Meal: ${d.meal}</tspan>
           <tspan x="4em" dy="1.5em">Time: ${formatTime(d.mDate)}</tspan>`);
      tooltip.style("display", "block");
      tooltip.raise();
    })
    .on("mouseout", function() {
      tooltip.style("display", "none");
    });

    svg.selectAll(".exercise")
    .data(exerciseData)
    .enter()
    .append("circle")
    .attr("class", "exercise")
    .attr("r", 5)
    .style("fill", "red")
    .attr("cx", d => xScale(d.eDate)) 
    .attr("cy", d => {
      const glucose1 = glucoseData.reduce((prev, curr) => {
        if (curr.gDate < d.eDate) {
          if (!prev || Math.abs(curr.gDate - d.eDate) < Math.abs(prev.gDate - d.eDate)) {
            return curr;
          }
        }
        return prev;
      }, null);
      const glucose2 = glucoseData.find(g => g.gDate >= d.eDate);
      if (!glucose1 || !glucose2) {
        return height - padding;
      }
      const exerciseY = (glucose1.glucose - glucose2.glucose) / (glucose1.gDate - glucose2.gDate) * (d.eDate - glucose1.gDate) + glucose1.glucose;
      return yScale(exerciseY); 
    })
    .on("mouseover", function(d) {
      const glucose1 = glucoseData.reduce((prev, curr) => {
        if (curr.gDate < d.eDate) {
          if (!prev || Math.abs(curr.gDate - d.eDate) < Math.abs(prev.gDate - d.eDate)) {
            return curr;
          }
        }
        return prev;
      }, null);
      const glucose2 = glucoseData.find(g => g.gDate >= d.eDate);
      if (!glucose1 || !glucose2) {
        return;
      }
      const exerciseY = (glucose1.glucose - glucose2.glucose) / (glucose1.gDate - glucose2.gDate) * (d.eDate - glucose1.gDate) + glucose1.glucose;
      const x = xScale(d.eDate);
      const y = yScale(exerciseY);
      tooltip.attr("transform", `translate(${x},${y})`);
      tooltip.select("text")
          .html(`<tspan x="4em" dy="0">Exercise: ${d.exercise}</tspan>
           <tspan x="4em" dy="1.5em">Time: ${formatTime(d.eDate)}</tspan>`);      
      tooltip.style("display", "block");
    })
    .on("mouseout", function() {
      tooltip.style("display", "none");
    });
  };

  
  function init() {
    Promise.all([
        d3.csv("data/chart-glucose-data.csv", d => ({
            gDate: new Date(+d.year, +d.month - 1, +d.day, +d.time),
            glucose: +d.glucose
        })),
        d3.csv("data/chart-meal-data.csv", d => ({
            mDate: new Date(+d.year, +d.month - 1, +d.day, +d.time),
            meal: d.meal
    
        })),
        d3.csv("data/chart-exercise-data.csv", d => ({
          eDate: new Date(+d.year, +d.month - 1, +d.day, +d.time),
          exercise: d.exercise
  
        }))
    ]).then(([glucoseData, mealData, exerciseData]) => {
        const data = [glucoseData, mealData, exerciseData]; //merge the datasets
        console.table(glucoseData, ["mDate", "meal"]);
        console.table(mealData, ["gDate", "glucose"]);
        console.table(exerciseData, ["eDate", "exercise"])
        lineChart(glucoseData, mealData, exerciseData);
    }).catch(error => {
      console.log(error);
    });
  }
  
  window.onload = init;
  