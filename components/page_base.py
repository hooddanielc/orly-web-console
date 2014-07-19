from page import Component

class PageBase(Component):
  def __init__(self, page):
    super(PageBase, self).__init__()

  @property
  def body(self):
    return ""

  CSS_NAMES = (
    'static/main/third-party/bootstrap/css/bootstrap.min.css',
    'static/main/third-party/bootstrap/css/bootstrap-theme.min.css',
  )

  JS_NAMES = (
    'static/main/third-party/bootstrap/js/bootstrap.min.js',
    'static/modules/page-base/page-base.js',
  )

  MUSTACHE_DICT = {
    'page-base': file('static/modules/page-base/page-base.mustache').read()
  }
