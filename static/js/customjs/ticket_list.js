 $(document).ready(function() {

     // $('#loginid').click(function() {
     //     $('#apikey').modal('show');
     // })

     // $('#logout').click(function() {
     //     window.location.href = "/";
     // })

     //set up some minimal options for the feedback_me plugin
     // fm_options = {
     //     //jQueryUI:true,
     //     bootstrip: true,
     //     show_email: true,
     //     email_required: true,
     //     position: "right-top",
     //     show_radio_button_list: true,
     //     radio_button_list_required: true,
     //     radio_button_list_title: "How do you rate this application?",
     //     name_placeholder: "Name please",
     //     email_placeholder: "Email goes here",
     //     message_placeholder: "Go ahead, type your feedback here...",
     //     name_required: true,
     //     message_required: true,
     //     show_asterisk_for_required: true,
     //     feedback_url: "/send_feedback_clean",
     //     custom_params: {
     //         csrf: "my_secret_token",
     //         user_id: "john_doe",
     //         feedback_type: "clean_complex"
     //     },
     //     delayed_options: {
     //         success_color: "#5cb85c",
     //         fail_color: "#d2322d",
     //         delay_success_milliseconds: 3500,
     //         send_success: "Sent successfully :)"
     //     }
     // };

     // //init feedback_me plugin
     // fm.init(fm_options);

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
        console.log("prem-prem elem == ", this)
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
        console.log(create_dt.format())         

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
             
             //alert(dt.format())
             // 2016/07/13 16:35

             data = {
                 //'date': new Date($('#datepicker').val()),
                 'date': create_dt.format(),
                 'division': $('#division').val(),
                 'pg': pg,
                 'duration': duration,
                 'error_count': error_count,
                 'outage_caused': outage_caused,
                 'system_caused': system_caused,
                 'ticket_num': ticket_num,
                 'ticket_link': ticket_link,
                 'addt_notes': $('#additional_notes').val(),
                 'ticket_type': $('input[name=tkt-radio]:checked').val()
             }
             console.log("Insert ticket data ", data)
             
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
                             'ticket_num': $('#dialog_ticket_num').text(),
                             'ticket_type': $('#dialog_ticket_type').html(),
                             'update_end_dt': 'N',
                         }
                         console.log('update data == ', data)
                         $.ajax({
                             url: '/update-ticket-data',
                             type: 'POST',
                             data: data,
                             success: function(result) {
                                 console.log(JSON.stringify(result))
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

         data = {
             'start_date_s': $('#query_datepicker_start').val(),
             'start_date_e': $('#query_datepicker_start_end').val(),
             'end_date_s': $('#query_datepicker_end').val(),
             'end_date_e': $('#query_datepicker_end_end').val(),
             'ticket_num': ticket_num,
             'division': $('#query_division').val(),
             'pg': pg,
             'duration': $('#query_duration').val(),
             'error_count': $('#query_errorcount').val(),
             'outage_caused': $('#query_cause').val(),
             'system_caused': $('#query_subcause').val(),
             'addt_notes': $('#query_addt_notes').html(),
             'initial': initial
         }
         console.log('data_table data == ', data)

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
             $.ajax({
                 url: '/get-ticket-data',
                 type: 'POST',
                 data: data,
                 success: function(result) {
                     if (result.status == 'success') {
                         create_tickets(result)
                         // $('#loginid').html(login_id)
                         set_division(login_id)
                         disable_local_tz()
                         elem = $('input[name=optradio]:checked', '#tzForm').val()             
                         set_tz(elem)

                         // If its Ninja we need to hide the edits button of SID.
                         if(window.location.href.indexOf("ninja") > -1) {                         
                            $('.editsbutton').hide()
                            }

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
                 console.log('call success == ', result.results)
                 //console.log(toType(result.results))
                 ninja_users = []
                 console.log('***'+login_id)
                 JSON.parse(result.results).forEach(function(obj, i, a) {
                     console.log(obj.fields.userid)
                     if (obj.fields.userid == login_id){
                        console.log('id matched == ' + obj.fields.region)
                        $("#division").val(obj.fields.region);
                        getval({'value':obj.fields.region},'inputting',[])
                     }

                     //ninja_users.push(obj.fields.userid)
                 })
                 console.log(ninja_users)

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
         
         console.log('transactiondata length == ', transactiondata.results.length)
         $("<div class='CSSTableGenerator1'></div>").appendTo("#ticket_list");
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
                 // slicedata = transactiondata_results.slice(pageNumber * 5,
                 //     Math.min((pageNumber + 1) * 5, transactiondata_results.length));
                 slicedata = transactiondata_results.slice(((pageNumber - 1) * 50), 50 * pageNumber + 1)
             }
         } else {
             slicedata = transactiondata_results.slice(0, 50)
         }

         $(".CSSTableGenerator1").empty()

         $("<table id='ticket-table' class='table  tablesorter' style='table-layout:fixed; width:100%'> </table>").appendTo('.CSSTableGenerator1')
         $('#ticket-table').append('<thead class="thead-inverse"><tr><th style="display:none">id</th><th>User Id</th><th class="local-col">Create Date<span style="text-align:center;color:blue"> (Local)</span></th><th class="est-col" style="display:none">Create Date <span style="text-align:center;color:blue"> (EST)</span></th>' 
            + '<th class="utc-col" style="display:none">Create Date<span style="text-align:center;color:blue"> (UTC)</span></th><th class="local-col">End Date</th><th class="est-col" style="display:none">End Date</th><th class="utc-col" style="display:none">End Date</th><th>Ticket#</th>'
            + '<th> Division </th> <th>PeerGroup</th> <th>Duration</th><th>Error Count</th><th>Outage Cause</th><th>System Caused</th><th>Addt Notes</th><th class="editsbutton"></th></tr></thead>');

         slicedata.forEach(function(obj, i, a) {

                 //obj.created_dt = new Date(obj.created_dt)
                 //obj.created_dt = moment.tz(obj.created_dt, "America/New_York").format();
                 //console.log("object == ", obj)
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
                        + created_dt_est + '</td> <td id="id_created_dt_utc" class="utc-col" style="display:none">' + created_dt_utc + '</td> <td id="id_row_end_ts" class="local-col">' + row_end_ts + '</td><td id="id_row_end_ts_est" class="est-col" style="display:none">' + row_end_ts_est + '</td> <td id="id_row_end_ts_utc" class="utc-col" style="display:none">' + row_end_ts_utc + '</td> <td style="word-wrap: break-word" id="id_ticket_num">' + obj.ticket_num + '</td> <td id="id_division">' + obj.division 
                        + '</td><td id="id_pg">  <select class="form-control input-sm" id="table_pg' + i + '""> </select>  </td> <td id="id_duration">' + obj.duration + '</td><td id="id_error_count">' + obj.error_count + '</td><td id="id_outage_caused">' + obj.outage_caused + '</td><td id="id_system_caused">' + obj.system_caused 
                        + '</td><td id="id_addt_notes" ><div style="height:40px;overflow:scroll" title="' + obj.addt_notes + '">' + obj.addt_notes + '</div></td><td class="editsbutton" ><button  id="edit' + i + '"">edit</button><button id="end' + i + '"">end</button></td></tr>');
                 } else {
                     $('#ticket-table').append('<tr><td id="id_tkt_type" style="display:none">' + obj.ticket_type + '</td><td id="id_user_id">' + obj.crt_user_id + '</td><td id="id_created_dt" class="local-col">' + created_dt_local + '</td> <td id="id_created_dt_est" class="est-col" style="display:none">' 
                        + created_dt_est + '</td> <td id="id_created_dt_utc" class="utc-col" style="display:none">' + created_dt_utc + '</td> <td id="id_row_end_ts" class="local-col">' + row_end_ts + '</td><td id="id_row_end_ts_est" class="est-col" style="display:none">' + row_end_ts_est + '</td><td id="id_row_end_ts_utc" class="utc-col" style="display:none">' + row_end_ts_utc + '</td><td style="word-wrap: break-word" id="id_ticket_num"><a href="' + obj.ticket_link + '" target="_blank" >' 
                        + obj.ticket_num + '</a></td> <td id="id_division">' + obj.division + '</td><td id="id_pg">  <select class="form-control input-sm" id="table_pg' + i + '""> </select>  </td> <td id="id_duration">' + obj.duration + '</td><td id="id_error_count">' + obj.error_count + '</td><td id="id_outage_caused">' 
                        + obj.outage_caused + '</td><td id="id_system_caused">' + obj.system_caused + '</td><td id="id_addt_notes" ><div style="height:40px;overflow:scroll" title="' + obj.addt_notes + '">' + obj.addt_notes + '</div></td><td class="editsbutton"><button class="editbutton" id="edit' + i + '"">edit</button><button id="end' + i + '"">end</button></td></tr>');
                 }

                 login_id = obj.login_id

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
                 console.log('prem date == ' + date)

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
             widgets: ['uitheme'],
         });


         $('[id^=end]').click(function() {
             data = {}
             row = $(this).parent().parent()
             ticket_num = row.find("#id_ticket_num").text()

             data = {
                 'ticket_num': ticket_num,
                 'update_end_dt': 'Y',
             }

             console.log('update data == ', data)
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
             ticket_num = row.find("#id_ticket_num").html()
             division = row.find("#id_division").html()
                 //pg = row.find("td:nth-child(6), select")
             pg = row.find("#id_pg, select")
             duration = row.find("#id_duration").html()
             error_count = row.find("#id_error_count").html()
             outage_caused = row.find('#id_outage_caused').html()
             system_caused = row.find("#id_system_caused").html()
             addt_notes = row.find("#id_addt_notes").html()
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
             $("#dialog_ticket_num").html(ticket_num)
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
