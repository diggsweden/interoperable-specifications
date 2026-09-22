window.onload = (event) => {
  // Replace link to md files to rendered html equivalents
  var mdLinks = document.querySelectorAll('a[href$=".md"]');
  mdLinks.forEach(a =>{
    var oldHref = a.getAttribute('href');
    var newHref = oldHref.slice(0, oldHref.lastIndexOf(".")) + ".html"
    a.setAttribute('href', newHref)
  });
};