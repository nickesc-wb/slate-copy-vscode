const assert = require('assert');
const { wrapForSlate } = require('../wrap');

const cases = [
  {
    name: 'js',
    lang: 'javascript',
    input: 'console.log("hi");\nif (x) {\n  y();\n}\n',
    expected: `<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title></title>
  </head>
  <body>
    <script type="text/javascript">
      console.log("hi");
      if (x) {
        y();
      }
    </script>
  </body>
</html>`,
  },
  {
    name: 'css',
    lang: 'css',
    input: '.a {\n  color: red;\n}',
    expected: `<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title></title>
    <style type="text/css">
      .a {
        color: red;
      }
    </style>
  </head>
  <body>
  </body>
</html>`,
  },
  {
    name: 'html fragment',
    lang: 'html',
    input: '<div>\n  <p>Hi</p>\n</div>',
    expected: `<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title></title>
  </head>
  <body>
    <div>
      <p>Hi</p>
    </div>
  </body>
</html>`,
  },
  {
    name: 'html with body only',
    lang: 'html',
    input: '<body>\n  <p>Hi</p>\n</body>',
    expected: `<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title></title>
  </head>
  <body>
    <p>Hi</p>
  </body>
</html>`,
  },
  {
    name: 'html with html and body is unchanged',
    lang: 'html',
    input: '<html>\n<body class="x">\n<p>Hi</p>\n</body>\n</html>\n',
    expected: '<html>\n<body class="x">\n<p>Hi</p>\n</body>\n</html>\n',
  },
  {
    name: '<bodyguard> is not a body tag',
    lang: 'html',
    input: '<bodyguard></bodyguard>',
    expected: `<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title></title>
  </head>
  <body>
    <bodyguard></bodyguard>
  </body>
</html>`,
  },
];

let failed = 0;
for (const c of cases) {
  try {
    assert.strictEqual(wrapForSlate(c.input, c.lang), c.expected);
    console.log(`ok   ${c.name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL ${c.name}\n${e.message}`);
  }
}
process.exit(failed ? 1 : 0);
