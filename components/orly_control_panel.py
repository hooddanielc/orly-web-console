from page import Component
import orly_editor

class OrlyControlPanel(Component):
  def __init__(self, page):
    super(OrlyControlPanel, self).__init__()
    self.orly_editor = orly_editor.OrlyEditor(page)

  @property
  def body(self):
    return ""

  JS_NAMES = (
    'static/modules/orly-control-panel/orly-control-panel.js',
  )

  MUSTACHE_DICT = {
    'orly-control-panel': file('static/modules/orly-control-panel/orly-control-panel.mustache').read(),
    'orly-control-panel-params': file('static/modules/orly-control-panel/orly-control-panel-params.mustache').read()
  }
