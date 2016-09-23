$(document).ready(function() {     
    
    var curr_date_3 = moment.tz(new Date(), "America/New_York").format();                
    var curr_date = new Date()        

    $("#ams-query-datepicker-start").datepicker({
        value: curr_date_3,
        step: 10
    });

    $("#ams-query-datepicker-start-end").datepicker({
        value: curr_date_3,
        step: 10
    });


    if ('{{active_tab}}' == 'ams'){    
    // $('#vod-sid').hide()
    alert('{{error_msg}}')
    window.location = '/sid-login#ams-sid'
    window.open()
    }


    $('#ams-query').click(function() {        
        load_datatable('N')
     })

    $(function(){
      var hash = window.location.hash;
      hash && $('ul.nav a[href="' + hash + '"]').tab('show');

      $('.nav-tabs a').click(function (e) {
        $(this).tab('show');
        var scrollmem = $('body').scrollTop() || $('html').scrollTop();
        window.location.hash = this.hash;
        $('html,body').scrollTop(scrollmem);
      });
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        
        var target = $(e.target).attr("href")

        if (target == '#ams-sid'){
            load_datatable('Y')      
        }
    })
    var load_datatable = function(initial){
        data = {'initial':initial
                ,'ticket_num': $('#ams-query-ticket-no').val()
                ,'division': $('#ams-query-division').val()
                ,'region': $('#ams-query-region').val()
                ,'start_date_s': $('#ams-query-datepicker-start').val()
                ,'start_date_e': $('#ams-query-datepicker-start-end').val()
                ,'action': $('#ams-query-action').val()
                ,'last_action': $('#ams-query-last-action').val()
                ,'resolve_close': $('#ams-query-resolve-close').val()
        }
        console.log('ams query data == ', data)
        // alert('calling')
        $.ajax({
         url: '/ams-get-ticket-data',
         type: 'POST',
         data: data,
         success: function(result) {
             if (result.status == 'success') {
                console.log(JSON.stringify(result))
                 create_tickets(result)                                                  
             } else if (result.status == 'session timeout') {
                 alert("Session expired -- Please relogin")
                 document.location.href = "/";
             } else {
                 alert("Unable to ams ticket data!! Contact Support");
             }
         },
         error: function() {
             alert("Call to get ams tickets failed");
         }
            })
    }

    function create_tickets(jsondata) {
         transactiondata = jsondata         
         $("<div class='CSSTableGenerator2'  style=' width:100%; overflow:scroll' >").appendTo("#ams-ticket-list");
         $('#pagination-ams').pagination({
             items: transactiondata.results.length,
             itemsOnPage: 50,
             onInit: redrawData,
             onPageClick: redrawData,
             cssStyle: 'light-theme'
         });
     }
     
     function redrawData(pageNumber, event) {         
        transactiondata_results = transactiondata.results
         if (pageNumber) {
             if (pageNumber == 1) {
                 slicedata = transactiondata_results.slice(0, 50)
             } else {                 
                 slicedata = transactiondata_results.slice(((pageNumber - 1) * 50), 50 * pageNumber + 1)
             }
         } else {
             slicedata = transactiondata_results.slice(0, 50)
         }

         $(".CSSTableGenerator2").empty()
         // class='table  tablesorter' style='table-layout:fixed; max-width:60px; width:100%'
         $("<table id='ams-ticket-table' class='table  tablesorter'  style=''> </table>").appendTo('.CSSTableGenerator2')
         
         $('#ams-ticket-table').append('<thead class="thead-inverse">'  
            + '<tr><th>Id</th>'
            + '    <th>URL</th>'
            + '    <th>Brouha</th>'
            + '    <th>Action</th>'
            + '    <th>Last Action before Clear</th>'
            + '    <th>Resolve/Close Reason</th>'
            + '    <th>In Process</th>'
            + '    <th>Chronic</th>'
            + '    <th>Service Affecting</th>'
            + '    <th>From</th>'
            // + '    <th>To</th>'
            + '    <th>Till</th>'
            + '    <th>Duration (minutes)</th>'
            + '    <th>Customers</th>'
            + '    <th>STBs</th>'            
            + '    <th>TTA</th>'            
            + '    <th>TTI</th>'            
            + '    <th>TTS</th>'            
            + '    <th>TTR</th>'            
            + '    <th>By</th>'            
            + '    <th>Division</th>'            
            + '    <th>Region</th>'            
            + '    <th>DAC</th>'            
            + '    <th>Device</th>'            
            + '    <th>IP</th>'            
            + '    <th>Upstreams</th>'            
            + '    <th>Reason</th>'            
            + '    <th>Comment</th>'            
            + '    <th>Root Cause</th>'            
            + '    <th>Corrective Action Taken</th>'            
            + '    <th>SI Ticket</th>'            
            + '    <th>JB Ticket</th>'            
            + '    <th>Found in Support System</th>'            
            + '    <th>Alert Event Text</th>'            
            + '    <th>Alert Type</th>'            
            + '</tr></thead>');

         
         slicedata.forEach(function(obj, i, a) {          
                console.log('obj == ', obj)     
                $('#ams-ticket-table').append('<tr>'
                    + '<td> ' +  obj.ticket_num + ' </td>'
                    + '<td> ' +  obj.url + ' </td>'
                    + '<td> ' +  obj.brouha + ' </td>'
                    + '<td> ' +  obj.action + ' </td>'
                    + '<td> ' +  obj.last_action_before_clear + ' </td>'
                    + '<td> ' +  obj.resolve_close_reason + ' </td>'
                    + '<td> ' +  obj.in_process + ' </td>'
                    + '<td> ' +  obj.chronic + ' </td>'
                    + '<td> ' +  obj.service_affecting + ' </td>'
                    + '<td> ' +  obj.from_dt  + ' </td>'
                    + '<td> ' +  obj.till_dt + ' </td>'
                    + '<td> ' +  obj.duration + ' </td>'
                    + '<td> ' +  obj.customers + ' </td>'
                    + '<td> ' +  obj.stbs + ' </td>'
                    + '<td> ' +  obj.tta + ' </td>'
                    + '<td> ' +  obj.tti + ' </td>'
                    + '<td> ' +  obj.tts + ' </td>'
                    + '<td> ' +  obj.ttr + ' </td>'
                    + '<td> ' +  obj.created_by  + ' </td>'
                    + '<td> ' +  obj.division + ' </td>'
                    + '<td> ' +  obj.region + ' </td>'
                    + '<td> ' +  obj.dac + ' </td>'
                    + '<td> ' +  obj.device + ' </td>'
                    + '<td> ' +  obj.ip + ' </td>'
                    + '<td> ' +  obj.upstreams + ' </td>'
                    + '<td> ' +  obj.reason + ' </td>'
                    + '<td> ' +  obj.comment + ' </td>'
                    + '<td> ' +  obj.root_cause + ' </td>'
                    + '<td> ' +  obj.corrective_action_taken + ' </td>'
                    + '<td> ' +  obj.si_ticket + ' </td>'
                    + '<td> ' +  obj.jb_ticket + ' </td>'
                    + '<td> ' +  obj.found_in_support_system + ' </td>'
                    + '<td> ' +  obj.alert_event_text + ' </td>'
                    + '<td> ' +  obj.alert_type + ' </td>'
                    + '</tr>')
             })



        $("#ams-ticket-table").tablesorter({
             sortList: [],
             headers: {
                 
                 10: {
                     sorter: false
                 },
                 16: {
                     sorter: false
                 }
             },
             theme: "bootstrap",
             headerTemplate: '{content} {icon}',
             widgets: ['uitheme','scroller'],
             widgetOptions: {
                scroller_fixedColumns: 1,
                scroller_height: 300,
                // scroll tbody to top after sorting
                scroller_upAfterSort: true,
                // pop table header into view while scrolling up the page
                scroller_jumpToHeader: true
            }
         });

    

         
    }


     
         
})
 
 
