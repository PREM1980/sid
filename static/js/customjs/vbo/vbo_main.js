$(document).ready(function() {

    daily_report_on_load = true

    if (!String.prototype.format) {
       String.prototype.format = function() {
           var args = arguments;
           return this.replace(/{(\d+)}/g, function(match, number) {
               return typeof args[number] != 'undefined' ? args[number] : match;
           });
       };
   }


    function roundoff(nbr) {        
        result = (Math.round(nbr * 100 * 100) / 100)
        return result
    }
    function add_percentage(val) {                
        return val + '%'
    }
    $('#report-daily-1-submit, #report-daily-2-submit, #report-daily-3-submit,' + 
        '#report-weekly-1-submit, #report-weekly-2-submit, #report-weekly-3-submit ' + 
        ',#report-weekly-4-submit, #report-weekly-5-submit, #report-weekly-6-submit ' + 
        ',#report-weekly-7-submit, #report-weekly-8-submit, #report-weekly-9-submit ' + 
        ',#report-weekly-10A-submit, #report-weekly-10B-submit, #report-weekly-11-submit ' + 
        ',#report-weekly-12-submit, #report-weekly-13-submit, #report-weekly-14-submit ' +
        ',#report-weekly-15-submit, #report-weekly-16A-submit, #report-weekly-16B-submit ' +
        ',#report-weekly-16C-submit, #report-weekly-16D-submit, #report-weekly-16E-submit ' + 
        ',#report-weekly-19-submit '
        ).click(function() {
        // report_num = this.id.split('-')[2]        
        report_num = this.id.split('-')[1] + '-' + this.id.split('-')[2]        
        // alert(report_num)
        elem = "#report-{0}-comments-txt".format(report_num)        
        comments = $(elem).val()        
        
        $.ajax({
            url: '/vbo/update-report-comments/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() +  '&report_num=' + report_num + '&report_callouts=' + comments,            
            type: 'GET',            
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
        console.log('daily_report_on_load ==', daily_report_on_load)
        console.log('report_names ==', report_names_and_dates[report_names_and_dates.length - 1].report_run_date )
        $('#report_names').val('Daily Errors Report')
        $('#report_dates').val(report_names_and_dates[report_names_and_dates.length - 1].report_run_date)
        handle_report_name_change('Daily Errors Report')
        if (daily_report_on_load == true){
            url = '/vbo/report-data/?' + 'report_name=' + 'Daily Errors Report' + '&report_run_date=' + report_names_and_dates[report_names_and_dates.length - 1].report_run_date
        }else{
            url = '/vbo/report-data/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val()
        }
        $.ajax({
            url: url,
            type: 'GET',
            //data: data,
            success: function(result) {
                if (result.status == 'success') {
                    console.log('chart results == ', result)
                    $('#animation,#animation-space').hide()
                    // $('#vbo-stb-error-rates-comments, #daily-report2-admin,  #vbo-nbrf-spikes-comments, #vbo-x1-vs-legacy-comments, #vbo-x1-vs-legacy-comments, #html-reports-btn').show()
                    $('#vbo-stb-error-rates-comments, #report-daily-2-callouts-admin,  #html-reports-btn').show()                    
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
                    $('#report-daily-1-comments-txt').val(comments.report_1_comments)
                    $('#report-daily-2-comments-txt').val(comments.report_2_comments)
                    $('#report-daily-3-comments-txt').val(comments.report_3_comments)

                    load_highcharts_admin_section()
                    generate_callouts_from_server()
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
            // $('#vbo-x1-vs-legacy').highcharts({
            $('#report-daily-3-highcharts').highcharts({                
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
            // $('#vbo-nbrf-spikes').highcharts({
            $('#report-daily-2-highcharts').highcharts({
                chart: {
                          // type: 'bar',
                          events: {
                            load: function() {  
                                // alert('load')        
                              addCallout(this);
                            },
                            redraw: function() {
                                // alert('redraw')
                              addCallout(this);
                            },
                          }
                        },
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
                        data: spikes_vcp_error_rate,
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
            // $('#vbo-stb-error-rates').highcharts({
            $('#report-daily-1-highcharts').highcharts({
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
    var report_names_values = []
    var report_names_and_dates;
    var load_vbo_report_names = function() {
        $.ajax({
            url: '/vbo/get-report-names',
            type: 'POST',
            data: {},
            success: function(result) {
                if (result.status == 'success') {
                    report_names_and_dates = result.results[0].results
                    console.log(JSON.stringify(report_names_and_dates))
                    
                    report_names_and_dates.forEach(function(obj) {
                        report_names_values.push(obj.report_name)
                    })
                    report_names_values = _.uniq(report_names_values);

                    report_names_values.forEach(function(each) {
                        $('#report_names')
                            .append($("<option></option>")
                                .attr("value", each)
                                .text(each));
                    })
                    generate_daily_report()
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

    // Load all the report names
    load_vbo_report_names()

    $('#report-submit').on('click', function() {
        if (($('#report_names').val() == 'Pick Your Report') || ($('#report_dates').val() == 'Pick Your Run Date')) {
            alert('Pick your report and run date')
        } else {
            if ($('#report_names').val() == 'Weekly Errors Report'){
            generate_weekly_report()
            }else{
                daily_report_on_load = false
                generate_daily_report()
                
            }
        }
    })

    $('#report_names').on('change', function() {        
       var selected = $(this).find("option:selected").val();       
       handle_report_name_change(selected)
    });
    var handle_report_name_change = function(selected){
        
        var report_dates = []        
        report_names_and_dates.forEach(function(obj) {
            if (obj.report_name == selected) {
                report_dates.push(obj.report_run_date + '&&&&' + obj.id)
            }
        })        
        $('#report_dates').empty();
        report_dates.forEach(function(each) {            
            each = each.split('&&&&')
            $('#report_dates')
                .append($("<option></option>")
                    .attr("value", each[0])
                    .attr("name", each[1])
                    .text(each[0]));
        })
    }

    var set_summary_weekly = function(x1) {
        //report_create_time = moment.utc(x1.report_create_time).format('MMM DD, YYYY');        
        // alert(x1.report_create_time)
        report_start_dt = moment(x1.report_create_time).subtract(7,'d').format('MMM DD');        
        report_end_dt = moment(x1.report_create_time).subtract(1,'d').format('MMM DD');        
        date_heading = report_start_dt + 'th - ' + report_end_dt +'th '+moment(x1.report_create_time).format('YYYY')
        // report_create_time = moment().subtract(7,'d').format('YYYY-MM-DD');

        // alert(dateFrom)
        $('#weekly-report-date').text(date_heading)
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

        // console.log('x1 == ', JSON.stringify(x1))

        x1['qry-4'].forEach(function(obj) {
            console.log(JSON.stringify(obj))
            if (obj.dayname == 'Saturday'){
                $('#stb-x1-weekly').text(add_percentage(obj.x1_nbr_error_rate))
                $('#stb-legacy-weekly').text(add_percentage(obj.legacy_nbr_error_rate))
                $('#stb-nat-weekly').text(add_percentage(obj.nbr_error_rate))
            }
            })

        x1['qry-3'].forEach(function(obj) {
            console.log(JSON.stringify(obj))
            if (obj.dayname == 'Saturday'){
                $('#stb-x1-sat').text(add_percentage(obj.x1_nbr_error_rate))
                $('#stb-legacy-sat').text(add_percentage(obj.legacy_nbr_error_rate))
                $('#stb-nat-sat').text(add_percentage(obj.nbr_error_rate))
            }else if (obj.dayname == 'Sunday') {
                $('#stb-x1-sun').text(add_percentage(obj.x1_nbr_error_rate))
                $('#stb-legacy-sun').text(add_percentage(obj.legacy_nbr_error_rate))
                $('#stb-nat-sun').text(add_percentage(obj.nbr_error_rate))
            }else if (obj.dayname == 'Monday') {
                $('#stb-x1-mon').text(add_percentage(obj.x1_nbr_error_rate))
                $('#stb-legacy-mon').text(add_percentage(obj.legacy_nbr_error_rate))
                $('#stb-nat-mon').text(add_percentage(obj.nbr_error_rate))
            }else if (obj.dayname == 'Tuesday') {
                $('#stb-x1-tue').text(add_percentage(obj.x1_nbr_error_rate))
                $('#stb-legacy-tue').text(add_percentage(obj.legacy_nbr_error_rate))
                $('#stb-nat-tue').text(add_percentage(obj.nbr_error_rate))
            }
            else if (obj.dayname == 'Wednesday') {
                $('#stb-x1-wed').text(add_percentage(obj.x1_nbr_error_rate))
                $('#stb-legacy-wed').text(add_percentage(obj.legacy_nbr_error_rate))
                $('#stb-nat-wed').text(add_percentage(obj.nbr_error_rate))
            }
            else if (obj.dayname == 'Thursday') {
                $('#stb-x1-thu').text(add_percentage(obj.x1_nbr_error_rate))
                $('#stb-legacy-thu').text(add_percentage(obj.legacy_nbr_error_rate))
                $('#stb-nat-thu').text(add_percentage(obj.nbr_error_rate))
            }
            else if (obj.dayname == 'Friday') {
                $('#stb-x1-fri').text(add_percentage(obj.x1_nbr_error_rate))
                $('#stb-legacy-fri').text(add_percentage(obj.legacy_nbr_error_rate))
                $('#stb-nat-fri').text(add_percentage(obj.nbr_error_rate))
            }
        })

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
                    $('#report-weekly-1-comments-txt').val(x1.report_comments.report_1_comments)
         
        }
    }})

    }
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href") // activated tab
    
    if (target == '#weekly-report-2-h'){
    show_weekly_report_2()
    }else if (target == '#weekly-report-3-h') {
    show_weekly_report_3()
    }
    else if (target == '#weekly-report-4-h') {
    show_weekly_report_4()
    }
    else if (target == '#weekly-report-5-h') {
    show_weekly_report_5()
    }
    else if (target == '#weekly-report-6-h') {
    show_weekly_report_6()
    }
    else if (target == '#weekly-report-7-h') {
    show_weekly_report_7()
    }
        else if (target == '#weekly-report-8-h') {
            show_weekly_report_8()
        }
        else if (target == '#weekly-report-9-h') {
            show_weekly_report_9()
        }
        else if (target == '#weekly-report-10-h') {
            show_weekly_report_10()
        }
        else if (target == '#weekly-report-11-h') {
            show_weekly_report_11()
        }
        else if (target == '#weekly-report-12-h') {
            
            show_weekly_report_12()
        }
        else if (target == '#weekly-report-13-h') {
            
            show_weekly_report_13()
        }
    else if (target == '#weekly-report-14-h') {
    
    show_weekly_report_14()
    }
    else if (target == '#weekly-report-15-h') {
    
    show_weekly_report_15()
    }
        else if (target == '#weekly-report-16-h') {
            
            show_weekly_report_16()
        }
        else if (target == '#weekly-report-17-h') {
            
            show_weekly_report_17()
        }
        else if (target == '#weekly-report-19-h') {
            
            show_weekly_report_19()
        }
    
    });

    var show_weekly_report_2 = function(){
        
        $.ajax({
            url: '/vbo/monthly/report-2/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-2 result == ', result)
                if (result.status == 'success') {
                    $('#weekly-2-loading-animation').hide()
                    $('#report-weekly-2-comments').show()
                    $('#report-weekly-2-comments-txt').val(result.results.report_comments.report_2_comments)
                    // $('#report-weekly-2-comments').show()
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
                        report_2_weekly_categories.push(moment(obj.report_create_time).format('MM/DD/YYYY HH:mm'))
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
        
            $('#weekly-report-2').highcharts({
                title: {
                    text: 'Spikes NBRF%',
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
                    labels:{
                        format : '{value} CST'
                    }
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
        // alert('show_weekly_report_3()')
        
        $.ajax({
            url: '/vbo/monthly/report-3/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-3 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_3))
                    $('#weekly-3-loading-animation').hide()
                    $('#report-weekly-3-comments').show()
                    $('#report-weekly-3-comments-txt').val(result.results.report_comments.report_3_comments)
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
    // alert('drawchart_weekly_report_3')
    console.log('spikes_weekly_date_time == ', spikes_weekly_date_time)
            $('#weekly-report-3').highcharts({
                title: {
                    text: 'Simultaneous Sessions Graph',
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
                    lang: {
                       numericSymbols: null //otherwise by default ['k', 'M', 'G', 'T', 'P', 'E']
                    },                    
                },
                yAxis: {
                    title: {
                        text: 'Number of Simultaneous Sessions'
                    },
                    lang: {
                       numericSymbols: null //otherwise by default ['k', 'M', 'G', 'T', 'P', 'E']
                    },
                    tickInterval: 20000,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }],
                    labels: {
                        formatter: function () {
                            return Highcharts.numberFormat(this.value,0);
                        }
                    }
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
        // alert('show_weekly_report_4()')
        
        $.ajax({
            url: '/vbo/monthly/report-4/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                
                if (result.status == 'success') {
                    // console.log('chart results == ', JSON.stringify(result.results.report_4))
                    $('#weekly-4-loading-animation').hide()
                    $('#report-weekly-4-comments').show()
                    $('#report-weekly-4-comments-txt').val(result.results.report_comments.report_4_comments)

                    spikes = result.results.report_4
                    console.log('monthly report-4 result == ', JSON.stringify(spikes))
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
                        spikes_weekly_date_time.push(moment(obj.report_time).format('MM/DD/YYYY HH:mm'))
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
                    console.log('spikes_weekly_date_time == ', spikes_weekly_date_time)
                    // console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_sessiondhtclientimpl_persist))
                    // console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_expandplaylist))
                    // console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_setupermsession))
                    // console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_setupodrmsession))
                    // console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_sessionpersistenceservice_getsettopstatus))
                    // console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_udbservice_validateplayeligibility))
                    // console.log('chart results == ', JSON.stringify(spikes_weekly_99th_rtime_getsoplist))
                    drawchart_weekly_report_4()
        }
    }
    })}

    var drawchart_weekly_report_4 = function() {
    // alert('drawchart_weekly_report')
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
                    labels:{
                        format : '{value} CST'
                    }
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
        // alert('show_weekly_report_5()')
        
        $.ajax({
            url: '/vbo/monthly/report-5/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-5 result == ', result)
                if (result.status == 'success') {
                    $('#weekly-5-loading-animation').hide()
                    console.log('chart results == ', JSON.stringify(result.results.report_5))
                    $('#report-weekly-5-comments').show()
                    $('#report-weekly-5-comments-txt').val(result.results.report_comments.report_5_comments)
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
    // alert('drawchart_weekly_report')
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
        // alert('show_weekly_report_6()')
        
        $.ajax({
            url: '/vbo/monthly/report-6/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                $('#weekly-6-loading-animation').hide()
                console.log('monthly report-6 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_6))
                    $('#report-weekly-6-comments').show()
                    $('#report-weekly-6-comments-txt').val(result.results.report_comments.report_6_comments)
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
    // alert('drawchart_weekly_report_6')
    console.log('spikes_weekly_date_time == ', spikes_weekly_date_time)
            $('#weekly-report-6').highcharts({
                title: {
                    text: 'Stripe Setup Times Graph 99th',
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
        // alert('show_weekly_report_7()')
        
        $.ajax({
            url: '/vbo/monthly/report-7/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-7 result == ', result)
                if (result.status == 'success') {
                    $('#weekly-7-loading-animation').hide()
                    console.log('chart results == ', JSON.stringify(result.results.report_7))
                    $('#report-weekly-7-comments').show()
                    $('#report-weekly-7-comments-txt').val(result.results.report_comments.report_7_comments)
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
                        // report_7_weekly_date_time.push(new Date(moment(obj.report_date).format('MM/DD/YYYY')).getTime())
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
        // alert('drawchart_weekly_report_7')
        console.log('spikes_weekly_date_time == ', report_7_weekly_date_time)
            $('#weekly-report-7').highcharts({
                title: {
                    text: '50th % Setup Time Trend Graph',
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
                    // type:'datetime',
                    categories: report_7_weekly_date_time,
                    tickInterval: 7,
        //             tickPositioner: function(min, max){
        //                  var interval = this.options.tickInterval,
        //                      ticks = [],
        //                      count = 0;
                        
        //                 while(min < max) {
        //                     ticks.push(min);
        //                     min += interval;
        //                     count ++;
        //                 }
                        
        //                 ticks.info = {
        //                     unitName: 'day',
        //                     count: 7,
        //                     higherRanks: {},
        //                     totalRange: interval * count
        //                 }            
        //     return ticks;
        // }
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
        // alert('show_weekly_report_8()')
        
        $.ajax({
            url: '/vbo/monthly/report-8/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-8 result == ', result)
                if (result.status == 'success') {
                    $('#weekly-8-loading-animation').hide()
                    console.log('chart results == ', JSON.stringify(result.results.report_8))
                    $('#report-weekly-8-comments').show()
                    $('#report-weekly-8-comments-txt').val(result.results.report_comments.report_8_comments)
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
            console.log("report_8_weekly_categories == ", JSON.stringify(report_8_weekly_categories))
            console.log("report_8_weekly_br_denial_rate == ", JSON.stringify(report_8_weekly_vlqok_error_rate))
            $('#weekly-report-8').highcharts({
                title: {
                    text: 'Major Events Graph',
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
                    tickInterval: 7,
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
        // alert('show_weekly_report_9()')
        
        $.ajax({
            url: '/vbo/monthly/report-9/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-9 result == ', result)
                if (result.status == 'success') {
                    $('#weekly-9-loading-animation').hide()
                    console.log('chart results == ', JSON.stringify(result.results.report_9))
                    $('#report-weekly-9-comments').show()
                    $('#report-weekly-9-comments-txt').val(result.results.report_comments.report_9_comments)
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
                    text: 'Major Events Graph-Full Year',
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
                    tickInterval: 14,
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
        // alert('show_weekly_report_10()')
        
        $.ajax({
            url: '/vbo/monthly/report-10/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-10 result == ', result)
                if (result.status == 'success') {
                    $('#weekly-10-loading-animation').hide()
                    console.log('chart results == ', JSON.stringify(result.results.report_10))
                    $('#report-weekly-10A-comments').show()
                    $('#report-weekly-10A-comments-txt').val(result.results.report_comments.report_10A_comments)
                    $('#report-weekly-10B-comments').show()
                    $('#report-weekly-10B-comments-txt').val(result.results.report_comments.report_10B_comments)
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
                    drawchart_weekly_report_10('#weekly-report-10A','Network Resource Failure Rate',
                        report_10_weekly_x1_network_error_rate,report_10_weekly_legacy_network_error_rate,'NetworkResourceFailure','X1 NetworkResourceFailure Rate', 'Legacy NetworkResourceFailure Rate')                    
                    drawchart_weekly_report_10('#weekly-report-10B','Tune Error Rate',
                        report_10_weekly_x1_network_error_rate,report_10_weekly_legacy_network_error_rate,'Tune Error Rate by STB Type','X1 Tune Error Rate', 'Legacy Tune Error Rate')                    
        }
    }
    })}

    var drawchart_weekly_report_10 = function(id,text,report_10_weekly_x1_network_error_rate,report_10_weekly_legacy_network_error_rate, title, series_1_title, series_2_title) {            
            $(id).highcharts({
                title: {
                    text: title,
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
                    tickInterval: 7,
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
                        name: series_1_title,
                        data: report_10_weekly_x1_network_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: series_2_title,
                        data: report_10_weekly_legacy_network_error_rate,
                        turboThreshold: 12000,
                        lineWidth: 2
                    },                     
                ]
            });
        }


    var show_weekly_report_11 = function(){                
        $.ajax({
            url: '/vbo/monthly/report-11/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                $('#weekly-11-loading-animation').hide()
                console.log('monthly report-11 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_10))
                    $('#report-weekly-11-comments').show()
                    $('#report-weekly-11-comments-txt').val(result.results.report_comments.report_11_comments)
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
                    drawchart_weekly_report_11('#weekly-report-11','National QAM VOD Error Rate',
                        report_11_weekly_cm_connect_error_rate,report_11_weekly_networkresource_failure_error_rate
                        ,report_11_weekly_tune_error_rate,report_11_weekly_vlqok_error_rate)                                        
        }
    }
    })}

    var drawchart_weekly_report_11 = function(id,text,report_10_weekly_x1_network_error_rate,report_10_weekly_legacy_network_error_rate) {            
            $(id).highcharts({
                title: {
                    text: 'Daily Error Rate by Category',
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
                    tickInterval: 7,
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



        var show_weekly_report_12 = function(){ 
        alert('show_weekly_report_12')               
        $.ajax({
            url: '/vbo/monthly/report-12/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-12 result == ', result)
                if (result.status == 'success') {
                    $('#weekly-12-loading-animation').hide()
                    // console.log('chart results == ', JSON.stringify(result.results.report_12))
                    $('#report-weekly-12-comments').show()
                    $('#report-weekly-12-comments-txt').val(result.results.report_comments.report_12_comments)
                    report_12= result.results.report_12
                    report_12_weekly_categories = []
                    report_12_weekly_augusta = []
                    report_12_weekly_independence = []
                    report_12_weekly_pompano = []
                    report_12_weekly_dade = []
                    report_12_weekly_colorado_springs = []
                    
                    report_12.forEach(function(obj) {
                        report_12_weekly_categories.push(moment(obj.report_date).format('DD MMM YYYY'))
                        report_12_weekly_augusta.push(parseFloat(obj['augusta, ga']))                                                
                        report_12_weekly_independence.push(parseFloat(obj['independence, mo']))                                                
                        report_12_weekly_pompano.push(parseFloat(obj['pompano, fl']))                                                
                        report_12_weekly_dade.push(parseFloat(obj['dade, fl']))                                                
                        report_12_weekly_colorado_springs.push(parseFloat(obj['colorado springs, co']))                                                
                        
                    })
                    console.log(report_12_weekly_dade)
                    console.log(report_12_weekly_augusta)
                    console.log(report_12_weekly_independence)
                    console.log(report_12_weekly_colorado_springs)
                    console.log(report_12_weekly_pompano)
                    
                    drawchart_weekly_report_12('#weekly-report-12','Daily Error Rate',   
                            report_12_weekly_augusta,report_12_weekly_independence,report_12_weekly_pompano,report_12_weekly_dade,report_12_weekly_colorado_springs
                        )                                        
        }
    }
    })}

    var drawchart_weekly_report_12 = function(id,text,report_12_weekly_augusta,report_12_weekly_independence,report_12_weekly_pompano,report_12_weekly_dade,report_12_weekly_colorado_springs) {            
        console.log('prem report_12_weekly_augusta == ', report_12_weekly_categories.length)
        console.log('prem report_12_weekly_augusta == ', report_12_weekly_augusta)
        console.log('prem report_12_weekly_augusta == ', report_12_weekly_independence)
        console.log('prem report_12_weekly_augusta == ', report_12_weekly_pompano)
        console.log('prem report_12_weekly_augusta == ', report_12_weekly_dade)
        console.log('prem report_12_weekly_augusta == ', report_12_weekly_colorado_springs)

                
            $(id).highcharts({
                title: {
                    text: 'Worst PGs - Tune Errors',
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
                    categories: report_12_weekly_categories,                    
                },
                yAxis: {
                    max: 3,                    
                    title: {
                        text: text
                    },                    
                    tickInterval: .25,
                    labels:{
                        format : '{value} %'
                    }                
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
                        name: 'August, GA',
                        data: report_12_weekly_augusta,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'independence, MO',
                        data: report_12_weekly_independence,
                        turboThreshold: 12000,
                        lineWidth: 2
                    },                     
                    {
                        name: 'Pompano, FL',
                        data: report_12_weekly_pompano,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'Dade, FL',
                        data: report_12_weekly_dade,
                        turboThreshold: 12000,
                        lineWidth: 2
                    },                     
                    {
                        name: 'Colorado Springs, CO',
                        data: report_12_weekly_colorado_springs,
                        turboThreshold: 12000,
                        lineWidth: 2
                    },                     
                ]
            });
        }

        var show_weekly_report_13 = function(){ 
        alert('show_weekly_report_13')               
        $.ajax({
            url: '/vbo/monthly/report-13/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-13 result == ', result)
                if (result.status == 'success') {
                    $('#weekly-13-loading-animation').hide()
                    // console.log('chart results == ', JSON.stringify(result.results.report_12))
                    $('#report-weekly-13-comments').show()
                    $('#report-weekly-13-comments-txt').val(result.results.report_comments.report_13_comments)
                    report_13= result.results.report_13
                    report_13_weekly_categories = []
                    report_13_weekly_charleston = []
                    report_13_weekly_sarasota = []
                    report_13_weekly_sebring = []
                    report_13_weekly_gray = []
                    report_13_weekly_monroe = []
                    
                    report_13.forEach(function(obj) {
                        report_13_weekly_categories.push(moment(obj.report_date).format('DD MMM YYYY'))
                        report_13_weekly_charleston.push(parseFloat(obj['charleston, sc']))                                                
                        report_13_weekly_sarasota.push(parseFloat(obj['sarasota, fl']))                                                
                        report_13_weekly_sebring.push(parseFloat(obj['sebring, fl']))                                                
                        report_13_weekly_gray.push(parseFloat(obj['gray, tn']))                                                
                        report_13_weekly_monroe.push(parseFloat(obj['monroe, la']))                                                
                        
                    })                                        
                    drawchart_weekly_report_13('#weekly-report-13','Daily Error Rate',   
                            report_13_weekly_charleston
                            ,report_13_weekly_sarasota
                            ,report_13_weekly_sebring
                            ,report_13_weekly_gray
                            ,report_13_weekly_monroe
                        )                                        
        }
    }
    })}

    var drawchart_weekly_report_13 = function(id,text,report_12_weekly_charleston
                                                ,report_13_weekly_sarasota
                                                ,report_13_weekly_sebring
                                                ,report_13_weekly_gray
                                                ,report_13_weekly_monroe) {            

        // alert('drawchart_weekly_report_13')
                
            $(id).highcharts({
                title: {
                    text: 'Worst PGs - NetworkResourceFailures',
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
                    categories: report_13_weekly_categories,                    
                },
                yAxis: {
                    max: 14,                    
                    title: {
                        text: text
                    },                    
                    tickInterval: .25,
                    labels:{
                        format : '{value} %'
                    }                
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
                        name: 'Charleston, SC',
                        data: report_13_weekly_charleston,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'Sarasota, FL',
                        data: report_13_weekly_sarasota,
                        turboThreshold: 12000,
                        lineWidth: 2
                    },                     
                    {
                        name: 'Sebring, FL',
                        data: report_13_weekly_sebring,
                        turboThreshold: 12000,
                        lineWidth: 2
                    }, 
                    {
                        name: 'Gray, TN',
                        data: report_13_weekly_gray,
                        turboThreshold: 12000,
                        lineWidth: 2
                    },                     
                    {
                        name: 'Monroe, LA',
                        data: report_13_weekly_monroe,
                        turboThreshold: 12000,
                        lineWidth: 2
                    },                     
                ]
            });
        }


        var show_weekly_report_14 = function(){
        // alert('show_weekly_report_14()')
        
        $.ajax({
            url: '/vbo/monthly/report-14/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-14 result == ', result)
                if (result.status == 'success') {
                    $('#weekly-14-loading-animation').hide()
                    console.log('chart results == ', JSON.stringify(result.results.report_14))
                    $('#report-weekly-14-comments').show()
                    $('#report-weekly-14-comments-txt').val(result.results.report_comments.report_14_comments)
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
                        report_14_x1_network_teardown_errors_rate.push(obj.x1_networkresourcefailure_rate)
                        report_14_x1_vcp_errors_rate.push(obj.x1_vcp_error_rate)
                        report_14_x1_tune_errors_rate.push(obj.x1_tune_error_rate)
                        report_14_x1_cm_connect_errors_rate.push(obj.x1_cm_connect_error_rate)
                        report_14_x1_vlqok_errors_rate.push(obj.x1_vlqok_error_rate)

                        report_14_legacy_udb_errors_rate.push(obj.legacy_udb_error_rate)     
                        report_14_legacy_plant_errors_rate.push(obj.legacy_plant_error_rate)
                        report_14_legacy_cdn_setup_errors_rate.push(obj.legacy_cdn_setup_error_rate)
                        report_14_legacy_network_teardown_errors_rate.push(obj.x1_networkresourcefailure_rate)
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
                    categories: report_14_categories,
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'blue'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    },
                    labels:{
                        format : '{value} %'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'blue'
                        },
                        formatter: function(){
                            return this.stack;
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
                    id : 'udb-errors',
                    name: 'UDB Errors',
                    data: report_14_x1_udb_errors_rate,
                    stack: 'x1'
                }, {
                    id : 'plant-errors',
                    name: 'Plant Errors',
                    data: report_14_x1_plant_errors_rate,
                    stack: 'x1'
                }, {
                    id : 'cdn-setup-errors',
                    name: 'CDN Setup Errors',
                    data: report_14_x1_cdn_setup_errors_rate,
                    stack: 'x1'
                }, {
                    id : 'network-teardown--errors',
                    name: 'Network Teardown Errors',
                    data: report_14_x1_network_teardown_errors_rate,
                    stack: 'x1'
                }, {
                    id : 'vcp-errors',
                    name: 'VCP Errors',
                    data: report_14_x1_vcp_errors_rate,
                    stack: 'x1'
                }, {
                    id : 'tune-errors',
                    name: 'Tune Errors',
                    data: report_14_x1_tune_errors_rate,
                    stack: 'x1'
                }, {
                    id : 'cm-connect-errors',
                    name: 'CM_CONNECT Errors',
                    data: report_14_x1_cm_connect_errors_rate,
                    stack: 'x1'
                }, {
                    id : 'vlqok-errors',
                    name: 'VLQOK Errors',
                    data: report_14_x1_vlqok_errors_rate,
                    stack: 'x1'
                },
                {
                    linkedTo: 'udb-errors',
                    name: 'UDB Errors',
                    data: report_14_legacy_udb_errors_rate,
                    stack: 'legacy'
                }, {
                    linkedTo: 'plant-errors',
                    name: 'Plant Errors',
                    data: report_14_legacy_plant_errors_rate,
                    stack: 'legacy'
                }, {
                    linkedTo: 'cdn-setup-errors',
                    name: 'CDN Setup Errors',
                    data: report_14_legacy_cdn_setup_errors_rate,
                    stack: 'legacy'
                }, {
                    linkedTo: 'network-teardown-errors',
                    name: 'Network Teardown Errors',
                    data: report_14_legacy_network_teardown_errors_rate,
                    stack: 'legacy'
                }, {
                    linkedTo: 'vcp-errors',
                    name: 'VCP Errors',
                    data: report_14_legacy_vcp_errors_rate,
                    stack: 'legacy'
                }, {
                    linkedTo: 'tune-errors',
                    name: 'Tune Errors',
                    data: report_14_legacy_tune_errors_rate,
                    stack: 'legacy'
                }, {
                    linkedTo: 'cm-connect-errors',
                    name: 'CM_CONNECT Errors',
                    data: report_14_legacy_cm_connect_errors_rate,
                    stack: 'legacy'
                }, {
                    linkedTo: 'vlqok-errors',
                    name: 'VLQOK Errors',
                    data: report_14_legacy_vlqok_errors_rate,
                    stack: 'legacy'
                },  
                ]


            });
        }

        var show_weekly_report_15 = function(){
        // alert('show_weekly_report_15()')
        
        $.ajax({
            url: '/vbo/monthly/report-15/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-14 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_15))
                    $('#weekly-15-loading-animation').hide()
                    $('#report-weekly-15-comments').show()
                    $('#report-weekly-15-comments-txt').val(result.results.report_comments.report_15_comments)
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
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'blue'
                        },
                        formatter: function(){
                            return this.stack;
                        }
                    },
                    labels: {
                        formatter: function () {
                            return Highcharts.numberFormat(this.value,0);
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
        // alert('show_weekly_report_16()')        
        $.ajax({
            url: '/vbo/monthly/report-16/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-16 result == ', result)
                if (result.status == 'success') {
                    $('#weekly-16-loading-animation').hide()
                    console.log('chart results report-16 == ', JSON.stringify(result.results.report_16))

                    $('#report-weekly-16A-comments').show()
                    $('#report-weekly-16A-comments-txt').val(result.results.report_comments.report_16A_comments)
                    $('#report-weekly-16B-comments').show()
                    $('#report-weekly-16B-comments-txt').val(result.results.report_comments.report_16B_comments)
                    $('#report-weekly-16C-comments').show()
                    $('#report-weekly-16C-comments-txt').val(result.results.report_comments.report_16C_comments)
                    $('#report-weekly-16D-comments').show()
                    $('#report-weekly-16D-comments-txt').val(result.results.report_comments.report_16D_comments)
                    $('#report-weekly-16E-comments').show()
                    $('#report-weekly-16E-comments-txt').val(result.results.report_comments.report_16E_comments)

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

                    drawchart_weekly_report_16_1('#weekly-report-16A','Top 5 PeerGroups - NetworkTeardown Error Rate')

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
                    

                    drawchart_weekly_report_16_1('#weekly-report-16B','Top 5 PeerGroups - QAM Capacity Error Rate')

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
                    drawchart_weekly_report_16_1('#weekly-report-16C','Top 5 PeerGroups - Tune Error Rate')



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
                    drawchart_weekly_report_16_1('#weekly-report-16D','Top 5 PeerGroups - CM Connect Error Rate')


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
                    drawchart_weekly_report_16_1('#weekly-report-16E','Top 5 PeerGroups - VideoLost QAM OK Error Rate')
                    
        }
        }
        })}

        var drawchart_weekly_report_16_1 = function(id,title){
            // alert('drawchart_weekly_report_16()')
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
            categories: report_16_categories,
            title: {
                text: null
            },
            
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            },
            labels:{
                format : '{value} %'
            }
        },
        tooltip: {
            valueSuffix: ' million'
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
            // floating: true,
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
        // alert('show_weekly_report_17()')        
        $.ajax({
            url: '/vbo/monthly/report-17/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-16 result == ', result)
                if (result.status == 'success') {
                    $('#weekly-17-loading-animation').hide()
                    console.log('chart results report-17 == ', JSON.stringify(result.results.report_17))
                    // obj = result.results.report_17

                                     
                 $("<div class='weekly-report-17-table'  style=' width:100%; overflow:scroll' >").appendTo("#weekly-report-17");
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

        var show_weekly_report_19 = function(){
        // alert('show_weekly_report_14()')
        
        $.ajax({
            url: '/vbo/monthly/report-19/?' + 'report_name=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),
            type: 'GET',
            success: function(result) {
                console.log('monthly report-19 result == ', result)
                if (result.status == 'success') {
                    console.log('chart results == ', JSON.stringify(result.results.report_19))
                    $('#weekly-19-loading-animation').hide()
                    $('#report-weekly-19-comments').show()
                    $('#report-weekly-19-comments-txt').val(result.results.report_comments.report_19_comments)
                    report_19 = result.results.report_19
                    report_19_categories = []

                    report_19_maint_udb_errors = []
                    report_19_maint_plant_errors = []
                    report_19_maint_cdn_setup_errors = []
                    report_19_maint_network_teardown_errors = []
                    report_19_maint_vcp_errors = []
                    report_19_maint_tune_errors = []
                    report_19_maint_cm_connect_errors = []
                    report_19_maint_vlqok_errors = []

                    report_19_peak_udb_errors = []
                    report_19_peak_plant_errors = []
                    report_19_peak_cdn_setup_errors = []
                    report_19_peak_network_teardown_errors = []
                    report_19_peak_vcp_errors = []
                    report_19_peak_tune_errors = []
                    report_19_peak_cm_connect_errors = []
                    report_19_peak_vlqok_errors = []

                    report_19_others_udb_errors = []
                    report_19_others_plant_errors = []
                    report_19_others_cdn_setup_errors = []
                    report_19_others_network_teardown_errors = []
                    report_19_others_vcp_errors = []
                    report_19_others_tune_errors = []
                    report_19_others_cm_connect_errors = []
                    report_19_others_vlqok_errors = []

                    
                    report_19.forEach(function(obj){
                        report_19_categories.push(obj.dayname_txt)
                        if (obj.window == 'MAINT') {
                        report_19_maint_udb_errors.push(parseInt(obj.udb_errors))     
                        report_19_maint_plant_errors.push(parseInt(obj.plant_errors))     
                        report_19_maint_cdn_setup_errors.push(parseInt(obj.cdn_setup_errors))     
                        report_19_maint_network_teardown_errors.push(parseInt(obj.network_teardown_errors))     
                        report_19_maint_vcp_errors.push(parseInt(obj.vcp_errors))     
                        report_19_maint_tune_errors.push(parseInt(obj.tune_errors))     
                        report_19_maint_cm_connect_errors.push(parseInt(obj.cm_connect_errors))     
                        report_19_maint_vlqok_errors.push(parseInt(obj.vlqok_errors))     
                        } if (obj.window == 'PEAK'){
                            report_19_peak_udb_errors.push(parseInt(obj.udb_errors))     
                            report_19_peak_plant_errors.push(parseInt(obj.plant_errors))     
                            report_19_peak_cdn_setup_errors.push(parseInt(obj.cdn_setup_errors))     
                            report_19_peak_network_teardown_errors.push(parseInt(obj.network_teardown_errors))     
                            report_19_peak_vcp_errors.push(parseInt(obj.vcp_errors))     
                            report_19_peak_tune_errors.push(parseInt(obj.tune_errors))     
                            report_19_peak_cm_connect_errors.push(parseInt(obj.cm_connect_errors))     
                            report_19_peak_vlqok_errors.push(parseInt(obj.vlqok_errors))     
                        } if (obj.window == 'OTHER'){
                            report_19_others_udb_errors.push(parseInt(obj.udb_errors))
                            report_19_others_plant_errors.push(parseInt(obj.plant_errors))     
                            report_19_others_cdn_setup_errors.push(parseInt(obj.cdn_setup_errors))     
                            report_19_others_network_teardown_errors.push(parseInt(obj.network_teardown_errors))     
                            report_19_others_vcp_errors.push(parseInt(obj.vcp_errors))     
                            report_19_others_tune_errors.push(parseInt(obj.tune_errors))     
                            report_19_others_cm_connect_errors.push(parseInt(obj.cm_connect_errors))     
                            report_19_others_vlqok_errors.push(parseInt(obj.vlqok_errors)) 
                        }
                        }
                    )
                    
                    // console.log('peak udb ==',report_19_peak_udb_errors)
                    // console.log('peak plant ==',report_19_peak_plant_errors)
                    // console.log('peak cdn ==',report_19_peak_cdn_setup_errors)
                    // console.log('peak network ==',report_19_peak_network_teardown_errors)
                    // console.log('peak vcp ==',report_19_peak_vcp_errors)
                    // console.log('peak tune ==',report_19_peak_tune_errors)
                    // console.log('peak cm connect ==',report_19_peak_cm_connect_errors)
                    // console.log('peak vlqok ==',report_19_peak_vlqok_errors)

                    // console.log('maint udb ==',report_19_maint_udb_errors)
                    // console.log('maint plant ==',report_19_maint_plant_errors)
                    // console.log('maint cdn ==',report_19_maint_cdn_setup_errors)
                    // console.log('maint network ==',report_19_maint_network_teardown_errors)
                    // console.log('maint vcp ==',report_19_maint_vcp_errors)
                    // console.log('maint tune ==',report_19_maint_tune_errors)
                    // console.log('maint cm connect ==',report_19_maint_cm_connect_errors)
                    // console.log('maint vlqok ==',report_19_maint_vlqok_errors)

                    // console.log('other udb ==',report_19_others_udb_errors)
                    // console.log('other plant ==',report_19_others_plant_errors)
                    // console.log('other cdn ==',report_19_others_cdn_setup_errors)
                    // console.log('other network ==',report_19_others_network_teardown_errors)
                    // console.log('other vcp ==',report_19_others_vcp_errors)
                    // console.log('other tune ==',report_19_others_tune_errors)
                    // console.log('other cm connect ==',report_19_others_cm_connect_errors)
                    // console.log('other vlqok ==',report_19_others_vlqok_errors)
                    // console.log('category ==', report_19_categories)
                    report_19_categories = eliminateDuplicates(report_19_categories)                    
                    // console.log('category ==', report_19_categories)
                    drawchart_weekly_report_19()                    
        }
        }
        })}

        var drawchart_weekly_report_19 = function() {
            
            $('#weekly-report-19').highcharts({

                chart: {
                    type: 'column',
                    zoomType: 'xy'
                },
                title: {
                    text: 'Error Distribution by Window'
                },
                xAxis: {                    
                    categories: report_19_categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    },
                    tickInterval: 20000,
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'blue'
                        },
                        formatter: function(){
                            return this.stack;
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
                    // headerFormat: '<b>{point.x}</b><br/>',
                    // pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                series: [
                {
                    linkedTo: 'udb-errors',
                    name: 'UDB Errors',
                    data: report_19_maint_udb_errors,
                    stack: 'maint'
                }, {
                    linkedTo: 'plant-errors',
                    name: 'Plant Errors',
                    data: report_19_maint_plant_errors,
                    stack: 'maint'
                }, {
                    linkedTo: 'cdn-setup-errors',
                    name: 'CDN Setup Errors',
                    data: report_19_maint_cdn_setup_errors,
                    stack: 'maint'
                }, {
                    linkedTo: 'network-teardown-errors',
                    name: 'Network Teardown Errors',
                    data: report_19_maint_network_teardown_errors,
                    stack: 'maint'
                }, {
                    linkedTo: 'vcp-errors',
                    name: 'VCP Errors',
                    data: report_19_maint_vcp_errors,
                    stack: 'maint'
                }, {
                    linkedTo: 'tune-errors',
                    name: 'Tune Errors',
                    data: report_19_maint_tune_errors,
                    stack: 'maint'
                }, {
                    linkedTo: 'cm-connect-errors',
                    name: 'CM_CONNECT Errors',
                    data: report_19_maint_cm_connect_errors,
                    stack: 'maint'
                }, {
                    linkedTo: 'vlqok-errors',
                    name: 'VLQOK Errors',
                    data: report_19_maint_vlqok_errors,
                    stack: 'maint'
                },
                {
                    id: 'udb-errors',
                    name: 'UDB Errors',
                    data: report_19_peak_udb_errors,
                    stack: 'peak'
                }, {
                    id: 'plant-errors',
                    name: 'Plant Errors',
                    data: report_19_peak_plant_errors,
                    stack: 'peak'
                }, {
                    id: 'cdn-setup-errors',
                    name: 'CDN Setup Errors',
                    data: report_19_peak_cdn_setup_errors,
                    stack: 'peak'
                }, {
                    id: 'network-teardown-errors',
                    name: 'Network Teardown Errors',
                    data: report_19_peak_network_teardown_errors,
                    stack: 'peak'
                }, {
                    id: 'vcp-errors',
                    name: 'VCP Errors',
                    data: report_19_peak_vcp_errors,
                    stack: 'peak'
                }, {
                    id: 'tune-errors',
                    name: 'Tune Errors',
                    data: report_19_peak_tune_errors,
                    stack: 'peak'
                }, {
                    id: 'cm-connect-errors',
                    name: 'CM_CONNECT Errors',
                    data: report_19_peak_cm_connect_errors,
                    stack: 'peak'
                }, {
                    id: 'vlqok-errors',
                    name: 'VLQOK Errors',
                    data: report_19_peak_vlqok_errors,
                    stack: 'peak'
                },
                
                {
                    linkedTo: 'udb-errors',
                    name: 'UDB Errors',
                    data: report_19_others_udb_errors,
                    stack: 'other'
                }, {
                    linkedTo: 'plant-errors',
                    name: 'Plant Errors',
                    data: report_19_others_plant_errors,
                    stack: 'other'
                }, {
                    linkedTo: 'cdn-setup-errors',
                    name: 'CDN Setup Errors',
                    data: report_19_others_cdn_setup_errors,
                    stack: 'other'
                }, {
                    linkedTo: 'network-teardown-errors',
                    name: 'Network Teardown Errors',
                    data: report_19_others_network_teardown_errors,
                    stack: 'other'
                }, {
                    linkedTo: 'vcp-errors',
                    name: 'VCP Errors',
                    data: report_19_others_vcp_errors,
                    stack: 'other'
                }, {
                    linkedTo: 'tune-errors',
                    name: 'Tune Errors',
                    data: report_19_others_tune_errors,
                    stack: 'other'
                }, {
                    linkedTo: 'cm-connect-errors',
                    name: 'CM_CONNECT Errors',
                    data: report_19_others_cm_connect_errors,
                    stack: 'other'
                }, {
                    linkedTo: 'vlqok-errors',
                    name: 'VLQOK Errors',
                    data: report_19_others_vlqok_errors,
                    stack: 'other'
                },
                ]


            });
        }

        function eliminateDuplicates(arr) {
            var i,
                len = arr.length,
                out = [],
                obj = {};

            for (i = 0; i < len; i++) {
                obj[arr[i]] = 0;
            }
            for (i in obj) {
                out.push(i);
            }
            return out;
        }

        gen_points = {}

        var generate_callouts_from_server = function(){

        $.ajax({
            url: '/vbo/store-callouts/?' + 'report_id=' + $('#report_dates').find('option:selected').attr("name"),            
            type: 'GET',
            // async: false,
            success: function(result){
             if (result.status == 'success')   {                           
                if(Object.getOwnPropertyNames(result.results[0]).length != 0){                
                    // console.log('callouts results - 1 == ', JSON.stringify(result.results[0].results))
                    console.log('callouts results - 2 == ', result.results[0].results[0])
                    // gen_points = result.results[0].results[0]
                    // gen_points = gen_points.report_data
                    // gen_points = JSON.parse(gen_points.report_data)
                    // console.log('gen_points - 1 == ', gen_points)
                    // console.log('gen_points - 2 == ', gen_points.report_data)
                    // console.log('callouts results - 3 == ', JSON.parse(result.results[0].results[0].report_data)['0'])
                    callouts = JSON.parse(result.results[0].results[0].report_data)['0']
                    
                    gen_points = JSON.parse(result.results[0].results[0].report_data)
                    console.log('before gen_points == ', gen_points)

                    callouts.forEach(function(obj){                                        
                        
                        id = 0 + '-' + obj.point
                        
                        $('#points-table tr:last').after('<tr id=' + id + '>'
                            + '<td class="callout-line-item">' + 0 + '</td>'
                            + '<td class="callout-x-axis">' + obj.x_axis + '</td> '
                            + '<td class="callout-y-axis">' + obj.y_axis + '</td>'  
                            + '<td class="callout-point">' + obj.point + '</td>'  
                            + '<td class="callout-message">   <textarea> ' + obj.callout + ' </textarea>  </td>'
                            + '<td class="callout-x-axis-position">   <input value='+ obj.y_axis_position+'> </td>'
                            + '<td class="callout-y-axis-position">   <input value='+ obj.x_axis_position+'> </td>'
                            + '<td class="callout-box-type">   <select class="callout-box-type-select"> <option>Box</option>   <option>Line</option> <option>Double Line</option></select></td>'
                            + '<td class="callout-angle">   <input value=' + obj.angle +'></td>'
                            + '<td class="callout-height">   <input value='+ obj.height+'></td>'
                            + '<td class="callout-width">   <input value='+ obj.width+'></td>'
                            + '<td class="callout-color">   <input class="jscolor" value='+ obj.color +'">    </td></tr>');
                        new jscolor($('#points-table tr:last').find('.jscolor')[0])                    
                        $('#'+id).find(".callout-box-type, .callout-box-type-select").val(obj.draw_type);
                    })                               
                    $("#line-elements").prop('selectedIndex', 1);
                    console.log('load all data')
                    load_all_data_points()      
                    $("#report-daily-2-highcharts").highcharts().redraw()                       
             }
            }
            }
        }) 
        }

        var load_highcharts_admin_section = function(){
            
                var chart = $("#report-daily-2-highcharts").highcharts();
                
                console.log('daily report 2 chart data == ', chart)

                line_charts = chart.series.map(function(obj) {
                        return obj.name + '&&' + obj.index;
                    })
                
                console.log('daily report 2 line_charts == ', line_charts)

                $.each(line_charts, function(index, value) {
                        // console.log('name-index- value== ', value)
                        if (index == 0 ){
                            content = value.split('&&')
                                // console.log('name-index- value== ', content)
                            $('#line-elements').append($('<option/>', {
                                value: content[1].trim(),
                                text: content[0].trim()
                            }));
                        }
                    });

                $('#pick-x-y-axis').multiselect({
                height: 600,
                show: ['slide', 500],
                hide: ['slide', 500],
                noneSelectedText: 'Pick Division and select pg',
                click: function(event, ui){                                
                    contents = ui.text.split('&&')                    
                    id = $('#line-elements').val().trim() + '-' +contents[2].trim()
                    if (ui.checked == true){
                        $('#points-table tr:last').after('<tr id=' + id + '>'
                                        // + '<td class="callout-line-item">' + $('#line-elements').find("option:selected").text().trim() + '&&'+ $('#line-elements').val().trim() + '</td>'
                                        + '<td class="callout-line-item">' + 0 + '</td>'
                                        + '<td class="callout-x-axis">' + contents[0].trim() + '</td> '
                                        + '<td class="callout-y-axis">' + contents[1].trim() + '</td>'  
                                        + '<td class="callout-point">' + contents[2].trim() + '</td>'  
                                        + '<td class="callout-message">   <textarea/>  </td>'
                                        + '<td class="callout-x-axis-position">   <input> </td>'
                                        + '<td class="callout-y-axis-position">   <input> </td>'
                                        + '<td class="callout-box-type">   <select> <option>Box</option>   <option>Line</option> <option>Double Line</option></select></td>'
                                        + '<td class="callout-angle">   <input id="angle"/></td>'
                                        + '<td class="callout-height">   <input id="height"/></td>'
                                        + '<td class="callout-width">   <input id="width"/></td>'
                                        + '<td class="callout-color">   <input class="jscolor" value="ab2567"/>    </td></tr>');
                        new jscolor($('#points-table tr:last').find('.jscolor')[0])

                    }else{
                        $('#'+id).remove()
                    }

                    }
                }).multiselectfilter();

        }   

        $('#line-elements').on('change', function() {
                load_all_data_points()                
        });


        load_all_data_points = function(){
                line_chart_name = $('#line-elements').find("option:selected").text()
                
                var chart = $("#report-daily-2-highcharts").highcharts();

                chart.series.forEach(function(obj, index) {
                            if (obj.name == line_chart_name) {
                                categories = chart.xAxis.map(function(obj) {
                                    return obj.categories;
                                })
                                series_data = chart.series[index]
                                    
                                data_points = series_data.yData.map(function(obj, ix) {
                                    return {
                                        'yaxis': parseFloat([series_data.yData[ix]]),
                                        'point': series_data.yData[ix] + ' && ' + categories[0][ix] + ' && ' + ix
                                    }
                                })
                            }
                        })
                        
                data_points.sort(function(a, b) {
                            return b.yaxis - a.yaxis
                        })                        
                $("#pick-x-y-axis").empty();
                $.each(data_points, function() {
                        $('#pick-x-y-axis')
                            .append($('<option></option>')
                                .attr("value", this.yaxis)
                                .text(this.point))
                    });
                $('#pick-x-y-axis').multiselect('refresh');
                console.log('load_all_data_points - 1')
                if(Object.getOwnPropertyNames(gen_points).length != 0){                
                    $('#pick-x-y-axis').multiselect("widget").find(":checkbox").each(function(){
                        checkbox_item = this
                        position_value = this.title.split('&&')[2].trim()                                                
                        console.log('load_all_data_points -gen_points == ', gen_points)
                        console.log('load_all_data_points -gen_points == ', gen_points['0'])
                        gen_points['0'].forEach(function(obj){                            
                            if (position_value == obj.point) {                                                            
                                $(checkbox_item).attr("checked",true)
                            }
                        })                        
                })
                }
                console.log('load_all_data_points - 2')
        }

        //Store the attributes of the callouts in the database

        $('#store-callouts').on('click', function(){
            alert('store callouts')
            // get the report number and id value
            id = $("#store-callouts").closest("div[id*='callouts-admin']").attr('id')            
            report_num = id.split('-')[1] + '-' + id.split('-')[2]        
            console.log('report_num == ', report_num)
            elem = "#report-{0}-comments-txt".format(report_num)        
            comments = $(elem).val()                    
            generate_callout_points()
            console.log('post == ', gen_points)

            $.ajax({
                url: '/vbo/store-callouts/?' + 'report_number=' + $('#report_names').val() + '&report_run_date=' + $('#report_dates').val() +  '&report_num=' + report_num + '&report_id=' + $('#report_dates').find('option:selected').attr("name"),            
                type: 'POST',            
                data: JSON.stringify(gen_points),
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

        // Generate the callouts for the admin to view it real time.
        $('#gen-graph').on('click', function() {        
            $('.callout').remove();
            $('.single-arrow-line').remove();
            $('.double-arrow-line').remove();
            remove_labels = false
            gen_points = {}
            generate_callout_points()
            $("#report-daily-2-highcharts").highcharts().redraw()

        })

        var generate_callout_points = function(){
            gen_points = {}
            $('#points-table tr').not(':first').each(function() {                
                // line_item = $(this).find(".callout-line-item").html().split('&amp;&amp;')[1];                
                line_item = $(this).find(".callout-line-item").html();                
                x_axis = $(this).find(".callout-x-axis").html();
                y_axis = $(this).find(".callout-y-axis").html()
                point = $(this).find(".callout-point").html()
                callout = $(this).find(".callout-message").find('textarea').val()
                y_axis_position = $(this).find(".callout-x-axis-position").find('input').val()
                x_axis_position = $(this).find(".callout-y-axis-position").find('input').val()
                angle = $(this).find(".callout-angle").find('input').val()
                draw_type = $(this).find(".callout-box-type").find('select').val()
                width = $(this).find(".callout-width").find('input').val()
                height = $(this).find(".callout-height").find('input').val()
                color = $(this).find(".callout-color").find('input').val()
                if (line_item in gen_points) {
                    gen_points[line_item].push({ x_axis, y_axis, point, callout, y_axis_position, x_axis_position, color, draw_type, height, width, angle })
                } else {
                    gen_points[line_item] = [{ x_axis, y_axis, point, callout, y_axis_position, x_axis_position, color, draw_type, height, width, angle }]
                }
                console.log('gen_points == ', JSON.stringify(gen_points))

                });
            }


        
    var addCallout = function(chart) {

         x_axis_position_default = 10
         y_axis_position_default = 30
         console.log('******generate callouts******* == ', gen_points)
         console.log('******generate callouts******* == ', JSON.stringify(gen_points))
         var xAxis;
         var yAxis;
         if (Object.keys(gen_points).length === 0) {
             // alert('empty object')
         } else {
             for (var key in gen_points) {

                 xAxis = chart.xAxis[0]
                 yAxis = chart.yAxis[0]

                 gen_points[key].forEach(function(obj, index) {
                     point_val = gen_points[key][index]['point']
                     callout = gen_points[key][index]['callout']
                     y_axis_position = gen_points[key][index]['y_axis_position']
                     x_axis_position = gen_points[key][index]['x_axis_position']
                     color = gen_points[key][index]['color']
                     draw_type = gen_points[key][index]['draw_type']
                     height = gen_points[key][index]['height']
                     width = gen_points[key][index]['width']
                     angle = gen_points[key][index]['angle']

                     series = chart.series[parseInt(key)]
                     point = series.data[parseInt(point_val)];

                     console.log('gen_points == ', gen_points)
                         // console.log('xAxis == ', xAxis)
                         // console.log('yAxis == ', yAxis.toPixels)                                                             
                     if (y_axis_position == '' || parseInt(y_axis_position) == 0) {
                         y_axis_position = 0
                     }
                     if (x_axis_position == '' || parseInt(x_axis_position) == 0) {
                         x_axis_position = 0
                     }
                     console.log('chart.plotTop == ', chart.plotTop)
                     console.log('point.plotX == ', point.plotX)
                     console.log('point.plotY == ', point.plotY)
                     console.log('x_axis_position == ', x_axis_position)
                     console.log('y_axis_position == ', y_axis_position)
                     console.log('xAxis position 1 == ', (point.plotX + chart.plotLeft + x_axis_position_default))
                     console.log('yAxis position 1 == ', (point.plotY + chart.plotTop - y_axis_position_default))
                     console.log('xAxis position 2 == ', (point.plotX + chart.plotLeft + x_axis_position_default) + parseInt(x_axis_position))
                     console.log('yAxis position 2 == ', (point.plotY + chart.plotTop - y_axis_position_default) + parseInt(y_axis_position))
                     remove_labels = false
                     if (remove_labels) {
                         //we dont need this anymore but ill leave it for any future use if needed.
                         console.log(chart.renderer.label)
                         var a = chart.renderer.label('<div class="callout">' + callout + '</div>',
                             point.plotX + chart.plotLeft + 10,
                             point.plotY + chart.plotTop - parseInt(y_axis_position), 'callout', null, null, true).destroy();

                         console.log('a', a);
                     } else {
                         if (draw_type == 'Box') {
                             // alert('draw')              
                             var a = chart.renderer.label('<div class="callout" style="background-color:#' + gen_points[key][index]['color'] + ';height:'+ height +'px;width:'+width+'px">' + callout + '</div>',
                                 (point.plotX + chart.plotLeft + x_axis_position_default) + parseInt(x_axis_position),
                                 (point.plotY + chart.plotTop - y_axis_position_default) - parseInt(y_axis_position), 'callout', null, null, true).add();
                         }else if (draw_type == 'Line') {
                             properties = 'style="display:block; background-color:#' + color + '; height:' + height + 'px; width:' + width + 'px; -ms-transform: rotate(' + angle + 'deg); -webkit-transform: rotate(' + angle + 'deg); transform: rotate(' + angle + 'deg); transform-origin: bottom left;"'
                             console.log(properties)
                             var a = chart.renderer.label('<div class="single-arrow-line" ' + properties + '>  </div>',
                                 (point.plotX + chart.plotLeft + x_axis_position_default) + parseInt(x_axis_position),
                                 (point.plotY + chart.plotTop - y_axis_position_default) - parseInt(y_axis_position), 'callout', null, null, true).add();
                             console.log('a', a);

                         }
                         else {                            
                             properties = 'style="display:block; background-color:#' + color + '; height:' + height + 'px; width:' + width + 'px; -ms-transform: rotate(' + angle + 'deg); -webkit-transform: rotate(' + angle + 'deg); transform: rotate(' + angle + 'deg); transform-origin: bottom left;"'
                             console.log(properties)
                             var a = chart.renderer.label('<div class="double-arrow-line" ' + properties + '>  </div>',
                                 (point.plotX + chart.plotLeft + x_axis_position_default) + parseInt(x_axis_position),
                                 (point.plotY + chart.plotTop - y_axis_position_default) - parseInt(y_axis_position), 'callout', null, null, true).add();
                             console.log('a', a);


                         }

                     }
                 })
             }
         }
    };

    

})