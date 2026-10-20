# Copy for Slate

Adds a clipboard button to the editor title bar (next to Split Editor / More Actions) for JS, CSS, and HTML files. Click it to copy the selection, or the whole file if nothing is selected, wrapped in a Slate-ready HTML document.

- **JS**: wrapped in `<script type="text/javascript">` inside `<body>`
- **CSS**: wrapped in `<style type="text/css">` inside `<head>`
- **HTML**: wrapped in `<html>` + `<body>`. If `<body>` already exists, only `<html>` (and `<head>` if missing) is added. If `<html>` exists, copied as-is.

Also available from the right-click menu and the Command Palette ("Copy for Slate").
