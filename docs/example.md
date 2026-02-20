# Example - DocPub1.0 - Document and publisher

Let us consider a very simple interoperable specification where we describe a document and an associated publisher.

The document must have a title, creation date and a publisher. It also recommended that the document is categorized with help of an external terminology. In this case we will use the data categories from the publication office.

The publisher should be typed as a person, have a name, an email that is recommended and an optional special identifier expressed via a custom property in a specific data vocabulary.

## PROF-INSPEC expression

```turtle
@prefix ex: <http://example.com/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix prof: <http://www.w3.org/ns/dx/prof/> .
@prefix profrole: <http://www.w3.org/ns/dx/prof/role/> .
@prefix dtheme: <http://publications.europa.eu/resource/authority/data-theme/> .
@prefix inspec: <https://w3id.org/inspec/datavoc/> .

ex:spec1 a prof:Profile ;
  dcterms:title "DocPub1.0 - document and publisher"@en ;
  dcterms:description """DocPub 1.0 is an example of an interoperable specification.
It reuses classes and properties from DCTerms and FOAF as well as introduces an own property.
The purpose is to show how all of the different parts of an interoperable specification fits together.""" ;
  dcterms:conformsTo inspec:PROF ;
  prof:hasResource ex:ap1 ;
  prof:hasResource ex:dv1 ;
  prof:hasResource ex:te1 ;
  prof:hasResource ex:vi1 .

ex:ap1 a prof:ResourceDescriptor ;
  dcterms:title "Application Profile for DocPub1.0";
  dcterms:conformsTo inspec:SHACL ;
  dcterms:format "text/turtle" ;
  prof:hasArtifact ex:AP1File ;
  prof:hasRole profrole:schema, profrole:constraints ;

ex:dv1 a prof:ResourceDescriptor ;
  dcterms:title "Data vocabulary for DocPub1.0";
  dcterms:conformsTo inspec:RDFS ;
  dcterms:format "text/turtle" ;
  dcterms:subject ex:DV1Ontology ;
  prof:hasArtifact ex:DV1File ;
  prof:hasRole profrole:schema, profrole:vocabulary .

ex:dv2 a prof:ResourceDescriptor ;
  dcterms:title "Data vocabulary for Dublin Core";
  dcterms:conformsTo inspec:RDFS ;
  prof:isInheritedFrom ex:spec_DCTERMS ;
  dcterms:subject dcterms: ;
  dcterms:format "rdf/xml" ;
  prof:hasArtifact <https://www.dublincore.org/specifications/dublin-core/dcmi-terms/dublin_core_terms.rdf> ;
  prof:hasRole profrole:schema, profrole:vocabulary .

ex:dv3 a prof:ResourceDescriptor ;
  dcterms:title "Data vocabulary for Friend of a Friend (FOAF)";
  dcterms:conformsTo inspec:RDFS ;
  prof:isInheritedFrom ex:spec_FOAF ;
  dcterms:subject foaf: ;
  dcterms:format "rdf/xml" ;
  prof:hasArtifact <http://xmlns.com/foaf/spec/index.rdf> ;
  prof:hasRole profrole:schema, profrole:vocabulary .

ex:te1 a prof:ResourceDescriptor ;
  dcterms:title "Data themes terminology from EU publication office";
  dcterms:conformsTo inspec:SKOS ;
  dcterms:subject dtheme: ;
  dcterms:format "text/turtle" ;
  prof:hasArtifact ex:TE1File ;
  prof:hasRole profrole:vocabulary .

ex:vi1 a prof:ResourceDescriptor ;
  dcterms:title "Diagram of DocPub1.0";
  dcterms:conformsTo inspec:SVG ;
  dcterms:format "image/svg+xml" ;
  prof:hasArtifact ex:VI1File ;
  prof:hasRole profrole:specification .
```

The following triples can be provided as part of PROF-INSPEC, alternatively they can be auto generated as part of the harvesting process.

```turtle
# referenced classes and properties - AP-14
ex:spec1 inspec:reuses foaf:Document ;
  inspec:reuses dcterms:title ;
  inspec:reuses dcterms:created ;
  inspec:reuses dcterms:publisher ;
  inspec:reuses dcterms:subject ;
  inspec:reuses foaf:Person ;
  inspec:reuses foaf:name ;
  inspec:reuses foaf:mbox ;
  inspec:introduces ex:personNumber .

# public shapes - AP-3/AP-4, reproduced from SHACL-INSPEC or auto generated as part of the harvesting process
ex:spec1 dcterms:hasPart ex:ns-document ;
  dcterms:hasPart ex:ps-title ;
  dcterms:hasPart ex:ps-created ;
  dcterms:hasPart ex:ps-publisher ;
  dcterms:hasPart ex:ps-subject ;
  dcterms:hasPart ex:ns-person ;
  dcterms:hasPart ex:ps-name ;
  dcterms:hasPart ex:ps-mbox ;
  dcterms:hasPart ex:ps-pnr .
```

