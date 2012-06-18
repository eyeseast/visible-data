#!/usr/bin/env python
import csv
import datetime
import json
import sys
import urllib
import urllib2

FIELDS = ('date', 'pm25', 'aqi', 'tweet_id')

def get_tweets(screen_name, page=1, count=200, **kwargs):
    params = {
        'screen_name': screen_name,
        'page': page,
        'count': count
    }
    params.update(kwargs)
    url = "http://api.twitter.com/1/statuses/user_timeline.json?" 
    url += urllib.urlencode(params)
    return json.load(urllib2.urlopen(url))

def parse_tweet(tweet):
    """
    Parse a tweet text and return a dictionary with keys matching FIELDS

    
    >>> tweet = "06-07-2012 08:00; PM2.5; 38.0; 105; Unhealthy for Sensitive Groups (at 24-hour exposure at this level)"
    >>> details = parse_tweet(tweet)
    >>> details['pm25']
    '38.0'
    >>> details['aqi']
    '105'
    """
    text = tweet.get('text', '')
    details = {}
    try:
        parts = [p.strip() for p in text.split(';')]
        details['date'] = parts[0]
        details['pm25'] = parts[2]
        details['aqi'] = parts[3]
        details['tweet_id'] = tweet['id_str']
        return details

    except IndexError:
        raise
    

def main(screen_name):
    """
    Grab last 3200 tweets and dump to sys.stdout
    """
    writer = csv.DictWriter(sys.stdout, FIELDS)
    writer.writerow(dict(zip(FIELDS, FIELDS)))

    for page in range(1,17):
        tweets = get_tweets(screen_name, page=page)
        for tweet in tweets:
            if "24hr avg" in tweet['text'] or " to " in tweet['text']:
                continue

            try:
                row = parse_tweet(tweet)
                writer.writerow(row)
            except IndexError, e:
                sys.stderr.write(str(e) + '\n')
                sys.stderr.write(tweet['text'] + '\n')


if __name__ == '__main__':
    main(sys.argv[1])