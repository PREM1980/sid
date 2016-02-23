import uuid
from cqlengine import columns
from cqlengine.models import Model
from datetime import datetime
from cqlengine.management import sync_table


class Tickets(Model):
    ticket_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    created_dt = columns.DateTime(default=datetime.now())
    division = columns.Text()
    pg = columns.Text()
    duration = columns.Text()
    error_count = columns.Text()
    outage_caused = columns.Text()
    system_caused = columns.Text()
    addt_notes = columns.Text()
    ticket_num = columns.Text()
    ticket_type = columns.Text()
    row_create_ts = columns.DateTime(default=datetime.now())
    row_end_ts = columns.DateTime(
        default='9999-12-31 00:00:00.00000-00')


#connection.setup(['127.0.0.1'], "cqlengine", protocol_version=3)
# sync_table(Tickets)
from cqlengine import connection
connection.setup(["localhost"], "sid")
sync_table(Tickets)
