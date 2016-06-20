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

                         data_values_users_by_week_count = []
                         data_values_users_by_week_range = []
                         console.log('week',result.results_group_ticket_by_week_count)
                         result.results_group_ticket_by_week.forEach(function(obj){
                            
                            data_values_users_by_week_count.push(obj[0])
                            data_values_users_by_week_range.push(obj[1])
                         })
                         drawchart_tickets_created_by_week()


                        data_values_users_by_count = []
                        data_values_users = []
                         
                        result.results_group_users_get_count.forEach(function(obj){
                            data_values_users_by_count.push(obj[0])
                            data_values_users.push(obj[1])
                         })
                         drawchart_tickets_created_by_users()
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

    var drawchart_tickets_created_by_users = function () {
    $('#container_users_by_count').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Average Tickets created by Users(Name)'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: data_values_users_by_count,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Tickets (counts)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Users',
            data: data_values_users
            }]
    });
    }


    var drawchart_tickets_created_by_week = function () {
    $('#container_users_by_week').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Average Tickets created by week'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: data_values_users_by_week_range,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Tickets (counts)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Tickets',
            data: data_values_users_by_week_count
            }]
    });
    }
    


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
