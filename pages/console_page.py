from bottle import route
from page import Page
from components import page_base
from components import orly_control_panel

class MyPage(Page):
  def __init__(self):
    super(MyPage, self).__init__()
    self.page_base = page_base.PageBase(self)
    self.orly_control_panel = orly_control_panel.OrlyControlPanel(self)

  @property
  def title(self):
    return "Orly Web Console"

  JS_NAMES = (
    'static/main/third-party/broofa-node-uuid.js',
    'static/pages/console-page/console-page.js',
  )

  CSS_NAMES = ('static/pages/console-page/console-page.css',)

  MUSTACHE_DICT = {
    'console-page': file('static/pages/console-page/console-page.mustache').read()
  }

@route('/console')
def route_home():
  return MyPage().render()
