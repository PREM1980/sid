CENTRAL = ['10201', '10202', '10203', '10204', '10401', '10402', '10404', '11701', '11702', '11703', '11704', '11801', '11802', '11803', '12601', '12602', '12603', '12701', '12702', '12703', '12704', '13401', '13402', '13701', '13702', '13703', '13704', '13705', '13901', '13902', '14001', '14002', '14003', '14401', '14402', '14403', '14404', '14405', '14406', '14701', '14702', '14703', '14704', '14705', '14706', '14801', '14802', '14803', '14804', '14805', '14806', '18101', '21301', '21302', '21303', '21304', '21305', '21306', '23001', '23002', '23101', '23102', '23103', '23104', '23301', '23501', '23601', '23701', '23801']
WEST 	= ['10101', '10102', '12301', '12303', '13001', '13801', '14502', '14503', '16801', '16802', '16803', '17101', '17102', '17201', '17301', '17302', '17401', '17402', '17403', '17404', '17405', '17406', '17407', '17501', '17502', '17503', '17504', '17505', '17801', '17802', '17803', '17804', '17805', '17806', '17807', '17901', '18201', '21601', '21702', '21704', '24001', '24601', '24602']
NORTHEAST = ['10501', '10601', '10701', '10702', '10801', '10901', '11001', '11101', '11102', '11201', '11202', '11203', '11301', '11401', '11402', '13201', '13301', '13501', '13502', '13601', '14901', '15001', '15101', '15102', '15301', '15401', '15501', '15601', '15801', '15901', '16001', '16101', '16201', '16401', '16501', '16601', '16701', '16702', '16703', '16704', '16901', '16902', '17001', '18001', '18501', '18701', '18702', '18703', '18801', '18901', '19001', '19501', '19601', '19701', '19901', '20101', '20201', '20701', '22001', '22002', '22301', '22302', '23201']
NATIONAL = CENTRAL + WEST + NORTHEAST + ['All','ALL','all']

VALID_DIVISION = ['National','Central','Northeast','Western']
VALID_DIVISION_LC = ['national','central','northeast','western']
	
VALID_DURATION = ['1 - 15 minutes'
					,'15 - 30 minutes'
					,'30 - 60 minutes'
					,'1 - 3 hours'
					,'Greater than 3 hours']

VALID_ERROR_COUNT = ['less than 1,000'
					,'1,000 - 5,000'
					,'5,000 - 10,000'
					,'10,000 - 20,000'
					,'20,000 - 50,000'
					,'50,000 - 100,000'
                    ,'100,000 - 150,000'
					,'150,000 - 200,000'
                    ,'200,000 - 250,000'
                    ,'250,000 - 500,000'
                    ,'Greater than 500,000'
					]

VALID_ERROR_COUNT_NUMERALS = {'less than 1,000': 999
					,'1,000 - 5,000': 3000
					,'5,000 - 10,000': 7500
					,'10,000 - 20,000': 15000
					,'20,000 - 50,000': 35000
					,'50,000 - 100,000': 75000
                    ,'100,000 - 150,000': 125000
					,'150,000 - 200,000': 175000
                    ,'200,000 - 250,000': 225000
                    ,'250,000 - 500,000': 375000
                    ,'Greater than 500,000': 500001
					}

VALID_ERROR_COUNT_NUMERALS_QUERY = {'less than 1,000': ' < 999'
					,'1,000 - 5,000': 'between 1000 and 4999'
					,'5,000 - 10,000': 'between 5000 and 9999'
					,'10,000 - 20,000': 'between 10000 and 19999'
					,'20,000 - 50,000': 'between 20000 and 49999'
					,'50,000 - 100,000': 'between 50000 and 99999'
                    ,'100,000 - 150,000': 'between 100000 and 149999'
					,'150,000 - 200,000': 'between 150000 and 199999'
                    ,'200,000 - 250,000': 'between 200000 and 249999'
                    ,'250,000 - 500,000': 'between 250000 and 499999'
                    ,'Greater than 500,000': ' > 500000 '
					}


VALID_OUTAGE_CAUSED = ['Scheduled Maintenance'
							,'Scheduled Maintenance resulting in Outage'
							,'NSA Scheduled Maintenance resulting in Outage'
							,'Comcast System Unplanned Outage'
							,'Non-Comcast System Outage']

VALID_SYSTEM_CAUSED = ['Capacity'
							,'Backoffice'
							,'Cisco Pump'
							,'Arris Pump'
							,'Network'
							,'UDB'
							,'Content'
							,'Aloha Network'
							,'Billing System'
							,'Other']

