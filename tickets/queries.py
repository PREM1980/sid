
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

#print 'qry loaded == ', p1