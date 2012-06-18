#!/usr/bin/env python
import csv
import sys

from lxml.etree import parse

def main(infile, outfile):
    """
    Turn an XML infile into a CSV outfile
    """
    match = parse(infile).getroot()
    players = {
        'Team1': match.find('variables').find('gNameTeam1').get('value'),
        'Team2': match.find('variables').find('gNameTeam2').get('value')
    }

    # store all fields, with each point as an ordinal number
    fields = ['point'] + match.find('points').find('point').find('shot').keys()
    writer = csv.DictWriter(outfile, fields)
    writer.writerow(dict(zip(fields, fields)))

    # loop through points to get all shots
    points = match.find('points')
    for i, point in enumerate(points.findall('point')):
        for shot in point.findall('shot'):
            row = dict(shot.attrib)
            row['point'] = str(i)
            row['hitBy'] = players[shot.get('hitBy')]
            writer.writerow(row)


if __name__ == "__main__":
    main(sys.argv[1], sys.stdout)