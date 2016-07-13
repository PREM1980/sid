$(document).ready(function() {

    function roundoff(nbr) {        
        result = (Math.round(nbr * 100 * 100) / 100)
        return result
    }
    $('#report-1-submit, #report-2-submit, #report-3-submit').click(function() {
        report_num = this.id.split('-')[1]        
        
        if (report_num == '1'){
            comments = $('#report-1-comments-txt').val()
        }
        else if (report_num == '2'){
            comments = $('#report-2-comments-txt').val()
        }
        else
        {
            comments = $('#report-3-comments-txt').val()
        }
        
        $.ajax({
            url: '/vbo/update-report-callouts/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() +  '&report_num=' + report_num + '&report_callouts=' + comments,
            // url: '/vbo/update-report-callouts/?'+'report_num='+report_num,
            type: 'GET',
            //data: data,
            success: function(result) {
                if (result.status == 'success') {
                    console.log('chart results == ', result)
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
    })
    var set_summary = function(x1) {
        console.log('prem report_create_Time == ', x1.report_create_time)
        report_create_time = moment.utc(x1.report_create_time).format('MMM DD, YYYY');
        console.log('prem formatter report_create_Time == ', report_create_time)
        $('#report-date').text(report_create_time)
        $('#successful-setup-total').text(x1.successful_setup_total.toLocaleString())

        $('#business-rules-total').text(x1.business_rules_total.toLocaleString())
        $('#business-rules-success').text(100 - x1.business_rules_success + '%')
        $('#business-rules-error').text(x1.business_rules_success + '%')

        $('#non-business-rules-total').text(x1.non_business_rules_total.toLocaleString())
        $('#non-business-rules-success').text(100 - x1.non_business_rules_success + '%')
        $('#non-business-rules-error').text(x1.non_business_rules_success + '%')


        $('#udb-total').text(x1.udb_total.toLocaleString())
        $('#udb-success').text(100 - x1.udb_success + '%')
        $('#udb-error').text(x1.udb_success + '%')
        $('#udb-nbr').text(roundoff(x1.udb_total / x1.non_business_rules_total) + '%')

        $('#cdn-total').text((x1.cdn_setup_total + x1.cdn_connect_total).toLocaleString())

        $('#cdn-setup-total').text(x1.cdn_setup_total.toLocaleString())
        $('#cdn-setup-success').text(100 - x1.cdn_setup_success + '%')
        $('#cdn-setup-error').text(x1.cdn_setup_success + '%')
        $('#cdn-setup-nbr').text(roundoff(x1.cdn_setup_total / x1.non_business_rules_total) + '%')

        $('#cdn-connect-total').text(x1.cdn_connect_total.toLocaleString())
        $('#cdn-connect-success').text(100 - x1.cdn_connect_success + '%')
        $('#cdn-connect-error').text(x1.cdn_connect_success + '%')
        $('#cdn-connect-nbr').text(roundoff(x1.cdn_connect_total / x1.non_business_rules_total) + '%')

        $('#net-total').text(x1.net_total.toLocaleString())
        $('#net-success').text(100 - x1.net_success + '%')
        $('#net-error').text(x1.net_success + '%')
        $('#net-nbr').text(roundoff(x1.net_total / x1.non_business_rules_total) + '%')

        $('#field-total').text(x1.field_plant_total + x1.video_total + x1.tune_total)

        $('#field-plant-total').text(x1.field_plant_total.toLocaleString())
        $('#field-plant-success').text(100 - x1.field_plant_success + '%')
        $('#field-plant-error').text(x1.field_plant_success + '%')
        $('#field-plant-nbr').text(roundoff(x1.field_plant_total / x1.non_business_rules_total) + '%')

        $('#video-total').text(x1.video_total.toLocaleString())
        $('#video-success').text(100 - x1.video_success + '%')
        $('#video-error').text(x1.video_success + '%')
        $('#video-nbr').text(roundoff(x1.video_total / x1.non_business_rules_total) + '%')

        $('#tune-total').text(x1.tune_total.toLocaleString())
        $('#tune-success').text(100 - x1.tune_success + '%')
        $('#tune-error').text(x1.tune_success + '%')
        $('#tune-nbr').text(roundoff(x1.tune_total / x1.non_business_rules_total) + '%')

        $('#vcp-total').text(x1.vcp_total.toLocaleString())
        $('#vcp-success').text(100 - x1.vcp_success + '%')
        $('#vcp-error').text(x1.vcp_success + '%')
        $('#vcp-nbr').text(roundoff(x1.vcp_total / x1.non_business_rules_total) + '%')

        $('#other-setup-total').text(x1.other_setup_total.toLocaleString())
        $('#other-setup-success').text(100 - x1.other_setup_success + '%')
        $('#other-setup-error').text(x1.other_setup_success + '%')
        $('#other-setup-nbr').text(roundoff(x1.other_setup_total / x1.non_business_rules_total) + '%') + '%'

        $('#x1-stb-nbr-rate').text(x1.x1_stb_nbr_rates + '%')
        $('#legacy-stb-nbr-rate').text(x1.legacy_stb_nbr_rates + '%')
        $('#national-stb-nbr-rate').text(x1.national_stb_nbr_rates + '%')

        return;
    }

    var generate_report = function() {

        $.ajax({
            url: '/vbo/report-data/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val(),
            type: 'GET',
            //data: data,
            success: function(result) {
                if (result.status == 'success') {
                    console.log('chart results == ', result)
                    $('#animation,#animation-space').hide()
                    $('#vbo-stb-error-rates-comments, #vbo-nbrf-spikes-comments, #vbo-x1-vs-legacy-comments, #vbo-x1-vs-legacy-comments, #html-reports-btn').show()

                    x1 = result.results.results_nbrf_x1_error_rates
                    legacy = result.results.results_nbrf_legacy_error_rates

                    set_summary(x1)

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

                    comments = result.results.report_comments
                    $('#report-1-comments-txt').val(comments.report_1_comments)
                    $('#report-2-comments-txt').val(comments.report_2_comments)
                    $('#report-3-comments-txt').val(comments.report_3_comments)
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
            $('#vbo-x1-vs-legacy').highcharts({
                title: {
                    text: 'National Error Rate by STB Type',
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
                        lineWidth: 1
                    }, {
                        name: 'X1 NBR Error Rate',
                        data: x1_vs_legacy_x1_nbr_error_rate,
                        turboThreshold: 2000,
                        lineWidth: 1
                    },
                ]
            });
        }

        var drawchart_nbrf_spikes = function() {
            $('#vbo-nbrf-spikes').highcharts({
                title: {
                    text: 'Spikes NBRF %',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                series: [{
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
                        lineWidth: 1
                    }, {
                        name: 'VLQOK Error Rate',
                        data: spikes_vlqok_error_rate,
                        turboThreshold: 2000,
                        lineWidth: 1
                    }, {
                        name: 'UDB Error Rate',
                        data: spikes_udb_error_rate,
                        turboThreshold: 2000,
                        lineWidth: 1
                    }, {
                        name: 'VCP Error Rate',
                        data: spikes_udb_error_rate,
                        turboThreshold: 2000,
                        lineWidth: 1
                    }, {
                        name: 'Plant Error Rate',
                        data: spikes_plant_error_rate,
                        turboThreshold: 2000,
                        lineWidth: 1
                    }, {
                        name: 'NetworkResourceFailure Rate',
                        data: spikes_networkresourcefailure_error_rate,
                        turboThreshold: 2000,
                        lineWidth: 1
                    }, {
                        name: 'CDN Setup Error Rate',
                        data: spikes_cdn_setup_error_rate,
                        turboThreshold: 2000,
                        lineWidth: 1
                    }, {
                        name: 'CM Connect Error Rate',
                        data: spikes_cm_connect_error_rate,
                        turboThreshold: 2000,
                        lineWidth: 1
                    }, {
                        name: 'Tune Error Rate',
                        data: spikes_tune_error_rate,
                        turboThreshold: 2000,
                        lineWidth: 1
                    }
                ]
            });
        }

        var drawchart_stacked_stb_error_rates = function() {
            $('#vbo-stb-error-rates').highcharts({
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
    }

    var load_vbo_report_names = function() {
        $.ajax({
            url: '/vbo/get-report-names',
            type: 'POST',
            data: {},
            success: function(result) {
                if (result.status == 'success') {
                    report_names_dates = result.results[0].results
                    console.log(JSON.stringify(report_names_dates))
                    var report_names = []
                    report_names_dates.forEach(function(obj) {
                        report_names.push(obj.report_name)
                    })
                    report_names = _.uniq(report_names);

                    report_names.forEach(function(each) {
                        $('#report_names')
                            .append($("<option></option>")
                                .attr("value", each)
                                .text(each));
                    })

                } else if (result.status == 'session timeout') {
                    alert("Session expired -- Please relogin")
                    document.location.href = "/";
                } else {
                    alert("Unable to get VBO Reports!! Contact Support");
                }
            },
            error: function() {
                alert("Call to searchproduct failed");
            }
        })
    }

    load_vbo_report_names()

    $('#report-submit').on('click', function() {
        if (($('#report_names').val() == 'Pick Your Report') || ($('#report_dates').val() == 'Pick Your Run Date')) {
            alert('Pick your report and run date')
        } else {
            generate_report()
        }
    })

    $('#report_names').on('change', function() {
        var selected = $(this).find("option:selected").val();

        var report_dates = []
        report_names_dates.forEach(function(obj) {
            console.log(obj.name)
            if (obj.report_name == selected) {
                console.log('same == ', obj)
                report_dates.push(obj.report_run_date)
            }

        })
        
        report_dates.forEach(function(each) {
            $('#report_dates')
                .append($("<option></option>")
                    .attr("value", each)
                    .text(each));
        })


    });



})
