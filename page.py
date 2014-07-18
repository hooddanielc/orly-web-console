from itertools import chain
from json import dumps
from string import Template
from bottle import request, response
import uuid

def CssTag(name):
  return '<link rel="stylesheet" href="%s" />' % name

def JsTag(name):
  return '<script src="%s"></script>' % name

class BodyBuilder(object):
  def __init__(self):
    super(BodyBuilder, self).__init__()
    self.__data = {}

  def __getitem__(self, key):
    return self.__data.get(key, '')

  def __setitem__(self, key, val):
    self.__data[key] = val

  @property
  def body(self):
    return ''

  def yieldClasses(self, taboo):
    cls = self.__class__
    if cls not in taboo:
      taboo.add(cls)
      for comp in self.yieldComponents():
        for comp_cls in comp.yieldClasses(taboo):
          yield comp_cls
      yield cls

  def yieldComponents(self):
    for item in self.__dict__.itervalues():
      if issubclass(item.__class__, Component):
        yield item

  def yieldDataItems(self):
    for comp in self.yieldComponents():
      for item in comp.__data.iteritems():
        yield item
    for item in self.__data.iteritems():
      yield item

  CSS_NAMES = tuple()
  JS_NAMES = tuple()
  MUSTACHE_DICT = {}

class Component(BodyBuilder):
  def __init__(self):
    super(Component, self).__init__()

class Page(BodyBuilder):
  def __init__(self):
    super(Page, self).__init__()

    if not request.get_cookie('session_id'):
      self._session = str(uuid.uuid1())
      response.set_cookie('session_id', self._session)
    else:
      self._session = request.get_cookie('session_id')

    self.__data = {}

  def render(self):
    classes = tuple(self.yieldClasses(set()))
    return Page.HTML.substitute({
      'title':    self.title,
      'head_css': '\n'.join(map(CssTag, Page.HEAD_CSS_NAMES)),
      'head_js':  '\n'.join(map(JsTag,  Page.HEAD_JS_NAMES)),
      'data':     dumps(dict(self.yieldDataItems())),
      'mustache': dumps(dict(chain.from_iterable(cls.MUSTACHE_DICT.iteritems() for cls in classes))),
      'body_css': '\n'.join(map(CssTag, chain.from_iterable(cls.CSS_NAMES for cls in classes))),
      'body_js':  '\n'.join(map(JsTag,  chain.from_iterable(cls.JS_NAMES  for cls in classes))),
      'body':     self.body,
    })

  @property
  def title(self):
    return self.__class__.__name__

  @property
  def session(self):
    return self._session

  HTML = Template("""
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>$title</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      $head_css
      $head_js
    </head>
    <body>
      <script>
        var app = {
          modules: {}
        };
        app.data = $data;
        app.mustache = $mustache;
      </script>
      $body_css
      $body_js
      $body
    </body>
    </html>
  """)

  HEAD_CSS_NAMES = (
    'static/main/main.css',
  )

  HEAD_JS_NAMES = (
    'static/main/third-party/mustache.min.js',
    'static/main/third-party/jquery.min.js',
    'static/main/third-party/underscore.min.js',
    'static/main/third-party/backbone.min.js'
  )
