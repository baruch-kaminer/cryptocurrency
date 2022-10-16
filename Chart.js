 

function test(get) {
 

  test1(get);
}

function test1(get) {
  let arr = [];


  let dataPoints1 = [];
  let dataPoints2 = [];
  let dataPoints3 = [];
  let dataPoints4 = [];
  let dataPoints5 = [];

  let options = {
    title: {
      text: "Electricity Generation in Turbine",
    },
    axisX: {
      title: "chart updates every 2 secs",
    },
    axisY: {
      suffix: "$",
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      verticalAlign: "top",
      fontSize: 22,
      fontColor: "dimGrey",
      itemclick: toggleDataSeries,
    },
    data: [
      {
        type: "line",
        xValueType: "dateTime",
        yValueFormatString: "###.00Wh",
        xValueFormatString: "hh:mm:ss TT",
        showInLegend: true,
        name: "",
        dataPoints: dataPoints1,
      },
      {
        type: "line",
        xValueType: "dateTime",
        yValueFormatString: "###.00Wh",
        showInLegend: true,
        name: "Turbine 2",
        dataPoints: dataPoints2,
      },
      {
        type: "line",
        xValueType: "dateTime",
        yValueFormatString: "###.00Wh",
        showInLegend: true,
        name: "Turbine 2",
        dataPoints: dataPoints3,
      },
      {
        type: "line",
        xValueType: "dateTime",
        yValueFormatString: "###.00Wh",
        showInLegend: true,
        name: "Turbine 2",
        dataPoints: dataPoints4,
      },
      {
        type: "line",
        xValueType: "dateTime",
        yValueFormatString: "###.00Wh",
        showInLegend: true,
        name: "Turbine 2",
        dataPoints: dataPoints5,
      },
    ],
  };

  let chart = $("#chartContainer").CanvasJSChart(options);

  function toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }

  let updateInterval = 2000;
  // initial value

  let time = new Date();

  // starting at 10.00 am

  let tHours = time.getHours();
  let tMinutes = time.getMinutes() - 4;
  let tSeconds = time.getSeconds();
  let tMilliseconds = time.getMilliseconds();

  time.setHours(tHours);
  time.setMinutes(tMinutes);
  time.setSeconds(tSeconds);
  time.setMilliseconds(tMilliseconds);

  let nams = [];

 

  function updateChart(count) {
    $.ajax({
      url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${get}&tsyms=USD`,
      success: function (e) {
        // console.log(e);
        arr.splice(0, arr.length);
        nams.splice(0, nams.length);
        for (const obj in e) {
          nams.push(obj);
          arr.push(e[obj]);
        }
      },
      erorr: function (erorr){
        console.log(erorr);
      }
    });
    // console.log(arr);
    count = count || 1;
    for (let i = 0; i < count; i++) {
      time.setTime(time.getTime() + updateInterval);

      // adding random value and rounding it to two digits.

      // pushing the new values

      if (arr[0]) {
        let key1 = Object.keys(arr[0]);
        // console.log(arr[0]);
        dataPoints1.push({
          x: time.getTime(),
          y: arr[0][key1],
        });
      }

      if (arr[1]) {
        let key2 = Object.keys(arr[1]);
        dataPoints2.push({
          x: time.getTime(),
          y: arr[1][key2],
        });
      }

      if (arr[2]) {
        let key3 = Object.keys(arr[2]);
        dataPoints3.push({
          x: time.getTime(),
          y: arr[2][key3],
        });
      }

      if (arr[3]) {
        let key4 = Object.keys(arr[3]);
        dataPoints4.push({
          x: time.getTime(),
          y: arr[3][key4],
        });
      }

      if (arr[4]) {
        let key5 = Object.keys(arr[4]);
        dataPoints5.push({
          x: time.getTime(),
          y: arr[4][key5],
        });
      }
    }

    for(let i = 0; i <= 4; i++){
      if (arr[i]) {
        let key = Object.keys(arr[i]);
        options.data[i].legendText = `${nams[i]}: ${arr[i][key]}$`;
      }
    }

    $("#chartContainer").CanvasJSChart().render();
  }
  
  updateChart(100);
  setInterval(function () {
    updateChart();
  }, updateInterval);
}


