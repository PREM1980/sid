
# # string created_dt ==  Wed Apr 27 2016 15:35:00 GMT-0400 (EDT)
# # created_dt ==  2016-04-27 15:35:00+04:00
# from dateutil.parser import parse
# import dateutil.tz

# dt = parse('Wed Apr 27 2016 15:35:00 GMT-0400 (EDT)')
# print 'dt == ',dt
# print 'tzinfo == ', dt.tzinfo


# localtz = dateutil.tz.tzlocal()

# print 'offset == ',localtz.utcoffset(dt).total_seconds()
# print 'tzname == ',dt.tzname()

# utc_dt = dt.utcnow()
# print 'utcnow == ',utc_dt

# tz_edt = dateutil.tz.tzoffset('EDT',-14400)

# edt_dt = dt.astimezone(tz_edt)
# from dateutil.parser import parse
# dt = 'Wed Apr 27 2016 15:35:00 GMT-0400 (EDT)'
# created_dt = parse(dt)
# print 'created_dt == ', created_dt
# print 'type created_dt == ', type(created_dt)
# print 'dir created_dt == ', dir(created_dt)
# print 'dir created_dt.tzinfo == ', dir(created_dt.tzinfo)
# print 'created_dt.tzinfo == ', created_dt.tzinfo
# print 'created_dt.tzinfo tzname == ', dir(created_dt.tzinfo.tzname)
# print 'created_dt.tzinfo utcoffser== ', dir(created_dt.tzinfo.utcoffset)
# print 'created_dt.tzname == ', created_dt.tzname()

from datetime import datetime
from pytz import timezone

fmt = "%Y-%m-%d %H:%M:%S %Z%z"
timezonelist = ['UTC','US/Pacific','Europe/Berlin']
for zone in timezonelist:
    now_time = datetime.now(timezone(zone))
    print now_time.strftime(fmt)

    