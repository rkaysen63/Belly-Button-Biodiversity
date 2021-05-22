function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
  
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
  
// Initialize the dashboard
init();
  
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}
  
// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
  
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
  
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  
  });
}
  
// D1-1. Create the buildCharts function.
function buildCharts(sample) {
  // D1-2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // D1-3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // D3. Create a variable that holds the metadata array.
    var metadata = data.metadata;

    console.log(samples);
    console.log(metadata);
    // D1-4. Create a variable that filters the samples array for the object with
    // the desired sample number, i.e. 1 of 99 that matches user selection.
    var resultArraySample = samples.filter(sampleObj => sampleObj.id == sample);

    // D3-1. Create a variable that filters the metadata array for the object with 
    // the desired sample number, i.e. 1 of 99 that matches user selection.
    var resultArrayMetadata = metadata.filter(sampleObj => sampleObj.id == sample);

    // Prints an array to the console.
    console.log(resultArraySample);
    console.log(resultArrayMetadata);
    // D1-5. Create a variable that holds the first sample (object) in the array.      
    // resultArrayX btw only has one object and by default index = 0.
    var resultSample = resultArraySample[0];

    // D3-2. Create a variable that holds the first sample in the metadata array.
    var resultMetadata = resultArrayMetadata[0];

    // Prints an object to the console.
    console.log(resultSample);
    console.log(resultMetadata);  
    // D1-6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = resultSample.otu_ids;
    var sampleValues = resultSample.sample_values;
    var otuLabels = resultSample.otu_labels;

    // 3. Create a variable that holds the washing frequency.
    // var washingFreq = resultMetadata.wfreq;
    var washingFreq = parseFloat(resultMetadata.wfreq);
    
    // Prints arrays to the console.
    console.log(otuIds);
    console.log(sampleValues);
    console.log(otuLabels);
    console.log(washingFreq);     
  
    // D1-7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var first10otuIds = otuIds.slice(0, 10).map(x => "OTU " + x).reverse();
    var first10sampleValues = sampleValues.slice(0, 10).reverse();
    var first10otuLabels = otuLabels.slice(0, 10).reverse();
    
    // var yticks = first10otuIDs
    var trace = {
      x: first10sampleValues,
      y: first10otuIds,
      // yticks: yticks,
      type: "bar",
      orientation: "h",
      hovertext: first10otuLabels
    };

    // D1-8. Create the trace for the bar chart. 
    var barData = [trace];

    // D1-9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // D1-10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bar and Bubble charts
    // D2-1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      type: "scatter",
      mode: "markers",
      hovertext: otuLabels,
      // marker: {size=sampleValues,
        // sizemode="area",
        // sizeref=2.0*max(sampleValues)/(40.0**2),
        // sizemin=4
        // color=[otuIds], 
        // colorscale=(0,"blue"),(1,"red")}  
      }];

    // D2-2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      hovermode: "closest"
    };

    // D2-3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // D3-4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: washingFreq,
      title: {text: "Belly Button Washing Frequency",
      font:{size:24}|"Scrubs per Week", font:{size: 16}},
      gauge:{
        axis: {range: [null, 10], tickwidth: 2, tickcolor: "black"},
        bar: {color: "dimgray"},
        // bgcolor:
        borderwidth: 2,
        bordercolor: "darkslategrey",
        steps: [
          {range: [0, 2], color: "hotpink"},
          {range: [2, 4], color: "coral"},
          {range: [4, 6], color: "khaki"},
          {range: [6, 8], color: "mediumspringgreen"},
          {range: [8, 10], color: "deepskyblue"}]     
      }
    }];
    
    // D3-5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: {
        t: 25,
        r: 25,
        l: 25,
        b: 25
      }
    };
    // D3-6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

 