$(document).ready(function(){
	$(function() {

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function(data) {
        // Create the chart
        window.chart = new Highcharts.StockChart({
            chart: {
                renderTo: 'container'
            },

            rangeSelector: {
                selected: 1,
                inputDateFormat: '%Y-%m-%d'
            },

            title: {
                text: 'Error Count'
            },

            series: [{
                name: 'AAPL',
                data: data,
                tooltip: {
                    valueDecimals: 2
                }}]

        }, function(chart) {

            // apply the date pickers
            setTimeout(function() {
                $('input.highcharts-range-selector', $('#' + chart.options.chart.renderTo)).datepicker()
            }, 0)
        });
    });

//     p = a[0][0].X1.national
// output = []
// for (var key in p) {
//   if (p.hasOwnProperty(key)) {
//      console.log('ptrm == ',Number.isInteger(parseInt(key)))
//      if (Number.isInteger(parseInt(key))){
//       output.push([key,p[key].errors])
//      }
//   }
// }
// console.log(JSON.stringify(output))

    // Set the datepicker's date format
    $.datepicker.setDefaults({
        dateFormat: 'yy-mm-dd',
        onSelect: function(dateText) {
            this.onchange();
            this.onblur();
        }
    });

});
	
	})