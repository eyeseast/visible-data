#!/usr/bin/env python
import csv
import sys
import time

from geopy import geocoders
g = geocoders.Google()

def geocode(file, outfile):
    reader = csv.DictReader(file)
    fields = reader.fieldnames + ['latitude', 'longitude']

    writer = csv.DictWriter(outfile, fields)
    writer.writerow(dict(zip(fields, fields)))

    for row in reader:
        if not row.get('address'):
            continue

        location = "%s, %s, %s" % (row['address'], row['city'], row['state'])
        try:
            place, (lat, lng) = list(g.geocode(location, exactly_one=False))[0]
            row['lat'] = lat
            row['lng'] = lng
            writer.writerow(row)
            time.sleep(1)

        except KeyboardInterrupt:
            sys.exit(1)
            
        except:
            print "Could not geocode: %s" % location
            continue


if __name__ == '__main__':
    with open(sys.argv[1]) as f:
        geocode(f, sys.stdout)