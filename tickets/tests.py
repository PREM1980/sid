from django.test import TestCase
from elasticsearch import Elasticsearch, ElasticsearchException
# Create your tests here.


class PostTicketData(TestCase):

    def setUp(self):
        self.es = Elasticsearch(['localhost'], verify_certs=True)

    def test_es_row_persist(self):
        doc = {'system_caused': 'Backoffice', 'division': 'National', 'addt_notes': '', 'pg': '10101', 'date': '2016/02/15 08:56',
               'duration': '1 - 15 minutes', 'outage_caused': 'Scheduled Maintenance', 'ticket_num': '1234', 'ticket_type': 'JIRA', 'error_count': '1,000 - 5,000'}

        self.es = Elasticsearch(['localhost'], verify_certs=True)

        result = self.es.index(index='tickets', doc_type='tickets', body=doc)
        self.assertEqual(result['created'], True)

        doc = {'_id': result['_id']}
        result = self.es.delete(
            index='tickets', doc_type='tickets', id=result['_id'])
