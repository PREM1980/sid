// multiple axis http://jsfiddle.net/5eem7a2a/1/

// br,nbr,business,errors ,success
// yeah br is a rate
// hence the r component of "br"
// business is the raw count
// that creates is the numerator of br
// business, success, errors are all raw coungs
// business = BR error counts, Errors = NBR error counts # Don
// br/nbr = error rates
// removed it 69.0.0.0/0 (CIDR)
$(document).ready(function() {
    function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
    $(function() {
        var seriesOptions = [],
            seriesCounter = 0,
            names = ['MSFT', 'AAPL', 'GOOG'];
            error_list = ['CM_CONNECT Errors','Infinite Retry Errors','Network Resource Failure','Plant Setup Errors','Plant Teardown Errors','Tune Errors','VCP Errors']                            
            error_constants = ['br','business','errors','nbr','success', 'sr']
            error_counts_results= []

        
        function createChart_rates(chart, params) {
            // console.log(JSON.stringify(params))
            Highcharts.stockChart(chart, {
                title: {
                    text: params.title
                },
                rangeSelector: {
                    selected: 0
                },

                yAxis: [{
                    // min:60,
                    // max:100,
                    // tickInterval: 10,
                    labels: {
                        formatter: function() {
                                    if (params.y2axis == 'pct'){
                                        return (this.value > 0 ? ' + ' : '') + this.value + '%'
                                    }else
                                        return (this.value)                             
                        }                        
                    },
                    title:{
                        text: "Session's",
                        style: {
                        color: Highcharts.getOptions().colors[5]
                    }
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'silver'
                    }],
                    opposite: false
                },
                {
                    min:0,
                    max:10,
                    tickInterval: 5,
                    labels: {
                        formatter:                                 
                                function() {
                                    if (params.y2axis == 'pct'){
                                        return (this.value > 0 ? ' + ' : '') + this.value + '%'
                                    }
                                    else{
                                        return this.value ;
                                    }                                
                                }
                    },
                    title:{
                        text: 'BR / NBR Rates',
                        style: {
                        color: Highcharts.getOptions().colors[5]
                    }
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'silver'
                    }]
                }
                ],
                legend:{
                    enabled: true
                },
                // plotOptions:{
                //      showInLegend: true
                // },
                // plotOptions: {
                //     series: {
                //         compare: 'percent',
                //         showInNavigator: true
                //     }
                // },

                // tooltip: {
                //     pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                //     valueDecimals: 2,
                //     split: true
                // },
                series: 
                [
                {
                name: 'BR',
                data: seriesOptions[1]['data'],
                yAxis: 1
                },
                {
                name: 'NBR',
                data: seriesOptions[2]['data'],
                yAxis: 1
                },
                {
                name: 'Session',
                // type: 'column',
                data: seriesOptions[0]['data'],
                yAxis: 0
                },

                ]
            });
        }    

        function createChart_counts(chart, params) {
            // console.log(JSON.stringify(params))
            Highcharts.stockChart(chart, {
                title: {
                    text: params.title
                },
                rangeSelector: {
                    selected: 0
                },

                yAxis: [{
                    // min:60,
                    // max:100,
                    // tickInterval: 10,
                    labels: {
                        formatter: function() {
                                    if (params.y2axis == 'pct'){
                                        return (this.value > 0 ? ' + ' : '') + this.value + '%'
                                    }else
                                        return (this.value)                             
                        }                        
                    },
                    title:{
                        text: "Session's",
                        style: {
                        color: Highcharts.getOptions().colors[5]
                    }
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'silver'
                    }],
                    opposite: false
                },
                {
                    // min:0,
                    // max:10,
                    // tickInterval: 5,
                    labels: {
                        formatter:                                 
                                function() {
                                    if (params.y2axis == 'pct'){
                                        return (this.value > 0 ? ' + ' : '') + this.value + '%'
                                    }
                                    else{
                                        return this.value ;
                                    }                                
                                }
                    },
                    title:{
                        text: 'BR / NBR Rates',
                        style: {
                        color: Highcharts.getOptions().colors[5]
                    }
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'silver'
                    }]
                }
                ],
                legend:{
                    enabled: true
                },                
                series: 
                [
                {
                name: 'BR',
                data: seriesOptions[1]['data'],
                yAxis: 1
                },
                {
                name: 'NBR',
                data: seriesOptions[2]['data'],
                yAxis: 1
                },
                {
                name: 'Session',
                // type: 'column',
                data: seriesOptions[0]['data'],
                yAxis: 0
                },

                ]
            });
        }    

        // business = BR error counts, Errors = NBR error counts
        // http://jsfiddle.net/5eem7a2a/1/

        var load_graphs = function(scope, scopeFilter, chart_1, chart_2){
            console.log('load_graphs scope == ', scope)
            console.log('load_graphs sopeFilter== ', scopeFilter)
            var deferred = $.Deferred()
            d = new Date()
            starttime = d.setMonth(d.getMonth()-3)
            starttime = d.setDate(d.getDate()-3)
            endtime = (new Date).getTime()
            // console.log('starttime == ', starttime)
            // console.log('endtime == ', endtime)
            if (scope == 'national'){
                url = 'https://vpsq.cable.comcast.com/metrics/vod?scope='+ scope + '&interval=day&startTime='+starttime+'&endTime='+ endtime
            }
            else if (scope == 'division'){
                url = 'https://vpsq.cable.comcast.com/metrics/vod?scope=' + scope + '&scopeFilter=' + scopeFilter + '&interval=day&startTime='+starttime+'&endTime='+ endtime
            }
            // if (scope == 'national'){
            //     url = 'http://96.118.53.210:8081/vpsq-er-ws-0.0.1-SNAPSHOT/vodMetrics?scope='+ scope + '&interval=day&startTime='+starttime+'&endTime='+ endtime
            // }
            // else if (scope == 'division'){
            //     url = 'http://96.118.53.210:8081/vpsq-er-ws-0.0.1-SNAPSHOT/vodMetrics?scope=' + scope + '&scopeFilter=' + scopeFilter + '&interval=day&startTime='+starttime+'&endTime='+ endtime
            // }
            // else if (scope == 'division'){
            //     url = 'http://96.118.53.210:8081/vpsq-er-ws-0.0.1-SNAPSHOT/vodMetrics?scope=' + scope + '&scopeFilter=' + scopeFilter + '&interval=day&startTime='+starttime+'&endTime='+ endtime
            // }
            // else if (scope == 'central'){
            //     url = 'http://96.118.53.210:8081/vpsq-er-ws-0.0.1-SNAPSHOT/vodMetrics?scope=' + scope + '&scopeFilter=' + scopeFilter + '&interval=day&startTime='+starttime+'&endTime='+ endtime
            // }

            if (scopeFilter == ''){
                data_filter = 'national'
            }
            else if  (scopeFilter == 'western'){
                data_filter = 'Western'
            }
            else if  (scopeFilter == 'northeast'){
                data_filter = 'Northeast'
            }
            else if  (scopeFilter == 'central'){
                data_filter = 'Central'
            }
            console.log(url)
            console.log('scopeFilter == ', scopeFilter)
            console.log('data_filter == ',data_filter)
            
            $.ajax({type:'GET',
                url: url,             
                // dataType: 'jsonp',
                jsonpCallback: 'test',
                success: function(data){                    
                    // console.log(JSON.stringify(data))
                    console.log('data == ', data)
                    $.each(data,function(i,x){                    
                        console.log('data x1 == ', x[0]['X1'])                                                
                        console.log('data x1 data_filter == ', data_filter)                                                
                        console.log('data x1 data_filter applied == ', x[0]['X1'][data_filter])                                                

                        for (var i = 0; i <= 10; i++)
                        {   
                            error_counts_results[i] = []
                        }
                        $.each(x[0]['X1'][data_filter], function(unix_date,data){                                
                            if  (parseFloat(unix_date)){
                                $.each(error_constants, 
                                    function(ix,error_item){  
                                        // console.log(ix)
                                        // console.log(data[error_item])
                                        error_counts_results[ix].push([parseInt(unix_date),data[error_item]])
                                    }
                                )
                            // console.log('result == ', JSON.stringify(error_counts_results))
                            }                           
                        })
                    })
                    // $.each(error_constants, function(i, name){
                    //     seriesOptions[i] = {
                    //     name: name,
                    //     data: error_counts_results[i]
                    //     };
                    // })
                    seriesOptions[0] = {
                        name: error_constants[5],
                        data: error_counts_results[5]
                    };
                    console.log('option 1 == ', seriesOptions[0])
                    seriesOptions[1] = {
                        name: error_constants[0],
                        data: error_counts_results[0]
                    };
                    console.log('option 2 == ', seriesOptions[1])
                    seriesOptions[2] = {
                        name: error_constants[3],
                        data: error_counts_results[3]
                    };
                    console.log('option 3 == ', seriesOptions[2])
                    params = {
                        'title':  capitalizeFirstLetter(data_filter) + '- Session Rates vs BR/NBR Rates'
                        // 'title': capitalizeFirstLetter(data_filter) + ' - Session Rates vs BR/NBR Rates'
                        ,'y2axis':'pct'
                    }                                 
                    createChart_rates(chart_1,params);
                    seriesOptions[0] = {
                        name: error_constants[4],
                        data: error_counts_results[4]
                    };
                    
                    seriesOptions[1] = {
                        name: name,
                        data: error_counts_results[1]
                    };

                    seriesOptions[2] = {
                        name: name,
                        data: error_counts_results[2]
                    };
                    params = {
                        'title':capitalizeFirstLetter(data_filter) +  ' - Session Counts vs BR/NBR Counts'
                        ,'y2axis':'cnt'
                    }                                 
                    createChart_counts(chart_2,params);
                    deferred.resolve()
                    
                },                
            })
            return deferred.promise()
        }

        load_graphs('national','','container-natl-rates','container-natl-counts').then(
            function() {
                load_graphs('division','western','container-west-rates','container-west-counts').then(
                    function() {
                load_graphs('division','central','container-central-rates','container-central-counts').then(
                    function() {
                    load_graphs('division','northeast','container-east-rates','container-east-counts')    
            }
            )   
                }
            )
            }
        )
        // .then(
            
        // ).then(
        //     function() {
        //         load_graphs('division','Northeast','container-east-rates','container-east-counts')    
        //     }
        // )

        // load_graphs('national','','container-natl-rates','container-natl-counts',
        //     function() {
        //         load_graphs('division','Western','container-west-rates','container-west-counts')    
        //     }
        // )

        // function load_all_graphs(arg1, arg2, arg3){
        //     var result = load_graphs('national','','container-natl-rates','container-natl-counts')
        //     console.log('result == ', result)
        //     var result = load_graphs('division','Western','container-west-rates','container-west-counts')
        //     console.log('result == ', result)
        // }

        // load_all_graphs()

        // var promise_1 = load_graphs('national','','container-natl-rates','container-natl-counts')        
        // var promise_2 = load_graphs('division','Western','container-west-rates','container-west-counts')
        
        // console.log('start promise')
        // $.when(promise_1, promise_2).done(function(){console.log('its complete')})



    });

})
