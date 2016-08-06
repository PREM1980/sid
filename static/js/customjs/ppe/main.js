$(document).ready(function() {
    alert('hi')

    $("#datestart").datepicker({
        dateFormat: 'yymmdd'
    });
    $("#dateend").datepicker({
        dateFormat: 'yymmdd'
    });


    var genChart = function() {
        console.log('called')
        alert('loading')
        $(function() {
        	        alert('loading-1')

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
        alert('exit')
    }

    $('#genChart').on('click', function() {
        genChart()
    })



})
