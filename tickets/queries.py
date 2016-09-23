
all_query = {'generic': """
					select   tb1.ticket_num
							,tb1.row_create_ts
							,tb1.ticket_type
							,tb1.row_update_ts
							,tb1.row_end_ts
							,tb2.division_name
							,tb3.duration
							,tb4.error
							,tb5.outage_caused
							,tb6.system_caused
							,tb8.pg_cd
							,tb9.notes
							,tb1.crt_user_id
							,tb1.upd_user_id
							,tb1.ticket_link
							,tb1.hardened_check
							,tb1.mitigate_check
							,tb1.antenna_tune_error
							,tb1.antenna_cm_error
							,tb1.antenna_network_error
							,tb1.antenna_qam_error
							,tb1.antenna_insuff_qam_error	
							,tb10.antenna_root_caused						
							,tb11.outage_categories						
							from sid.tickets tb1
							inner join
							sid.division tb2
							on tb1.division_id = tb2.division_id
							inner join
							sid.duration tb3
							on tb1.duration_id = tb3.duration_id
							inner join
							sid.error_count tb4
							on tb1.error_count_id = tb4.error_count_id
							inner join
							sid.outage_caused tb5
							on tb1.outage_caused_id = tb5.outage_caused_id
							inner join
							sid.system_caused tb6
							on tb1.system_caused_id = tb6.system_caused_id
							inner join
							sid.antenna_root_caused tb10
							on tb1.antenna_root_cause = tb10.antenna_root_cause_id
							inner join
							sid.outage_categories tb11
							on tb1.outage_categories = tb11.outage_categories_id
							inner join
							sid.tickets_pgs tb7
							on tb1.ticket_num = tb7.tickets_id
							inner join
							sid.pg tb8
							on tb7.pg_id = tb8.pg_id
							left outer join
							sid.addt_notes tb9
							on tb1.ticket_num = tb9.notes_id
							where tb1.valid_flag = "Y"
							order by tb1.row_create_ts desc,tb1.ticket_num desc
					""",

		'conditions':"""
					select   tb1.ticket_num
							,tb1.row_create_ts
							,tb1.ticket_type
							,tb1.row_update_ts
							,tb1.row_end_ts
							,tb2.division_name
							,tb3.duration
							,tb4.error
							,tb5.outage_caused
							,tb6.system_caused
							,tb8.pg_cd
							,tb9.notes
							,tb1.crt_user_id
							,tb1.upd_user_id
							,tb1.ticket_link
							,tb1.hardened_check
							,tb1.mitigate_check
							,tb1.antenna_tune_error
							,tb1.antenna_cm_error
							,tb1.antenna_network_error
							,tb1.antenna_qam_error
							,tb1.antenna_insuff_qam_error		
							,tb10.antenna_root_caused						
							,tb11.outage_categories											
							from sid.tickets tb1
							inner join
							sid.division tb2
							on tb1.division_id = tb2.division_id
							inner join
							sid.duration tb3
							on tb1.duration_id = tb3.duration_id
							inner join
							sid.error_count tb4
							on tb1.error_count_id = tb4.error_count_id
							inner join
							sid.outage_caused tb5
							on tb1.outage_caused_id = tb5.outage_caused_id
							inner join
							sid.system_caused tb6
							on tb1.system_caused_id = tb6.system_caused_id
							inner join
							sid.antenna_root_caused tb10
							on tb1.antenna_root_cause = tb10.antenna_root_cause_id
							inner join
							sid.outage_categories tb11
							on tb1.outage_categories = tb11.outage_categories_id
							inner join
							sid.tickets_pgs tb7
							on tb1.ticket_num = tb7.tickets_id
							inner join
							sid.pg tb8
							on tb7.pg_id = tb8.pg_id
							left outer join
							sid.addt_notes tb9
							on tb1.ticket_num = tb9.notes_id
							where tb1.valid_flag = "Y"
					""",
		'pg_conditions':"""
					select   tb1.ticket_num
							,tb1.row_create_ts
							,tb1.ticket_type
							,tb1.row_update_ts
							,tb1.row_end_ts
							,tb2.division_name
							,tb3.duration
							,tb4.error
							,tb5.outage_caused
							,tb6.system_caused
							,tb8.pg_cd
							,tb9.notes
							,tb1.crt_user_id
							,tb1.upd_user_id
							,tb1.ticket_link
							,tb1.hardened_check
							,tb1.mitigate_check
							,tb1.antenna_tune_error
							,tb1.antenna_cm_error
							,tb1.antenna_network_error
							,tb1.antenna_qam_error
							,tb1.antenna_insuff_qam_error
							,tb10.antenna_root_caused						
							,tb11.outage_categories																		
							from sid.tickets tb1
							inner join
							sid.division tb2
							on tb1.division_id = tb2.division_id
							inner join
							sid.duration tb3
							on tb1.duration_id = tb3.duration_id
							inner join
							sid.error_count tb4
							on tb1.error_count_id = tb4.error_count_id
							inner join
							sid.outage_caused tb5
							on tb1.outage_caused_id = tb5.outage_caused_id
							inner join
							sid.system_caused tb6
							on tb1.system_caused_id = tb6.system_caused_id
							inner join
							sid.antenna_root_caused tb10
							on tb1.antenna_root_cause = tb10.antenna_root_cause_id
							inner join
							sid.outage_categories tb11
							on tb1.outage_categories = tb11.outage_categories_id
							inner join
							sid.tickets_pgs tb7
							on tb1.ticket_num = tb7.tickets_id
							inner join
							sid.pg tb8
							on tb7.pg_id = tb8.pg_id
							left outer join
							sid.addt_notes tb9
							on tb1.ticket_num = tb9.notes_id
							where tb1.valid_flag = "Y"
					"""}