PG_NAMES = { '15601': 'Delaware County', '23201': 'York', '16601': 'Willow Grove', '15901': 'Montgomery County PA', '13401': 'Hattiesburg', '22001': 'Philly Area 1', '13402': 'Tupelo', '17001': 'Richmond', '11301': 'Mashpee', '10101': 'Albuquerque', '10102': 'Santa Fe, Farmington', '17406': 'Bay North', '19501': 'State College', '13001': 'Fresno', '11704': 'Chicago Area 4', '21301': 'Memphis', '11701': 'Chicago Area 4', '11702': 'Chicago Area 4', '11703': 'Chicago Area 4', '23601': 'Peoria', '12701': 'Westland', '10204': 'North-South', '12702': 'Grand Rapids', '10202': 'Stone Mtn', '10203': 'Vinings', '10201': 'Canton', '17405': 'Bay North', '17404': 'Bay North', '17407': 'Bay North', '15501': 'Chester County', '17401': 'Bay North', '18001': 'Springfield / Holyoke', '17403': 'Bay North', '17402': 'Bay North', '13601': 'New Haven (Hamden)', '80006': 'Content Test', '20201': 'Blairsville', '18801': 'Prince George County', '14503': 'Minneapolis', '14502': 'Roseville', '11102': 'Exeter', '11101': 'Exeter', '12301': 'Denver, Longmont, Mtns', '12303': 'North Metro, NOMA', '10801': 'Chesapeake Bay Group', '17807': 'Seattle', '17505': 'San Jose', '11803': 'Mount Prospect', '11802': 'Mount Prospect', '11801': 'Mount Prospect', '11201': 'Foxboro', '11203': 'Brockton', '11202': 'Needham', '21306': 'Houma', '23301': 'South Bend', '16704': 'Pittsburgh', '15102': 'Verona', '16703': 'Pittsburgh, Wheeling', '15101': 'Union', '12703': 'Holt', '13301': 'Lancaster', '22002': 'CorporateCenter', '10601': 'Baltimore County', '21305': 'Little Rock', '19701': 'Philly Area 2', '20701': 'Huntington', '13901': 'Indianapolis', '13902': 'Fort Wayne', '10702': 'Carrol County', '10701': 'Howard/Harford', '19601': 'Scranton', '15401': 'Burlington, Gloucester', '18101': 'Tallahassee', '16401': 'Trenton', '23701': 'Rockford', '20101': 'Londonderry', '11001': 'Derry', '99904': '99904', '17302': 'Salt Lake City', '17301': 'Salt Lake City', '10901': 'Delmarva / Salisbury', '24602': 'Aurora, Wheatridge', '18901': 'Prince William County', '18702': 'Montgomery Cty', '17201': 'Stockton', '64102': 'QA Seachange 641 - PG 02', '18701': 'Montgomery Cty', '64101': 'QA Seachange 641 - PG 01', '17801': 'Seattle', '17803': 'Seattle', '17802': 'Seattle', '17805': 'Seattle', '17804': 'Seattle', '15001': 'Monmouth Ocean', '17806': 'Seattle', '21601': 'Co Springs, Pueblo', '22302': 'Loudoun', '24001': 'Santa Barbara', '99901': '99901', '13201': 'Harrisburg', '16802': 'Portland *Collapsed to 16801*', '16803': 'Portland  *Collapsed to 16801*\t', '16801': 'Portland', '18501': 'Alexandria, Arlington', '16001': 'New Castle', '15801': 'Garden State', '10401': 'Augusta', '10402': 'Savannah', '10404': 'Augusta National', '16101': 'Philly Areas 3/4', '18201': 'Tucson', '21303': 'Monroe', '14706': 'Panama City', '14705': 'Orlando', '14704': 'Leesburg', '14703': 'Sebring', '14702': 'Sarasota', '14701': 'Naples', '21304': 'Shreveport', '19901': 'Plymouth', '13801': 'Independence', '70002': 'DO NOT EDIT IN RCM', '70001': 'DO NOT EDIT IN RCM', '23801': 'Springfield', '23002': 'Homewood', '13702': 'Gadsden', '23001': 'Homewood', '14405': 'West Palm', '21702': 'Houston - South', '18703': 'Frederick Cty', '17101': 'Roseville', '17102': 'Roseville', '23103': 'Elmhurst', '23102': 'Elmhurst', '23101': 'Elmhurst', '16501': 'Vineland', '23104': 'Elmhurst', '99001': 'COD Philly Lab A', '21704': 'Houston - North', '13704': 'Tuscaloosa', '17901': 'Spokane', '13501': 'Hartford (Bristol)', '13502': 'Hartford (Bristol)', '13705': 'Dothan', '16902': 'Spotsylvania', '16901': 'Chesterfield', '11402': 'Boston', '11401': 'Maynard', '16701': 'Pittsburgh', '15301': 'Bucks County', '14801': 'Nashville', '14802': 'Knoxville', '14803': 'Chattanooga', '14804': 'Gray', '14805': 'Paducah', '14806': 'Elizabethtown', '24601': 'Englewood, Littleton, CR', '16702': 'Pittsburgh, Youngstown', '17504': 'San Jose', '16201': 'Pleasantville', '17501': 'San Jose', '17502': 'San Jose', '17503': 'San Jose', '14901': 'Central Jersey', '14001': 'Jacksonville', '14002': 'Brunswick', '14003': 'Charleston', '23501': 'Champaign', '10501': 'Baltimore City', '12601': 'Taylor', '12602': 'Warren-West', '12603': 'Warren-East', '21302': 'Jackson', '14404': 'Redlands', '13703': 'Mobile', '14406': 'West Palm', '13701': 'Huntsville', '14401': 'Pompano', '14402': 'Dade', '14403': 'Vero Beach', '19001': 'Washington DC', '22301': 'Blue Ridge', '12704': 'Westland #2 Collapsed to 12701' }

