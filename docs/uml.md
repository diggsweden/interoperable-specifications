# INSPEC UML tag convention

Interoperable specifications are often authored as UML models, typically as Enterprise Architect files or XMI exports from them. The data vocabularies and the application profile of the specification are then extracted from the model. This page describes how such a model is described as a specification part, and the tag convention the model must follow for interoperable specification parts to be extracted from it, see the [rules for extracting specification parts - EXTRACT-INSPEC](rules.md#rules-for-extracting-specification-parts---extract-inspec).

Extraction is a preparatory step. The extracted data vocabularies and application profile are interoperable specification parts like any other, and are described and validated according to the rules for their kind.

## The UML specification part

A UML model is described by a `prof:ResourceDescriptor`, indicated via `prof:hasResource` from the interoperable specification resource like any other specification part:

Statement | Meaning
--- | ---
`dcterms:conformsTo inspec:UML` [1] | Identifies the specification part as a UML model following the INSPEC UML tag convention.
`dcterms:format` [0..1] | Identifies the kind of model file.
`prof:hasArtifact` [1] | The model file.
`inspec:umlOntology` [0..1] | The URI of a data vocabulary resource. The packages of the model with this `ontologyURI`, and those without an `ontologyURI` whose `baseURI` is this URI or this URI followed by `/` or `#`, are extracted, and their **introduced** terms make up the data vocabulary, see [Packages](#packages). It never points out reused terms.
`inspec:umlOntologyDiagram` [0..1] | A diagram that limits the extraction of the data vocabulary to what it draws, see [Ontology diagram](#ontology-diagram). It is given only together with `inspec:umlOntology`.
`inspec:umlDiagram` [0..1] | The diagram the application profile is extracted from.
`inspec:umlExtractionOption` [0..*] | An option for how the model is read, see [Extraction options](#extraction-options).
`prof:hasRole` [0..*] | What the model describes: `profrole:vocabulary`, `profrole:constraints` and/or `profrole:specification` (a diagram).

Each specification part has a single artifact, so that `dcterms:format` is unambiguous, and names at most one data vocabulary. A model that holds several data vocabularies is described by one specification part per vocabulary, each with the same `prof:hasArtifact`. The same model in several formats, e.g. an Enterprise Architect file and its XMI export, is described by one specification part per file. Each data vocabulary and the diagram should be named by only one specification part, so that each is extracted only once. The other parts may still indicate what the model describes via `prof:hasRole`, see [Roles](#roles).

### Roles

`inspec:umlOntology` and `inspec:umlDiagram` decide what is extracted, the values of `prof:hasRole` do not. A role without its corresponding property is valid and means that the model describes this, but is not its source. For example, `profrole:constraints` without `inspec:umlDiagram` says that the model describes the application profile while a separately maintained SHACL specification part is authoritative. The same goes for `profrole:vocabulary` without `inspec:umlOntology`.

### Names

Diagrams are identified by name or by GUID. A name must be unique within the model file, otherwise the GUID must be used. The name of an ontology diagram needs only to be unique among the diagrams of the data vocabulary's packages. Data vocabularies are identified by URI, see `inspec:umlOntology`.

### <span id="extraction-options"></span>Extraction options

An `inspec:umlExtractionOption` names an option for how the model is read. Its values are literals:

* `osloUris` - a class or attribute with neither a `uri` nor a `name` tag is named from its UML name, as the OSLO toolchain does: a class in upper camel case (e.g. "legal entity" gives `LegalEntity`), an attribute in lower camel case (e.g. "Legal Name" gives `legalName`), with a leading `^` dropped and whitespace removed. The name is then treated as a `name` tag, see [Term URIs](#term-uris). It applies to both the data vocabulary and the application profile. Associations still need a `uri` or `name` tag.
* `implicitOrder` - in the application profile, an attribute's property shape without an `ap-order` tag is ordered by the attribute's position in its class. It has no effect on a specification part without `inspec:umlDiagram`.

The specification parts with the same `prof:hasArtifact` must agree on `osloUris`, so that the data vocabulary and the application profile use the same term URIs. A converter should warn about a value it does not recognise and ignore it.

### Several models

An interoperable specification may have several UML specification parts, for example one per data vocabulary, or one per model file when the data vocabularies are kept in separate files. The diagram names and data vocabulary URIs of each specification part are resolved in its own model file.

### Data vocabulary specification parts

`dcterms:subject` has no role in the extraction from a UML model. The specification part of an extracted data vocabulary still points to its data vocabulary resource via `dcterms:subject`, see Rule DV-6 in the [rules](rules.md#dv6).

## <span id="tag-convention"></span>The tag convention

The model indicated via `prof:hasArtifact` must follow the rules below. Information is provided as tags on the elements of the model. Where a rule below says that something is an error, no extraction result is valid; where it says that something gives a warning, the extraction proceeds.

### Tags

The following tags are interpreted, all other tags are ignored:

* `uri`, `name` and `package` - identify a term, see [Term URIs](#term-uris).
* `baseURI`, `ontologyURI` and `language` - on a package, see [Packages](#packages) and [Texts](#texts).
* `parentURI`, `domain` and `range` - see [Domain and range](#domain-and-range) and [Inheritance](#inheritance).
* `label-xx`, `definition-xx` and `usageNote-xx` - texts in the language `xx`, see [Texts](#texts).
* `ap-label-xx`, `ap-definition-xx` and `ap-usageNote-xx` - texts for the application profile.
* `ap-weight`, `ap-nodeKind`, `ap-preferred`, `ap-order`, `ap-pattern`, `ap-codelist`, `ap-refines` and `ap-variant` - see [Application profile](#application-profile).
* `ignore` - see [Ignored elements](#ignored-elements).

In general a tag `X` applies to both the data vocabulary and the application profile, and `ap-X` overrides it in the application profile only. In practice this applies to the text tags only: `domain`, `range` and `parentURI` apply to the data vocabulary only, and the other `ap-` tags to the application profile only.

The values of `domain`, `range` and `parentURI` are absolute IRIs.

### Term URIs

URIs are not minted from UML element names, except with the `osloUris` extraction option, see [Extraction options](#extraction-options). A term is identified by:

* a `uri` tag,
* a `package` and a `name` tag, the name being resolved against the `baseURI` of the given package, or
* a `name` tag, resolved against the `baseURI` of the package that owns the class or attribute or, for an association, of the package it is located in.

A `uri` tag takes precedence: a `package` tag given with it is not used. A `uri` tag given with a `name` tag must agree with it.

A class or attribute is located in its owning package, or, when the diagrams of a data vocabulary's packages draw it and another package owns it, in one of those packages, see [Packages](#packages). An association has no owner and is located through the diagrams that draw it. It is an error:

* if an introduced term has none of the tags above,
* if a `name` tag has characters not allowed in a URI, or
* if a `package` tag, given without a `uri` tag, names a package that is not in the model file.

### Packages

The ontology URI of a package is its `ontologyURI` tag, or else its `baseURI` tag. An `inspec:umlOntology` `U` identifies the packages whose `ontologyURI` tag is `U`, and the packages without an `ontologyURI` tag whose `baseURI` is `U`, `U/` or `U#`, as an ontology conventionally mints its terms under such a namespace. Together they make up one data vocabulary, and their `baseURI`s are allowed to differ. It is an error if `U` identifies no package.

Without an ontology diagram, the extraction for the packages identified via `inspec:umlOntology` looks only at the occurrences located in them:

* the classes owned by the packages (as shown in Enterprise Architect's Project Browser), regardless of which diagrams they are drawn on, including classes drawn on no diagram,
* the classes owned by other packages and drawn on the packages' own diagrams. Such a class is located in the first of the packages whose diagrams draw it, in the order of the model file, while its terms are still resolved in its owning package,
* the attributes of those classes, and
* the associations drawn visibly on the packages' own diagrams (a hidden link does not count). An association drawn by the diagrams of several of the packages is located in the first of them, in the order of the model file.

Only class elements, abstract ones included, define terms. Data types and enumerations are only used as ranges, and other element types are skipped. Ignored elements are left out.

The packages introduce the terms of those occurrences whose URI resolves into one of them, i.e. that have:

* a `name` tag alone, resolved in one of the packages,
* a `package` tag naming one of the packages, together with a `name` tag, or
* a `uri` tag that is the `baseURI` of one of the packages followed by a local name, not by a sub-namespace.

Occurrences whose terms resolve elsewhere are uses of other vocabularies and produce nothing in the data vocabulary. The data vocabulary contains only the introduced terms.

The data vocabulary resource (see Rule DV-2 in the [rules](rules.md#dv2)) is the URI given by `inspec:umlOntology`. The text tags of the packages describe it: the label gives `dcterms:title`, the definition `dcterms:description` and the usage note `skos:scopeNote`. When several packages make up the data vocabulary, each kind of text is taken from the packages that have the corresponding tag, which must give the same text, otherwise it is an error. When none of them has it, it is taken from the first of the packages, in the order of the model file. A converter should warn when the text of another package is left out.

An introduced term must be identical in all its defining occurrences. If the same class or property is defined in several places in the packages, its texts and its superclasses or superproperties must be the same in each. Otherwise it is an error. A property whose occurrences differ in domain or range, after `domain` and `range` tags, gets no domain or range respectively; a converter should warn about it and recommend a `domain` or `range` tag. A redefining attribute is not a defining occurrence, see [Inheritance](#inheritance).

### <span id="ontology-diagram"></span>Ontology diagram

An `inspec:umlOntologyDiagram` limits the extraction to the occurrences the diagram draws, instead of those located in the packages:

* the classes drawn on the diagram, wherever they are owned, and the attributes of those classes, and
* the associations drawn visibly on the diagram.

One of the packages identified via `inspec:umlOntology` must own the diagram, otherwise it is an error. A class owned by one of the packages is located in it. Any other class, and every association, is located in the package that owns the diagram. The terms of a class and its attributes are still resolved in the class's owning package, and the terms of an association in the package that owns the diagram. Which terms are introduced is decided as without an ontology diagram.

The data vocabulary resource is described by the texts of the package that owns the diagram. A kind of text that package has none of is taken as without an ontology diagram.

### Domain and range

The domain of a property is the class that has the property, i.e. the owner of an attribute or, for an association end, the class at the opposite end. The range is the type of the attribute, or the class at the association end. Types are resolved as follows:

* a class gives that class,
* a data type or a primitive type with a `uri` tag gives that URI,
* a primitive type name (`String`, `Date`, `DateTime`, `Boolean`, `LangString` etc., matched case-insensitively) gives its XSD datatype or `rdf:langString`,
* `uri` gives an IRI value, see [Attributes typed uri](#attributes-typed-uri),
* an unknown type name, or an untagged data type with an unknown name, gives no range and a warning.

The `domain` and `range` tags replace the domain and range in the data vocabulary only, typically to make them less narrow. The value `rdfs:Resource` means that no domain or range is given.

#### <span id="attributes-typed-uri"></span>Attributes typed uri

An attribute typed `uri` holds an IRI. Its property shape gets `sh:nodeKind sh:IRI` and no `sh:datatype`, and the property gets no `rdfs:range` unless a `range` tag gives one. An attribute typed `anyURI` holds a literal of the datatype `xsd:anyURI`.

### Associations

When the model leaves navigability unspecified, which is the default in Enterprise Architect, a role name makes its end navigable. When navigability or a direction is given, each navigable end becomes a property of the class at the opposite end. Introduced association properties need a `uri` or `name` tag. Role and connector names are only used as texts.

A term may be tagged on the connector instead of on its ends, giving one property for every direction. A connector `name` tag with no roles and no direction gives one property from source to target. A connector-tagged property that is navigable in both directions between different classes needs `domain` and `range` tags. It is an error to give a `name` or `uri` tag on both the connector and one of its ends.

In the application profile, an association term with only a `name` tag is resolved in the package of the profile diagram, which draws every association of the profile.

The class of an association class is skipped with a warning, together with its attributes and the associations attached to it. The connector of the association class is still converted as an ordinary association.

### Inheritance

A generalization becomes `rdfs:subClassOf` only. Shapes are not flattened, and no `inspec:refines` or `inspec:variant` is inferred.

An attribute marked `{subsets x}` gives `rdfs:subPropertyOf` from its property to the property of `x` when its property is introduced. A property gets `rdfs:subPropertyOf` for its `parentURI` tag and for each property it subsets; a class gets `rdfs:subClassOf` for each generalization and for its `parentURI` tag.

An attribute marked `{redefines x}` must resolve to the same URI as `x`, and `x` must be in the model, otherwise it is an error. This applies to each attribute it redefines. The redefining attribute is not a defining occurrence of the property: it is exempt from the rule that all defining occurrences give the same statements (see [Packages](#packages)), and it contributes nothing to the data vocabulary. If nothing else in the package defines the property, `x` defines it (domain, range and texts). In the application profile, the redefining attribute gets an ordinary property shape on the node shape of its class, with its own type, multiplicity and tags, which is how a subclass narrows an inherited attribute.

Subsetting and redefinition are only read between attributes, not between association ends.

### Enumerations

In the data vocabulary, the range of an enumeration-typed property is the enumeration's own `uri` or `name` tag if it has one. Otherwise it is `xsd:string` for plain literals and absent for URI literals.

In the application profile, an enumeration gives `sh:in` with the values in the order of the enumeration literals in the model:

* if all literals have a `uri` tag, `sh:in` contains those URIs, with `sh:nodeKind sh:IRI`,
* if no literal has a `uri` tag, `sh:in` contains the literal names as plain literals, with `sh:nodeKind sh:Literal`,
* a mix of the two is an error.

The `uri` tag of a literal must be an absolute IRI. Ignored literals do not count. An enumeration without usable literals gives a warning and no `sh:in`.

### Texts

Each kind of text, i.e. label, definition and usage note, is taken as a whole from the first source that has it, in every language that source gives. Sources are not mixed language by language.

Statement | Taken from, in order
--- | ---
`rdfs:label` | `label-xx`, else the UML name (for an association, the connector's name)
`rdfs:comment` | `definition-xx`, else the Enterprise Architect notes with markup stripped
`skos:scopeNote` (data vocabulary) | `usageNote-xx`
`sh:name` | `ap-label-xx`, else `label-xx`, else the UML name (for an association end, its role)
`sh:description` | `ap-definition-xx`, else `definition-xx`, else the Enterprise Architect notes
`skos:scopeNote` (application profile) | `ap-usageNote-xx`, else `usageNote-xx`

Untagged texts (UML names and notes) and text tags without a language suffix are in the language given by the `language` tag of the package they are located in. A converter may let the caller supply a default language when there is none. A text tag without a language suffix gives way, with a warning, to a suffixed tag for the same language.

When the term of an association is tagged on the connector, the texts of an end are taken from the end, else from the connector, else from the role of the end, and then from the name of the connector.

### Application profile

#### Node shapes

The classes drawn on the diagram given by `inspec:umlDiagram` become node shapes, abstract ones included. A node shape is main unless the class is marked as supportive, either by the `«supportive»` stereotype or by the tag `ap-weight` = `supportive`, see Rule AP-5 in the [rules](rules.md#ap5). The `«main»` stereotype and `ap-weight` = `main` mark a class as main explicitly. A stereotype and an `ap-weight` tag that disagree are an error, and a stereotype other than `«main»` or `«supportive»` gives a warning.

Main node shapes get `sh:targetClass` and `sh:nodeKind sh:IRI`. Supportive node shapes get no target declaration, are reached via `sh:node` and get `sh:nodeKind sh:BlankNodeOrIRI`. Both indicate their class with a property shape with `sh:path rdf:type` and `sh:hasValue` the class. A node shape contains only the attributes of its own class and the associations of its own class drawn visibly on the diagram (a hidden link does not count). An association drawn only on other diagrams is left out. How shape URIs are minted is not part of the convention.

#### Property shapes

The range of a property shape is given by:

* `sh:datatype` for a datatype,
* `sh:class` for a class, together with `sh:node` to the node shape of the class when that node shape is supportive in the profile. A range class not drawn on the diagram is given by `sh:class` only.

A lower bound of 1 or more gives `sh:minCount`, a lower bound of 0 gives none. An upper bound other than `*` gives `sh:maxCount`.

Without an `ap-nodeKind` tag, the node kind is inferred:

* a datatype, `anyURI` included, gives `sh:Literal`,
* `uri` gives `sh:IRI`,
* `sh:in` of URIs gives `sh:IRI`, and of literals `sh:Literal`,
* `ap-codelist` gives `sh:IRI`,
* a class with a main node shape in the profile gives `sh:IRI`,
* a class with a supportive node shape, or with no node shape, gives `sh:BlankNodeOrIRI`,
* an unresolved type gives none, with a warning.

#### Application profile tags

* `ap-weight` - `main` or `supportive`, see [Node shapes](#node-shapes).
* `ap-nodeKind` - gives `sh:nodeKind`. Takes `BlankNode`, `IRI`, `Literal`, `BlankNodeOrIRI`, `BlankNodeOrLiteral` or `IRIOrLiteral`, matched case-insensitively.
* `ap-preferred` - the value `true` gives `sh:minCount 0` regardless of the lower bound, i.e. the property is preferred (recommended but not required).
* `ap-order` - gives `sh:order`, must be an integer. Without the `implicitOrder` extraction option, property shapes have no implicit order from their position in the model.
* `ap-pattern` - gives `sh:pattern`, must be a valid regular expression. `sh:pattern` is only given by this tag, not by constraints in the model.
* `ap-codelist` - on an attribute or association end, the concept scheme whose concepts are allowed as values. Gives `sh:nodeKind sh:IRI` and an anonymous `sh:node` with `sh:severity sh:Info` requiring `rdf:type skos:Concept` and `skos:inScheme` the concept scheme. It is an error on an attribute typed with a literal datatype, so leave the type empty or use `uri`.
* `ap-refines` - a shape URI, gives `inspec:refines` and `sh:and` with a list containing the same shape, see Rules [AP-7](rules.md#ap7) and [AP-9](rules.md#ap9).
* `ap-variant` - a shape URI, gives `inspec:variant`, see Rules [AP-8](rules.md#ap8) and [AP-10](rules.md#ap10).

`ap-refines` and `ap-variant` are allowed on classes (node shapes) as well as on attributes and association ends (property shapes).

### Ignored elements

An element is ignored when its `ignore` tag has the value `true`, matched case-insensitively. An ignored element gets no definition and no shape, but its term remains valid for references. The attributes of an ignored class are ignored too. A reference to an ignored class that has no `uri` or `name` tag is an error at the referring attribute or association end.

## Relation to OSLO

The convention starts from the tag names used by the [OSLO](https://github.com/Informatievlaanderen/OSLO-UML-Transformer) toolchain of the Flemish government, but it is **not** OSLO's convention, and an OSLO model will not necessarily convert. At the time of writing the main differences are:

* Only the tags listed above are interpreted, other OSLO tags are ignored.
* The `domain` tag is taken from OSLO's earlier toolchain (OSLO-EA-to-RDF), it is not supported by the current one.
* The `language` tag and the application profile tags `ap-weight`, `ap-nodeKind`, `ap-preferred`, `ap-order`, `ap-pattern`, `ap-refines` and `ap-variant` are added by INSPEC. In OSLO the language is a setting of the converter.
* OSLO extracts a vocabulary from one target diagram. Here a data vocabulary is scoped by its packages, or by an ontology diagram given via `inspec:umlOntologyDiagram`. An application profile, as in OSLO, takes only the associations its diagram draws.
* OSLO falls back on the UML element name when there is no `name` tag. Here, URIs are only minted from element names with the `osloUris` extraction option, and only for classes and attributes.
* OSLO's `Domain.prop` naming of properties and its `-rev-` tags for association classes are not supported.
* A generalization becomes `rdfs:subClassOf` only.
* In OSLO the `range` tag sets the range in both the vocabulary and the application profile. Here it replaces the `rdfs:range` only, the range in the application profile always follows the model.
* `ap-codelist` is read on the attribute or association end only, whereas OSLO also reads it on the range class. The constraint it gives, see [Application profile tags](#application-profile-tags), differs from the one OSLO generates.

See the [supported tags of the OSLO-UML-Transformer](https://github.com/Informatievlaanderen/OSLO-UML-Transformer/blob/main/packages/oslo-converter-uml-ea/lib/enums/README.md) and the [OSLO-EA-to-RDF documentation](https://github.com/Informatievlaanderen/OSLO-EA-to-RDF) for OSLO's own convention.

## Example

A profile interoperable specification whose data vocabulary and application profile are both extracted from a single XMI export:

```turtle
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix prof: <http://www.w3.org/ns/dx/prof/> .
@prefix profrole: <http://www.w3.org/ns/dx/prof/role/> .
@prefix inspec: <https://w3id.org/inspec/datavoc/> .
@prefix ex: <https://example.org/> .

ex:spec a prof:Profile ;
  dcterms:conformsTo inspec:PROF ;
  prof:hasResource ex:spec-uml .

ex:spec-uml a prof:ResourceDescriptor ;
  dcterms:conformsTo inspec:UML ;
  dcterms:format "application/vnd.xmi+xml" ;
  prof:hasArtifact <https://example.org/spec/model.xmi> ;
  prof:hasRole profrole:vocabulary, profrole:constraints ;
  inspec:umlOntology <https://example.org/ns/book/> ;
  inspec:umlDiagram "Book profile" .
```

## Open questions

* Nested packages - whether an `inspec:umlOntology` includes the terms of packages nested in the package it identifies.
* Association terms drawn in several packages - how the data vocabularies should handle an association term whose association is drawn by the diagrams of packages with different ontology URIs.
* Association classes - whether and how to support association classes.
