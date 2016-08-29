$(document).ready(function() {

$(function() {
//   $( "#month" ).datepicker({
//		dateFormat: 'yy-mm',
//		maxDate: "-1m"
//});
//   $( "#trending_month" ).datepicker({
//                dateFormat: 'yy-mm',
//                maxDate: "-1m"
//});

     $('.date-picker').datepicker(
                    {
                        dateFormat: "yy-mm",
			maxDate: "-1m",
                        changeMonth: true,
                        changeYear: true,
                        showButtonPanel: true,
                        onClose: function(dateText, inst) {


                            function isDonePressed(){
                                return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
                            }

                            if (isDonePressed()){
                                var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                                var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                                $(this).datepicker('setDate', new Date(year, month, 1)).trigger('change');
                                
                                 $('.date-picker').focusout()//Added to remove focus from datepicker input box on selecting date
                            }
                        },
                        beforeShow : function(input, inst) {

                            inst.dpDiv.addClass('month_year_datepicker')

                            if ((datestr = $(this).val()).length > 0) {
                                year = datestr.substring(datestr.length-4, datestr.length);
                                month = datestr.substring(0, 2);
                                $(this).datepicker('option', 'defaultDate', new Date(year, month-1, 1));
                                $(this).datepicker('setDate', new Date(year, month-1, 1));
                                $(".ui-datepicker-calendar").hide();
                            }
                        }
                    })

});


//etstats?rtype=bestpgs_ec&month=2016-06-01&no_requested=10

var pieChart = function(){
$(function() {
    month=$('#month').val()+"-01";
    rtype=$('#rtype').val();
    no_requested=$('#no_requested').val();
    no_errors_requested=$('#no_errors_requested').val();

    ttverbiage={"bestpgs_ec":"Error Count", "worstpgs_ec":"Error Count", "bestpgs_eps":"Error Percent of Streams", "worstpgs_eps":"Error Percent of Streams", "bestpgs_ms": "Market Share of Errors", "worstpgs_ms": "Market Share of Errors", "top_errors_count":"Errors by Count", "top_errors_percent":"Errors by Percent"};

    verbiage={"bestpgs_ec":"Best Peergroups by Error Count", "worstpgs_ec":"Worst Peergroups by Error Count", "bestpgs_eps":"Best Peergroups by Error Percent of Streams", "worstpgs_eps":"Worst Peergroups by Error Percent of Streams", "bestpgs_ms": "Best Market Share of Errors", "worstpgs_ms": "Worst Market Share of Errors","top_errors_count":"Top Errors by Count", "top_errors_percent":"Top Errors by Percent"};

    var clabel = verbiage[rtype]+" ( "+$('#month').val()+")";

    var tt_label = ttverbiage[rtype];


    $.getJSON("etstats?rtype="+rtype+"&month="+month+"&no_requested="+no_requested+"&no_errors_requested="+no_errors_requested, function(json){
       data = json.results

    //The iteration below removes double quotes from the "y" value
    //Correct JSON is being returned but highcharts rejects values like "0.87" 
    $.each(data, function (i, point) {
         point.y = eval(point.y);
    });

    var pieformat=''
    var pointformatting = ''

    if (rtype == "bestpgs_ec" || rtype == "worstpgs_ec" || rtype == "top_errors_count") {
        var pieformat = '<b>{point.name}</b>: {point.y}'
        var pointformatting = '{series.name}:<b>{point.y}</b>'
    }else{
        var pieformat = '<b>{point.name}</b>: {point.percentage:.1f} %'
        var pointformatting = '{series.name}:<b>{point.percentage:.1f}%</b>'
    }

    var chart = new Highcharts.Chart({
    chart: {
        renderTo: 'container',
        type: 'pie'
    },
    lang: {
        thousandsSep: ","
    },
    title: {
	text: clabel
    },
    tooltip:{	
	pointFormat: pointformatting 
    },
    plotOptions: {
	pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: pieformat,
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


  title_verbiage={"ec": "Error Count", "eps":"Error Percent of Streams (PGs)", "ms":"Market Share of Errors", "de_counts":"Specific Error Counts", "de_pcts":"Specific Errors by Percent", "eps_nd": "Error Percent of Streams (Nat/Div)"};
  yaxis_verbiage={"ec": "Number", "eps":"Percent", "ms":"Market Share of Errors", "de_counts":"Counts", "de_pcts":"Percent", "eps_nd":"Percent"};

  trending_month = $('#trending_month').val()+"-01";
  trending_rtype = $('#trending_rtype').val();
  months_requested = $('#months_requested').val();

  var chart_title = title_verbiage[trending_rtype]+" ( "+$('#trending_month').val()+" ) ";
  var chart_yaxis = yaxis_verbiage[trending_rtype]

  $.getJSON("ettrending?trending_month="+trending_month+"&trending_rtype="+trending_rtype+"&months_requested="+months_requested, function(json){
    var data = json.results;
    console.log('Error Trending==', data)
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
