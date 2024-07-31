function chart_activation(get, _nams) {
  $("#chartContainer").hide();
  const nams = _nams.map(n => n.toUpperCase());
  const arr_data = [];
  
  const arr_dataPoints = [[], [], [], [], []];
  
  const options = {
    title: {
      text: "Coins Live Report",
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
    data: [],
  };

  arr_dataPoints.forEach((e, i) => {
    options.data.push({
      type: "line",
      xValueType: "dateTime",
      yValueFormatString: "###.00$",
      showInLegend: true,
      name: nams[i],
      dataPoints: e,
    });
  });
  options.data[0].xValueFormatString = "hh:mm:ss TT";

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
  let time = new Date();
  let tHours = time.getHours();
  let tMinutes = time.getMinutes() - 3;
  let tSeconds = time.getSeconds();
  let tMilliseconds = time.getMilliseconds();

  time.setHours(tHours);
  time.setMinutes(tMinutes);
  time.setSeconds(tSeconds);
  time.setMilliseconds(tMilliseconds);

  function updateChart(count) {
    $.ajax({
      url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${get}&tsyms=USD`,
      success: function (e) {
        arr_data.splice(0, arr_data.length);
        for (const obj in e) {
          arr_data.push(e[obj]);
        }
      },
      erorr: function (erorr) {
        console.log(erorr);
      },
    });
    count = count || 1;

    for (let i = 0; i < count; i++) {
      time.setTime(time.getTime() + updateInterval);
      let key;
      arr_dataPoints.forEach((e, i) => {
        if (arr_data[i]) {
          key = Object.keys(arr_data[i]);
          e.push({
            x: time.getTime(),
            y: arr_data[i][key],
          });
        }
      });
    }

    for (let i = 0; i <= 4; i++) {
      if (arr_data[i]) {
        let key = Object.keys(arr_data[i]);
        options.data[i].legendText = `${nams[i]}: ${arr_data[i][key]}$`;
      }
    }

    $("#chartContainer").CanvasJSChart().render();
  }

  updateChart(100);
  setInterval(function () {
    updateChart();
  }, updateInterval);
  $("#app").hide();
  $("#chartContainer").show(4000);
}
