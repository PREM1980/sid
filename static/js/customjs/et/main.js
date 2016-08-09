$(document).ready(function() {

$(function() {
   $( "#month" ).datepicker({
		dateFormat: 'yy-mm',
		maxDate: "-1m"
});
   $( "#trending_month" ).datepicker({
		dateFormat: 'yy-mm',
		maxDate: "-1m"
});

});


//etstats?rtype=bestpgs_ec&month=2016-06-01&no_requested=10

var pieChart = function(){
$(function() {
    month=$('#month').val()+"-01";
    rtype=$('#rtype').val();
    no_requested=$('#no_requested').val();
    ttverbiage={"bestpgs_ec":"Error Count", "worstpgs_ec":"Error Count", "bestpgs_eps":"Error Percent of Streams", "worstpgs_eps":"Error Percent of Streams", "bestpgs_ms": "Market Share of Errors", "worstpgs_ms": "Market Share of Errors"};
    verbiage={"bestpgs_ec":"Best Peergroups by Error Count", "worstpgs_ec":"Worst Peergroups by Error Count", "bestpgs_eps":"Best Peergroups by Error Percent of Streams", "worstpgs_eps":"Worst Peergroups by Error Percent of Streams", "bestpgs_ms": "Best Market Share of Errors", "worstpgs_ms": "Worst Market Share of Errors"};
    var chart_label = verbiage[rtype]
    var tt_label = ttverbiage[rtype] 
    $.getJSON("etstats?rtype="+rtype+"&month="+month+"&no_requested="+no_requested, function(json){
       data = json 

    //The iteration below removes double quotes from the "y" value
    //Correct JSON is being returned but highcharts rejects values like "0.87" 
    $.each(data, function (i, point) {
         point.y = eval(point.y);
    });

    var chart = new Highcharts.Chart({
    chart: {
        renderTo: 'container',
        type: 'pie'
    },
    title: {
	text: chart_label
    },
    tooltip:{	
	pointFormat: '{series.name}:<b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
	pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
    },
    series: [{
	name: tt_label,
        data: data
    }]
  });
 });
});
};

var genChart = function(){
$(function() {


  title_verbiage={"ec": "Error Count", "eps":"Error Percent of Streams", "ms":"Market Share of Errors", "de_counts":"Specific Error Counts", "de_pcts":"Specific Errors by Percent"};
  yaxis_verbiage={"ec": "Number", "eps":"Percent", "ms":"Market Share of Errors", "de_counts":"Counts", "de_pcts":"Percent"};

  trending_month = $('#trending_month').val()+"-01";
  trending_rtype = $('#trending_rtype').val();
  months_requested = $('#months_requested').val();

  var chart_title = title_verbiage[trending_rtype]
  var chart_yaxis = yaxis_verbiage[trending_rtype]

  $.getJSON("ettrending?trending_month="+trending_month+"&trending_rtype="+trending_rtype+"&months_requested="+months_requested, function(json){
    var data = json;

    var exist, index, options = {
    chart: {
        renderTo: 'container',
        type: 'spline'
    },
    plotOptions: {
        series: {
                marker: {
                        enabled: false
                }
        }
    },
    exporting : {
        csv: {
           dateFormat: '%Y-%m-%d'
        }
    },
    title: {
        text: chart_title
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
                text: chart_yaxis
        }
    },
    series: []
  }

  Highcharts.each(data, function(p, i) {
    exist = false;
    if (options.xAxis.categories.indexOf(p.day) < 0) {
      options.xAxis.categories.push(p.day)
    }
    Highcharts.each(options.series, function(s, j) {
      if (s.name === p.market) {
        exist = true;
        index = j;
      }
    });
    if (exist) {
      options.series[index].data.push(parseFloat(p.metric))
    } else {
      options.series.push({
        name: p.market,
        data: [parseFloat(p.metric)]
      })
    }
  })
  $('#container').highcharts(options);
  });
});
}

    $('#pieChart').on('click', function() {
        pieChart()
    })
    $('#genChart').on('click', function() {
        genChart()
    })

})