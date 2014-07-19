from page import Component

class OrlyEditor(Component):
  def __init__(self, page):
    super(OrlyEditor, self).__init__()

  @property
  def body(self):
    return ""

  CSS_NAMES = (
    'static/main/third-party/code-mirror/codemirror.css',
    'static/main/third-party/code-mirror/theme/solarized.css',
  )

  JS_NAMES = (
    'static/main/third-party/code-mirror/codemirror.js',
    'static/main/third-party/code-mirror/mode/clike.js',
    'static/modules/orly-editor/orly-editor.js',
  )

  MUSTACHE_DICT = {
    'orly-editor': file('static/modules/orly-editor/orly-editor.mustache').read()
  }
