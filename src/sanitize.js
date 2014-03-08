exports.links =function(content) {
  return content.replace(/(\].*)(\.md)/g, '$1.html');
};

exports.replacements = function(content) {
  // Replace `Hello World` with `{{> body }}`. This is where our content gets injected.
  content = content.replace(/<!-- .*\s*<p>Hello world!.*<\/p>/, "{{> body }}");

  // Replace `.md` in links with `.html`
  content = exports.links(content);

  // Add a {{title}} template in the `<title></title>` tag.
  content = content.replace(/(<title>).+(<\/title>)/, '{{#isnt basename "index"}}$1{{titleize basename}}$2{{else}}$1Home$2{{/isnt}}');
  return content;
};

