$(document).ready(function() {

    $.ajax({
                 url: '/charts-data',
                 type: 'GET',
                 //data: data,
                 success: function(result) {
                     if (result.status == 'success') {
                         console.log('chart result == ', JSON.stringify(result))   
                         
                         data_values_duration = []
                         result.results_duration.forEach(function(obj){
                            data_values_duration.push({
                                "name":obj[0]
                                ,"y":obj[1]
                            })
                         })
                         console.log(JSON.stringify(data_values_duration))

                         drawchart_duration()
                         
                         data_values_error_count = []

                         result.results_error_count.forEach(function(obj){
                            data_values_error_count.push({
                                "name":obj[0]
                                ,"y":obj[1]
                            })
                         })

                         
                         drawchart_error_count()

                         data_values_system_caused = []
                         result.results_system_caused.forEach(function(obj){
                            data_values_system_caused.push({
                                "name":obj[0]
                                ,"y":obj[1]
                            })
                         })
                         drawchart_system_caused()

                         data_values_outage_caused = []
                         result.results_outage_caused.forEach(function(obj){
                            data_values_outage_caused.push({
                                "name":obj[0]
                                ,"y":obj[1]
                            })
                         })
                         drawchart_outage_caused()

                         data_values_division = []
                         result.results_division.forEach(function(obj){
                            data_values_division.push({
                                "name":obj[0]
                                ,"y":obj[1]
                            })
                         })
                         drawchart_division()


                         data_values_pg = []
                         result.results_pg.forEach(function(obj){
                            data_values_pg.push({
                                "name":obj[0]
                                ,"y":obj[1]
                            })
                         })
                         drawchart_pg()

                         //$('#loginid').html(login_id)
                         //set_division(login_id)
                     } else if (result.status == 'session timeout') {
                         alert("Session expired -- Please relogin")
                         document.location.href = "/";
                     } else {
                         alert("Unable to get data!! Contact Support");
                     }
                 },
                 error: function() {
                     alert("Call to charts data failed");
                 }
             })



    var drawchart_pg = function () {
        
    $('#container_pg').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Events by PeerGroup'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                    },

                },
                showInLegend: true
            }
        },
        series: [{
            name: 'PG',
            colorByPoint: true,
            data: data_values_pg,
            
        }]
    });
    return;
    };




    var drawchart_division = function () {
        
    $('#container_division').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Events by Division'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                    },

                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Events',
            colorByPoint: true,
            data: data_values_division,
            
        }]
    });
    return;
    };




    var drawchart_outage_caused = function () {
    $('#container_outage_caused').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Events by Outage Caused'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                    },

                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Events',
            colorByPoint: true,
            data: data_values_outage_caused,
            
        }]
    });
    return;
    };


    var drawchart_system_caused = function () {
    $('#container_system_caused').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Events by System Caused'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                    },

                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Events',
            colorByPoint: true,
            data: data_values_system_caused,
            
        }]
    });
    return;
    };

    var drawchart_error_count = function () {
    $('#container_error_count').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Events by Error Count'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                    },

                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Events',
            colorByPoint: true,
            data: data_values_error_count,
            
        }]
    });
    return;
    };


    var drawchart_duration = function () {
        
    $('#container_duration').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Events by Duration'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Events',
            colorByPoint: true,
            data: data_values_duration,
        }]
    });
    return;
    };


})
