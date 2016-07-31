import requests
import json
# http://tectonic.sys.comcast.net/peergroups
r = requests.get('https://volcano.sys.comcast.net/volcano/ajax.php?m=getSiteList&tz=America%252FNew_York',verify=False)
data =  json.loads(r.text.encode('utf-8'))
print data 
output = {}
central = [10201, 10202, 10203, 10204, 10401, 10402, 10404, 11701, 11702, 11703, 11704, 11801, 11802, 11803, 12601, 12602, 12603, 12701, 12702, 12703, 12704, 13401, 13402, 13701, 13702, 13703, 13704, 13705, 13901, 13902, 14001, 14002, 14003, 14401, 14402, 14403, 14404, 14405, 14406, 14701, 14702, 14703, 14704, 14705, 14706, 14801, 14802, 14803, 14804, 14805, 14806, 18101, 21301, 21302, 21303, 21304, 21305, 21306, 23001, 23002, 23101, 23102, 23103, 23104, 23301, 23501, 23601, 23701, 23801]
western = [10101, 10102, 12301, 12303, 13001, 13801, 14502, 14503, 16801, 16802, 16803, 17101, 17102, 17201, 17301, 17302, 17401, 17402, 17403, 17404, 17405, 17406, 17407, 17501, 17502, 17503, 17504, 17505, 17801, 17802, 17803, 17804, 17805, 17806, 17807, 17901, 18201, 21601, 21702, 21704, 24001, 24601, 24602]
northeast = [10501, 10601, 10701, 10702, 10801, 10901, 11001, 11101, 11102, 11201, 11202, 11203, 11301, 11401, 11402, 13201, 13301, 13501, 13502, 13601, 14901, 15001, 15101, 15102, 15301, 15401, 15501, 15601, 15801, 15901, 16001, 16101, 16201, 16401, 16501, 16601, 16701, 16702, 16703, 16704, 16901, 16902, 17001, 18001, 18501, 18701, 18702, 18703, 18801, 18901, 19001, 19501, 19601, 19701, 19901, 20101, 20201, 20701, 22001, 22002, 22301, 22302, 23201]

for each in data:
	output[str(each['peergroup'])] = str(each['peergroup_descr'])

print output

# central_new = {}
# for pg in central:
# 	if str(pg) in output:
# 		central_new[str(pg)] =  output[str(pg)]

# print 'central ==' , central_new

# western_new = []
# for pg in western:
# 	if str(pg) in output:

# 		western_new[str(pg)] =  output[str(pg)]

# print 'western ==', western_new

# ne_new = []
# for pg in northeast:
# 	if str(pg) in output:
# 		ne_new[str(pg)] =  output[str(pg)]

# print 'ne ==', ne_new