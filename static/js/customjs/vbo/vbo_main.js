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
                    alert('comments updated')
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
        report_create_time = moment(x1.report_create_time).format('MMM DD, YYYY');        
        $('#daily-report-date').text(report_create_time)
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


        $('#cdn-setup-total').text(x1.cdn_setup_total.toLocaleString())
        $('#cdn-setup-success').text(100 - x1.cdn_setup_success + '%')
        $('#cdn-setup-error').text(x1.cdn_setup_success + '%')
        $('#cdn-setup-nbr').text(roundoff(x1.cdn_setup_total / x1.non_business_rules_total) + '%')

        $('#cdn-connect-total').text(x1.cdn_connect_total.toLocaleString())
        $('#cdn-connect-success').text(100 - x1.cdn_connect_success + '%')
        $('#cdn-connect-error').text(x1.cdn_connect_success + '%')
        $('#cdn-connect-nbr').text(roundoff(x1.cdn_connect_total / x1.non_business_rules_total) + '%')

        $('#cdn-total').text((x1.cdn_setup_total + x1.cdn_connect_total).toLocaleString())
        // $('#cdn-nbr').text(($('#cdn-connect-nbr').val() + $('#cdn-setup-nbr').val()).toLocaleString())
        $('#cdn-nbr').text(roundoff(x1.cdn_setup_total / x1.non_business_rules_total) + roundoff(x1.cdn_connect_total / x1.non_business_rules_total) + '%')

        $('#net-total').text(x1.net_total.toLocaleString())
        $('#net-success').text(100 - x1.net_success + '%')
        $('#net-error').text(x1.net_success + '%')
        $('#net-nbr').text(roundoff(x1.net_total / x1.non_business_rules_total) + '%')

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

        $('#field-total').text((x1.field_plant_total + x1.video_total + x1.tune_total).toLocaleString())


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

    var generate_daily_report = function() {

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
                    	spikes_categories.push(moment(obj.report_create_time).format('MM/DD/YYYY HH:mm') )
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
                    min: 0,
                    max: 5,
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
                    turboThreshold: 2000 // to accept point object configuration
                }],
                xAxis: {
                    categories: spikes_categories,
                    tickInterval: 60,
                },
                yAxis: {
                    title: {
                        text: 'National QAM VOD Error Rate'
                    },
                    min: 0,
                    max: 5,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }],
                    labels:{
                        format : '{value} %'
                    }
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
                    name: 'VLQOK Errors',
                    data: vlqok_errors_rate
                }, {
                	name: 'CM_CONNECT Errors',
                    data: cm_connect_errors_rate
                    
                }, {
                	name: 'Tune Errors',
                    data: tune_errors_rate
                }, {
                    name: 'VCP Errors',
                    data: vcp_errors_rate
                }, {
                	name: 'Network Teardown Errors',
                    data: network_teardown_errors_rate
                }, {
                    name: 'CDN Setup Errors',
                    data: cdn_setup_errors_rate
                }, {
                	name: 'Plant Errors',
                    data: plant_errors_rate

                }, {
                    name: 'UDB Errors',
                    data: udb_errors_rate

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
                    report_names_and_dates = result.results[0].results
                    console.log(JSON.stringify(report_names_and_dates))
                    var report_names = []
                    report_names_and_dates.forEach(function(obj) {
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
        	if ($('#report_names').val() == 'Weekly Errors Report'){
        		generate_weekly_report()
        	}else{
            	generate_daily_report()
        	}
        }
    })

    $('#report_names').on('change', function() {
        var selected = $(this).find("option:selected").val();
        var report_dates = []
        console.log('report_names_and_dates == ', JSON.stringify(report_names_and_dates))
        report_names_and_dates.forEach(function(obj) {
            if (obj.report_name == selected) {
                report_dates.push(obj.report_run_date + '&&&&' + obj.id)
            }
        })
        console.log('report_dates == ', JSON.stringify(report_dates))
        $('#report_dates').empty();
        report_dates.forEach(function(each) {
        	console.log('each == ' + each)
        	console.log('each-length == ' + each.length)
        	each = each.split('&&&&')
            $('#report_dates')
                .append($("<option></option>")
                    .attr("value", each[0])
                    .attr("name", each[1])
                    .text(each[0]));
        })

    });

    var set_summary_weekly = function(x1) {
        //report_create_time = moment.utc(x1.report_create_time).format('MMM DD, YYYY');        
        // alert(x1.report_create_time)
        report_create_time = moment(x1.report_create_time).format('MMM DD, YYYY');        
        // dateFrom = moment().subtract(7,'d').format('YYYY-MM-DD');
        // alert(dateFrom)
        $('#report-date').text(report_create_time)
        console.log('total == ', x1.successful_setup_total.toLocaleString())
        $('#monthly-successful-setup-total').text(x1.successful_setup_total.toLocaleString())

        $('#monthly-business-rules-total').text(x1.business_rules_total.toLocaleString())
        $('#monthly-business-rules-success').text(100 - x1.business_rules_success + '%')
        $('#monthly-business-rules-error').text(x1.business_rules_success + '%')

        $('#monthly-non-business-rules-total').text(x1.non_business_rules_total.toLocaleString())
        $('#monthly-non-business-rules-success').text(100 - x1.non_business_rules_success + '%')
        $('#monthly-non-business-rules-error').text(x1.non_business_rules_success + '%')


        $('#monthly-udb-total').text(x1.udb_total.toLocaleString())
        $('#monthly-udb-success').text(100 - x1.udb_success + '%')
        $('#monthly-udb-error').text(x1.udb_success + '%')
        $('#monthly-udb-nbr').text(roundoff(x1.udb_total / x1.non_business_rules_total) + '%')

        $('#monthly-cdn-total').text((x1.cdn_setup_total + x1.cdn_connect_total).toLocaleString())
        $('#monthly-cdn-nbr').text(roundoff((x1.cdn_setup_total + x1.cdn_connect_total) / x1.non_business_rules_total) + '%')

        $('#monthly-cdn-setup-total').text(x1.cdn_setup_total.toLocaleString())
        $('#monthly-cdn-setup-success').text(100 - x1.cdn_setup_success + '%')
        $('#monthly-cdn-setup-error').text(x1.cdn_setup_success + '%')
        $('#monthly-cdn-setup-nbr').text(roundoff(x1.cdn_setup_total / x1.non_business_rules_total) + '%')

        $('#monthly-cdn-connect-total').text(x1.cdn_connect_total.toLocaleString())
        $('#monthly-cdn-connect-success').text(100 - x1.cdn_connect_success + '%')
        $('#monthly-cdn-connect-error').text(x1.cdn_connect_success + '%')
        $('#monthly-cdn-connect-nbr').text(roundoff(x1.cdn_connect_total / x1.non_business_rules_total) + '%')

        $('#monthly-net-total').text(x1.net_total.toLocaleString())
        $('#monthly-net-success').text(100 - x1.net_success + '%')
        $('#monthly-net-error').text(x1.net_success + '%')
        $('#monthly-net-nbr').text(roundoff(x1.net_total / x1.non_business_rules_total) + '%')

        

        $('#monthly-field-plant-total').text(x1.field_plant_total.toLocaleString())
        $('#monthly-field-plant-success').text(100 - x1.field_plant_success + '%')
        $('#monthly-field-plant-error').text(x1.field_plant_success + '%')
        $('#monthly-field-plant-nbr').text(roundoff(x1.field_plant_total / x1.non_business_rules_total) + '%')

        $('#monthly-video-total').text(x1.video_total.toLocaleString())
        $('#monthly-video-success').text(100 - x1.video_success + '%')
        $('#monthly-video-error').text(x1.video_success + '%')
        $('#monthly-video-nbr').text(roundoff(x1.video_total / x1.non_business_rules_total) + '%')

        $('#monthly-tune-total').text(x1.tune_total.toLocaleString())
        $('#monthly-tune-success').text(100 - x1.tune_success + '%')
        $('#monthly-tune-error').text(x1.tune_success + '%')
        $('#monthly-tune-nbr').text(roundoff(x1.tune_total / x1.non_business_rules_total) + '%')

        $('#monthly-field-total').text((x1.field_plant_total + x1.video_total + x1.tune_total).toLocaleString())
        $('#monthly-field-nbr').text(
            (roundoff(x1.field_plant_total / x1.non_business_rules_total)
            + roundoff(x1.video_total / x1.non_business_rules_total)
            + roundoff(x1.tune_total / x1.non_business_rules_total) ) + '%'
            )

        $('#monthly-vcp-total').text(x1.vcp_total.toLocaleString())
        $('#monthly-vcp-success').text(100 - x1.vcp_success + '%')
        $('#monthly-vcp-error').text(x1.vcp_success + '%')
        $('#monthly-vcp-nbr').text(roundoff(x1.vcp_total / x1.non_business_rules_total) + '%')

        $('#monthly-other-setup-total').text(x1.other_setup_total.toLocaleString())
        $('#monthly-other-setup-success').text(100 - x1.other_setup_success + '%')
        $('#monthly-other-setup-error').text(x1.other_setup_success + '%')
        $('#monthly-other-setup-nbr').text(roundoff(x1.other_setup_total / x1.non_business_rules_total) + '%') + '%'

        $('#monthly-x1-stb-nbr-rate').text(x1.x1_stb_nbr_rates + '%')
        $('#monthly-legacy-stb-nbr-rate').text(x1.legacy_stb_nbr_rates + '%')
        $('#monthly-national-stb-nbr-rate').text(x1.national_stb_nbr_rates + '%')
        
        $('#setup-timing-50th-ve1').text(Math.round(x1['qry-1']['avg_50th_ve1_pc']))
        $('#setup-timing-50th-ve2').text(Math.round(x1['qry-1']['avg_50th_ve2_pc']))
        $('#setup-timing-50th-ve3').text(Math.round(x1['qry-1']['avg_50th_ve3_pc']))
        $('#setup-timing-50th-ve4').text(Math.round(x1['qry-1']['avg_50th_ve4_pc']))
        $('#setup-timing-50th-vw1').text(Math.round(x1['qry-1']['avg_50th_vw1_pc']))
        $('#setup-timing-50th-vw2').text(Math.round(x1['qry-1']['avg_50th_vw2_pc']))
        $('#setup-timing-50th-vw3').text(Math.round(x1['qry-1']['avg_50th_vw3_pc']))
        $('#setup-timing-50th-vw4').text(Math.round(x1['qry-1']['avg_50th_vw4_pc']))

        $('#setup-timing-50th-national').text(Math.round(
            (Math.round(x1['qry-1']['avg_50th_ve1_pc'])
            +Math.round(x1['qry-1']['avg_50th_ve2_pc'])
            +Math.round(x1['qry-1']['avg_50th_ve3_pc'])
            +Math.round(x1['qry-1']['avg_50th_ve4_pc'])
            +Math.round(x1['qry-1']['avg_50th_vw1_pc'])
            +Math.round(x1['qry-1']['avg_50th_vw2_pc'])
            +Math.round(x1['qry-1']['avg_50th_vw3_pc'])
            +Math.round(x1['qry-1']['avg_50th_vw4_pc'])) /8))

        $('#setup-timing-99th-ve1').text(Math.round(x1['qry-1']['avg_99th_ve1_pc']))
        $('#setup-timing-99th-ve2').text(Math.round(x1['qry-1']['avg_99th_ve2_pc']))
        $('#setup-timing-99th-ve3').text(Math.round(x1['qry-1']['avg_99th_ve3_pc']))
        $('#setup-timing-99th-ve4').text(Math.round(x1['qry-1']['avg_99th_ve4_pc']))
        $('#setup-timing-99th-vw1').text(Math.round(x1['qry-1']['avg_99th_vw1_pc']))
        $('#setup-timing-99th-vw2').text(Math.round(x1['qry-1']['avg_99th_vw2_pc']))
        $('#setup-timing-99th-vw3').text(Math.round(x1['qry-1']['avg_99th_vw3_pc']))
        $('#setup-timing-99th-vw4').text(Math.round(x1['qry-1']['avg_99th_vw4_pc']))

        $('#setup-timing-99th-national').text(Math.round(
            (Math.round(x1['qry-1']['avg_99th_ve1_pc'])
            +Math.round(x1['qry-1']['avg_99th_ve2_pc'])
            +Math.round(x1['qry-1']['avg_99th_ve3_pc'])
            +Math.round(x1['qry-1']['avg_99th_ve4_pc'])
            +Math.round(x1['qry-1']['avg_99th_vw1_pc'])
            +Math.round(x1['qry-1']['avg_99th_vw2_pc'])
            +Math.round(x1['qry-1']['avg_99th_vw3_pc'])
            +Math.round(x1['qry-1']['avg_99th_vw4_pc'])) /8))

        $('#setup-timing-max-ve1').text(Math.round(x1['qry-2']['max_ve1']).toString().toLocaleString())
        $('#setup-timing-max-ve2').text(Math.round(x1['qry-2']['max_ve2']).toString().toLocaleString())
        $('#setup-timing-max-ve3').text(Math.round(x1['qry-2']['max_ve3']).toString().toLocaleString())
        $('#setup-timing-max-ve4').text(Math.round(x1['qry-2']['max_ve4']).toString().toLocaleString())
        $('#setup-timing-max-vw1').text(Math.round(x1['qry-2']['max_vw1']).toString().toLocaleString())
        $('#setup-timing-max-vw2').text(Math.round(x1['qry-2']['max_vw2']).toString().toLocaleString())
        $('#setup-timing-max-vw3').text(Math.round(x1['qry-2']['max_vw3']).toString().toLocaleString())
        $('#setup-timing-max-vw4').text(Math.round(x1['qry-2']['max_vw4']).toString().toLocaleString())
        $('#setup-timing-max-national').text(Math.round(x1['qry-2']['max_all']).toString().toLocaleString())


        return;
    }

    var generate_weekly_report = function(){
    	$('#weekly-div').show()
    	$('#animation,#animation-space').hide()
    	$('#daily-div').hide()
    	
    	$.ajax({
            url: '/vbo/monthly/report-1/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
            	console.log('monthly report-1 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_1))
                    x1 = result.results.report_1
                    console.log('x1 ==',x1)
                    set_summary_weekly(x1)
         
        }
    }})

    }
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  		var target = $(e.target).attr("href") // activated tab
  		alert(target);
  		if (target == '#weekly-report-2'){
  			show_weekly_report_2()
  		}else if (target == '#weekly-report-3') {
  			show_weekly_report_3()
  		}
  		else if (target == '#weekly-report-4') {
  			show_weekly_report_4()
  		}
  		else if (target == '#weekly-report-5') {
  			show_weekly_report_5()
  		}
  		else if (target == '#weekly-report-6') {
  			show_weekly_report_6()
  		}
  		else if (target == '#weekly-report-7') {
  			show_weekly_report_7()
  		}
        else if (target == '#weekly-report-8') {
            show_weekly_report_8()
        }
        else if (target == '#weekly-report-9') {
            show_weekly_report_9()
        }
        else if (target == '#weekly-report-10') {
            show_weekly_report_10()
        }
        else if (target == '#weekly-report-11') {
            show_weekly_report_11()
        }
  		else if (target == '#weekly-report-14') {
  			alert('report-14')
  			show_weekly_report_14()
  		}
  		else if (target == '#weekly-report-15') {
  			alert('report-15')
  			show_weekly_report_15()
  		}
        else if (target == '#weekly-report-16') {
            alert('report-16')
            show_weekly_report_16()
        }
        else if (target == '#weekly-report-17') {
            alert('report-17')
            show_weekly_report_17()
        }
  		
	});

    var show_weekly_report_2 = function(){
    	
    	$.ajax({
            url: '/vbo/monthly/report-2/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
            	console.log('monthly report-2 result == ', result)
                if (result.status == 'success') {
                    // console.log('chart results == ', JSON.stringify(result.results.report_2))
                    report_2 = result.results.report_2
                    report_2_weekly_categories = []
                    report_2_weekly_br_denial_rate = []
                    report_2_weekly_vlqok_error_rate = []
                    report_2_weekly_udb_error_rate = []
                    report_2_weekly_vcp_error_rate = []
                    report_2_weekly_plant_error_rate = []
                    report_2_weekly_networkresourcefailure_error_rate = []
                    report_2_weekly_cdn_setup_error_rate = []
                    report_2_weekly_cm_connect_error_rate = []
                    report_2_weekly_tune_error_rate = []

                    report_2.forEach(function(obj) {
                        report_2_weekly_categories.push(obj.report_create_time)
                        report_2_weekly_br_denial_rate.push(obj.br_denial_rate)
                        report_2_weekly_vlqok_error_rate.push(obj.vlqok_error_rate)
                        report_2_weekly_udb_error_rate.push(obj.udb_error_rate)
                        report_2_weekly_vcp_error_rate.push(obj.vcp_error_rate)
                        report_2_weekly_plant_error_rate.push(obj.plant_error_rate)
                        report_2_weekly_networkresourcefailure_error_rate.push(obj.networkresourcefailure_rate)
                        report_2_weekly_cdn_setup_error_rate.push(obj.cdn_setup_error_rate)
                        report_2_weekly_cm_connect_error_rate.push(obj.cm_connect_error_rate)
                        report_2_weekly_tune_error_rate.push(obj.tune_error_rate)
                    })
                    drawchart_weekly_report_2()
        }
    }
	})}

    var drawchart_weekly_report_2 = function() {
    		console.log("report_2_weekly_categories == ", JSON.stringify(report_2_weekly_categories))
    		console.log("report_2_weekly_br_denial_rate == ", JSON.stringify(report_2_weekly_vlqok_error_rate))
            $('#weekly-report-2').highcharts({
                title: {
                    text: '',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                series: [{
                    turboThreshold: 12000 // to accept point object configuration
                }],
                xAxis: {
                    categories: report_2_weekly_categories,
                    tickInterval: 180,
                },
                yAxis: {
                	max: 5,
                    title: {
                        text: 'National QAM VOD Error Rate'
                    },                    
                    tickInterval: 1,
                    labels:{
                    	format : '{value} %'
                    }
              	//       labels: {
			           //  formatter:function() {
			           //      var pcnt = (this.value / dataSum) * 100;
			           //      return Highcharts.numberFormat(pcnt,0,',') + '%';
            		// }}
                },
                tooltip: {
                    valueSuffix: ''
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
                        data: report_2_weekly_br_denial_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'VLQOK Error Rate',
                        data: report_2_weekly_vlqok_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'UDB Error Rate',
                        data: report_2_weekly_udb_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'VCP Error Rate',
                        data: report_2_weekly_vcp_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'Plant Error Rate',
                        data: report_2_weekly_plant_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'NetworkResourceFailure Rate',
                        data: report_2_weekly_networkresourcefailure_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'CDN Setup Error Rate',
                        data: report_2_weekly_cdn_setup_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'CM Connect Error Rate',
                        data: report_2_weekly_cm_connect_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'Tune Error Rate',
                        data: report_2_weekly_tune_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }
                ]
            });
        }

    var show_weekly_report_3 = function(){
    	alert('show_weekly_report_3()')
    	
    	$.ajax({
            url: '/vbo/monthly/report-3/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
            	console.log('monthly report-3 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_3))
                    spikes = result.results.report_3
                    spikes_weekly_date_time = []
                    spikes_weekly_ve1 = []
                    spikes_weekly_ve2 = []
                    spikes_weekly_ve3 = []
                    spikes_weekly_ve4 = []
                    spikes_weekly_vw1 = []
                    spikes_weekly_vw2 = []
                    spikes_weekly_vw3 = []
                    spikes_weekly_vw4 = []                    
                    // spikes_categories.push(moment(obj.report_create_time).format('MM/DD/YYYY HH:mm') )
                    spikes.forEach(function(obj) {
                        spikes_weekly_date_time.push(moment(obj.report_create_time).format('MM/DD/YYYY HH:mm'))
                        spikes_weekly_ve1.push(obj.ve1)
                        spikes_weekly_ve2.push(obj.ve2)
                        spikes_weekly_ve3.push(obj.ve3)
                        spikes_weekly_ve4.push(obj.ve4)
                        spikes_weekly_vw1.push(obj.vw1)
                        spikes_weekly_vw2.push(obj.vw2)
                        spikes_weekly_vw3.push(obj.vw3)
                        spikes_weekly_vw4.push(obj.vw4)
                    })
                    drawchart_weekly_report_3()
        }
    }
	})}

   	var drawchart_weekly_report_3 = function() {
   		alert('drawchart_weekly_report_3')
   		console.log('spikes_weekly_date_time == ', spikes_weekly_date_time)
            $('#weekly-report-3').highcharts({
                title: {
                    text: 'Simultaneous Session Graph',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                series: [{
                    turboThreshold: 12000 // to accept point object configuration
                }],
                xAxis: {
                    categories: spikes_weekly_date_time,
                    tickInterval: 40,
                },
                yAxis: {
                    title: {
                        text: 'Number of Simultaneous Sessions'
                    },
                    tickInterval: 20000,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: ''
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
                        name: 'VE1 Simultaneous Sessions',
                        data: spikes_weekly_ve1,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VE2 Simultaneous Sessions',
                        data: spikes_weekly_ve2,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VE3 Simultaneous Sessions',
                        data: spikes_weekly_ve3,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VE4 Simultaneous Sessions',
                        data: spikes_weekly_ve4,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VW1 Simultaneous Sessions',
                        data: spikes_weekly_vw1,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VW2 Simultaneous Sessions',
                        data: spikes_weekly_vw2,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VW3 Simultaneous Sessions',
                        data: spikes_weekly_vw3,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VW4 Simultaneous Sessions',
                        data: spikes_weekly_vw4,
                        turboThreshold: 12000,
                        lineWidth: 1
                    } 
                ]
            });
        }

        var show_weekly_report_4 = function(){
    	alert('show_weekly_report_4()')
    	
    	$.ajax({
            url: '/vbo/monthly/report-4/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
            	console.log('monthly report-4 result == ', result)
                if (result.status == 'success') {
                    // console.log('chart results == ', JSON.stringify(result.results.report_4))
                    spikes = result.results.report_4
                    spikes_weekly_date_time = []
                    spikes_weekly_99th_rtime_sessiondhtclientimpl_persist  = []
                    // spikes_weekly_99th_rtime_setup_js = []
                    spikes_weekly_99th_rtime_expandplaylist = []
                    spikes_weekly_99th_rtime_setupermsession = []
                    spikes_weekly_99th_rtime_setupodrmsession = []
                    spikes_weekly_99th_rtime_sessionpersistenceservice_getsettopstatus = []
                    spikes_weekly_99th_rtime_udbservice_validateplayeligibility = []
                    spikes_weekly_99th_rtime_getsoplist = []                    
                    // spikes_weekly_99th_rtime_teardown_js = []                    

                    spikes.forEach(function(obj) {
                        spikes_weekly_date_time.push(moment(obj.report_create_time).format('MM/DD/YYYY HH:mm'))
                        spikes_weekly_99th_rtime_sessiondhtclientimpl_persist.push(obj['99th_rtime_sessiondhtclientimpl_persist'])
                        // spikes_weekly_99th_rtime_setup_js.push(obj['99th_rtime_setup_js'])
                        spikes_weekly_99th_rtime_expandplaylist.push(obj['99th_rtime_expandplaylist'])
                        spikes_weekly_99th_rtime_setupermsession.push(obj['99th_rtime_setupermsession'])
                        spikes_weekly_99th_rtime_setupodrmsession.push(obj['99th_rtime_setupodrmsession'])
                        spikes_weekly_99th_rtime_sessionpersistenceservice_getsettopstatus.push(obj['99th_rtime_sessionpersistenceservice_getsettopstatus'])
                        spikes_weekly_99th_rtime_udbservice_validateplayeligibility.push(obj['99th_rtime_udbservice_validateplayeligibility'])
                        spikes_weekly_99th_rtime_getsoplist.push(obj['99th_rtime_getsoplist'])
                        // spikes_weekly_99th_rtime_teardown_js.push(obj['99th_rtime_getsoplist'])
                    })
                    console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_sessiondhtclientimpl_persist))
                    console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_expandplaylist))
                    console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_setupermsession))
                    console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_setupodrmsession))
                    console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_sessionpersistenceservice_getsettopstatus))
                    console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_udbservice_validateplayeligibility))
                    console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_getsoplist))
                    drawchart_weekly_report_4()
        }
    }
	})}

   	var drawchart_weekly_report_4 = function() {
   		alert('drawchart_weekly_report')
   		console.log('spikes_weekly_date_time == ', spikes_weekly_date_time)
            $('#weekly-report-4').highcharts({
                title: {
                    text: '99th Percentile Workflow Setup Time',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                series: [{
                    turboThreshold: 12000 // to accept point object configuration
                }],
                xAxis: {
                    categories: spikes_weekly_date_time,
                    tickInterval: 4,
                },
                yAxis: {
                    title: {
                        text: 'Time in MilliSeconds'
                    },
                    max:4000,
                    tickInterval:500,
                    // plotLines: [{
                    //     value: 0,
                    //     width: 1,
                    //     color: '#808080'
                    // }]
                },
                tooltip: {
                    valueSuffix: ''
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
                        name: '99th% Response Time: SessionDHTClientImpl.persist',
                        data: spikes_weekly_99th_rtime_sessiondhtclientimpl_persist,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }                     
                    , {
                        name: '99th% Response Time: ExpandPlayList',
                        data: spikes_weekly_99th_rtime_expandplaylist,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th% Response Time: SetupERMSession',
                        data: spikes_weekly_99th_rtime_setupermsession,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th% Response Time: SetupODRMSession',
                        data: spikes_weekly_99th_rtime_setupodrmsession,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th% Response Time: SessionPersistenceService.getSettopStatus',
                        data: spikes_weekly_99th_rtime_sessionpersistenceservice_getsettopstatus,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th% Response Time: UDB Service validate play eligibility',
                        data: spikes_weekly_99th_rtime_udbservice_validateplayeligibility,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th% Response Time: GetSopList',
                        data: spikes_weekly_99th_rtime_getsoplist,
                        turboThreshold: 12000,
                        lineWidth: 1
                    },                     
                ]
            });
        }


        var show_weekly_report_5 = function(){
    	alert('show_weekly_report_5()')
    	
    	$.ajax({
            url: '/vbo/monthly/report-5/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
            	console.log('monthly report-5 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_5))
                    spikes = result.results.report_5
                    spikes_weekly_date_time = []
                    spikes_weekly_50th_rtime_sessiondhtclientimpl_persist  = []
                    spikes_weekly_50th_rtime_setup_js = []
                    spikes_weekly_50th_rtime_expandplaylist = []
                    spikes_weekly_50th_rtime_setupermsession = []
                    spikes_weekly_50th_rtime_setupodrmsession = []
                    spikes_weekly_50th_rtime_sessionpersistenceservice_getsettopstatus = []
                    spikes_weekly_50th_rtime_udbservice_validateplayeligibility = []
                    spikes_weekly_50th_rtime_getsoplist = []                    
                    spikes_weekly_50th_rtime_teardown_js = []                    

                    spikes.forEach(function(obj) {
                        spikes_weekly_date_time.push(moment(obj.report_time).format('MM/DD/YYYY HH:mm'))
                        spikes_weekly_50th_rtime_sessiondhtclientimpl_persist.push(obj['50th_rtime_sessiondhtclientimpl_persist'])
                        spikes_weekly_50th_rtime_setup_js.push(obj['50th_rtime_setup_js'])
                        spikes_weekly_50th_rtime_expandplaylist.push(obj['50th_rtime_playlist_engine_pc'])
                        spikes_weekly_50th_rtime_setupermsession.push(obj['50th_rtime_erm_setup_pc'])
                        spikes_weekly_50th_rtime_setupodrmsession.push(obj['50th_rtime_odrm_setup_pc'])
                        spikes_weekly_50th_rtime_sessionpersistenceservice_getsettopstatus.push(obj['50th_rtime_sessionpersistenceservice_getsettopstatus'])
                        spikes_weekly_50th_rtime_udbservice_validateplayeligibility.push(obj['50th_rtime_udb_trsetup'])
                        spikes_weekly_50th_rtime_getsoplist.push(obj['50th_rtime_getsoplist'])
                        spikes_weekly_50th_rtime_teardown_js.push(obj['50th_rtime_getsoplist'])
                    })
                    console.log('chart results == ', JSON.stringify(spikes_weekly_date_time))
                    drawchart_weekly_report_5()
        }
    }
	})}

   	var drawchart_weekly_report_5 = function() {
   		alert('drawchart_weekly_report')
   		console.log('spikes_weekly_date_time == ', spikes_weekly_date_time)
            $('#weekly-report-5').highcharts({
                title: {
                    text: '50th Percentile Workflow Setup Time',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                series: [{
                    turboThreshold: 12000 // to accept point object configuration
                }],
                xAxis: {
                    categories: spikes_weekly_date_time,
                    tickInterval: 6,
                },
                yAxis: {
                    title: {
                        text: 'Time in MilliSeconds'
                    },                    
                },
                tooltip: {
                    valueSuffix: ''
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
                        name: '50th% Response Time: Playlist Engine',
                        data: spikes_weekly_50th_rtime_expandplaylist,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '50th% Response Time: ERM Setup',
                        data: spikes_weekly_50th_rtime_setupermsession,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '50th% Response Time: ODRM Setup',
                        data: spikes_weekly_50th_rtime_setupodrmsession,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '50th% Response Time: UDB Setup',
                        data: spikes_weekly_50th_rtime_udbservice_validateplayeligibility,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, 
                    


                ]
            });
        }


	    var show_weekly_report_6 = function(){
    	alert('show_weekly_report_6()')
    	
    	$.ajax({
            url: '/vbo/monthly/report-6/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
            	console.log('monthly report-6 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_6))
                    spikes = result.results.report_6
                    spikes_weekly_date_time = []
                    spikes_weekly_ve1 = []
                    spikes_weekly_ve2 = []
                    spikes_weekly_ve3 = []
                    spikes_weekly_ve4 = []
                    spikes_weekly_vw1 = []
                    spikes_weekly_vw2 = []
                    spikes_weekly_vw3 = []
                    spikes_weekly_vw4 = []                    

                    spikes.forEach(function(obj) {
                        spikes_weekly_date_time.push(moment(obj.report_date).format('MM/DD/YYYY HH:mm'))
                        spikes_weekly_ve1.push(obj['99th_ve1_pc'])
                        spikes_weekly_ve2.push(obj['99th_ve2_pc'])
                        spikes_weekly_ve3.push(obj['99th_ve3_pc'])
                        spikes_weekly_ve4.push(obj['99th_ve4_pc'])
                        spikes_weekly_vw1.push(obj['99th_vw1_pc'])
                        spikes_weekly_vw2.push(obj['99th_vw2_pc'])
                        spikes_weekly_vw3.push(obj['99th_vw3_pc'])
                        spikes_weekly_vw4.push(obj['99th_vw4_pc'])
                    })
                    drawchart_weekly_report_6()
        }
    }
	})}

   	var drawchart_weekly_report_6 = function() {
   		alert('drawchart_weekly_report_6')
   		console.log('spikes_weekly_date_time == ', spikes_weekly_date_time)
            $('#weekly-report-6').highcharts({
                title: {
                    text: '',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                series: [{
                    turboThreshold: 12000 // to accept point object configuration
                }],
                xAxis: {
                    categories: spikes_weekly_date_time,
                    tickInterval: 3,
                },
                yAxis: {
                    title: {
                        text: 'Time in MilliSeconds'
                    },
                    min: 50,
                    tickInterval: 500,
                    max: 5000                    
                ,
                tooltip: {
                    valueSuffix: ''
                }}
                ,
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [
                    {
                        name: '99th%:ve1',
                        data: spikes_weekly_ve1,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th%:ve2',
                        data: spikes_weekly_ve2,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th%:ve3',
                        data: spikes_weekly_ve3,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th%:ve4',
                        data: spikes_weekly_ve4,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th%:vw1',
                        data: spikes_weekly_vw1,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th%:vw2',
                        data: spikes_weekly_vw2,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th%:vw3',
                        data: spikes_weekly_vw3,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th%:vw4',
                        data: spikes_weekly_vw4,
                        turboThreshold: 12000,
                        lineWidth: 1
                    } 
                ]
            });
        }

        var show_weekly_report_7 = function(){
        alert('show_weekly_report_7()')
        
        $.ajax({
            url: '/vbo/monthly/report-7/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-7 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_7))
                    report_7 = result.results.report_7
                    report_7_weekly_date_time = []
                    report_7_weekly_ve1 = []
                    report_7_weekly_ve2 = []
                    report_7_weekly_ve3 = []
                    report_7_weekly_ve4 = []
                    report_7_weekly_vw1 = []
                    report_7_weekly_vw2 = []
                    report_7_weekly_vw3 = []
                    report_7_weekly_vw4 = []                    

                    report_7.forEach(function(obj) {
                        report_7_weekly_date_time.push(moment(obj.report_date).format('MM/DD/YYYY'))
                        report_7_weekly_ve1.push(obj['50th_ve1_pc'])
                        report_7_weekly_ve2.push(obj['50th_ve2_pc'])
                        report_7_weekly_ve3.push(obj['50th_ve3_pc'])
                        report_7_weekly_ve4.push(obj['50th_ve4_pc'])
                        report_7_weekly_vw1.push(obj['50th_vw1_pc'])
                        report_7_weekly_vw2.push(obj['50th_vw2_pc'])
                        report_7_weekly_vw3.push(obj['50th_vw3_pc'])
                        report_7_weekly_vw4.push(obj['50th_vw4_pc'])
                    })
                    drawchart_weekly_report_7()
        }
    }
    })}

    var drawchart_weekly_report_7 = function() {
        alert('drawchart_weekly_report_7')
        console.log('spikes_weekly_date_time == ', report_7_weekly_date_time)
            $('#weekly-report-7').highcharts({
                title: {
                    text: '',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                series: [{
                    turboThreshold: 12000 // to accept point object configuration
                }],
                xAxis: {
                    categories: report_7_weekly_date_time,
                    tickInterval: 3,
                },
                yAxis: {
                    title: {
                        text: 'Time in MilliSeconds'
                    },
                    min: 500,
                    tickInterval: 50,
                    max: 1000                    
                ,
                tooltip: {
                    valueSuffix: ''
                }}
                ,
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [
                    {
                        name: 'VE1 50th% Setup Time',
                        data: report_7_weekly_ve1,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VE2 50th% Setup Time',
                        data: report_7_weekly_ve2,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VE3 50th% Setup Time',
                        data: report_7_weekly_ve3,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VE4 50th% Setup Time',
                        data: report_7_weekly_ve4,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'Vw1 50th% Setup Time',
                        data: report_7_weekly_vw1,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'Vw2 50th% Setup Time',
                        data: report_7_weekly_vw2,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'Vw3 50th% Setup Time',
                        data: report_7_weekly_vw3,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'Vw4 50th% Setup Time',
                        data: report_7_weekly_vw4,
                        turboThreshold: 12000,
                        lineWidth: 1
                    } 
                ]
            });
        }

        var show_weekly_report_8 = function(){
        alert('show_weekly_report_8()')
        
        $.ajax({
            url: '/vbo/monthly/report-8/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-8 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_8))
                    report_8 = result.results.report_8
                    report_8_weekly_categories = []
                    report_8_weekly_nbr_error_rate = []
                    report_8_weekly_br_denial_rate = []
                    report_8_weekly_vlqok_error_rate = []
                    report_8_weekly_udb_error_rate = []
                    report_8_weekly_vcp_error_rate = []
                    report_8_weekly_plant_error_rate = []
                    report_8_weekly_networkresourcefailure_error_rate = []
                    report_8_weekly_cdn_setup_error_rate = []
                    report_8_weekly_cm_connect_error_rate = []
                    report_8_weekly_tune_error_rate = []

                    report_8.forEach(function(obj) {
                        report_8_weekly_categories.push(moment(obj.report_create_time).format('DD MMM YYYY'))
                        report_8_weekly_nbr_error_rate.push(obj.nbr_error_rate)
                        report_8_weekly_br_denial_rate.push(obj.br_denial_rate)
                        report_8_weekly_vlqok_error_rate.push(obj.vlqok_error_rate)
                        report_8_weekly_udb_error_rate.push(obj.udb_error_rate)
                        report_8_weekly_vcp_error_rate.push(obj.vcp_error_rate)
                        report_8_weekly_plant_error_rate.push(obj.plant_error_rate)
                        report_8_weekly_networkresourcefailure_error_rate.push(obj.networkresourcefailure_rate)
                        report_8_weekly_cdn_setup_error_rate.push(obj.cdn_setup_error_rate)
                        report_8_weekly_cm_connect_error_rate.push(obj.cm_connect_error_rate)
                        report_8_weekly_tune_error_rate.push(obj.tune_error_rate)
                    })
                    drawchart_weekly_report_8()
        }
    }
    })}

    var drawchart_weekly_report_8 = function() {
            console.log("report_2_weekly_categories == ", JSON.stringify(report_8_weekly_categories))
            console.log("report_2_weekly_br_denial_rate == ", JSON.stringify(report_8_weekly_vlqok_error_rate))
            $('#weekly-report-8').highcharts({
                title: {
                    text: '',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                series: [{
                    turboThreshold: 12000 // to accept point object configuration
                }],
                xAxis: {
                    categories: report_8_weekly_categories,
                    // tickInterval: 180,
                },
                yAxis: {
                    max: 10,                    
                    title: {
                        text: 'National QAM VOD Error Rate'
                    },                    
                    tickInterval: 1,
                    labels:{
                        format : '{value} %'
                    }
                //       labels: {
                       //  formatter:function() {
                       //      var pcnt = (this.value / dataSum) * 100;
                       //      return Highcharts.numberFormat(pcnt,0,',') + '%';
                    // }}
                },
                tooltip: {
                    valueSuffix: ''
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
                        data: report_8_weekly_br_denial_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'NBR Error Rate',
                        data: report_8_weekly_nbr_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'VLQOK Error Rate',
                        data: report_8_weekly_vlqok_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'UDB Error Rate',
                        data: report_8_weekly_udb_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'VCP Error Rate',
                        data: report_8_weekly_vcp_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'Plant Error Rate',
                        data: report_8_weekly_plant_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'NetworkResourceFailure Rate',
                        data: report_8_weekly_networkresourcefailure_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'CDN Setup Error Rate',
                        data: report_8_weekly_cdn_setup_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'CM Connect Error Rate',
                        data: report_8_weekly_cm_connect_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'Tune Error Rate',
                        data: report_8_weekly_tune_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }
                ]
            });
        }

        var show_weekly_report_9 = function(){
        alert('show_weekly_report_9()')
        
        $.ajax({
            url: '/vbo/monthly/report-9/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-9 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_9))
                    report_9 = result.results.report_9
                    report_9_weekly_categories = []
                    report_9_weekly_nbr_error_rate = []
                    report_9_weekly_br_denial_rate = []
                    report_9_weekly_vlqok_error_rate = []
                    report_9_weekly_udb_error_rate = []
                    report_9_weekly_vcp_error_rate = []
                    report_9_weekly_plant_error_rate = []
                    report_9_weekly_networkresourcefailure_error_rate = []
                    report_9_weekly_cdn_setup_error_rate = []
                    report_9_weekly_cm_connect_error_rate = []
                    report_9_weekly_tune_error_rate = []

                    report_9.forEach(function(obj) {
                        report_9_weekly_categories.push(moment(obj.report_create_time).format('DD MMM YYYY'))
                        report_9_weekly_nbr_error_rate.push(obj.nbr_error_rate)
                        report_9_weekly_br_denial_rate.push(obj.br_denial_rate)
                        report_9_weekly_vlqok_error_rate.push(obj.vlqok_error_rate)
                        report_9_weekly_udb_error_rate.push(obj.udb_error_rate)
                        report_9_weekly_vcp_error_rate.push(obj.vcp_error_rate)
                        report_9_weekly_plant_error_rate.push(obj.plant_error_rate)
                        report_9_weekly_networkresourcefailure_error_rate.push(obj.networkresourcefailure_rate)
                        report_9_weekly_cdn_setup_error_rate.push(obj.cdn_setup_error_rate)
                        report_9_weekly_cm_connect_error_rate.push(obj.cm_connect_error_rate)
                        report_9_weekly_tune_error_rate.push(obj.tune_error_rate)
                    })
                    drawchart_weekly_report_9()
        }
    }
    })}

    var drawchart_weekly_report_9 = function() {
            console.log("report_9_weekly_categories == ", JSON.stringify(report_9_weekly_categories))
            console.log("report_9_weekly_br_denial_rate == ", JSON.stringify(report_9_weekly_vlqok_error_rate))
            $('#weekly-report-9').highcharts({
                title: {
                    text: '',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                series: [{
                    turboThreshold: 12000 // to accept point object configuration
                }],
                xAxis: {
                    categories: report_9_weekly_categories,
                    // tickInterval: 180,
                    // minTickInterval: 3600*24*30
                },
                yAxis: {
                    max: 10,                    
                    title: {
                        text: 'National QAM VOD Error Rate'
                    },                    
                    tickInterval: 1,
                    labels:{
                        format : '{value} %'
                    }
                //       labels: {
                       //  formatter:function() {
                       //      var pcnt = (this.value / dataSum) * 100;
                       //      return Highcharts.numberFormat(pcnt,0,',') + '%';
                    // }}
                },
                tooltip: {
                    valueSuffix: ''
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
                        data: report_9_weekly_br_denial_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'NBR Error Rate',
                        data: report_9_weekly_nbr_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'VLQOK Error Rate',
                        data: report_9_weekly_vlqok_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'UDB Error Rate',
                        data: report_9_weekly_udb_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'VCP Error Rate',
                        data: report_9_weekly_vcp_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'Plant Error Rate',
                        data: report_9_weekly_plant_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'NetworkResourceFailure Rate',
                        data: report_9_weekly_networkresourcefailure_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'CDN Setup Error Rate',
                        data: report_9_weekly_cdn_setup_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'CM Connect Error Rate',
                        data: report_9_weekly_cm_connect_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, {
                        name: 'Tune Error Rate',
                        data: report_9_weekly_tune_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }
                ]
            });
        }

        var show_weekly_report_10 = function(){
        alert('show_weekly_report_10()')
        
        $.ajax({
            url: '/vbo/monthly/report-10/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-10 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_10))
                    report_10= result.results.report_10
                    report_10_weekly_categories = []
                    report_10_weekly_x1_network_error_rate = []
                    report_10_weekly_legacy_network_error_rate = []                    
                    report_10_weekly_x1_tune_error_rate = []
                    report_10_weekly_legacy_tune_error_rate = []                    
                    report_10.forEach(function(obj) {
                        report_10_weekly_categories.push(moment(obj.report_create_time).format('DD MMM YYYY'))
                        report_10_weekly_x1_network_error_rate.push(obj.x1_networkresourcefailure_rate)
                        report_10_weekly_legacy_network_error_rate.push(obj.legacy_networkresourcefailure_rate)
                        
                    })
                    drawchart_weekly_report_10('#report-10-1-weekly','Network Resource Failure Rate',
                        report_10_weekly_x1_network_error_rate,report_10_weekly_legacy_network_error_rate)                    
                    drawchart_weekly_report_10('#report-10-2-weekly','Tune Error Rate',
                        report_10_weekly_x1_network_error_rate,report_10_weekly_legacy_network_error_rate)                    
        }
    }
    })}

    var drawchart_weekly_report_10 = function(id,text,report_10_weekly_x1_network_error_rate,report_10_weekly_legacy_network_error_rate) {            
            $(id).highcharts({
                title: {
                    text: '',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                series: [{
                    turboThreshold: 12000 // to accept point object configuration
                }],
                xAxis: {
                    categories: report_10_weekly_categories,
                    // tickInterval: 180,
                    // minTickInterval: 3600*24*30
                },
                yAxis: {
                    max: .5,                    
                    title: {
                        text: text
                    },                    
                    tickInterval: .1,
                    labels:{
                        format : '{value} %'
                    }
                //       labels: {
                       //  formatter:function() {
                       //      var pcnt = (this.value / dataSum) * 100;
                       //      return Highcharts.numberFormat(pcnt,0,',') + '%';
                    // }}
                },
                tooltip: {
                    valueSuffix: ''
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
                        name: 'X1 Tune Error Rate',
                        data: report_10_weekly_x1_network_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'Legacy Tune Error Rate',
                        data: report_10_weekly_legacy_network_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    },                     
                ]
            });
        }


    var show_weekly_report_11 = function(){
        alert('show_weekly_report_11()')
        
        $.ajax({
            url: '/vbo/monthly/report-11/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-11 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_10))
                    report_11= result.results.report_11
                    report_11_weekly_categories = []
                    report_11_weekly_cm_connect_error_rate = []
                    report_11_weekly_networkresource_failure_error_rate = []                    
                    report_11_weekly_tune_error_rate = []
                    report_11_weekly_vlqok_error_rate = []                    
                    report_11.forEach(function(obj) {
                        report_11_weekly_categories.push(moment(obj.report_create_time).format('DD MMM YYYY'))
                        report_11_weekly_cm_connect_error_rate.push(obj.cm_connect_error_rate)                                                
                        report_11_weekly_networkresource_failure_error_rate.push(obj.networkresourcefailure_rate)                                                
                        report_11_weekly_tune_error_rate.push(obj.tune_error_rate)                                                
                        report_11_weekly_vlqok_error_rate.push(obj.vlqok_error_rate)                                                                        
                    })
                    console.log(report_11_weekly_cm_connect_error_rate)
                    drawchart_weekly_report_11('#weekly-report-11','Daily Error Rate by Category',
                        report_11_weekly_cm_connect_error_rate,report_11_weekly_networkresource_failure_error_rate
                        ,report_11_weekly_tune_error_rate,report_11_weekly_vlqok_error_rate)                    
                    // drawchart_weekly_report_10('#report-10-2-weekly','Tune Error Rate',
                    //     report_10_weekly_x1_network_error_rate,report_10_weekly_legacy_network_error_rate)                    
        }
    }
    })}

    var drawchart_weekly_report_11 = function(id,text,report_10_weekly_x1_network_error_rate,report_10_weekly_legacy_network_error_rate) {            
            $(id).highcharts({
                title: {
                    text: '',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                series: [{
                    turboThreshold: 12000 // to accept point object configuration
                }],
                xAxis: {
                    categories: report_11_weekly_categories,
                    // tickInterval: 180,
                    // minTickInterval: 3600*24*30
                },
                yAxis: {
                    max: .6,                    
                    title: {
                        text: text
                    },                    
                    tickInterval: .1,
                    labels:{
                        format : '{value} %'
                    }
                //       labels: {
                       //  formatter:function() {
                       //      var pcnt = (this.value / dataSum) * 100;
                       //      return Highcharts.numberFormat(pcnt,0,',') + '%';
                    // }}
                },
                tooltip: {
                    valueSuffix: ''
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
                        name: 'NetworkResourceFailure Rate',
                        data: report_11_weekly_networkresource_failure_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'Tune Error Rate',
                        data: report_11_weekly_tune_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    },                     
                    {
                        name: 'CM Connect Error Rate',
                        data: report_11_weekly_cm_connect_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'VLQOK Error Rate',
                        data: report_11_weekly_vlqok_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    },                     
                ]
            });
        }
        var show_weekly_report_14 = function(){
    	alert('show_weekly_report_14()')
    	
    	$.ajax({
            url: '/vbo/monthly/report-14/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
            	console.log('monthly report-14 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_14))
                    report_14 = result.results.report_14
                    report_14_categories = []

                    report_14_x1_udb_errors_rate = []
                    report_14_x1_plant_errors_rate = []
                    report_14_x1_cdn_setup_errors_rate = []
                    report_14_x1_network_teardown_errors_rate = []
                    report_14_x1_vcp_errors_rate = []
                    report_14_x1_tune_errors_rate = []
                    report_14_x1_cm_connect_errors_rate = []
                    report_14_x1_vlqok_errors_rate = []

                    report_14_legacy_categories = []
                    report_14_legacy_udb_errors_rate = []
                    report_14_legacy_plant_errors_rate = []
                    report_14_legacy_cdn_setup_errors_rate = []
                    report_14_legacy_network_teardown_errors_rate = []
                    report_14_legacy_vcp_errors_rate = []
                    report_14_legacy_tune_errors_rate = []
                    report_14_legacy_cm_connect_errors_rate = []
                    report_14_legacy_vlqok_errors_rate = []

                    report_14.forEach(function(obj){
                    	report_14_categories.push(obj.dayname)
                    	report_14_x1_udb_errors_rate.push(obj.x1_udb_error_rate)     
                    	report_14_x1_plant_errors_rate.push(obj.x1_plant_error_rate)
                    	report_14_x1_cdn_setup_errors_rate.push(obj.x1_cdn_setup_error_rate)
                    	report_14_x1_network_teardown_errors_rate.push(obj.x1_network_teardown_error_rate)
                    	report_14_x1_vcp_errors_rate.push(obj.x1_vcp_error_rate)
                    	report_14_x1_tune_errors_rate.push(obj.x1_tune_error_rate)
                    	report_14_x1_cm_connect_errors_rate.push(obj.x1_cm_connect_error_rate)
                    	report_14_x1_vlqok_errors_rate.push(obj.x1_vlqok_error_rate)

                    	report_14_legacy_udb_errors_rate.push(obj.legacy_udb_error_rate)     
                    	report_14_legacy_plant_errors_rate.push(obj.legacy_plant_error_rate)
                    	report_14_legacy_cdn_setup_errors_rate.push(obj.legacy_cdn_setup_error_rate)
                    	report_14_legacy_network_teardown_errors_rate.push(obj.legacy_network_teardown_error_rate)
                    	report_14_legacy_vcp_errors_rate.push(obj.legacy_vcp_error_rate)
                    	report_14_legacy_tune_errors_rate.push(obj.legacy_tune_error_rate)
                    	report_14_legacy_cm_connect_errors_rate.push(obj.legacy_cm_connect_error_rate)
                    	report_14_legacy_vlqok_errors_rate.push(obj.legacy_vlqok_error_rate)
                    	
                    	})
					

                    
                    drawchart_weekly_report_14()
        }
	    }
		})}

        var drawchart_weekly_report_14 = function() {
        	
            $('#weekly-report-14').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Daily Error Rate by STB Type'
                },
                xAxis: {                    
                    categories: report_14_categories
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
                    data: report_14_x1_udb_errors_rate,
                    stack: 'x1'
                }, {
                    name: 'Plant Errors',
                    data: report_14_x1_plant_errors_rate,
                    stack: 'x1'
                }, {
                    name: 'CDN Setup Errors',
                    data: report_14_x1_cdn_setup_errors_rate,
                    stack: 'x1'
                }, {
                    name: 'Network Teardown Errors',
                    data: report_14_x1_network_teardown_errors_rate,
                    stack: 'x1'
                }, {
                    name: 'VCP Errors',
                    data: report_14_x1_vcp_errors_rate,
                    stack: 'x1'
                }, {
                    name: 'Tune Errors',
                    data: report_14_x1_tune_errors_rate,
                    stack: 'x1'
                }, {
                    name: 'CM_CONNECT Errors',
                    data: report_14_x1_cm_connect_errors_rate,
                    stack: 'x1'
                }, {
                    name: 'VLQOK Errors',
                    data: report_14_x1_vlqok_errors_rate,
                    stack: 'x1'
                },
                {
                    name: 'UDB Errors',
                    data: report_14_legacy_udb_errors_rate,
                    stack: 'legacy'
                }, {
                    name: 'Plant Errors',
                    data: report_14_legacy_plant_errors_rate,
                    stack: 'legacy'
                }, {
                    name: 'CDN Setup Errors',
                    data: report_14_legacy_cdn_setup_errors_rate,
                    stack: 'legacy'
                }, {
                    name: 'Network Teardown Errors',
                    data: report_14_legacy_network_teardown_errors_rate,
                    stack: 'legacy'
                }, {
                    name: 'VCP Errors',
                    data: report_14_legacy_vcp_errors_rate,
                    stack: 'legacy'
                }, {
                    name: 'Tune Errors',
                    data: report_14_legacy_tune_errors_rate,
                    stack: 'legacy'
                }, {
                    name: 'CM_CONNECT Errors',
                    data: report_14_legacy_cm_connect_errors_rate,
                    stack: 'legacy'
                }, {
                    name: 'VLQOK Errors',
                    data: report_14_legacy_vlqok_errors_rate,
                    stack: 'legacy'
                },  
                ]


            });
        }

        var show_weekly_report_15 = function(){
    	alert('show_weekly_report_15()')
    	
    	$.ajax({
            url: '/vbo/monthly/report-15/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
            	console.log('monthly report-14 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_15))
                    report_15 = result.results.report_15
                    report_15_categories = []
                    report_15_error_x1 = []
                    report_15_error_legacy = []

                    report_15.forEach(function(obj){
                    	report_15_categories.push(obj.error_code)
                    	report_15_error_x1.push(obj.x1)
                    	report_15_error_legacy.push(obj.legacy)
                    	})
					

                    
                    drawchart_weekly_report_15()
        }
	    }
		})}

        var drawchart_weekly_report_15 = function() {
        	
            $('#weekly-report-15').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Daily Error Rate by STB Type'
                },
                xAxis: {
                    // categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                    //categories: ['X1', 'Legacy']
                    categories: report_15_categories
                },
                yAxis: {
                    min: 0,
                    tickInterval: 50000,
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
                    data: report_15_error_x1,
                }, {
                    name: 'Plant Errors',
                    data: report_15_error_legacy,
                }, 
                ]


            });
        }

        var show_weekly_report_16 = function(){
        alert('show_weekly_report_16()')        
        $.ajax({
            url: '/vbo/monthly/report-16/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-16 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results report-16 == ', JSON.stringify(result.results.report_16))
                    report_16 = result.results.report_16
                    report_16_categories = []
                    report_16_legacy_network_error = []
                    report_16_x1_network_error = []

                    report_16.forEach(function(obj){
                        console.log("typeof_obj"+JSON.stringify(obj.report_name))
                        
                        // drawchart_weekly_report_16_1('#report-16-6-weekly')
                        if (obj.report_name == 'report_1'){
                            report_16_categories.push(obj.pg_name)
                            report_16_legacy_network_error.push(obj.legacy_error_rate)
                            report_16_x1_network_error.push(obj.x1_error_rate)                            
                        }
                        })

                    drawchart_weekly_report_16_1('#report-16-1-weekly','Top 5 PeerGroups - NetworkTeardown Error Rate')

                    report_16_categories = []
                    report_16_legacy_network_error = []
                    report_16_x1_network_error = []

                    report_16.forEach(function(obj){
                        if (obj.report_name == 'report_2'){
                                report_16_categories.push(obj.pg_name)
                                report_16_legacy_network_error.push(obj.legacy_error_rate)
                                report_16_x1_network_error.push(obj.x1_error_rate)
                            }
                            
                        })
                    

                    drawchart_weekly_report_16_1('#report-16-2-weekly','Top 5 PeerGroups - QAM Capacity Error Rate')

                    report_16_categories = []
                    report_16_legacy_network_error = []
                    report_16_x1_network_error = []

                    report_16.forEach(function(obj){
                        if (obj.report_name == 'report_3'){
                                report_16_categories.push(obj.pg_name)
                                report_16_legacy_network_error.push(obj.legacy_error_rate)
                                report_16_x1_network_error.push(obj.x1_error_rate)
                            }
                            
                        })
                    drawchart_weekly_report_16_1('#report-16-3-weekly','Top 5 PeerGroups - Tune Error Rate')



                    report_16_categories = []
                    report_16_legacy_network_error = []
                    report_16_x1_network_error = []

                    report_16.forEach(function(obj){
                        if (obj.report_name == 'report_4'){
                                report_16_categories.push(obj.pg_name)
                                report_16_legacy_network_error.push(obj.legacy_error_rate)
                                report_16_x1_network_error.push(obj.x1_error_rate)
                            }
                            
                        })
                    drawchart_weekly_report_16_1('#report-16-4-weekly','Top 5 PeerGroups - CM Connect Error Rate')


                    report_16_categories = []
                    report_16_legacy_network_error = []
                    report_16_x1_network_error = []

                    report_16.forEach(function(obj){
                        if (obj.report_name == 'report_5'){
                                report_16_categories.push(obj.pg_name)
                                report_16_legacy_network_error.push(obj.legacy_error_rate)
                                report_16_x1_network_error.push(obj.x1_error_rate)
                            }
                            
                        })
                    drawchart_weekly_report_16_1('#report-16-5-weekly','Top 5 PeerGroups - VideoLost QAM OK Error Rate')
                    
        }
        }
        })}

        var drawchart_weekly_report_16_1 = function(id,title){
            // alert('drawchart_weekly_report_16_1()')
            console.log('im gonna draw now == ', id)
          // $('#weekly-report-16').highcharts({
            $(id).highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: title
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            // categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
            categories: report_16_categories,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'LegacyNetworkResourceError',
            data: report_16_legacy_network_error
        }, {
            name: 'X1NetworkResourceError',
            data: report_16_x1_network_error
        }, ]
    });
        }

        var show_weekly_report_17 = function(){
        alert('show_weekly_report_17()')        
        $.ajax({
            url: '/vbo/monthly/report-17/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-16 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results report-17 == ', JSON.stringify(result.results.report_17))
                    // obj = result.results.report_17

                                     
                 $("<div class='weekly-report-17-table'  style=' width:100%; overflow:scroll' >").appendTo("#report-17-weekly");
                    $(".weekly-report17-CSSTableGenerator1").empty() 
                    $("<table id='weekly-report-17-table' class='table'  style=''> </table>").appendTo('.weekly-report-17-table')

                $('#weekly-report-17-table').append('<thead class="thead-inverse" style="background-color:gray"><tr>'
                     + '<<th>Event Type</th>'
                     + '<<th>Result Code</th>'
                     + '<<th>Result Text</th>'
                     + '<<th>Client Reason Code</th>'
                     + '<<th>Teardown Reason Code</th>'
                     + '<<th>Ownership</th>'
                     + '<<th>Description</th>'
                     + '<<th>Total</th>'
                     + '<<th>X1</th>'
                     + '<<th>Legacy</th>'
                     + '</tr></thead>');

                result.results.report_17.forEach(function(obj, i, a) {
                    console.log('hey')

                    $('#weekly-report-17-table').append('<tr>'
                        + '<td>' + obj.event_type + '</td>'
                         + '<td>' + obj.result_code + '</td>'
                         + '<td>' + obj.result_text + '</td>'
                         + '<td>' + obj.client_reason_code + '</td>'
                         + '<td>' + obj.tear_down_reason_code + '</td>'
                         + '<td>' + obj.ownership + '</td>'
                         + '<td>' + obj.description + '</td>'
                         + '<td>' + obj.total + '</td>'
                         + '<td>' + obj.x1 + '</td>'
                         + '<td>' + obj.legacy + '</td>'                                                 
                        + '</tr>');
                })
        }
        }
        })}


})
