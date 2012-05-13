import datetime
import os
import re
import unicodedata
from fabric.api import *

POST_TEMPLATE = """\
---
title: %(title)s
layout: post
published: false
tags: []
---
"""

ROOT = os.path.realpath(os.path.dirname(__file__))
_f = lambda fn: os.path.join(ROOT, fn)

class _DoingItWrong(Exception):
	"""
	Catch-all for breaking things
	"""
	pass
		

# borrowed shamelessly from django
def _slugify(value):
    """
    Normalizes string, converts to lowercase, removes non-alpha characters,
    and converts spaces to hyphens.
    """
    value = unicode(value)
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore')
    value = re.sub('[^\w\s-]', '', value).strip().lower()
    return re.sub('[-\s]+', '-', value)


def post(title='', format='markdown'):
	"""
	Create a new stub post
	"""
	date = datetime.datetime.now().strftime('%Y-%m-%d')
	slug = _slugify(title)
	filename = _f("_posts/%s-%s.%s" % (date, slug, format))
	if not os.path.exists(filename):
		with open(filename, 'wb') as f:
			content = POST_TEMPLATE % {'title': title}
			f.write(content)
	else:
		raise _DoingItWrong('That post already exists!')

def build():
	local('lessc %s > %s' % (_f('bootstrap/less/bootstrap.less'), _f('bootstrap/bootstrap.css')))
