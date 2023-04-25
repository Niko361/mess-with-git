// description: Experimenting with charts suitable for displaying MENTORd metrics
// contributors: Danielle Martin,
function formatTime(date) {
   return d3.timeFormat("%H:%M")(date);
}

function lineChartAlex(glucoseData, mealData, exerciseData)
{
   const width = 1200;
   const height = 500;
   const padding = 50;
   const bottomPadding = 120;
   const topPadding = 80;
   const leftPadding = 150;
   
   const xScale = d3.scaleTime()
   .domain(d3.extent(glucoseData, d => d.gDate))
   .range([leftPadding, width]);
   
   const yScale = d3.scaleLinear()
   .domain([0, d3.max(glucoseData, d => d.glucose)])
   .range([height - bottomPadding, bottomPadding]);
   
   const line = d3.line()
   .x(d => xScale(d.gDate))
   .y(d => yScale(d.glucose));
   
   const svg = d3.select("#chartAlex")
   .append("svg")
   .attr("width", width)
   .attr("height", height);
   
   svg.append("path")
   .datum(glucoseData)
   .attr("class", "line")
   .attr("d", line)
   .style("stroke-width", "2px")
   .style("stroke", "grey");
   
   const xAxis1 = d3.axisBottom(xScale)
   .ticks(d3.timeDay.every(1))
   .tickFormat(d3.timeFormat("%a. %b %d %H"));
   
   svg.append("g")
   .attr("class", "axis x-axis")
   .attr("transform", `translate(0, ${height - bottomPadding})`)
   .attr("stroke-width", 2)
   .call(xAxis1)
   .selectAll("path")
   .attr("stroke", "grey");
   svg.select(".x-axis")
   .selectAll("line")
   .attr("stroke", "grey");

   const xAxis2 = d3.axisBottom(xScale)
   .ticks(d3.timeDay.every(1))
   .tickFormat(d3.timeFormat("%a. %b %d %H"));

   svg.append("g")
   .attr("class", "axis x-axis")
   .attr("transform", `translate(0, ${height - 20})`)
   .attr("stroke-width", 2)
   .call(xAxis2)   
   .selectAll("path")
   .attr("stroke", "grey");
   svg.select(".x-axis")
   .selectAll("line")
   .attr("stroke", "grey");
   
   const yAxis = d3.axisLeft(yScale);
   
   svg.append("g")
   .attr("class", "axis y-axis")
   .attr("transform", `translate(${leftPadding}, 0)`)
   .attr("stroke-width", 2)
   .call(yAxis)
   .selectAll("path")
   .attr("stroke", "grey");
   svg.select(".y-axis")
   .selectAll("line")
   .attr("stroke", "grey");

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

   //Vertical hover line
   const hoverLine = svg.append("line")
      .attr("class", "hover-line")
      .attr("stroke", "black")
      .attr("stroke-width", 0.25)
      .attr("y1", topPadding)
      .attr("y2", height - 20)
      .style("display", "none");

   svg.on("mousemove", function() {
      var mousePosition = d3.mouse(this);
      var mouseX = mousePosition[0];
      var mouseY = mousePosition[1];
      hoverLine.attr("x1", mouseX)
               .attr("x2", mouseX)
               .style("display", "block");
   })
   .on("mouseout", function() {
      hoverLine.style("display", "none");
   });

   //Plot glucose dots
   svg.selectAll(".dot")
   .data(glucoseData)
   .enter().append("circle")
   .attr("class", "dot")
   .style("fill", "black")
   .attr("cx", d => xScale(d.gDate))
   .attr("cy", d => yScale(d.glucose))
   .attr("r", 5)
   .attr("opacity", 1)
   .on("mouseover", function(d) 
   {
      const x = xScale(d.gDate);
      const y = yScale(d.glucose);
      tooltip.attr("transform", `translate(${x},${y-50})`);
      tooltip.select("text")
         .html(`<tspan x="4em" dy="0">Glucose: ${d.glucose}</tspan>
         <tspan x="4em" dy="1.5em">Time: ${formatTime(d.gDate)}</tspan>`);
      tooltip.style("display", "block");
      tooltip.raise();
   })
   .on("mouseout", function() 
   {
   tooltip.style("display", "none");
   })

   //Plot meal dots
   svg.selectAll(".meal")
   .data(mealData)
   .enter()
   .append("circle")
   .attr("class", "meal")
   .attr("r", 7)
   .style("fill", "blue")
   .attr("cx", d => xScale(d.mDate)) 
   .attr("cy", d => 
   {
      return yScale(-2); 
   })
   //hover tooltip
   .on("mouseover", function(d) 
   {
      const x = xScale(d.mDate);
      const y = yScale(-2);
      tooltip.attr("transform", `translate(${x},${y-50})`);
      // tooltip.html(`<img src="${d.mImg}" width="100" height="100"/><tspan x="4em" dy="0">Meal: ${d.meal}</tspan>
      //    <tspan x="4em" dy="1.5em">Time: ${formatTime(d.mDate)}</tspan>`);
      tooltip.select("text")
      .html(`<tspan x="4em" dy="0">Meal: ${d.meal}</tspan>
      <tspan x="4em" dy="1.5em">Time: ${formatTime(d.mDate)}</tspan>`);  
      tooltip.style("display", "block");
      tooltip.raise();
   })
   .on("mouseout", function() 
   {
      tooltip.style("display", "none");
   });

   // Create a line selection for the start and end times
   var lines = svg.selectAll(".exerciseLines")
   .data(exerciseData)
   .enter()
   .append("line")
   .attr("class", "exerciseLines")
   .attr("x1", d => xScale(d.eTimeStart))
   .attr("y1", d => yScale(-1))
   .attr("x2", d => xScale(d.eTimeEnd))
   .attr("y2", d => yScale(-1))
   .attr("stroke", "red")
   .attr("stroke-width", 7)
   .on("mouseover", function(d) {
      const x = xScale(d.eTimeStart);
      const y = yScale(-1);
      tooltip.attr("transform", `translate(${x},${y-50})`);
      tooltip.select("text")
      .html(`<tspan x="4em" dy="0">Exercise: ${d.exercise}</tspan>
      <tspan x="4em" dy="1.5em">Start Time: ${formatTime(d.eTimeStart)}</tspan>`);      
      tooltip.style("display", "block");
      })
      .on("mouseout", function() {
      tooltip.style("display", "none");
      });

   svg.selectAll(".startExercise")
   .data(exerciseData)
   .enter()
   .append("circle")
   .attr("class", "startExercise")
   .attr("r", 5)
   .style("fill", "red")
   .attr("cx", d => xScale(d.eTimeStart)) 
   .attr("cy", d => {
      return yScale(-1); 
   })
   .on("mouseover", function(d) {
      const x = xScale(d.eTimeStart);
      const y = yScale(-1);
      tooltip.attr("transform", `translate(${x},${y-50})`);
      tooltip.select("text")
      .html(`<tspan x="4em" dy="0">Exercise: ${d.exercise}</tspan>
      <tspan x="4em" dy="1.5em">Start Time: ${formatTime(d.eTimeStart)}</tspan>`);      
      tooltip.style("display", "block");
      })
      .on("mouseout", function() {
      tooltip.style("display", "none");
      });

      svg.selectAll(".endExercise")
      .data(exerciseData)
      .enter()
      .append("circle")
      .attr("class", "endExercise")
      .attr("r", 5)
      .style("fill", "red")
      .attr("cx", d => xScale(d.eTimeEnd)) 
      .attr("cy", d => {
         return yScale(-1); 
      })
      .on("mouseover", function(d) {
         const x = xScale(d.eTimeStart);
         const y = yScale(-1);
         tooltip.attr("transform", `translate(${x},${y-50})`);
         tooltip.select("text")
         .html(`<tspan x="4em" dy="0">Exercise: ${d.exercise}</tspan>
         <tspan x="4em" dy="1.5em">Start Time: ${formatTime(d.eTimeStart)}</tspan>`);      
         tooltip.style("display", "block");
         })
         .on("mouseout", function() {
         tooltip.style("display", "none");
         });

}

