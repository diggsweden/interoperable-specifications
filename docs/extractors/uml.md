# INSPEC UML extraction convention

Interoperable specifications are often authored as UML models, typically as Enterprise Architect files or XMI exports from them. The data vocabularies and the application profile of the specification are then extracted from the model. This page describes how such a model is described as a specification part, and the tag convention the model must follow for interoperable specification parts to be extracted from it. `inspec-uml:UML` is an extraction convention in the sense of [Rule EXTRACT-1](../rules.md#extract1).

This extraction convention uses the following namespaces:

namespace | expansion
--- | ---
inspec | <https://w3id.org/inspec/datavoc/>
inspec-uml | <https://w3id.org/inspec/datavoc/extractors/uml/>

## Terminology

The following terms are used with the meaning given here. Terms defined in the [rules](../rules.md), such as *data vocabulary*, *application profile*, *data vocabulary resource*, *node shape*, *property shape*, *main* and *supportive*, keep their meaning from there.

### The model

* **Model** - the UML model in the model file given by `prof:hasArtifact` of a UML specification part.
* **UML specification part** - a specification part with `dcterms:conformsTo inspec-uml:UML`, see [Describing the model as a specification part](#specification-part).
* **Element** - a package, class, data type, enumeration, enumeration value, attribute, association, association end or generalization in the model.
* **Package** - a UML package. A package **owns** the elements it contains, as given by the model.
* **Class** - a UML class, abstract or not. Data types and enumerations are not classes.
* **Attribute** - an attribute of a class.
* **Association** - a UML association, as a whole. Tags given on an association are said to be given **on the association**, as opposed to on one of its ends.
* **Association end** - one of the two ends of an association, with its role name, multiplicity and navigability.
* **Enumeration value** - a literal of a UML enumeration. (The word *literal* on its own always means an RDF literal.)
* **Type** - the type of an attribute (a class, data type, primitive type or enumeration), or the class at an association end.
* **Tag** - a tagged value on an element. *The tag `x`* means the tagged value named `x`.
* **Stereotype** - a UML stereotype on an element, written `«name»`.
* **Notes** - the documentation text of an element (in UML, its comments), with any markup stripped.
* **Diagram** - a UML diagram in the model. An element is **drawn on** a diagram when the diagram shows it. An association is drawn on a diagram only when it is visible there, so a hidden link does not count.
* **Ontology diagram** - the diagram given by `inspec-uml:ontologyDiagram`.
* **Application profile diagram** - the diagram given by `inspec-uml:apDiagram`.

### Data vocabulary scope

* **Ontology URI** - of a package: its `ontologyURI` tag, or else its `baseURI` tag.
* **Vocabulary packages** - the packages identified by `inspec-uml:ontology`, see [Scope](#dv-scope). Together they make up one data vocabulary.
* **Located in** - the package an element is considered to belong to for the extraction. It is usually the owning package, but can differ for classes drawn on other packages' diagrams and for associations, which have no owner, see [Scope](#dv-scope).

### Terms

* **Term** - a class or property of a data vocabulary, identified by an IRI. Classes give class terms. Attributes, association ends and associations give property terms. *Term* never refers to the UML element itself.
* **Property** - always an RDF property. On the UML side, the words used are *attribute* and *association end*.
* **Resolve** - to determine the IRI of a term from the tags of an element, see [Identifying terms](#identifying-terms). A `name` tag is resolved *in* a package, i.e. against that package's `baseURI`.
* **Occurrence** - an element that gives a term. The same term can have several occurrences, e.g. a property given by attributes of several classes.
* **Introduced term** - a term whose IRI resolves into one of the vocabulary packages. Only introduced terms make up the extracted data vocabulary. Other terms are **reused** from other data vocabularies.
* **Defining occurrence** - an occurrence of an introduced term within the scope of the extraction, other than a redefining attribute, see [Inheritance](#inheritance). All defining occurrences of a term must agree.

### Extraction

* **Extractor** - software that extracts a data vocabulary or application profile from a UML specification part according to this convention.
* **Extraction option** - a value of `inspec-uml:extractionOption`, see [Extraction options](#extraction-options).
* **Error** - a condition in the model or the specification part that prevents a valid extraction, see [Extractor conformance](#extractor-conformance).
* **Warning** - a condition in the model or the specification part that an extractor reports while still extracting, see [Extractor conformance](#extractor-conformance).

## <span id="specification-part"></span>Describing the model as a specification part

A UML model is described by a `prof:ResourceDescriptor`, indicated via `prof:hasResource` from the interoperable specification resource like any other specification part:

Statement | Meaning
--- | ---
`dcterms:conformsTo inspec-uml:UML` [1] | Identifies the specification part as a UML model following the INSPEC UML extraction convention.
`dcterms:format` [0..1] | Identifies the kind of model file.
`prof:hasArtifact` [1] | The model file.
`inspec-uml:ontology` [0..1] | The URI of a data vocabulary resource. It identifies the vocabulary packages, whose introduced terms make up the data vocabulary, see [Scope](#dv-scope). It never points out reused terms.
`inspec-uml:ontologyDiagram` [0..1] | A diagram that limits the extraction of the data vocabulary to what it draws, see [Ontology diagram](#ontology-diagram). It is given only together with `inspec-uml:ontology`.
`inspec-uml:apDiagram` [0..1] | The diagram the application profile is extracted from.
`inspec-uml:extractionOption` [0..*] | An option for how the model is read, see [Extraction options](#extraction-options).
`prof:hasRole` [0..*] | What the model describes: `profrole:vocabulary`, `profrole:constraints` and/or `profrole:specification` (a diagram).

Each specification part has a single artifact, so that `dcterms:format` is unambiguous, and names at most one data vocabulary. A model that holds several data vocabularies is described by one specification part per vocabulary, each with the same `prof:hasArtifact`. The same model in several formats, e.g. an Enterprise Architect file and its XMI export, is described by one specification part per file. Each data vocabulary and the diagram should be named by only one specification part, so that each is extracted only once. The other parts may still indicate what the model describes via `prof:hasRole`, see [Roles](#roles).

### Roles

`inspec-uml:ontology` and `inspec-uml:apDiagram` decide what is extracted, the values of `prof:hasRole` do not. A role without its corresponding property is valid and means that the model describes this, but is not its source. For example, `profrole:constraints` without `inspec-uml:apDiagram` says that the model describes the application profile while a separately maintained SHACL specification part is authoritative. The same goes for `profrole:vocabulary` without `inspec-uml:ontology`.

### Names

Diagrams, and the packages named by a `package` tag, are identified by name or by GUID. A name must be unique within the model file, otherwise the GUID must be used. The name of an ontology diagram needs only to be unique among the diagrams of the vocabulary packages. Data vocabularies are identified by URI, see `inspec-uml:ontology`.

### <span id="extraction-options"></span>Extraction options

An `inspec-uml:extractionOption` names an option for how the model is read. Its values are the concepts of the concept scheme `inspec-uml:ExtractionOptions`:

* `inspec-uml:osloUris` - a class or attribute with neither a `uri` nor a `name` tag is named from its UML name, as the OSLO toolchain does: a class in upper camel case (e.g. "legal entity" gives `LegalEntity`), an attribute in lower camel case (e.g. "Legal Name" gives `legalName`), with a leading `^` dropped and whitespace removed. The name is then treated as a `name` tag, see [Identifying terms](#identifying-terms). It applies to both the data vocabulary and the application profile. An association still needs a `uri` or `name` tag, on the association or on its ends.
* `inspec-uml:implicitOrder` - in the application profile, an attribute's property shape without an `ap-order` tag is ordered by the attribute's position in its class. It has no effect on a specification part without `inspec-uml:apDiagram`.

The specification parts with the same `prof:hasArtifact` must agree on `inspec-uml:osloUris`, so that the data vocabulary and the application profile use the same term URIs. An extractor should warn about a value it does not recognise and ignore it, so that other options may be defined as concepts outside this scheme.

### Several models

An interoperable specification may have several UML specification parts, for example one per data vocabulary, or one per model file when the data vocabularies are kept in separate files. The diagram names and data vocabulary URIs of each specification part are resolved in its own model file.

### Extraction results

Extraction is a preparatory step. The extracted data vocabularies and application profile are interoperable specification parts like any other, and are described and validated according to the rules for their kind.

`dcterms:subject` has no role in the extraction from a UML model. The specification part of an extracted data vocabulary still points to its data vocabulary resource via `dcterms:subject`, see Rule DV-6 in the [rules](../rules.md#dv6).

### Example

A profile interoperable specification whose data vocabulary and application profile are both extracted from a single XMI export:

```turtle
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix prof: <http://www.w3.org/ns/dx/prof/> .
@prefix profrole: <http://www.w3.org/ns/dx/prof/role/> .
@prefix inspec: <https://w3id.org/inspec/datavoc/> .
@prefix inspec-uml: <https://w3id.org/inspec/datavoc/extractors/uml/> .
@prefix ex: <https://example.org/> .

ex:spec a prof:Profile ;
  dcterms:conformsTo inspec:PROF ;
  prof:hasResource ex:spec-uml .

ex:spec-uml a prof:ResourceDescriptor ;
  dcterms:conformsTo inspec-uml:UML ;
  dcterms:format "application/vnd.xmi+xml" ;
  prof:hasArtifact <https://example.org/spec/model.xmi> ;
  prof:hasRole profrole:vocabulary, profrole:constraints ;
  inspec-uml:ontology <https://example.org/ns/book/> ;
  inspec-uml:apDiagram "Book profile" .
```

## <span id="tag-convention"></span>Tagging quick reference

The model indicated via `prof:hasArtifact` must follow the rules of this convention. Information is provided as tags on the elements of the model.

The following tags are interpreted, all other tags are ignored:

* `uri`, `name` and `package` - identify a term, see [Identifying terms](#identifying-terms).
* `baseURI`, `ontologyURI` and `language` - on a package, see [Scope](#dv-scope) and [Texts](#dv-texts).
* `parentURI`, `domain` and `range` - see [Domain and range](#domain-and-range) and [Inheritance](#inheritance).
* `label-xx`, `definition-xx` and `usageNote-xx` - texts in the language `xx`, see [Texts](#dv-texts).
* `ap-label-xx`, `ap-definition-xx` and `ap-usageNote-xx` - texts for the application profile, see [Texts](#ap-texts).
* `ap-weight`, `ap-nodeKind`, `ap-preferred`, `ap-order`, `ap-pattern`, `ap-codelist`, `ap-refines` and `ap-variant` - see [Application profile tags](#application-profile-tags).
* `ignore` - see [Ignored elements](#ignored-elements).

In general a tag `X` applies to both the data vocabulary and the application profile, and `ap-X` overrides it in the application profile only. In practice this applies to the text tags only: `domain`, `range` and `parentURI` apply to the data vocabulary only, and the other `ap-` tags to the application profile only.

The values of `domain`, `range` and `parentURI` are absolute IRIs.

### Tags by element

The tables below list, per kind of element, the tags that are interpreted, and whether they affect the data vocabulary (DV) or the application profile (AP). `xx` stands for a language code, e.g. `label-en`.

#### Package

Tag | Value | DV | AP | See
--- | --- | :-: | :-: | ---
`baseURI` | IRI | ✓ | ✓ | [Identifying terms](#identifying-terms), [Scope](#dv-scope)
`ontologyURI` | IRI | ✓ | | [Scope](#dv-scope)
`language` | language code | ✓ | ✓ | [Texts](#dv-texts)
`label-xx`, `definition-xx`, `usageNote-xx` | text | ✓ | | [The data vocabulary resource](#the-data-vocabulary-resource)

#### Class

Tag | Value | DV | AP | See
--- | --- | :-: | :-: | ---
`uri` | IRI | ✓ | ✓ | [Identifying terms](#identifying-terms)
`name` | local name | ✓ | ✓ | [Identifying terms](#identifying-terms)
`package` | package name or GUID | ✓ | ✓ | [Identifying terms](#identifying-terms)
`parentURI` | IRI | ✓ | | [Inheritance](#inheritance)
`label-xx`, `definition-xx`, `usageNote-xx` | text | ✓ | ✓ | [Texts](#dv-texts)
`ap-label-xx`, `ap-definition-xx`, `ap-usageNote-xx` | text | | ✓ | [Texts](#ap-texts)
`ap-weight` | `main` or `supportive` | | ✓ | [Node shapes](#node-shapes)
`ap-refines`, `ap-variant` | shape IRI | | ✓ | [Application profile tags](#application-profile-tags)
`ignore` | `true` | ✓ | ✓ | [Ignored elements](#ignored-elements)

The stereotypes `«main»` and `«supportive»` can be used instead of `ap-weight`.

#### Attribute

Tag | Value | DV | AP | See
--- | --- | :-: | :-: | ---
`uri` | IRI | ✓ | ✓ | [Identifying terms](#identifying-terms)
`name` | local name | ✓ | ✓ | [Identifying terms](#identifying-terms)
`package` | package name or GUID | ✓ | ✓ | [Identifying terms](#identifying-terms)
`parentURI` | IRI | ✓ | | [Inheritance](#inheritance)
`domain`, `range` | IRI | ✓ | | [Domain and range](#domain-and-range)
`label-xx`, `definition-xx`, `usageNote-xx` | text | ✓ | ✓ | [Texts](#dv-texts)
`ap-label-xx`, `ap-definition-xx`, `ap-usageNote-xx` | text | | ✓ | [Texts](#ap-texts)
`ap-nodeKind` | node kind | | ✓ | [Application profile tags](#application-profile-tags)
`ap-preferred` | `true` | | ✓ | [Application profile tags](#application-profile-tags)
`ap-order` | integer | | ✓ | [Application profile tags](#application-profile-tags)
`ap-pattern` | regular expression | | ✓ | [Application profile tags](#application-profile-tags)
`ap-codelist` | concept scheme IRI | | ✓ | [Application profile tags](#application-profile-tags)
`ap-refines`, `ap-variant` | shape IRI | | ✓ | [Application profile tags](#application-profile-tags)
`ignore` | `true` | ✓ | ✓ | [Ignored elements](#ignored-elements)

The constraints `{subsets x}` and `{redefines x}` are also read, see [Inheritance](#inheritance).

#### Association and association end

An association end takes the same tags as an attribute. The tags that identify the term (`uri`, `name`, `package`), and `parentURI`, `domain` and `range`, are given either on the ends or on the association, not both, see [Associations](#associations). When they are given on the association, its text tags and `ap-` tags apply to both ends, unless an end gives the tag itself. The association as a whole can be ignored as well:

Tag | Value | DV | AP | See
--- | --- | :-: | :-: | ---
`ignore` | `true` | ✓ | ✓ | [Ignored elements](#ignored-elements)

#### Other elements

Element | Tag | Value | DV | AP | See
--- | --- | --- | :-: | :-: | ---
Enumeration | `uri`, `name` | IRI, local name | ✓ | | [Enumerations](#enumerations)
Enumeration value | `uri` | IRI | | ✓ | [Enumerations](#enumerations)
Enumeration value | `ignore` | `true` | | ✓ | [Enumerations](#enumerations)
Data type or primitive type | `uri` | IRI | ✓ | ✓ | [Domain and range](#domain-and-range)
Generalization | `ignore` | `true` | ✓ | | [Inheritance](#inheritance)

## <span id="identifying-terms"></span>Identifying terms

URIs are not minted from UML element names, except with the `osloUris` extraction option, see [Extraction options](#extraction-options). A term is identified by:

* a `uri` tag,
* a `package` and a `name` tag, the name being resolved against the `baseURI` of the given package, or
* a `name` tag, resolved in the package that owns the class or attribute or, for an association or association end, in the package the association is located in.

A `uri` tag takes precedence: a `package` tag given with it is not used. A `uri` tag given with a `name` tag must end in `/` or `#` followed by the name.

A class or attribute is located in its owning package, or, when another package owns it and it is drawn on a diagram of the vocabulary packages, in one of the vocabulary packages, see [Scope](#dv-scope). An association has no owner and is located through the diagrams it is drawn on. It is an error:

* if a class, attribute or association in the scope of the extraction has none of the tags above, for an association neither on the association nor on its ends,
* if a `name` tag has characters other than unaccented Latin letters, digits or the characters `-._~` (the unreserved characters of RFC 3986),
* if a `package` tag is given without a `name` or `uri` tag, or
* if a `package` tag, given without a `uri` tag, names a package that is not in the model file.

## Extracting the data vocabulary

### <span id="dv-scope"></span>Scope

The ontology URI of a package is its `ontologyURI` tag, or else its `baseURI` tag. An `inspec-uml:ontology` `U` identifies the packages whose `ontologyURI` tag is `U`, and the packages without an `ontologyURI` tag whose `baseURI` is `U`, `U/` or `U#`, as an ontology conventionally mints its terms under such a namespace. These are the **vocabulary packages**. Together they make up one data vocabulary, and their `baseURI`s are allowed to differ. It is an error if `U` identifies no package.

Without an ontology diagram, the extraction looks only at the occurrences located in the vocabulary packages:

* the classes owned by the vocabulary packages, regardless of which diagrams they are drawn on, including classes drawn on no diagram,
* the classes owned by other packages and drawn on diagrams owned by the vocabulary packages. Such a class is located in the first vocabulary package with a diagram it is drawn on, in the order of the model file, while its terms are still resolved in its owning package,
* the attributes of those classes, and
* the associations drawn on diagrams owned by the vocabulary packages. An association drawn on diagrams of several vocabulary packages is located in the first of them, in the order of the model file.

Only classes, abstract ones included, give class terms. Data types and enumerations are only used as types, and other elements are skipped. Ignored elements are left out.

#### <span id="ontology-diagram"></span>Ontology diagram

An `inspec-uml:ontologyDiagram` limits the extraction to the occurrences drawn on the diagram, instead of those located in the vocabulary packages:

* the classes drawn on the diagram, wherever they are owned, and the attributes of those classes, and
* the associations drawn on the diagram.

One of the vocabulary packages must own the diagram, otherwise it is an error. A class owned by a vocabulary package is located in it. Any other class, and every association, is located in the package that owns the diagram. The terms given by a class and its attributes are still resolved in the class's owning package, and those given by an association in the package that owns the diagram. Which terms are introduced is decided as without an ontology diagram.

### Introduced terms and consistency

A term is introduced when an occurrence of it resolves into one of the vocabulary packages, i.e. has:

* a `name` tag alone, resolved in one of the vocabulary packages,
* a `package` tag naming one of the vocabulary packages, together with a `name` tag, or
* a `uri` tag that is the `baseURI` of one of the vocabulary packages followed by a name that would be valid as a `name` tag, i.e. not by a sub-namespace.

Other terms are reused from other data vocabularies and are not part of the extracted data vocabulary. An introduced term may refer to them, e.g. as its superclass or range, but statements about a reused term never point to the data vocabulary resource via `rdfs:isDefinedBy`, see Rule DV-5 in the [rules](../rules.md#dv5).

The introduced terms are the classes and properties the interoperable specification may indicate via `inspec:introduces`, see Rules [ENRICH-2](../rules.md#enrich2) and [ENRICH-3](../rules.md#enrich3).

An introduced term must be identical in all its defining occurrences: its texts and its superclasses or superproperties must be the same in each, otherwise it is an error. A property whose defining occurrences differ in domain or range, after `domain` and `range` tags, gets no domain or range respectively; an extractor should warn about it and recommend a `domain` or `range` tag. A redefining attribute is not a defining occurrence, see [Inheritance](#inheritance).

### The data vocabulary resource

The data vocabulary resource (see Rule DV-2 in the [rules](../rules.md#dv2)) is the URI given by `inspec-uml:ontology`, typed as `owl:Ontology`. The text tags of the vocabulary packages describe it: the label gives `dcterms:title`, the definition `dcterms:description` and the usage note `skos:scopeNote`. When there are several vocabulary packages, each kind of text is taken from those that have the corresponding tag, which must give the same text, otherwise it is an error. When none of them has it, it is taken from the first vocabulary package, in the order of the model file. An extractor should warn when the text of another vocabulary package is left out.

With an ontology diagram, the data vocabulary resource is described by the texts of the package that owns the diagram. A kind of text that package has none of is taken as without an ontology diagram.

### Classes and properties

#### Domain and range

The domain of a property is the class that owns the attribute or, for an association end, the class at the opposite end. The range is the type of the attribute or association end. Types are resolved as follows:

* a class gives that class,
* a data type or a primitive type with a `uri` tag gives that URI,
* a primitive type name (`String`, `Date`, `DateTime`, `Boolean`, `LangString` etc., matched case-insensitively) gives its XSD datatype or `rdf:langString`,
* `uri` gives an IRI value, see [Attributes typed uri](#attributes-typed-uri),
* an unknown type name, or an untagged data type with an unknown name, gives no range and a warning.

The `domain` and `range` tags replace the domain and range in the data vocabulary only, typically to make them less narrow. The value `rdfs:Resource` means that no domain or range is given.

#### <span id="attributes-typed-uri"></span>Attributes typed uri

An attribute typed `uri` holds an IRI. Its property gets no `rdfs:range` unless a `range` tag gives one. An attribute typed `anyURI` holds a literal of the datatype `xsd:anyURI`.

#### Associations

When the model leaves navigability unspecified, a role name makes its end navigable. When navigability or a direction is given, each navigable end becomes a property of the class at the opposite end. Introduced association properties need a `uri` or `name` tag. Role names and association names are only used as texts. An association with no navigable end gives no property, and a `uri` or `name` tag on an end that is not navigable is not used; both give a warning.

A property may be tagged on the association instead of on its ends, giving one property for every direction. A `name` tag on an association with no role names and no direction gives one property from source to target. A property tagged on an association that is navigable in both directions between different classes gets no domain or range, with a warning, unless `domain` and `range` tags give them, see [Introduced terms and consistency](#introduced-terms-and-consistency). It is an error to give a `name` or `uri` tag both on the association and on one of its ends.

An association is skipped with a warning when the element at one of its ends is missing from the model or is not a class. The class of an association class is skipped with a warning, together with its attributes and the associations attached to it. The association of the association class is still extracted as an ordinary association.

### Inheritance

A generalization becomes `rdfs:subClassOf` only, unless it is ignored. A generalization is skipped with a warning when the element at one of its ends is missing from the model or is not a class.

An attribute marked `{subsets x}` gives `rdfs:subPropertyOf` from its property to the property of `x` when its property is introduced. `x` must be in the model, otherwise it is an error. A property gets `rdfs:subPropertyOf` for its `parentURI` tag and for each property it subsets; a class gets `rdfs:subClassOf` for each generalization and for its `parentURI` tag.

An attribute marked `{redefines x}` must resolve to the same URI as `x`, and `x` must be in the model, otherwise it is an error. This applies to each attribute it redefines. The redefining attribute is not a defining occurrence of the property: it is exempt from the rule that all defining occurrences give the same statements (see [Introduced terms and consistency](#introduced-terms-and-consistency)), and it contributes nothing to the data vocabulary. If the property has no other defining occurrence, `x` gives its domain, range and texts.

Subsetting and redefinition are only read between attributes, not between association ends.

### Enumerations

The values of an enumeration are URIs when every enumeration value has a `uri` tag, and plain literals when none of them has one. It is an error if only some of them have a `uri` tag. The `uri` tag of an enumeration value must be an absolute IRI. Ignored enumeration values do not count.

The range of an enumeration-typed property is the enumeration's own `uri` or `name` tag if it has one. Otherwise it is `xsd:string` when the values are plain literals, and absent when they are URIs.

### <span id="dv-texts"></span>Texts

Each kind of text, i.e. label, definition and usage note, is taken as a whole from the first source that has it, in every language that source gives. Sources are not mixed language by language.

Statement | Taken from, in order
--- | ---
`rdfs:label` | `label-xx`, else the UML name (for an association, the association's name)
`rdfs:comment` | `definition-xx`, else the notes
`skos:scopeNote` | `usageNote-xx`

Untagged texts (UML names and notes) and text tags without a language suffix are in the language given by the `language` tag of the package they are located in. An extractor may let the caller supply a default language when there is none. A text tag without a language suffix gives way, with a warning, to a suffixed tag for the same language.

When a property is tagged on an association, the texts of each end are taken from the end, else from the association, else from the role name of the end, and then from the name of the association.

## <span id="application-profile"></span>Extracting the application profile

### <span id="ap-scope"></span>Scope

The classes drawn on the application profile diagram become node shapes, abstract ones included. A node shape contains only the attributes of its own class and the associations of its own class drawn on the diagram. An association drawn only on other diagrams is left out. Whether a term is introduced or reused does not matter in the application profile, shapes are given for both.

A property given by an association with only a `name` tag is resolved in the package that owns the application profile diagram, on which every association of the profile is drawn.

### Node shapes

A node shape is main unless the class is marked as supportive, either by the `«supportive»` stereotype or by the tag `ap-weight` = `supportive`, see Rule AP-5 in the [rules](../rules.md#ap5). The `«main»` stereotype and `ap-weight` = `main` mark a class as main explicitly. A stereotype and an `ap-weight` tag that disagree are an error, and a stereotype other than `«main»` or `«supportive»` gives a warning.

Main node shapes get `sh:targetClass` and `sh:nodeKind sh:IRI`. Supportive node shapes get no target declaration, are reached via `sh:node` and get `sh:nodeKind sh:BlankNodeOrIRI`. Both indicate their class with a property shape with `sh:path rdf:type` and `sh:hasValue` the class. How shape URIs are minted is not part of the convention.

Shapes are not flattened along generalizations, and no `inspec:refines` or `inspec:variant` is inferred from them.

### Property shapes

The range of a property shape is given by:

* `sh:datatype` for a datatype,
* `sh:class` for a class, together with `sh:node` to the node shape of the class when that node shape is supportive in the profile. A range class not drawn on the diagram is given by `sh:class` only.

The property shape of an attribute typed `uri` gets `sh:nodeKind sh:IRI` and no `sh:datatype`, see [Attributes typed uri](#attributes-typed-uri).

A lower bound of 1 or more gives `sh:minCount`, a lower bound of 0 gives none. An upper bound other than `*` gives `sh:maxCount`.

Without an `ap-nodeKind` tag, the node kind is inferred:

* a datatype, `anyURI` included, gives `sh:Literal`,
* `uri` gives `sh:IRI`,
* `sh:in` of URIs gives `sh:IRI`, and of literals `sh:Literal`,
* `ap-codelist` gives `sh:IRI`,
* a class with a main node shape in the profile gives `sh:IRI`,
* a class with a supportive node shape, or with no node shape, gives `sh:BlankNodeOrIRI`,
* an unresolved type gives none, with a warning.

A redefining attribute, see [Inheritance](#inheritance), gets an ordinary property shape on the node shape of its class, with its own type, multiplicity and tags, which is how a subclass narrows an inherited attribute.

#### <span id="ap-enumerations"></span>Enumerations

An enumeration gives `sh:in` with its values, see [Enumerations](#enumerations), in the order of the enumeration values in the model, with `sh:nodeKind sh:IRI` when they are URIs and `sh:nodeKind sh:Literal` when they are plain literals. An enumeration without usable enumeration values gives a warning and no `sh:in`.

#### Application profile tags

* `ap-weight` - `main` or `supportive`, see [Node shapes](#node-shapes). Any other value is an error.
* `ap-nodeKind` - gives `sh:nodeKind`. Takes `BlankNode`, `IRI`, `Literal`, `BlankNodeOrIRI`, `BlankNodeOrLiteral` or `IRIOrLiteral`, matched case-insensitively.
* `ap-preferred` - the value `true` gives `sh:minCount 0` regardless of the lower bound, i.e. the property is preferred (recommended but not required).
* `ap-order` - gives `sh:order`, must be an integer. Without the `implicitOrder` extraction option, property shapes have no implicit order from their position in the model.
* `ap-pattern` - gives `sh:pattern`, must be a valid regular expression. `sh:pattern` is only given by this tag, not by constraints in the model.
* `ap-codelist` - on an attribute or association end, the concept scheme whose concepts are allowed as values. Gives `sh:nodeKind sh:IRI` and an anonymous `sh:node` with `sh:severity sh:Info` requiring `rdf:type skos:Concept` and `skos:inScheme` the concept scheme. It is an error on an attribute typed with a literal datatype, so leave the type empty or use `uri`.
* `ap-refines` - a shape URI, gives `inspec:refines`, see Rules [AP-7](../rules.md#ap7) and [AP-9](../rules.md#ap9).
* `ap-variant` - a shape URI, gives `inspec:variant`, see Rules [AP-8](../rules.md#ap8) and [AP-10](../rules.md#ap10).

`ap-refines` and `ap-variant` are allowed on classes (node shapes) as well as on attributes and association ends (property shapes).

When a property is tagged on an association, the association's `ap-` tags apply to the property shapes of both ends, unless an end gives the tag itself.

### <span id="ap-texts"></span>Texts

Texts are taken as in the data vocabulary, see [Texts](#dv-texts), from the following sources:

Statement | Taken from, in order
--- | ---
`rdfs:label` (node shape) | `ap-label-xx`, else `label-xx`, else the UML name
`rdfs:comment` (node shape) | `ap-definition-xx`, else `definition-xx`, else the notes
`sh:name` (property shape) | `ap-label-xx`, else `label-xx`, else the UML name (for an association end, its role name)
`sh:description` (property shape) | `ap-definition-xx`, else `definition-xx`, else the notes
`skos:scopeNote` | `ap-usageNote-xx`, else `usageNote-xx`

It is an error if a property shape gets no `sh:name`, e.g. for an association end with neither a role name nor a label tag, see Rule AP-6 in the [rules](../rules.md#ap6).

## Ignored elements

An element is ignored when its `ignore` tag has the value `true`, matched case-insensitively. An ignored element gets no definition and no shape, but its term remains valid for references. The attributes of an ignored class are ignored too. A reference to an ignored class that has no `uri` or `name` tag is an error at the referring attribute or association end. An ignored association end gives no property and no property shape, while the other end is still read. An ignored generalization gives no `rdfs:subClassOf`.

## Extractor conformance

An extractor reports every error and warning it finds. On an error, no extraction result is valid, and the extractor produces no result for the specification part. On a warning, the extraction proceeds. The errors and warnings are listed below.

An extractor may include statements about reused terms, for example when a reused term is owned by a package with its own ontology URI, as long as they do not point to the extracted data vocabulary resource via `rdfs:isDefinedBy`, see Rule DV-5 in the [rules](../rules.md#dv5).

### Errors

The following are errors. Each links to the section that states the rule.

* Specification part and scope:
  * a diagram or package name that is not unique in the model file, see [Names](#names),
  * an `inspec-uml:ontology` that identifies no package, see [Scope](#dv-scope),
  * an ontology diagram that no vocabulary package owns, see [Ontology diagram](#ontology-diagram).
* Identifying terms, see [Identifying terms](#identifying-terms):
  * a class, attribute or association in the scope of the extraction without a `uri` or `name` tag,
  * a `name` tag with characters that are not allowed,
  * a `uri` tag that does not end in `/` or `#` followed by its `name` tag,
  * a `package` tag without a `name` or `uri` tag, or naming a package that is not in the model file.
* Data vocabulary:
  * defining occurrences of a term that differ in texts, superclasses or superproperties, see [Introduced terms and consistency](#introduced-terms-and-consistency),
  * vocabulary packages that give different texts for the data vocabulary resource, see [The data vocabulary resource](#the-data-vocabulary-resource),
  * a `uri` or `name` tag both on an association and on one of its ends, see [Associations](#associations),
  * `{subsets x}` or `{redefines x}` where `x` is not in the model, and `{redefines x}` that resolves to another IRI than `x`, see [Inheritance](#inheritance),
  * an enumeration whose values have a `uri` tag only in part, see [Enumerations](#enumerations),
  * a reference to an ignored class without a `uri` or `name` tag, see [Ignored elements](#ignored-elements).
* Application profile:
  * a stereotype and an `ap-weight` tag that disagree, see [Node shapes](#node-shapes),
  * an `ap-weight`, `ap-nodeKind`, `ap-order` or `ap-pattern` tag with a value that is not allowed, and an `ap-codelist` tag on an attribute typed with a literal datatype, see [Application profile tags](#application-profile-tags),
  * a property shape without `sh:name`, see [Texts](#ap-texts).

### Warnings

The following give warnings. Each links to the section that states the rule.

* an extraction option that the extractor does not recognise, see [Extraction options](#extraction-options),
* defining occurrences of a property that differ in domain or range, see [Introduced terms and consistency](#introduced-terms-and-consistency),
* the text of a vocabulary package that is left out, see [The data vocabulary resource](#the-data-vocabulary-resource),
* a type that cannot be resolved, see [Domain and range](#domain-and-range),
* an association with no navigable end, a `uri` or `name` tag on an end that is not navigable, an association class, and an association whose end is missing or not a class, see [Associations](#associations),
* a generalization whose end is missing or not a class, see [Inheritance](#inheritance),
* a text tag without a language suffix next to a suffixed one, see [Texts](#dv-texts),
* a stereotype other than `«main»` or `«supportive»`, see [Node shapes](#node-shapes),
* an enumeration without usable enumeration values, see [Enumerations](#ap-enumerations).

An extractor may report further warnings.

### Implementation notes

This section is informative.

* To make it easier for the modeller, an extractor can accept a GUID with or without enclosing braces and regardless of case, so that GUIDs can be copied as Enterprise Architect shows them, see [Appendix C](#appendix-c-notes-for-enterprise-architect).

## Appendix A: Worked example

*This section is not yet written.*

## Appendix B: Relation to OSLO

The convention starts from the tag names used by the [OSLO](https://github.com/Informatievlaanderen/OSLO-UML-Transformer) toolchain of the Flemish government, but it is **not** OSLO's convention, and an OSLO model will not necessarily convert. At the time of writing the main differences are:

* Only the tags listed above are interpreted, other OSLO tags are ignored.
* The `domain` tag is taken from OSLO's earlier toolchain (OSLO-EA-to-RDF), it is not supported by the current one.
* The `language` tag and the application profile tags `ap-weight`, `ap-nodeKind`, `ap-preferred`, `ap-order`, `ap-pattern`, `ap-refines` and `ap-variant` are added by INSPEC. In OSLO the language is a setting of the converter.
* OSLO extracts a vocabulary from one target diagram. Here a data vocabulary is scoped by its packages, or by an ontology diagram given via `inspec-uml:ontologyDiagram`. An application profile, as in OSLO, takes only the associations its diagram draws.
* OSLO falls back on the UML element name when there is no `name` tag. Here, URIs are only minted from element names with the `osloUris` extraction option, and only for classes and attributes.
* OSLO's `Domain.prop` naming of properties and its `-rev-` tags for association classes are not supported.
* A generalization becomes `rdfs:subClassOf` only.
* In OSLO the `range` tag sets the range in both the vocabulary and the application profile. Here it replaces the `rdfs:range` only, the range in the application profile always follows the model.
* `ap-codelist` is read on the attribute or association end only, whereas OSLO also reads it on the range class. The constraint it gives, see [Application profile tags](#application-profile-tags), differs from the one OSLO generates.

See the [supported tags of the OSLO-UML-Transformer](https://github.com/Informatievlaanderen/OSLO-UML-Transformer/blob/main/packages/oslo-converter-uml-ea/lib/enums/README.md) and the [OSLO-EA-to-RDF documentation](https://github.com/Informatievlaanderen/OSLO-EA-to-RDF) for OSLO's own convention.

## Appendix C: Notes for Enterprise Architect

This appendix is informative. It relates the terms of this convention to how they appear in Enterprise Architect.

* **Tags** are Enterprise Architect's tagged values. Tags on an association end are the tagged values of the connector's source or target role.
* **Associations** are connectors of the type Association. The ends of an association are the connector's source and target.
* **Ownership** is what the Project Browser shows: a package owns the elements listed under it, regardless of which diagrams they are drawn on.
* **Navigability** is unspecified by default, so a role name is what makes an end navigable, see [Associations](#associations).
* **Drawn on** - a connector hidden on a diagram is not drawn on it, even though it is still in the diagram.
* **Notes** are the Notes field of an element, which may contain formatting markup.
* **GUIDs** are shown by Enterprise Architect in braces and upper case, e.g. `{4F1B…}`, see [Implementation notes](#implementation-notes).
* **Names** of diagrams and packages need not be unique in Enterprise Architect. Use the GUID where they are not, see [Names](#names).

## Appendix D: Open questions

* Nested packages - whether an `inspec-uml:ontology` includes the terms of packages nested in the package it identifies.
* Association terms drawn in several packages - how the data vocabularies should handle an association term whose association is drawn by the diagrams of packages with different ontology URIs.
* Association classes - whether and how to support association classes.
