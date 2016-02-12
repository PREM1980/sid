from datetime import datetime
from elasticsearch import Elasticsearch, ElasticsearchException
#import elasticsearch
from elasticsearch_dsl import Search, Q


try:
    es = Elasticsearch(['localhost'], verify_certs=True)
except:
    print 'Exception'

# elasticsearch mapping
mapping = '''
{
    "mappings": {
        "tickets": {
            "properties": {
                "date": {
                    "type": "date",
                    "format": "yyyy/MM/dd HH:mm:ss"
                },
                "division": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "pg": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "duration": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "error_count": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "ticket_num": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "ticket_type": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "outage_caused": {
                    "type": "string",
                    "fields": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed"
                        },
                        "orig": {
                            "type": "string",
                            "index": "analyzed"
                        }
                }
                },
                "system_caused": {
                    "type": "string",
                    "fields": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed"
                        },
                        "orig": {
                            "type": "string",
                            "index": "analyzed"
                        }
                }
                },
                "addt_notes": {
                    "type": "string",
                    "fields": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed"
                        },
                        "orig": {
                            "type": "string",
                            "index": "analyzed"
                        }
                }
                
                }
            }
        }
    }
}'''
# es.indices.delete(index='tickets')  # delete indexes

#es.indices.create(index='tickets', ignore=400, body=mapping)

doc = {
    'date': '2016/02/10 09:38',
    'division': 'National',
    'pg': '10201',
    'error_count': '1,000-5,000',
    'ticket_num': '1234',
    'outage_caused': 'Scheduled Maintenance',
    'system_caused': 'Backoffice',
    'addt_notes': 'additional notes',
    'ticket_type': 'JIRA',
}

doc = {'system_caused': 'Backoffice', 'division': 'Central', 'addt_notes': 'a', 'pg': '10201', 'date': '2016/02/10 12:11:20',
       'outage_caused': 'Scheduled Maintenance', 'ticket_num': '1234', 'ticket_type': 'JIRA', 'error_count': '1 - 15 minutes'}
doc = {'system_caused': 'Backoffice', 'division': 'Central', 'addt_notes': 'a', 'pg': '10201', 'date': '2015/01/01 12:10',
       'outage_caused': 'Scheduled Maintenance', 'ticket_num': '1234', 'ticket_type': 'JIRA', 'error_count': '1 - 15 minutes',
       'duration': '1 - 15 minutes'}


#es.index(index='tickets', doc_type='tickets', body=doc)


body = {
    "query": {
        "bool": {
            "filter": [
                {
                    "term": {
                        "division": "Central"
                    }
                },
                {
                    "term": {
                        "outage_caused.raw": "Scheduled Maintenance"
                    }
                },
                {
                    "term": {
                        "pg": "10201"
                    }
                },
                {
                    "range": {
                        "date": {
                            "gte": "2016/01/01 12:11",
                            "lte": "2017/01/10 12:30"
                        }
                    }
                }
            ]
        }
    }
}

#res = es.search(index='tickets', body=body)
#.filter("term", outage_caused.raw="Scheduled Maintenance") \
d = {'outage_caused.raw': 'Scheduled Maintenance'}
s = Search(using=es, index="tickets") \
    .filter("term", division="Central") \
    .filter("term", pg="10201") \
    .filter("term", **d) \
    .filter("range", date={'gte': '2011/01/01 12:11', 'lt': '2017/01/01 12:11'})

try:
    res = s.execute()
except ElasticsearchException as es1:
    print 'es exception == ', es1

data = {}
results = []

for hit in s.scan():
    data['date'] = hit.date
    data['division'] = hit.division
    data['pg'] = hit.pg
    data['duration'] = hit.duration
    data['error_count'] = hit.error_count
    data['outage_caused'] = hit.outage_caused
    data['system_caused'] = hit.system_caused
    results.append(data)

print 'results == ', len(results)
# print hit.duration

# for each in res['hits']['hits']:
#     # print each['_source']
#     r = each['_source']
#     del r['ticket_num']
#     del r['ticket_type']
#     del r['addt_notes']
#     # print r
#     results.append(each)

# data = {'data': results}
# print data
