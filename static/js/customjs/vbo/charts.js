$(document).ready(function() {

    $.ajax({
        url: '/vbo/report-data',
        type: 'GET',
        //data: data,
        success: function(result) {
            if (result.status == 'success') {
                console.log('chart results == ', result)
                x1 = result.results.results_nbrf_x1_error_rates
                legacy = result.results.results_nbrf_legacy_error_rates

                udb_errors_rate = [x1.x1_udb_error_rate, legacy.legacy_udb_error_rate]
                plant_errors_rate = [x1.x1_plant_error_rate, legacy.legacy_plant_error_rate]
                cdn_setup_errors_rate = [x1.x1_cdn_setup_error_rate, legacy.legacy_cdn_setup_error_rate]
                network_teardown_errors_rate = [x1.x1_networkresourcefailure_rate, legacy.legacy_networkresourcefailure_rate]
                vcp_errors_rate = [x1.x1_vcp_error_rate, legacy.legacy_vcp_error_rate]
                cm_connect_errors_rate = [x1.x1_cm_connect_error_rate, legacy.legacy_cm_connect_error_rate]

                vlqok_errors_rate = [x1.x1_vlqok_error_rate, legacy.legacy_vlqok_error_rate]
                tune_errors_rate = [x1.x1_tune_error_rate, legacy.legacy_tune_error_rate]
                drawchart_stacked_stb_error_rates()

                spikes = result.results.results_nbrf_spikes

                spikes_categories = []
                spikes_br_denial_rate = []
                spikes_vlqok_error_rate = []
                spikes_udb_error_rate = []
                spikes_vcp_error_rate = []
                spikes_plant_error_rate = []
                spikes_networkresourcefailure_error_rate = []
                spikes_cdn_setup_error_rate = []
                spikes_cm_connect_error_rate = []
                spikes_tune_error_rate = []

                spikes.forEach(function(obj) {
                    spikes_categories.push(obj.report_create_time)
                    spikes_br_denial_rate.push(obj.br_denial_rate)
                    spikes_vlqok_error_rate.push(obj.vlqok_error_rate)
                    spikes_udb_error_rate.push(obj.udb_error_rate)
                    spikes_vcp_error_rate.push(obj.vcp_error_rate)
                    spikes_plant_error_rate.push(obj.plant_error_rate)
                    spikes_networkresourcefailure_error_rate.push(obj.networkresourcefailure_rate)
                    spikes_cdn_setup_error_rate.push(obj.cdn_setup_error_rate)
                    spikes_cm_connect_error_rate.push(obj.cm_connect_error_rate)
                    spikes_tune_error_rate.push(obj.tune_error_rate)
                })
                drawchart_nbrf_spikes()

                x1_vs_legacy = result.results.results_x1_vs_legacy
                x1_vs_legacy_legacy_nbr_error_rate = []
                x1_vs_legacy_x1_nbr_error_rate = []
                x1_vs_legacy.forEach(function(obj) {
                    x1_vs_legacy_legacy_nbr_error_rate.push(obj.legacy_nbr_error_rate)
                    x1_vs_legacy_x1_nbr_error_rate.push(obj.x1_nbr_error_rate)
                })
                drawchart_x1_vs_legacy()
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

    var drawchart_x1_vs_legacy = function() {
        $('#vbo_x1_vs_legacy').highcharts({
            title: {
                text: 'Spikes NBRF %',
                x: -20 //center
            },
            subtitle: {
                text: '',
                x: -20
            },
            xAxis: {
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                // 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                categories: spikes_categories,
                tickInterval: 60,
            },
            yAxis: {
                title: {
                    text: 'National QAM VOD Error Rate'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [
                // {turboThreshold: 2000 },
                {
                    name: 'Legacy NBR Error Rate',
                    data: x1_vs_legacy_legacy_nbr_error_rate,
                    turboThreshold: 2000,
                    lineWidth:1
                }, {
                    name: 'X1 NBR Error Rate',
                    data: x1_vs_legacy_x1_nbr_error_rate,
                    turboThreshold: 2000,
                    lineWidth:1
                }, 
            ]
        });
    }

    var drawchart_nbrf_spikes = function() {
        $('#vbo_nbrf_spikes').highcharts({
            title: {
                text: 'Spikes NBRF %',
                x: -20 //center
            },
            subtitle: {
                text: '',
                x: -20
            },
            series : [{
                    // name : 'AAPL Stock Price',
                    // data : data,
                    // threshold: null,
                    //lineWidth:1,
                    turboThreshold: 2000 // to accept point object configuration
                }],
            xAxis: {
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                // 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                categories: spikes_categories,
                tickInterval: 60,
            },
            yAxis: {
                title: {
                    text: 'National QAM VOD Error Rate'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [
                // {turboThreshold: 2000 },
                {
                    name: 'BR Denial Rate',
                    data: spikes_br_denial_rate,
                    turboThreshold: 2000,
                    lineWidth:1
                }, {
                    name: 'VLQOK Error Rate',
                    data: spikes_vlqok_error_rate,
                    turboThreshold: 2000,
                    lineWidth:1
                }, {
                    name: 'UDB Error Rate',
                    data: spikes_udb_error_rate,
                    turboThreshold: 2000,
                    lineWidth:1
                }, {
                    name: 'VCP Error Rate',
                    data: spikes_udb_error_rate,
                    turboThreshold: 2000,
                    lineWidth:1
                }, {
                    name: 'Plant Error Rate',
                    data: spikes_plant_error_rate,
                    turboThreshold: 2000,
                    lineWidth:1
                }, {
                    name: 'NetworkResourceFailure Rate',
                    data: spikes_networkresourcefailure_error_rate,
                    turboThreshold: 2000,
                    lineWidth:1
                }, {
                    name: 'CDN Setup Error Rate',
                    data: spikes_cdn_setup_error_rate,
                    turboThreshold: 2000,
                    lineWidth:1
                }, {
                    name: 'CM Connect Error Rate',
                    data: spikes_cm_connect_error_rate,
                    turboThreshold: 2000,
                    lineWidth:1
                }, {
                    name: 'Tune Error Rate',
                    data: spikes_tune_error_rate,
                    turboThreshold: 2000,
                    lineWidth:1
                }
            ]
        });
    }

    var drawchart_stacked_stb_error_rates = function() {
        $('#vbo_stb_error_rates').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Daily Error Rate by STB Type'
            },
            xAxis: {
                // categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                categories: ['X1', 'Legacy']
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        }
                    }
                }
            },
            series: [{
                name: 'UDB Errors',
                data: udb_errors_rate
            }, {
                name: 'Plant Errors',
                data: plant_errors_rate
            }, {
                name: 'CDN Setup Errors',
                data: cdn_setup_errors_rate
            }, {
                name: 'Network Teardown Errors',
                data: network_teardown_errors_rate

            }, {
                name: 'VCP Errors',
                data: vcp_errors_rate
            }, {
                name: 'Tune Errors',
                data: tune_errors_rate
            }, {
                name: 'CM_CONNECT Errors',
                data: cm_connect_errors_rate
            }, {
                name: 'VLQOK Errors',
                data: vlqok_errors_rate

            }, ]


        });
    }


})