## RDFS-INSPEC expression

```turtle
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .

ex:personNumber a rdf:Property ;
  rdfs:label "Personal number"@en ;
  rdfs:domain foaf:Person ;
  rdfs:range  rdf:Literal ;
  rdfs:isDefinedBy ex:DV1Ontology .

ex:DV1Ontology a owl:Ontology ;
  dcterms:title "Data vocabulary for DocPub"@en .
```

## SKOS-INSPEC expression

The following is just regular SKOS.

```turtle
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix dtheme: <http://publications.europa.eu/resource/authority/data-theme/> .

dtheme:ECON a skos:Concept ;
  skos:prefLabel "Economy"@en ;
  skos:topConceptOf dtheme: ;
  skos:inScheme dtheme: .

dtheme: a skos:ConceptScheme ;
  dcterms:title "Data theme terminology" .
...
```

## SHACL-INSPEC expression

```turtle
@prefix ex: <http://example.com/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix dtheme: <http://publications.europa.eu/resource/authority/data-theme/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .

# --------Document shape----------
ex:ns-document a sh:NodeShape ;
  sh:targetClass foaf:Document ;
  sh:name "Document"@en ;
  sh:property [
      sh:path rdf:type ;
      sh:in ( foaf:Document ) ;
    ],
    ex:ps-title,
    ex:ps-created,
    ex:ps-publisher,
    ex:ps-subject .

ex:ps-title a sh:PropertyShape ;
  sh:path dcterms:title ;
  sh:nodeKind sh:Literal ;
  sh:datatype rdf:langString ;
  sh:name "title"@en ;
  sh:minCount "1" .

ex:ps-created a sh:PropertyShape ;
  sh:path dcterms:created ;
  sh:nodeKind sh:Literal ;
  sh:datatype xsd:date ;
  sh:name "Created date"@en ;
  sh:minCount "1" .

ex:ps-publisher a sh:PropertyShape ;
  sh:path dcterms:published ;
  sh:nodeKind sh:IRI ;
  sh:name "Publisher"@en ;
  sh:class foaf:Person ;
  sh:minCount "1" .

ex:ps-subject a sh:PropertyShape ;
  sh:path dcterms:subject ;
  sh:nodeKind sh:IRI ;
  sh:name "Category"@en ;
  sh:node [
    a sh:NodeShape ;
    sh:severity sh:Info ;
    sh:property [
      sh:path rdf:type ;
      sh:hasValue skos:Concept ;
    ], [
      sh:path skos:inScheme ;
      sh:hasValue dtheme: ;
    ]
  ] .

# --------Person shape----------
ex:ns-person a sh:NodeShape ;
  sh:targetClass foaf:Person ;
  sh:name "Person"@en ;
  sh:property [
      sh:path rdf:type ;
      sh:in ( foaf:Person ) ;
    ],
    ex:ps-name,
    ex:ps-mbox,
    ex:ps-pnr .

ex:ps-name a sh:PropertyShape ;
  sh:path foaf:name ;
  sh:nodeKind sh:Literal ;
  sh:datatype rdf:langString ;
  sh:name "title"@en ;
  sh:minCount "1" .

ex:ps-mbox a sh:PropertyShape ;
  sh:path foaf:mbox ;
  sh:nodeKind sh:IRI ;
  sh:pattern "^mailto:.+@.+" ;
  sh:name "Email"@en .

ex:ps-pnr a sh:PropertyShape ;
  sh:path ex:personNumber ;
  sh:nodeKind sh:Literal ;
  sh:name "Personal number"@en ;
  sh:minCount "0" .
```

The following triples may be provided as part of SHACL-INSPEC, alternatively they can be auto generated as part of PROF-INSPEC above.

```turtle
# public shapes - AP-3/AP-4
ex:spec1 dcterms:hasPart ex:ns-document ;
  dcterms:hasPart ex:ps-title ;
  dcterms:hasPart ex:ps-created ;
  dcterms:hasPart ex:ps-publisher ;
  dcterms:hasPart ex:ps-subject ;
  dcterms:hasPart ex:ns-person ;
  dcterms:hasPart ex:ps-name ;
  dcterms:hasPart ex:ps-mbox ;
  dcterms:hasPart ex:ps-pnr .
```
