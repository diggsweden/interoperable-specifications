var respecConfig = {
  format: "markdown",
  shortName: "inspec",
  latestVersion: "http://w3id.org/inspec/specification",
  specStatus: "base",
  historyURI: null,
  lint: {
    "no-headingless-sections": false,
  },
  editors: [
    {
      name: "Matthias Palmér",
      url: "matthias@metasolutions.se",
      company: "MetaSolutions",
      companyURL: "https://metasolutions.se/",
    },
    {
      name: "André Costa",
      company: "MetaSolutions",
      companyURL: "https://metasolutions.se/",
    },
  ],
  github: "diggsweden/interoperable-specifications",
  otherLinks: [
    {
      key: "On behalf of",
      data: [{
        value: "Swedish Agency for Digital Government",
        href: "https://www.digg.se",
        class: "p-org org h-org",
      }]},
    {
      key: "Contributions from the reference group (in alphabetic order)",
      data: [
        {class: "editor p-author h-card vcard", value: "Andrew Mercer (Riksarkivet)"},
        {class: "editor p-author h-card vcard", value: "Benny Lund (Bolagsverket)"},
        {class: "editor p-author h-card vcard", value: "Caspar Almalander (Sveriges Kommuner och Regioner)"},
        {class: "editor p-author h-card vcard", value: "Cilla Öhnfeldt (Naturvårdsverket)"},
        {class: "editor p-author h-card vcard", value: "Erik Mossing (Bolagsverket)"},
        {class: "editor p-author h-card vcard", value: "Fredrik Emanuelsson (Riksarkivet)"},
        {class: "editor p-author h-card vcard", value: "Fredrik Klingwall (Kungliga biblioteket)"},
        {class: "editor p-author h-card vcard", value: "Fredrik Persäter (Lantmäteriet)"},
        {class: "editor p-author h-card vcard", value: "Jan Rydkvist (Statistikmyndigheten SCB)"},
        {class: "editor p-author h-card vcard", value: "Johan Oelrich (Arbetsförmedlingen)"},
        {class: "editor p-author h-card vcard", value: "Kristofer Gäfvert (Lantmäteriet)"},
        {class: "editor p-author h-card vcard", value: "Lars Näslund (Trafikverket)"},
        {class: "editor p-author h-card vcard", value: "Marcus Smith (Riksarkivet)"},
        {class: "editor p-author h-card vcard", value: "Marjan Akhavan (E-hälsomyndigheten)"},
        {class: "editor p-author h-card vcard", value: "Martin Brandhagen (Vetenskapsrådet)"},
        {class: "editor p-author h-card vcard", value: "Matthias Palmér (Myndigheten för digital förvaltning)"},
        {class: "editor p-author h-card vcard", value: "Mattias Ekhem (Myndigheten för digital förvaltning)"},
        {class: "editor p-author h-card vcard", value: "Michalis Vassilas (Myndigheten för digital förvaltning)"},
        {class: "editor p-author h-card vcard", value: "Olof Olsson (Svensk Nationell Datatjänst)"},
        {class: "editor p-author h-card vcard", value: "Olov Johansson (Sveriges geologiska undersökning)"},
        {class: "editor p-author h-card vcard", value: "Patrik Wahlgren (Statistikmyndigheten SCB)"},
        {class: "editor p-author h-card vcard", value: "Per Wiklander (Vetenskapsrådet)"},
        {class: "editor p-author h-card vcard", value: "Peter Israelsson (Myndigheten för digital förvaltning)"},
        {class: "editor p-author h-card vcard", value: "Stefan Jakobsson (Svensk nationell datatjänst)"},
        {class: "editor p-author h-card vcard", value: "Tomas Lindberg (Sveriges geologiska undersökning)"},
        {class: "editor p-author h-card vcard", value: "Ulrika Domellöf Mattson (Myndigheten för digital förvaltning)"},
      ]
    },
    {
      key: "License",
      data: [{
        value: "CC-BY 4.0",
        href: "http://creativecommons.org/licenses/by/4.0/",
      }]
    },
  ],
  // non-standard respec
  title: "Interoperable Specifications Profile",
  version: "1.0.0",
  copyright: 'Copyright © 2025 <a href="https://www.digg.se">DIGG</a>.',
  abstract: "A specification describes how data should be expressed and understood. The Interoperable Specifications Profile (INSPEC) has been developed to ensure that specifications are interoperable, reusable, and machine-readable. It follows a more modern approach, viewing a specification as a package of resources or components, some intended for human consumption and others for machine processing — resources, described using RDF, that are pre-defined to facilitate both semantic and technical interoperability.",
}

// override some W3C settings and move content out of html
function overrideTitle(conf) {
  document.title = `${conf.title} - version ${conf.version}`;
}

function setCopyright(conf) {
  const existingCopyright = document.querySelector(".copyright");
  existingCopyright.innerHTML = `${conf.copyright}`;
}

function setAbstract(conf) {
  const existingAbstract = document.getElementById("abstract");
  existingAbstract.innerHTML = `${conf.abstract}`;
}

overrideTitle(respecConfig);
setCopyright(respecConfig);
setAbstract(respecConfig);