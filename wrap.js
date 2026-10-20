// Pure wrapping logic, kept free of the vscode API so it can be tested with plain node.

const HTML_OPEN = '<html xmlns="http://www.w3.org/1999/xhtml">';
const HEAD = ['  <head>', '    <title></title>', '  </head>'];

// Strip common leading whitespace, then indent every non-blank line by `spaces`.
function indent(content, spaces) {
  const lines = content.replace(/\r\n?/g, '\n').replace(/^\n+|\s+$/g, '').split('\n');
  const minIndent = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.match(/^[ \t]*/)[0].length)
  );
  const pad = ' '.repeat(spaces);
  return lines
    .map((l) => (l.trim() ? pad + l.slice(Number.isFinite(minIndent) ? minIndent : 0) : ''))
    .join('\n');
}

function wrapJs(content) {
  return [
    HTML_OPEN,
    ...HEAD,
    '  <body>',
    '    <script type="text/javascript">',
    indent(content, 6),
    '    </script>',
    '  </body>',
    '</html>',
  ].join('\n');
}

function wrapCss(content) {
  return [
    HTML_OPEN,
    '  <head>',
    '    <title></title>',
    '    <style type="text/css">',
    indent(content, 6),
    '    </style>',
    '  </head>',
    '  <body>',
    '  </body>',
    '</html>',
  ].join('\n');
}

// Ignore tags that only appear inside HTML comments.
function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

function wrapHtml(content) {
  const src = stripComments(content);
  const hasHtml = /<html[\s>]/i.test(src);
  const hasBody = /<body[\s>]/i.test(src);
  const hasHead = /<head[\s>]/i.test(src);

  // Already a full document (or has its own <html>): copy as-is.
  if (hasHtml) return content;

  if (hasBody) {
    return [HTML_OPEN, ...(hasHead ? [] : HEAD), indent(content, 2), '</html>'].join('\n');
  }

  return [HTML_OPEN, ...HEAD, '  <body>', indent(content, 4), '  </body>', '</html>'].join('\n');
}

const WRAPPERS = { javascript: wrapJs, css: wrapCss, html: wrapHtml };

function wrapForSlate(content, languageId) {
  const wrap = WRAPPERS[languageId];
  return wrap ? wrap(content) : null;
}

module.exports = { wrapForSlate, wrapJs, wrapCss, wrapHtml };
