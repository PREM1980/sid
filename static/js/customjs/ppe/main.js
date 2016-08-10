$(document).ready(function() {
    

    $("#datestart").datepicker({
        dateFormat: 'yymmdd'
    });
    $("#dateend").datepicker({
        dateFormat: 'yymmdd'
    });


    var genChart = function() {
        console.log('called')
        
        $(function() {
        	       

            verbiage = {
                "actives": "Number of Active Accounts",
                "ef": "Number of Error Free Accounts",
                "er": "Number of Error Rate Accounts",
                "daily_ef": "Daily Positive Platform Experience",
                "daily_er": "Daily Error Rate Percentage"
            };
            reporttypeverbiage = {
                "herrin": "Herrin Report",
                "wilen": "Wilen Report",
                "wilen_nobr": "Wilen Report (No BR)"
            };
            verbosestb = {
                "x1": "X1 Only",
                "legacy": "Legacy only",
                "all": "X1 and Legacy Combined"
            }

            startdate = $('#datestart').val();
            enddate = $('#dateend').val();
            metricvar = $('#metricVar').val();
            rtype = $('#rtype').val();
            stb = $('#stb').val();

            // var metricvar = $("input[name='metricVar']:selected").val();
            var stbtext

            if (rtype != "herrin") {
                stbtext = " ( " + verbosestb[stb] + " ) "
            } else {
                stbtext = ""
            }

            textverb = verbiage[metricvar]
            source = {
                "herrin": "CEMP",
                "wilen": "Vertica",
                "wilen_nobr": "Vertica"
            }
            metric_x = {
                "actives": "Number of accounts",
                "ef": "Number of accounts",
                "er": "Number of accounts",
                "daily_ef": "Percent",
                "daily_er": "Percent"
            };

            var x_axis = metric_x[metricvar];
            var datasource = source[rtype];
            var textverb = verbiage[metricvar] + "/" + reporttypeverbiage[rtype] + stbtext + " (Source: " + datasource + ")";

            $.getJSON("/ppe/pullppe?startdate=" + startdate + "&enddate=" + enddate + "&metric=" + metricvar + "&rtype=" + rtype + "&stb=" + stb, function(json) {
                console.log('response json == ', json.results.length)
                console.log('response json == ', json.results[0])
                var data = json.results;
                console.log('typeof data == ',typeof data)
                // data = {"day": "07/01/2016", "region": "Mountain West", "metric": "98.53"}, {"day": "07/01/2016", "region": "Florida", "metric": "98.33"}, {"day": "07/01/2016", "region": "Beltway", "metric": "98.63"}, {"day": "07/01/2016", "region": "Western NE", "metric": "98.82"}, {"day": "07/01/2016", "region": "Freedom", "metric": "98.45"}, {"day": "07/01/2016", "region": "California", "metric": "98.71"}, {"day": "07/01/2016", "region": "Boston", "metric": "98.78"}, {"day": "07/01/2016", "region": "Oregon/SW Washington", "metric": "98.64"}, {"day": "07/01/2016", "region": "Washington", "metric": "98.57"}, {"day": "07/01/2016", "region": "Chicago", "metric": "98.66"}, {"day": "07/01/2016", "region": "Houston", "metric": "98.95"}, {"day": "07/01/2016", "region": "Big South", "metric": "98.51"}, {"day": "07/01/2016", "region": "Keystone", "metric": "98.96"}, {"day": "07/01/2016", "region": "Twin Cities", "metric": "98.44"}, {"day": "07/01/2016", "region": "Heartland", "metric": "98.58"}, {"day": "07/02/2016", "region": "Boston", "metric": "98.72"}, {"day": "07/02/2016", "region": "Freedom", "metric": "98.65"}, {"day": "07/02/2016", "region": "Beltway", "metric": "98.75"}, {"day": "07/02/2016", "region": "Keystone", "metric": "99.03"}, {"day": "07/02/2016", "region": "Oregon/SW Washington", "metric": "98.89"}, {"day": "07/02/2016", "region": "Twin Cities", "metric": "98.52"}, {"day": "07/02/2016", "region": "Big South", "metric": "98.19"}, {"day": "07/02/2016", "region": "Chicago", "metric": "98.81"}, {"day": "07/02/2016", "region": "Florida", "metric": "98.33"}, {"day": "07/02/2016", "region": "Western NE", "metric": "98.85"}, {"day": "07/02/2016", "region": "Mountain West", "metric": "98.43"}, {"day": "07/02/2016", "region": "Houston", "metric": "98.92"}, {"day": "07/02/2016", "region": "Washington", "metric": "98.55"}, {"day": "07/02/2016", "region": "Heartland", "metric": "98.57"}, {"day": "07/02/2016", "region": "California", "metric": "98.63"}

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
                    exporting: {
                        csv: {
                            dateFormat: '%Y-%m-%d'
                        }
                    },
                    title: {
                        text: textverb
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: x_axis
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
                        if (s.name === p.region) {
                            exist = true;
                            index = j;
                        }
                    });
                    if (exist) {
                        options.series[index].data.push(parseFloat(p.metric))
                    } else {
                        options.series.push({
                            name: p.region,
                            data: [parseFloat(p.metric)]
                        })
                    }
                })
                $('#container').highcharts(options);
            });
        });        
    }

    $('#genChart').on('click', function() {
        genChart()
    })



})
