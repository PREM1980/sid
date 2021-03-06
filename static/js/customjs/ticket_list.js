 
 
 $(document).ready(function() {     
     $('#random-check').change(function() {

    if ($("#random-check").is(":checked")) {
        $.ajax({
            url: '/sid-get-uuid',
            type: 'GET',            
            success: function(result) {
                // console.log('getuuid == ' + JSON.stringify(result))
                if (result.status == 'success') {
                    $('#ticket_no').val(result.uuid)
                } else {
                    alert("Unable to get UUID Error!! Contact Support");
                }
            },
            error: function() {
                alert("Unable to get UUID!! Contact Support");
            }
        })
    } else {
        $('#ticket_no').val("")}
    })


    function disable_local_tz(){
        var d = new Date();
        var n = d.getTimezoneOffset();
        var timezone = n / -60;
        if (timezone == -4){
            $('.radio-est').hide()
        }
     }

     disable_local_tz()

     $('#radio-local,#radio-est,#radio-utc').click(function(){        
        // console.log("prem-prem elem == ", this)
        set_tz($(this).val())

     })
     var set_tz = function(elem){            
        if (elem == 'local'){
            $('.local-col').show()
            $('.est-col').hide()
            $('.utc-col').hide()
        }else if (elem == 'est'){
            $('.est-col').show()
            $('.local-col').hide()
            $('.utc-col').hide()
        }else {
            $('.local-col').hide()
            $('.est-col').hide()
            $('.utc-col').show()
        }

     }

     $('#errorcount, #row_error_count').change(function() { 
        n = $(this).val()
        n = n.replace(/,/g, '')
        var parts=n.toString().split(".");
        val =  parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "")
        $(this).val(val)
         });
     

     $("#dropdown-menu li").not('.emptyMessage').click(function() {
          $('#errorcount').val($(this).text())
        });

    $("#dialog-dropdown-menu li").not('.emptyMessage').click(function() {
          $('#row_error_count').val($(this).text())
        });

     
     var toType = function(obj) {
         return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
        }

     $(function() {
         $("#accordion").accordion({
             collapsible: true,
         });
     });

     $(function() {
         $("#peergroup").multiselect({
             height: 600,
             show: ['slide', 500],
             hide: ['slide', 500],
             noneSelectedText: 'Pick Division and select pg'
         }).multiselectfilter();
     });

     $(function() {
         $("#query_peergroup").multiselect({
             height: 600,
             show: ['slide', 500],
             hide: ['slide', 500],
             noneSelectedText: 'Pick Division and select pg'
         }).multiselectfilter();
     });
     $(function() {
         $("#row_peergroup").multiselect({
             height: 600,
             show: ['slide', 500],
             hide: ['slide', 500],
             noneSelectedText: 'Pick Division and select pg'
         }).multiselectfilter();
     });

     function get_pgs(pg_object) {
         pg = []
         a = $(pg_object).multiselect("getChecked")
         for (index = 0; index < a.length; ++index) {
             //console.log("pg select value == ", a[index].value.substring(0:4))
             pg.push(a[index].value.substring(0, 5))
         }

         multiselect_widget_length = $(pg_object).multiselect("widget").find('.ui-multiselect-checkboxes li').length

         if ((multiselect_widget_length == pg.length) && (multiselect_widget_length != 0)) {
             pg = []
             pg.push('ALL')
         }
         
         return pg;

     }

     function reverse(s) {
         var o = '';
         for (var i = s.length - 1; i >= 0; i--)
             o += s[i];
         return o;
     }

     $('#upload').click(function(event) {
        create_dt = moment($('#datepicker').val(),'YYYY/MM/DD HH:mm');
        // console.log(create_dt.format())         

         event.preventDefault();
         event.stopPropagation();

         if (($('#division').val().length == 0) || ($('#division').val() == 'Division')) {
             alert('Select a division')
         } else if ($('#peergroup :selected').length == 0) {
             alert('Select a peergroup')
                 // } else if ($('#duration').val() == 'Duration (in mins)') {
                 //     alert('Pick Duration value')
                 // } else if ($('#errorcount').val() == 'Error Count') {
                 //     alert('Pick ErrorCount value')
                 // } else if ($('#cause').val() == 'Outage Caused') {
                 //     alert('Pick OutageCaused value')
                 // } else if ($('#subcause').val() == 'System Caused') {
                 //     alert('Pick SystemCaused value')
         } else if ($('#ticket_no').val().length == 0) {
             alert('Enter a valid ticket number')
         } else if ($('#radio1').is(':not(:checked)') && $('#radio2').is(':not(:checked)')) {
             alert('Select JIRA/TTS ticket')
         } else {
             duration = $('#duration').val()
             error_count = $('#errorcount').val()
             outage_caused = $('#cause').val()
             system_caused = $('#subcause').val()

             if (duration == 'Duration (in mins)') {
                 duration = ""
             }

             if (error_count == 'Error Count') {
                 error_count = ""
             }
             if (outage_caused == 'Outage Caused') {
                 outage_caused = ""
             }
             if (system_caused == 'System Caused') {
                 system_caused = ""
             }

             pg = get_pgs('#peergroup')

             ticket_num_n_link = $('#ticket_no').val()

             if (ticket_num_n_link.substring(0, 4) == 'http') {
                 ticket_num_only = reverse(reverse(ticket_num_n_link).split('/')[0])
                 ticket_num = ticket_num_only
                 ticket_link = ticket_num_n_link
             } else {

                 ticket_num = ticket_num_n_link
                 ticket_link = ''
             }                    

             data = {
                 //'date': new Date($('#datepicker').val()),
                 'date': create_dt.format(),
                 'division': $('#division').val(),
                 'pg': pg,
                 'duration': duration,
                 'error_count': error_count,
                 'outage_caused': outage_caused,
                 'system_caused': system_caused,
                 'ticket_num': ticket_num.trim(),
                 'ticket_link': ticket_link,
                 'addt_notes': $('#additional_notes').val(),
                 'ticket_type': $('input[name=tkt-radio]:checked').val(),
                 'sid_antenna_root_cause': $('#sid-antenna-root-cause').val(),
                 'sid_outage_categories': $('#sid-outage-categories').val(),
                 'sid_mitigate_check': ($('#sid-mitigate-check').val() == 'Yes' ? 'Y': 'N'), 
                 'sid_hardened_check': ($('#sid-hardened-check').val() == 'Yes' ? 'Y': 'N'), 
                 'sid_antenna_tune_error': ($('#sid-antenna-tune-error').val() == '' ? 0: $('#sid-antenna-tune-error').val()), 
                 'sid_antenna_qam_error': ($('#sid-antenna-qam-error').val() == '' ? 0: $('#sid-antenna-qam-error').val()),
                 'sid_antenna_network_error': ($('#sid-antenna-network-error').val() == '' ? 0: $('#sid-antenna-network-error').val()),
                 'sid_antenna_insuff_qam_error': ($('#sid-antenna-insuff-qam-error').val() == '' ? 0: $('#sid-antenna-insuff-qam-error').val()),
                 'sid_antenna_cm_error': ($('#sid-antenna-cm-error').val() == '' ? 0: $('#sid-antenna-cm-error').val())
             }
             // console.log("Insert ticket data ", data)
             
             $.ajax({
                 type: "POST",
                 url: '/post-ticket-data',
                 data: data,
                 success: function(result) {
                     if (result.status == 'success') {
                         alert("You're stored in our DB!! Playaround!!!!")
                         //reset values
                         //multiselect both needs to be together - uncheck and refresh
                         $("#peergroup option:selected").removeAttr("selected");
                         $("#peergroup").multiselect('refresh');
                         $('#division').prop('selectedIndex', 1);
                         $('#duration').prop('selectedIndex', 0);
                         $('#errorcount').prop('selectedIndex', 0);
                         $('#cause').prop('selectedIndex', 0);
                         $('#subcause').prop('selectedIndex', 0);
                         $('#ticket_no').val('');
                         $('#additional_notes').val('');
                         $("#random-check").prop( "checked", false );
                         $('#sid-antenna-root-cause').prop('selectedIndex', 0)
                         $('#sid-outage-categories').prop('selectedIndex', 0)
                         $("#sid-mitigate-check").prop( "selectedIndex", 0);
                         $("#sid-hardened-check").prop( "selectedIndex", 0);
                         $('#sid-antenna-tune-error').val('');
                         $('#sid-antenna-qam-error').val('');
                         $('#sid-antenna-network-error').val('');
                         $('#sid-antenna-insuff-qam-error').val('');
                         $('#sid-antenna-cm-error').val('');
                         //reset values over
                         load_datatable('N')
                     } else if (result.status == 'session timeout') {
                         alert("Session expired -- Please relogin")
                         document.location.href = "/";
                     } else {
                         alert(result.status)
                     }
                 },
             });
         }
     });

     $('#radio_division').click(function() {
         if ($('#radio_division').is(':checked')) {
             $('#divisions').show()
             $('#divisions_header').show()
             $("#radio_national").removeAttr("checked");
         }
     });

     $('#radio_national').click(function() {
         if ($('#radio_national').is(':checked')) {
             $('#divisions').hide()
             $("#radio_division").removeAttr("checked");
         }
     });

     $(function() {
         $("#dialog_pg_select").dialog({
             maxWidth: 800,
             maxHeight: 1000,
             width: 700,
             height: 800,
             modal: true,
             autoOpen: false,
         })
     });

     $(function() {
         $("#dialog").dialog({
             maxWidth: 800,
             maxHeight: 1000,
             width: 500,
             height: 500,
             modal: true,
             autoOpen: false,
             show: {
                 effect: "explode",
                 duration: 100
             },
             hide: {
                 effect: "explode",
                 duration: 100
             },
             buttons: {
                 "Cancel": function() {
                     $(this).dialog("close");
                 },
                 "Update": function() {
                     if ($('#row_peergroup :selected').length == 0) {
                         alert('Select a peergroup')
                     } else {
                         data = {}
                         pg = get_pgs('#row_peergroup')
                         create_dt = moment($('#dialog_created_dt').val(),'YYYY/MM/DD HH:mm');
                         if ($('#dialog_end_dt').val() == ''){
                            end_dt = ''
                         }else{
                            end_dt = moment($('#dialog_end_dt').val(),'YYYY/MM/DD HH:mm');
                            end_dt = end_dt.format()
                        }           

                        ticket_num_n_link = $('#dialog_ticket_num').val()

                        if (ticket_num_n_link.substring(0, 4) == 'http') {
                             ticket_num_only = reverse(reverse(ticket_num_n_link).split('/')[0])
                             ticket_num = ticket_num_only
                             ticket_link = ticket_num_n_link
                        } else {
                             ticket_num = ticket_num_n_link
                             ticket_link = ''
                        }             
                         data = {
                             'created_dt': create_dt.format(),
                             'end_dt': end_dt,
                             'division': $('#row_division').val(),
                             'pg': pg,
                             'duration': $('#row_duration').val(),
                             'error_count': $('#row_error_count').val(),
                             'outage_caused': $('#row_cause').val(),
                             'system_caused': $('#row_system_cause').val(),
                             'addt_notes': $('#dialog_addt_notes').text(),
                             'ticket_num': ticket_num,
                             'ticket_link': ticket_link,
                             'orig_ticket_num': $('#dialog_orig_ticket_num').val(),
                             'ticket_type': $('#dialog_ticket_type').html(),
                             'update_end_dt': 'N',
                             'antenna_root_cause': $('#dialog-sid-antenna-root-cause').val(),
                             'outage_categories': $('#dialog-sid-outage-categories').val(),
                             'mitigate_check': ($('#dialog-sid-mitigate-check').val() == 'Yes' ? 'Y': 'N'), 
                             'hardened_check': ($('#dialog-sid-hardened-check').val() == 'Yes' ? 'Y': 'N'), 
                             'antenna_tune_error': ($('#dialog-sid-antenna-tune-error').val() == '' ? 0: $('#dialog-sid-antenna-tune-error').val()),                              
                             'antenna_qam_error': ($('#dialog-sid-antenna-qam-error').val() == '' ? 0: $('#dialog-sid-antenna-qam-error').val()),                             
                             'antenna_network_error': ($('#dialog-sid-antenna-network-error').val() == '' ? 0: $('#dialog-sid-antenna-network-error').val()),                             
                             'antenna_insuff_qam_error': ($('#dialog-sid-antenna-insuff-qam-error').val() == '' ? 0: $('#dialog-sid-antenna-insuff-qam-error').val()),                             
                             'antenna_cm_error': ($('#dialog-sid-antenna-cm-error').val() == '' ? 0: $('#dialog-sid-antenna-cm-error').val()),                              
                         }
                         // console.log('update data == ', data)
                         $.ajax({
                             url: '/update-ticket-data',
                             type: 'POST',
                             data: data,
                             success: function(result) {
                                 // console.log(JSON.stringify(result))
                                 if (result.status == 'success') {
                                     alert("Row Updated!! Playaround!!")
                                     $('#dialog').dialog("close");
                                     load_datatable('N')
                                 } else if (result.status == 'session timeout') {
                                     alert("Session expired -- Please relogin")
                                     document.location.href = "/";
                                 } else {
                                     alert("Row Update Failed!! Contact Support")
                                 }
                             },
                             error: function(msg) {
                                 alert("Call to Update ticket failed!! Contact Support!!")
                             },

                         })
                     }
                 }
             }

         })
     })

     $("#division").change(function() {
         $("#dialog-pg").dialog("open");
     });
     $("#opener").click(function() {
         $("#dialog").dialog("open");
     });
     $('#query').click(function() {
         load_datatable('N')
     })
     $('#exportExcel').click(function() {
         load_datatable('N', 'EXCEL')
     })
     $('#exportPdf').click(function() {
         load_datatable('N', 'PDF')
     })
     var load_datatable = function(initial, download_report) {
         data = {}
         pg = []
         if (initial == 'N') {
             pg = get_pgs('#query_peergroup')
         }
         ticket_num = $('#query_ticket_no').val()
         if ($('#query-sid-mitigate-check').val() == 'Yes'){
             mitigate_check = 'Y'
        }else if ($('#query-sid-mitigate-check').val() == 'All'){
            mitigate_check = 'All'
        }else{
            mitigate_check = 'N'            
        }
        if ($('#query-sid-mitigate-check').val() == 'Yes'){
             hardened_check = 'Y'
        }else if ($('#query-sid-mitigate-check').val() == 'All'){
            hardened_check = 'All'
        }else{
            hardened_check = 'N'            
        }

         data = {
             'start_date_s': $('#query_datepicker_start').val(),
             'start_date_e': $('#query_datepicker_start_end').val(),
             'end_date_s': $('#query_datepicker_end').val(),
             'end_date_e': $('#query_datepicker_end_end').val(),
             'query_user_id': $('#query_user_id').val(),
             'ticket_num': ticket_num,
             'division': $('#query_division').val(),
             'pg': pg,
             'duration': $('#query_duration').val(),
             'error_count': $('#query_errorcount').val(),
             'outage_caused': $('#query_cause').val(),
             'system_caused': $('#query_subcause').val(),
             'addt_notes': $('#query_addt_notes').html(),
             'antenna_root_cause': $('#query-sid-antenna-root-cause').val(),
             'outage_categories': $('#query-sid-outage-categories').val(),
             'mitigate_check': mitigate_check, 
             'hardened_check': hardened_check, 
             'antenna_tune_error_s': ($('#query-sid-antenna-tune-error-s').val() == '' ? 0: $('#query-sid-antenna-tune-error-s').val()), 
             'antenna_tune_error_e': ($('#query-sid-antenna-tune-error-e').val() == '' ? 0: $('#query-sid-antenna-tune-error-e').val()), 
             'antenna_qam_error_s': ($('#query-sid-antenna-qam-error-s').val() == '' ? 0: $('#query-sid-antenna-qam-error-s').val()),
             'antenna_qam_error_e': ($('#query-sid-antenna-qam-error-e').val() == '' ? 0: $('#query-sid-antenna-qam-error-e').val()),
             'antenna_network_error_s': ($('#query-sid-antenna-network-error-s').val() == '' ? 0: $('#query-sid-antenna-network-error-s').val()),
             'antenna_network_error_e': ($('#query-sid-antenna-network-error-e').val() == '' ? 0: $('#query-sid-antenna-network-error-e').val()),
             'antenna_insuff_qam_error_s': ($('#query-sid-antenna-insuff-qam-error-s').val() == '' ? 0: $('#query-sid-antenna-insuff-qam-error-s').val()),
             'antenna_insuff_qam_error_e': ($('#query-sid-antenna-insuff-qam-error-e').val() == '' ? 0: $('#query-sid-antenna-insuff-qam-error-e').val()),
             'antenna_cm_error_s': ($('#query-sid-antenna-cm-error-s').val() == '' ? 0: $('#query-sid-antenna-cm-error-s').val()), 
             'antenna_cm_error_e': ($('#query-sid-antenna-cm-error-e').val() == '' ? 0: $('#query-sid-antenna-cm-error-e').val()),            
             'initial': initial
         }
         // console.log('data_table data == ', data)

         reports = ['EXCEL', 'PDF']

         if (reports.indexOf(download_report) > -1) {
             $('#hidden_form_start_date_s').val(data['start_date_s'])
             $('#hidden_form_start_date_e').val(data['start_date_e'])
             $('#hidden_form_ticket_num').val(data['ticket_num'])
             $('#hidden_form_division').val(data['division'])
             $('#hidden_form_pg').val(data['pg'])
             $('#hidden_form_duration').val(data['duration'])
             $('#hidden_form_error_count').val(data['error_count'])
             $('#hidden_form_outage_caused').val(data['outage_caused'])
             $('#hidden_form_system_caused').val(data['system_caused'])
             $('#hidden_form_addt_notes').val(data['addt_notes'])
             $('#hidden_form_tz').val($('input[name=optradio]:checked', '#tzForm').val())
             offset = new Date().getTimezoneOffset() 
             if ( offset > 0 ){
                offset = '-' + offset
             }else{
                offset = '+' + offset
             }
             $('#hidden_form_local_time_offset').val(offset)
             if (download_report == 'PDF') {
                 $('#downloadform').attr('action', '/pdf-download-data');
                 $('#downloadform').submit()
             } else {
                 $('#downloadform').attr('action', '/xls-download-data');
                 $('#downloadform').submit()
             }
         } else {
             // console.log(JSON.stringify(data))
             $.ajax({
                 url: '/get-ticket-data',
                 type: 'POST',
                 data: data,
                 success: function(result) {
                     if (result.status == 'success') {
                        // console.log(JSON.stringify(result))
                         create_tickets(result)
                         set_division(login_id)
                         disable_local_tz()
                         elem = $('input[name=optradio]:checked', '#tzForm').val()             
                         set_tz(elem)                         
                         if (!admin_user){
                            $('.admin-button').hide()
                            }
                         // If its Ninja we need to hide the edits button of SID.
                         if(window.location.href.indexOf("ninja") > -1) {                         
                            $('.editsbutton').hide()
                            }
                        //Collapse the createsection panel
                        $('#create-addt-fields').collapse('hide');
                        $('#filter-addt-fields').collapse('hide');

                     } else if (result.status == 'session timeout') {
                         alert("Session expired -- Please relogin")
                         document.location.href = "/";
                     } else {
                         alert("Unable to get data!! Contact Support");
                     }
                 },
                 error: function() {
                     alert("Call to searchproduct failed");
                 }
             })
         }
     }

     var set_division = function(login_id){
        $.ajax({
         url: '/get-ninja-users',
         type: 'GET',
         //data: data,
         success: function(result) {
             if (result.status == 'success') {
                 // console.log('call success == ', result.results)
                 //console.log(toType(result.results))
                 ninja_users = []
                 // console.log('***'+login_id)
                 JSON.parse(result.results).forEach(function(obj, i, a) {
                     // console.log(obj.fields.userid)
                     if (obj.fields.userid == login_id){
                        // console.log('id matched == ' + obj.fields.region)
                        $("#division").val(obj.fields.region);
                        getval({'value':obj.fields.region},'inputting',[])
                     }                   
                 })                 
             } else {
                 alert("Unable to get all NinjaUsers/Division!! Contact Support");
             }
         },
         error: function() {
             alert("Call to searchproduct failed");
         }
     })
    }

     load_datatable('Y')

     function create_tickets(jsondata) {
         transactiondata = jsondata         
         $("<div class='CSSTableGenerator1'  style=' width:100%; overflow:scroll' >").appendTo("#ticket_list");
         $('#pagination').pagination({
             items: transactiondata.results.length,
             itemsOnPage: 50,
             onInit: redrawData,
             onPageClick: redrawData,
             cssStyle: 'light-theme'
         });
     }

     function redrawData(pageNumber, event) {
         // console.log('jsondata = ' + JSON.stringify(transactiondata.results))
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

         $(".CSSTableGenerator1").empty()
         // class='table  tablesorter' style='table-layout:fixed; max-width:60px; width:100%'
         $("<table id='ticket-table' class='table  tablesorter'  style=''> </table>").appendTo('.CSSTableGenerator1')
         $('#ticket-table').append('<thead class="thead-inverse"><tr><th style="display:none">id</th><th>User Id</th><th class="local-col">Create Date<span style="text-align:center;color:blue"> (Local)</span></th><th class="est-col" style="display:none">Create Date <span style="text-align:center;color:blue"> (EST)</span></th>' 
            + '<th class="utc-col" style="display:none">Create Date<span style="text-align:center;color:blue"> (UTC)</span></th><th class="local-col">End Date</th><th class="est-col" style="display:none">End Date</th><th class="utc-col" style="display:none">End Date</th><th>Ticket#</th>'
            + '<th> Division </th> <th>PeerGroup</th> <th>Duration</th><th>Error Count</th><th>Outage Cause</th><th>System Caused</th><th>Addt Notes</th><th class="editsbutton"></th>'
            + '<th class="admin-button"> Antenna Root Cause </th> <th class="admin-button"> Outage Categories </th><th class="admin-button"> Mitigated </th><th class="admin-button">  Hardened </th>'
            + '<th class="admin-button"> Antenna - Tune Error </th><th class="admin-button">  Antenna - VIDEO LOST QAM Error </th><th class="admin-button"> Antenna - Network Resource Error </th><th class="admin-button"> Antenna - Inff QAM </th><th class="admin-button"> Antenna - CM Connect </th></tr></thead>');

         slicedata.forEach(function(obj, i, a) {
                 // console.log("object == ", obj)
                 user_id = obj.crt_user_id
                 if (typeof user_id === 'string') {
                 } else {
                     obj.crt_user_id = ""
                 }
                 created_dt_local = moment(obj.created_dt).format('MMM DD, YYYY HH:mm:ss');
                 created_dt_est = moment(obj.created_dt).tz("America/New_York").format('MMM DD, YYYY HH:mm:ss');
                 created_dt_utc = moment.utc(obj.created_dt).format('MMM DD, YYYY HH:mm:ss');
                 // console.log('obj.created_dt_est == ', created_dt_est)
                 // console.log('obj.created_dt_utc == ', created_dt_utc)
                 // console.log('obj.created_dt == ', created_dt_local)                 
                 // console.log('obj.row_end_ts == ', obj.row_end_ts)

                 if (obj.row_end_ts == '') {
                     row_end_ts = ""
                     row_end_ts_est = ""
                     row_end_ts_utc = ""
                 } else {
                     row_end_ts = moment(obj.row_end_ts).format('MMM DD, YYYY HH:mm:ss');
                     row_end_ts_est = moment(obj.row_end_ts).tz("America/New_York").format('MMM DD, YYYY HH:mm:ss');
                     row_end_ts_utc = moment.utc(obj.row_end_ts).format('MMM DD, YYYY HH:mm:ss');
                 }

                 if (obj.ticket_link.length == 0) {
                     $('#ticket-table').append('<tr><td id="id_tkt_type" style="display:none">' + obj.ticket_type + '</td><td id="id_user_id">' + obj.crt_user_id + '</td><td id="id_created_dt" class="local-col">' + created_dt_local + '</td> <td id="id_created_dt_est" class="est-col" style="display:none">' 
                        + created_dt_est + '</td> <td id="id_created_dt_utc" class="utc-col" style="display:none">' + created_dt_utc + '</td> <td id="id_row_end_ts" class="local-col">' + row_end_ts + '</td><td id="id_row_end_ts_est" class="est-col" style="display:none">' + row_end_ts_est 
                        + '</td> <td id="id_row_end_ts_utc" class="utc-col" style="display:none">' + row_end_ts_utc + '</td> <td style="word-wrap: break-word" id="id_ticket_num">' + obj.ticket_num + '</td> <td style="display:none" id="id_orig_ticket_num">' + obj.ticket_num + '</td> <td id="id_division">' + obj.division 
                        + '</td><td id="id_pg">  <select class="form-control input-sm" id="table_pg' + i + '""> </select>  </td> <td id="id_duration">' + obj.duration + '</td><td id="id_error_count">' + obj.error_count + '</td><td id="id_outage_caused">' + obj.outage_caused + '</td><td id="id_system_caused">' + obj.system_caused 
                        + '</td><td id="id_addt_notes" ><div style="height:40px;overflow:scroll" title="' + obj.addt_notes + '">' + obj.addt_notes + '</div></td><td class="editsbutton" ><button  id="edit' + i + '"">edit</button><button id="end' + i + '"">end</button></td>'
                        + '<td class="admin-button" id="id_antenna_root_cause">' + obj.antenna_root_caused + '</td> '
                        + '<td class="admin-button" id="id_outage_categories">' + obj.outage_categories + '</td> '
                        + '<td class="admin-button" id="id_mitigate_check">' + (obj.mitigate_check == 'Y' ? 'Yes': 'No') + '</td> '
                        + '<td class="admin-button" id="id_hardened_check">' + (obj.hardened_check == 'Y' ? 'Yes': 'No') + '</td> '
                        + '<td class="admin-button" id="id_antenna_tune_error">' + obj.antenna_tune_error + '</td> '
                        + '<td class="admin-button" id="id_antenna_qam_error">' + obj.antenna_qam_error + '</td> '
                        + '<td class="admin-button" id="id_antenna_network_error">' + obj.antenna_network_error + '</td> '
                        + '<td class="admin-button" id="id_antenna_insuff_qam_error">' + obj.antenna_insuff_qam_error + '</td> '
                        + '<td class="admin-button" id="id_antenna_cm_error">' + obj.antenna_cm_error + '</td> '
                        + '</tr>');
                    var row_index = $('#ticket-table tr:last').index()
                    // alert(row_index)
                    //$('#ticket-table tr:laafter( '<td>cell 1a</td>' );
                     // $('#ticket-table > tr > td:first-child').after( '<td>cell 1a</td>' );

                 } else {
                    // continue;
                     $('#ticket-table').append('<tr><td id="id_tkt_type" style="display:none">' + obj.ticket_type + '</td><td id="id_user_id">' + obj.crt_user_id + '</td><td id="id_created_dt" class="local-col">' + created_dt_local + '</td> <td id="id_created_dt_est" class="est-col" style="display:none">' 
                        + created_dt_est + '</td> <td id="id_created_dt_utc" class="utc-col" style="display:none">' + created_dt_utc + '</td> <td id="id_row_end_ts" class="local-col">' + row_end_ts + '</td><td id="id_row_end_ts_est" class="est-col" style="display:none">' + row_end_ts_est 
                        + '</td><td id="id_row_end_ts_utc" class="utc-col" style="display:none">' + row_end_ts_utc + '</td> ' 
                        + '<td style="word-wrap: break-word" id="id_ticket_num"><a href="' + obj.ticket_link + '" target="_blank" >' + obj.ticket_num + '</a> </td>'  
                        + '<td style="display:none" id="id_orig_ticket_num">' + obj.ticket_num + '</td> '
                        + '<td id="id_division">'  + obj.division + '</td><td id="id_pg">  <select class="form-control input-sm" id="table_pg' + i + '""> </select>  </td> <td id="id_duration">' + obj.duration + '</td><td id="id_error_count">' 
                        + obj.error_count + '</td><td id="id_outage_caused">' + obj.outage_caused + '</td><td id="id_system_caused">' + obj.system_caused + '</td><td id="id_addt_notes" ><div style="height:40px;overflow:scroll" title="' + obj.addt_notes + '">' 
                        + obj.addt_notes + '</div></td><td class="editsbutton"><button class="editbutton" id="edit' + i + '"">edit</button><button id="end' + i + '"">end</button></td>'
                        + '<td style="display:none" id="id_orig_ticket_link">' + obj.ticket_link + '</td>' +
                        + '<td class="admin-button" id="id_antenna_root_cause">' + obj.antenna_root_caused + '</td> '
                        + '<td class="admin-button" id="id_outage_categories">' + obj.outage_categories + '</td> '
                        + '<td class="admin-button" id="id_mitigate_check">' + obj.mitigate_check + '</td> '
                        + '<td class="admin-button" id="id_hardened_check">' + obj.hardened_check + '</td> '
                        + '<td class="admin-button" id="id_antenna_tune_error">' + obj.antenna_tune_error + '</td> '
                        + '<td class="admin-button" id="id_antenna_qam_error">' + obj.antenna_qam_error + '</td> '
                        + '<td class="admin-button" id="id_antenna_network_error">' + obj.antenna_network_error + '</td> '
                        + '<td class="admin-button" id="id_antenna_insuff_qam_error">' + obj.antenna_insuff_qam_error + '</td> '
                        + '<td class="admin-button" id="id_antenna_cm_error">' + obj.antenna_cm_error + '</td> '
                        + '</tr>');                        
                 }

                 login_id = obj.login_id
                 admin_user = obj.admin_user

                 for (j = 0; j < obj.pg.length; j++) {
                     if (obj.pg[j] == 'ALL') {
                         pg_name = ''
                     } else {
                         pg_name = pg_names[obj.pg[j]]
                     }
                     $('#table_pg' + i).append($('<option>', {
                         value: obj.pg[j],
                         text: obj.pg[j] + ' ' + pg_name
                     }))
                 }
             })
             // TableSort parser for date format: Jan 6, 1978
         $.tablesorter.addParser({
             id: 'monthDayYear',
             is: function(s) {
                 return false;
             },
             format: function(s) {
                 //alert('prem date == '+ s)
                 var date = s.match(/^(\w{3})[ ](\d{1,2}),[ ](\d{4})[ ](\d{2})[:](\d{2})[:](\d{2})$/);
                 // console.log('prem date == ' + date)

                 var m = monthNames[date[1]];
                 var d = String(date[2]);
                 if (d.length == 1) {
                     d = "0" + d;
                 }
                 var y = date[3];
                 return '' + y + m + d;
             },
             type: 'numeric'
         });
         var monthNames = {};
         monthNames["Jan"] = "01";
         monthNames["Feb"] = "02";
         monthNames["Mar"] = "03";
         monthNames["Apr"] = "04";
         monthNames["May"] = "05";
         monthNames["Jun"] = "06";
         monthNames["Jul"] = "07";
         monthNames["Aug"] = "08";
         monthNames["Sep"] = "09";
         monthNames["Oct"] = "10";
         monthNames["Nov"] = "11";
         monthNames["Dec"] = "12";

         $("#ticket-table").tablesorter({
             sortList: [],
             headers: {
                 // 2: {
                 //     //sorter: 'time',
                 //     //sorter:'my_date_column' 
                 //     //dateFormat: "ddd mmm yyyy hh:mm:ss"
                 //     //sorter: 'monthDayYear'
                 // },
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


         $('[id^=end]').click(function() {
             data = {}
             row = $(this).parent().parent()
             ticket_num = row.find("#id_ticket_num").text()

             data = {
                 'ticket_num': ticket_num,
                 'update_end_dt': 'Y',
             }

             // console.log('update data == ', data)
             $.ajax({
                 url: '/update-ticket-data',
                 type: 'POST',
                 data: data,
                 success: function(result) {
                     if (result.status == 'success') {
                         alert("Row End-Dated!! Playaround!!")
                         load_datatable('N')
                     } else if (result.status == 'session timeout') {
                         alert("Session expired -- Please relogin")
                         document.location.href = "/";
                     } else {
                         alert("Row End date Failed!! Contact Support")
                     }
                 },
                 error: function(msg) {
                     alert("Call to End date ticket failed!! Contact Support!!")
                 }
             })
         })

         $('[id^=edit]').click(function() {
             var id = $(this).attr('id');
             row = $(this).parent().parent()
             ticket_type = row.find("#id_ticket_type").html()
             
             tz = $('input[name=optradio]:checked', '#tzForm').val()             

             //All these values are hidden in the report 
             if (tz == 'local'){
                created_dt = row.find("#id_created_dt").html()  
                end_dt = row.find("#id_row_end_ts").html()              
             } else if (tz == 'est') {
                created_dt = row.find("#id_created_dt_est").html()                
                end_dt = row.find("#id_row_end_ts_est").html()              
             } else {
                created_dt = row.find("#id_created_dt_utc").html()                
                end_dt = row.find("#id_row_end_ts_utc").html()              
             }
             // alert(end_dt)
             // end_dt = row.find("#id_row_end_ts").html()
             ticket_num = row.find("#id_ticket_num").text()
             //alert(ticket_num)
             
             orig_ticket_num = row.find("#id_orig_ticket_num").html()
             division = row.find("#id_division").html()
                 //pg = row.find("td:nth-child(6), select")
             pg = row.find("#id_pg, select")
             duration = row.find("#id_duration").html()
             error_count = row.find("#id_error_count").html()
             outage_caused = row.find('#id_outage_caused').html()
             system_caused = row.find("#id_system_caused").html()
             addt_notes = row.find("#id_addt_notes").html()

             antenna_root_cause = row.find("#id_antenna_root_cause").html()
             outage_categories = row.find("#id_outage_categories").html()
             mitigate_check = row.find("#id_mitigate_check").html()
             hardened_check = row.find("#id_hardened_check").html()
             antenna_tune_error = row.find("#id_antenna_tune_error").html()
             antenna_cm_error = row.find("#id_antenna_cm_error").html()
             antenna_qam_error = row.find("#id_antenna_qam_error").html()
             antenna_network_error = row.find("#id_antenna_network_error").html()
             antenna_insuff_qam_error = row.find("#id_antenna_insuff_qam_error").html()             
             mitigate_check = (mitigate_check == 'Y' ? 'Yes': 'No')
             hardened_check = (mitigate_check == 'Y' ? 'Yes': 'No')
             $('#dialog-sid-antenna-root-cause').val(antenna_root_cause)
             $('#dialog-sid-outage-categories').val(outage_categories)
             $("#dialog-sid-mitigate-check").val(mitigate_check)
             $("#dialog-sid-hardened-check").val(hardened_check)
             $('#dialog-sid-antenna-tune-error').val(antenna_tune_error);
             $('#dialog-sid-antenna-qam-error').val(antenna_qam_error);
             $('#dialog-sid-antenna-network-error').val(antenna_network_error);
             $('#dialog-sid-antenna-insuff-qam-error').val(antenna_insuff_qam_error);
             $('#dialog-sid-antenna-cm-error').val(antenna_cm_error);

             $('#dialog_created_dt').datetimepicker('reset');
             $('#dialog_created_dt').datetimepicker({
                 value: new Date(created_dt),
                 step: 10
             });
             end_dt_default_est = moment.tz(new Date(), "America/New_York").format();
             if (end_dt == '') {
                 //Don't remove the reset, the old values should be reset
                 $('#dialog_end_dt').datetimepicker('reset');
                 $('#dialog_end_dt').datetimepicker({
                     'value': '',
                     'defaultDate': end_dt_default_est
                 });
             } else {
                 $('#dialog_end_dt').datetimepicker('reset');
                 $('#dialog_end_dt').datetimepicker({
                     value: new Date(end_dt),
                     step: 10
                 });
             }             
             $("#dialog_ticket_num").val(ticket_num)             
             if (typeof row.find("#id_orig_ticket_link").html() != 'undefined'){
                $("#dialog_ticket_num").val(row.find("#id_orig_ticket_link").html())
             }
             $("#dialog_orig_ticket_num").val(orig_ticket_num)
             $("#dialog_ticket_type").html(ticket_type)
             $("#dialog_division select").val(division)
             division = $("#row_division")[0]
             var pg_cds_array = []
             $(pg).find('option').each(function(i, selected) {
                 pg_cds_array[i] = $(selected).val().substring(0, 5);
             });

             getval(division, 'setting', pg_cds_array)
             $("#dialog_duration select").val(duration)
             //$("#dialog_error_count select").val(error_count)
             $("#row_error_count").val(error_count)
             $("#dialog_outage_caused select").val(outage_caused)
             $("#dialog_system_caused select").val(system_caused)
             $("#dialog_addt_notes").html(addt_notes)
             $("#dialog").dialog("open");

             //Very important 
             //Don't remove this piece of code, if its removed you will unable to edit filter text box in multiselect
             //http://stackoverflow.com/questions/16683512/jquery-ui-multiselect-widget-search-filter-not-receiving-focus-when-in-a-jquery
             if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
                 var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
                 $.ui.dialog.prototype._allowInteraction = function(e) {
                     if ($(e.target).closest('.ui-multiselect-filter input').length) return true;
                     return ui_dialog_interaction.apply(this, arguments);
                 };
             }


             //load_datatable('N')
         })
     }
 })
 
 
