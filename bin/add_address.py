#!/usr/bin/env python
import csv
import os
import sys

def add_address(file, outfile):
    reader = csv.DictReader(file)
    fields = reader.fieldnames + ['address']
    writer = csv.DictWriter(outfile, fields)
    writer.writerow(dict(zip(fields, fields)))

    for row in reader:
        address = [row['AddressLine1'], row['AddressLine2'], row.get('AddressLine3')]
        address = " ".join(filter(bool, address))

        address = "%s, %s, %s %s" % (address, row['City'], row['State'], row['Zip'])
        row['address'] = address
        writer.writerow(row)

if __name__ == '__main__':
    with open(sys.argv[1]) as f:
        add_address(f, sys.stdout)