function lineChart(glucoseData, mealData, exerciseData) 
{
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
   
   const svg = d3.select("#chart1")
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
   .on("mouseover", function(d) 
   {
      const x = xScale(d.gDate);
      const y = yScale(d.glucose);
      tooltip.attr("transform", `translate(${x},${y})`);
      tooltip.select("text")
         .html(`<tspan x="4em" dy="0">Glucose: ${d.glucose}</tspan>
         <tspan x="4em" dy="1.5em">Time: ${formatTime(d.gDate)}</tspan>`);
      tooltip.style("display", "block");
      tooltip.raise();
   })
   .on("mouseout", function() 
   {
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
   .attr("cy", d => 
   {
      const glucose1 = glucoseData.reduce((prev, curr) => {
      if (curr.gDate < d.mDate) 
      {
         if (!prev || Math.abs(curr.gDate - d.mDate) < Math.abs(prev.gDate - d.mDate)) 
         {
         return curr;
         }
      }
      return prev;
      }, null);

      const glucose2 = glucoseData.find(g => g.gDate >= d.mDate);
      if (!glucose1 || !glucose2) 
      {
      return height - padding;
      }
      const mealY = (glucose1.glucose - glucose2.glucose) / (glucose1.gDate - glucose2.gDate) * (d.mDate - glucose1.gDate) + glucose1.glucose;
      return yScale(mealY); 
   })

   .on("mouseover", function(d) 
   {
      const glucose1 = glucoseData.reduce((prev, curr) => {
      if (curr.gDate < d.mDate) 
      {
         if (!prev || Math.abs(curr.gDate - d.mDate) < Math.abs(prev.gDate - d.mDate)) {
         return curr;
         }
      }
      return prev;
      }, null);
      const glucose2 = glucoseData.find(g => g.gDate >= d.mDate);
      if (!glucose1 || !glucose2) 
      {
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
   .on("mouseout", function() 
   {
      tooltip.style("display", "none");
   });

   svg.selectAll(".exercise")
   .data(exerciseData)
   .enter()
   .append("circle")
   .attr("class", "exercise")
   .attr("r", 5)
   .style("fill", "red")
   .attr("cx", d => xScale(d.eTimeStart)) 
   .attr("cy", d => {
      const glucose1 = glucoseData.reduce((prev, curr) => {
         if (curr.gDate < d.eTimeStart) 
         {
            if (!prev || Math.abs(curr.gDate - d.eTimeStart) < Math.abs(prev.gDate - d.eTimeStart)) 
            {
               return curr;
            }
         }
      return prev;
      }, null);
      const glucose2 = glucoseData.find(g => g.gDate >= d.eTimeStart);
      if (!glucose1 || !glucose2) 
      {
         return height - padding;
      }
      const exerciseY = (glucose1.glucose - glucose2.glucose) / (glucose1.gDate - glucose2.gDate) * (d.eTimeStart - glucose1.gDate) + glucose1.glucose;
      return yScale(exerciseY); 
   })
   .on("mouseover", function(d) {
      const glucose1 = glucoseData.reduce((prev, curr) => {
      if (curr.gDate < d.eTimeStart) 
      {
         if (!prev || Math.abs(curr.gDate - d.eTimeStart) < Math.abs(prev.gDate - d.eTimeStart)) 
         {
            return curr;
         }
      }
      return prev;
      }, null);
      const glucose2 = glucoseData.find(g => g.gDate >= d.eTimeStart);
      if (!glucose1 || !glucose2) 
      {
         return;
      }
      const exerciseY = (glucose1.glucose - glucose2.glucose) / (glucose1.gDate - glucose2.gDate) * (d.eTimeStart - glucose1.gDate) + glucose1.glucose;
      const x = xScale(d.eTimeStart);
      const y = yScale(exerciseY);
      tooltip.attr("transform", `translate(${x},${y})`);
      tooltip.select("text")
      .html(`<tspan x="4em" dy="0">Exercise: ${d.exercise}</tspan>
      <tspan x="4em" dy="1.5em">Time: ${formatTime(d.eTimeStart)}</tspan>`);      
      tooltip.style("display", "block");
      })
      .on("mouseout", function() {
      tooltip.style("display", "none");
      });
};


function init() {
   var dateFormat = d3.timeFormat("%Y/%m/%d %H:%M");
   Promise.all([
   d3.csv("data/chart-glucose-data.csv", d => 
   ({
      gDate: new Date(+d.year, +d.month - 1, +d.day, +d.hour, +d.min),
      glucose: +d.glucose
   })),
   d3.csv("data/chart-meal-data.csv", d => 
   ({
      mDate: new Date(+d.year, +d.month - 1, +d.day, +d.hour, +d.min),
      meal: d.meal,
      mImg: d.mImg
   })),
   d3.csv("data/chart-exercise-data.csv", d => 
   ({
      eTimeStart: new Date(+d.startYear, +d.startMonth - 1, +d.startDay, +d.startHour, +d.startMin),
      eTimeEnd: new Date(+d.endYear, +d.endMonth - 1, +d.endDay, +d.endHour, +d.endMin),
      exercise: d.exercise
   }))

   ]).then(([glucoseData, mealData, exerciseData]) => 
   {
      console.table(mealData, ["mDate", "meal", "mImg"]);
      console.table(glucoseData, ["gDate", "glucose"]);
      console.table(exerciseData, ["eTimeStart", "eTimeEnd", "exercise"])
      lineChart(glucoseData, mealData, exerciseData)
      lineChartAlex(glucoseData, mealData, exerciseData);
   }).catch(error => 
   {
      console.log(error);
   });
}

window.onload = init;
