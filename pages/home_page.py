from bottle import route
from page import Page
from components import page_base

class MyPage(Page):
  def __init__(self):
    super(MyPage, self).__init__()
    self.page_base = page_base.PageBase(self)

  @property
  def title(self):
    return "Orly Web Console"

  JS_NAMES = ('static/pages/home-page/home-page.js',)
  CSS_NAMES = ('static/pages/home-page/home-page.css',)
  MUSTACHE_DICT = {
    'home-page': file('static/pages/home-page/home-page.mustache').read()
  }

@route('/')
def route_home():
  return MyPage().render()