ams_query = {"generic":""" SELECT tb1.ticket_num,
				tb1.url,
				tb1.brouha,
				tb1.action,
				tb1.last_action_before_clear,
				tb1.resolve_close_reason,
				tb1.in_process,
				tb1.chronic,
				tb1.service_affecting,
				tb1.from_dt,
				tb1.from_dt_am_pm,
				tb1.till_dt,
				tb1.till_dt_am_pm,
				tb1.duration,
				tb1.customers,
				tb1.stbs,
				tb1.tta,
				tb1.tti,
				tb1.tts,
				tb1.ttr,
				tb1.created_by,
				tb1.division,
				tb1.region,
				tb1.dac,
				tb1.device,
				tb1.ip,
				tb1.upstreams,
				tb1.reason,
				tb1.comment,
				tb1.root_cause,
				tb1.corrective_action_taken,
				tb1.si_ticket,
				tb1.jb_ticket,
				tb1.found_in_support_system,
				tb1.alert_event_text,
				tb1.alert_type,
				tb1.row_create_ts,
				tb1.row_update_ts,
				tb1.row_end_ts,
				tb1.crt_user_id,
				tb1.upd_user_id,
				tb1.valid_flag
			FROM
				sid.ams_tickets	tb1	
			where tb1.valid_flag = 'Y'			
			order by tb1.from_dt desc
			limit 500
""",
'ams_conditions':""" SELECT tb1.ticket_num,
				tb1.url,
				tb1.brouha,
				tb1.action,
				tb1.last_action_before_clear,
				tb1.resolve_close_reason,
				tb1.in_process,
				tb1.chronic,
				tb1.service_affecting,
				tb1.from_dt,
				tb1.from_dt_am_pm,
				tb1.till_dt,
				tb1.till_dt_am_pm,
				tb1.duration,
				tb1.customers,
				tb1.stbs,
				tb1.tta,
				tb1.tti,
				tb1.tts,
				tb1.ttr,
				tb1.created_by,
				tb1.division,
				tb1.region,
				tb1.dac,
				tb1.device,
				tb1.ip,
				tb1.upstreams,
				tb1.reason,
				tb1.comment,
				tb1.root_cause,
				tb1.corrective_action_taken,
				tb1.si_ticket,
				tb1.jb_ticket,
				tb1.found_in_support_system,
				tb1.alert_event_text,
				tb1.alert_type,
				tb1.row_create_ts,
				tb1.row_update_ts,
				tb1.row_end_ts,
				tb1.crt_user_id,
				tb1.upd_user_id,
				tb1.valid_flag
			FROM
				sid.ams_tickets	tb1	
			where tb1.valid_flag = 'Y'			
			
"""

	

}					

#print 'qry loaded == ', p1