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
    	alert('Daily Set')
        report_create_time = moment.utc(x1.report_create_time).format('MMM DD, YYYY');        
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
        report_names_and_dates.forEach(function(obj) {
            if (obj.report_name == selected) {
                report_dates.push(obj.report_run_date + '&&&&' + obj.id)
            }
        })
        $('#report_dates').val('');
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
        report_create_time = moment.utc(x1.report_create_time).format('MMM DD, YYYY');        
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

        $('#monthly-field-total').text(x1.field_plant_total + x1.video_total + x1.tune_total)

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
  		// alert(target);
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
  			alert('Trending Graph later')
  		}
  		
	});

    var show_weekly_report_2 = function(){
    	
    	$.ajax({
            url: '/vbo/monthly/report-2/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
            	console.log('monthly report-2 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_2))
                    spikes = result.results.report_2
                    spikes_weekly_categories = []
                    spikes_weekly_br_denial_rate = []
                    spikes_weekly_vlqok_error_rate = []
                    spikes_weekly_udb_error_rate = []
                    spikes_weekly_vcp_error_rate = []
                    spikes_weekly_plant_error_rate = []
                    spikes_weekly_networkresourcefailure_error_rate = []
                    spikes_weekly_cdn_setup_error_rate = []
                    spikes_weekly_cm_connect_error_rate = []
                    spikes_weekly_tune_error_rate = []

                    spikes.forEach(function(obj) {
                        spikes_weekly_categories.push(obj.report_create_time)
                        spikes_weekly_br_denial_rate.push(obj.br_denial_rate)
                        spikes_weekly_vlqok_error_rate.push(obj.vlqok_error_rate)
                        spikes_weekly_udb_error_rate.push(obj.udb_error_rate)
                        spikes_weekly_vcp_error_rate.push(obj.vcp_error_rate)
                        spikes_weekly_plant_error_rate.push(obj.plant_error_rate)
                        spikes_weekly_networkresourcefailure_error_rate.push(obj.networkresourcefailure_rate)
                        spikes_weekly_cdn_setup_error_rate.push(obj.cdn_setup_error_rate)
                        spikes_weekly_cm_connect_error_rate.push(obj.cm_connect_error_rate)
                        spikes_weekly_tune_error_rate.push(obj.tune_error_rate)
                    })
                    drawchart_weekly_report_2()
        }
    }
	})}

    var drawchart_weekly_report_2 = function() {
            $('#weekly-report-3').highcharts({
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
                    // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    // 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    categories: spikes_weekly_categories,
                    tickInterval: 180,
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
                        data: spikes_weekly_br_denial_rate,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VLQOK Error Rate',
                        data: spikes_weekly_vlqok_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'UDB Error Rate',
                        data: spikes_weekly_udb_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VCP Error Rate',
                        data: spikes_weekly_udb_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'Plant Error Rate',
                        data: spikes_weekly_plant_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'NetworkResourceFailure Rate',
                        data: spikes_weekly_networkresourcefailure_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'CDN Setup Error Rate',
                        data: spikes_weekly_cdn_setup_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'CM Connect Error Rate',
                        data: spikes_weekly_cm_connect_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'Tune Error Rate',
                        data: spikes_weekly_tune_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 1
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

                    spikes.forEach(function(obj) {
                        spikes_weekly_date_time.push(obj.report_create_time)
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
                    text: 'Spikes NBRF %',
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
                    tickInterval: 60,
                },
                yAxis: {
                    title: {
                        text: 'Number of Simultaneous Sessions'
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
                        data: spikes_weekly_ve1,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VLQOK Error Rate',
                        data: spikes_weekly_ve2,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'UDB Error Rate',
                        data: spikes_weekly_ve3,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'VCP Error Rate',
                        data: spikes_weekly_ve4,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'Plant Error Rate',
                        data: spikes_weekly_vw1,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'NetworkResourceFailure Rate',
                        data: spikes_weekly_vw2,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'CDN Setup Error Rate',
                        data: spikes_weekly_vw3,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: 'CM Connect Error Rate',
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
                    console.log('chart results == ', JSON.stringify(result.results.report_4))
                    spikes = result.results.report_4
                    spikes_weekly_date_time = []
                    spikes_weekly_99th_rtime_sessiondhtclientimpl_persist  = []
                    spikes_weekly_99th_rtime_setup_js = []
                    spikes_weekly_99th_rtime_expandplaylist = []
                    spikes_weekly_99th_rtime_setupermsession = []
                    spikes_weekly_99th_rtime_setupodrmsession = []
                    spikes_weekly_99th_rtime_sessionpersistenceservice_getsettopstatus = []
                    spikes_weekly_99th_rtime_udbservice_validateplayeligibility = []
                    spikes_weekly_99th_rtime_getsoplist = []                    
                    spikes_weekly_99th_rtime_teardown_js = []                    

                    spikes.forEach(function(obj) {
                        spikes_weekly_date_time.push(obj.report_time)
                        spikes_weekly_99th_rtime_sessiondhtclientimpl_persist.push(obj['99th_rtime_sessiondhtclientimpl_persist'])
                        spikes_weekly_99th_rtime_setup_js.push(obj['99th_rtime_setup_js'])
                        spikes_weekly_99th_rtime_expandplaylist.push(obj['99th_rtime_expandplaylist'])
                        spikes_weekly_99th_rtime_setupermsession.push(obj['99th_rtime_setupermsession'])
                        spikes_weekly_99th_rtime_setupodrmsession.push(obj['99th_rtime_setupodrmsession'])
                        spikes_weekly_99th_rtime_sessionpersistenceservice_getsettopstatus.push(obj['99th_rtime_sessionpersistenceservice_getsettopstatus'])
                        spikes_weekly_99th_rtime_udbservice_validateplayeligibility.push(obj['99th_rtime_udbservice_validateplayeligibility'])
                        spikes_weekly_99th_rtime_getsoplist.push(obj['99th_rtime_getsoplist'])
                        spikes_weekly_99th_rtime_teardown_js.push(obj['99th_rtime_getsoplist'])
                    })
                    console.log('chart results == ', JSON.stringify(spikes_weekly_date_time))
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
                    tickInterval: 6,
                },
                yAxis: {
                    title: {
                        text: 'Time in MilliSeconds'
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
                        name: '99th% Response Time: SessionDHTClientImpl.persist',
                        data: spikes_weekly_99th_rtime_sessiondhtclientimpl_persist,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
                        name: '99th% Response Time: SessionDHTClientImpl.persist',
                        data: spikes_weekly_99th_rtime_setup_js,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }, {
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
                    }, {
                        name: '99th% Response Time: SessionDHTClientImpl.persist',
                        data: spikes_weekly_99th_rtime_teardown_js,
                        turboThreshold: 12000,
                        lineWidth: 1
                    }


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
                        spikes_weekly_date_time.push(obj.report_time)
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
                        spikes_weekly_date_time.push(obj.report_date)
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
                    tickInterval: 60,
                },
                yAxis: {
                    title: {
                        text: 'Time in MilliSeconds'
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




})
