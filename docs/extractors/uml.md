# INSPEC UML extraction convention

Interoperable specifications are often authored as UML models, typically as Enterprise Architect files or XMI exports from them. The data vocabularies and the application profile of the specification are then extracted from the model. This page specifies how to describe such a model as a specification part, and the tag convention the model must follow for interoperable specification parts to be extracted from it. `inspec-uml:UML` is an extraction convention in the sense of [Rule EXTRACT-1](../rules.md#extract1).

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
* **Diagram** - a UML diagram in the model. An element is **drawn on** a diagram when the diagram shows it. An association is drawn on a diagram only when it is visible there, not when it is marked as hidden on it.
* **Ontology diagram** - the diagram given by `inspec-uml:ontologyDiagram`.
* **Application profile diagram** - the diagram given by `inspec-uml:apDiagram`.

### Data vocabulary scope

* **Ontology URI** - of a package: its `ontologyURI` tag, or else its `baseURI` tag.
* **Vocabulary packages** - the packages identified by `inspec-uml:ontology`, see [Scope](#dv-scope). Together they make up one data vocabulary.
* **Located in** - the package an element is considered to belong to for the extraction. It is usually the owning package, but can differ for classes drawn on other packages' diagrams and for associations, which have no owner, see [Scope](#dv-scope).

### Terms

* **Term** - a class or property of a data vocabulary, identified by a URI. Classes give class terms. Attributes, association ends and associations give property terms. *Term* never refers to the UML element itself.
* **Property** - always an RDF property. On the UML side, the words used are *attribute* and *association end*.
* **Resolve** - to determine the URI of a term from the tags of an element, see [Identifying terms](#identifying-terms). A `name` tag is resolved *in* a package, i.e. against that package's `baseURI`.
* **Occurrence** - an element that gives a term. The same term can have several occurrences, e.g. a property given by attributes of several classes.
* **Introduced term** - a term whose URI resolves into one of the vocabulary packages. Only introduced terms make up the extracted data vocabulary. Other terms are **reused** from other data vocabularies.
* **Defining occurrence** - an occurrence of an introduced term within the scope of the extraction, other than a redefining attribute, see [Inheritance](#inheritance). All defining occurrences of a term must give the same texts and the same superclasses or superproperties, see [Introduced terms and consistency](#introduced-terms-and-consistency).

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
`inspec-uml:ontology` [0..1] | The URI of a data vocabulary resource. It identifies the vocabulary packages, whose introduced terms make up the data vocabulary, see [Scope](#dv-scope). Reused terms are not part of the data vocabulary, even when they occur in the vocabulary packages, see [Introduced terms and consistency](#introduced-terms-and-consistency).
`inspec-uml:ontologyDiagram` [0..1] | A diagram that limits the extraction of the data vocabulary to what it draws, see [Ontology diagram](#ontology-diagram). It is given only together with `inspec-uml:ontology`.
`inspec-uml:apDiagram` [0..1] | The diagram the application profile is extracted from.
`inspec-uml:extractionOption` [0..*] | An option for how the model is read, see [Extraction options](#extraction-options).
`prof:hasRole` [0..*] | What the model describes: `profrole:vocabulary`, `profrole:constraints` and/or `profrole:specification` (a diagram).

Each specification part has a single artifact, so that `dcterms:format` is unambiguous, and at most one `inspec-uml:ontology`. A model that holds several data vocabularies is described by one specification part per vocabulary, each with the same `prof:hasArtifact`. The same model in several formats, e.g. an Enterprise Architect file and its XMI export, is described by one specification part per file. Each data vocabulary, and the application profile diagram, should be given by only one specification part, via `inspec-uml:ontology` and `inspec-uml:apDiagram`, so that each is extracted only once. The other parts may still indicate what the model describes via `prof:hasRole`, see [Roles](#roles).

### Roles

`inspec-uml:ontology` and `inspec-uml:apDiagram` decide what is extracted, the values of `prof:hasRole` do not. A role can be given without the property that extracts what it describes. It then says that the model describes that part of the specification, but is not the source it is extracted from. For example, `profrole:constraints` without `inspec-uml:apDiagram` says that the model describes the application profile while a separately maintained SHACL specification part is authoritative.

### Names

Diagrams, and the packages named by a `package` tag, are identified by name or by GUID. A name must be unique within the model file, otherwise the GUID must be used. The name of an ontology diagram needs only to be unique among the diagrams of the vocabulary packages. Data vocabularies are identified by URI, see `inspec-uml:ontology`.

### <span id="extraction-options"></span>Extraction options

An `inspec-uml:extractionOption` names an option for how the model is read. Its values are the concepts of the concept scheme `inspec-uml:ExtractionOptions`:

* `inspec-uml:osloUris` - a class or attribute with neither a `uri` nor a `name` tag is named from its UML name, as the OSLO toolchain does: a class in upper camel case (e.g. "legal entity" gives `LegalEntity`), an attribute in lower camel case (e.g. "Legal Name" gives `legalName`), with whitespace removed and, as in OSLO, a leading `^` dropped. The name is then treated as a `name` tag, see [Identifying terms](#identifying-terms). It applies to both the data vocabulary and the application profile. An association still needs a `uri` or `name` tag, on the association or on its ends.
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
  inspec-uml:apDiagram "Book model" .
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

The text tags apply to both the data vocabulary and the application profile, and the corresponding `ap-` text tags override them in the application profile only. `domain`, `range` and `parentURI` apply to the data vocabulary only, and the other `ap-` tags to the application profile only. The tables below show, per element, which tags affect which.

The values of `domain`, `range` and `parentURI` are absolute URIs.

### Tags by element

The tables below list, per kind of element, the tags that are interpreted, and whether they affect the data vocabulary (DV) or the application profile (AP). `xx` stands for a language code, e.g. `label-en`.

#### Package

Tag | Value | DV | AP | See
--- | --- | :-: | :-: | ---
`baseURI` | URI | ✓ | ✓ | [Identifying terms](#identifying-terms), [Scope](#dv-scope)
`ontologyURI` | URI | ✓ | | [Scope](#dv-scope)
`language` | language code | ✓ | ✓ | [Texts](#dv-texts)
`label-xx`, `definition-xx`, `usageNote-xx` | text | ✓ | | [The data vocabulary resource](#the-data-vocabulary-resource)

#### Class

Tag | Value | DV | AP | See
--- | --- | :-: | :-: | ---
`uri` | URI | ✓ | ✓ | [Identifying terms](#identifying-terms)
`name` | local name | ✓ | ✓ | [Identifying terms](#identifying-terms)
`package` | package name or GUID | ✓ | ✓ | [Identifying terms](#identifying-terms)
`parentURI` | URI | ✓ | | [Inheritance](#inheritance)
`label-xx`, `definition-xx`, `usageNote-xx` | text | ✓ | ✓ | [Texts](#dv-texts)
`ap-label-xx`, `ap-definition-xx`, `ap-usageNote-xx` | text | | ✓ | [Texts](#ap-texts)
`ap-weight` | `main` or `supportive` | | ✓ | [Node shapes](#node-shapes)
`ap-refines`, `ap-variant` | shape URI | | ✓ | [Application profile tags](#application-profile-tags)
`ignore` | `true` | ✓ | ✓ | [Ignored elements](#ignored-elements)

The stereotypes `«main»` and `«supportive»` can be used instead of `ap-weight`.

#### Attribute

Tag | Value | DV | AP | See
--- | --- | :-: | :-: | ---
`uri` | URI | ✓ | ✓ | [Identifying terms](#identifying-terms)
`name` | local name | ✓ | ✓ | [Identifying terms](#identifying-terms)
`package` | package name or GUID | ✓ | ✓ | [Identifying terms](#identifying-terms)
`parentURI` | URI | ✓ | | [Inheritance](#inheritance)
`domain`, `range` | URI | ✓ | | [Domain and range](#domain-and-range)
`label-xx`, `definition-xx`, `usageNote-xx` | text | ✓ | ✓ | [Texts](#dv-texts)
`ap-label-xx`, `ap-definition-xx`, `ap-usageNote-xx` | text | | ✓ | [Texts](#ap-texts)
`ap-nodeKind` | node kind | | ✓ | [Application profile tags](#application-profile-tags)
`ap-preferred` | `true` | | ✓ | [Application profile tags](#application-profile-tags)
`ap-order` | integer | | ✓ | [Application profile tags](#application-profile-tags)
`ap-pattern` | regular expression | | ✓ | [Application profile tags](#application-profile-tags)
`ap-codelist` | concept scheme URI | | ✓ | [Application profile tags](#application-profile-tags)
`ap-refines`, `ap-variant` | shape URI | | ✓ | [Application profile tags](#application-profile-tags)
`ignore` | `true` | ✓ | ✓ | [Ignored elements](#ignored-elements)

The constraints `{subsets x}` and `{redefines x}` are also read, see [Inheritance](#inheritance).

#### Association and association end

An association end takes the same tags as an attribute. The tags that identify the term (`uri`, `name`, `package`), and `parentURI`, `domain` and `range`, are given either on the ends or on the association, not both, see [Associations](#associations). When they are given on the association, its text tags and `ap-` tags apply to the property shapes of both ends, unless an end gives the tag itself. In the data vocabulary only the association's text tags are used, see [Texts](#dv-texts). The association as a whole can be ignored as well:

Tag | Value | DV | AP | See
--- | --- | :-: | :-: | ---
`ignore` | `true` | ✓ | ✓ | [Ignored elements](#ignored-elements)

#### Other elements

Element | Tag | Value | DV | AP | See
--- | --- | --- | :-: | :-: | ---
Enumeration | `uri`, `name` | URI, local name | ✓ | | [Enumerations](#enumerations)
Enumeration value | `uri` | URI | | ✓ | [Enumerations](#enumerations)
Enumeration value | `ignore` | `true` | | ✓ | [Enumerations](#enumerations)
Data type or primitive type | `uri` | URI | ✓ | ✓ | [Domain and range](#domain-and-range)
Generalization | `ignore` | `true` | ✓ | | [Inheritance](#inheritance)

## <span id="identifying-terms"></span>Identifying terms

URIs are not minted from UML element names, except with the `osloUris` extraction option, see [Extraction options](#extraction-options). A term is identified by:

* a `uri` tag,
* a `package` and a `name` tag, the name being resolved against the `baseURI` of the given package, or
* a `name` tag, resolved in the package that owns the class or attribute or, for an association or association end, in the package the association is located in.

An association has no owner, so it is located through the diagrams it is drawn on, see [Scope](#dv-scope) and [Ontology diagram](#ontology-diagram).

An association, or association end, with a `name` tag but no `package` or `uri` tag, whose association is drawn on diagrams owned by packages with different `baseURI`s, gives a warning. The data vocabulary and the application profile may resolve such a name in different packages, giving the property different URIs. A `package` tag avoids this.

A `uri` tag takes precedence: a `package` tag given with it is not used. A `uri` tag given with a `name` tag must end in `/` or `#` followed by the name.

It is an error:

* if a class, attribute or association in the scope of the extraction has none of the tags above, for an association neither on the association nor on its ends,
* if a `name` tag has characters other than unaccented Latin letters, digits or the characters `-._~` (the unreserved characters of RFC 3986),
* if a `package` tag is given without a `name` or `uri` tag, or
* if a `package` tag, given without a `uri` tag, names a package that is not in the model file.

## Extracting the data vocabulary

### <span id="dv-scope"></span>Scope

The ontology URI of a package is its `ontologyURI` tag, or else its `baseURI` tag. An `inspec-uml:ontology` `U` identifies the packages whose `ontologyURI` tag is `U`, and the packages without an `ontologyURI` tag whose `baseURI` is `U`, `U/` or `U#`, as an ontology conventionally mints its terms under such a namespace. These are the **vocabulary packages**. Together they make up one data vocabulary, and their `baseURI`s are allowed to differ. It is an error if `U` identifies no package.

Without an ontology diagram, the extraction looks only at the occurrences located in the vocabulary packages:

* the classes owned by the vocabulary packages, regardless of which diagrams they are drawn on, including classes drawn on no diagram,
* the classes owned by other packages and drawn on diagrams owned by the vocabulary packages. Such a class is located in the first vocabulary package, in the order of the model file, that owns a diagram it is drawn on. Its terms are still resolved in its owning package,
* the attributes of those classes, and
* the associations drawn on diagrams owned by the vocabulary packages. An association drawn on diagrams of several vocabulary packages is located in the first of them, in the order of the model file.

Only classes, abstract ones included, give class terms. Data types and enumerations are only used as types. Other kinds of elements, e.g. interfaces, components and objects, are skipped. Ignored elements are left out.

#### <span id="ontology-diagram"></span>Ontology diagram

An `inspec-uml:ontologyDiagram` limits the extraction to the occurrences drawn on the diagram, instead of those located in the vocabulary packages:

* the classes drawn on the diagram, wherever they are owned, and the attributes of those classes, and
* the associations drawn on the diagram.

One of the vocabulary packages must own the diagram, otherwise it is an error. A class owned by a vocabulary package is located in it. Any other class, and every association, is located in the package that owns the diagram.

The terms of a class and its attributes are resolved in the class's owning package. The terms of an association are resolved in the package that owns the diagram.

The diagram only limits which occurrences are read. Whether a term is introduced still depends only on whether it resolves into one of the vocabulary packages, see [Introduced terms and consistency](#introduced-terms-and-consistency).

### Introduced terms and consistency

A term is introduced when an occurrence of it resolves into one of the vocabulary packages, i.e. has:

* a `name` tag alone, resolved in one of the vocabulary packages,
* a `package` tag naming one of the vocabulary packages, together with a `name` tag, or
* a `uri` tag that is the `baseURI` of one of the vocabulary packages followed by a valid `name`. E.g. with the `baseURI` `https://example.org/ns/book/`, the `uri` `https://example.org/ns/book/Chapter` is introduced, but `https://example.org/ns/book/part/Chapter` is not, as `part/Chapter` is not a valid name.

Other terms are reused from other data vocabularies and are not part of the extracted data vocabulary. An introduced term may refer to them, e.g. as its superclass or range, but statements about a reused term never point to the data vocabulary resource via `rdfs:isDefinedBy`, see Rule DV-5 in the [rules](../rules.md#dv5).

The introduced terms are the classes and properties the interoperable specification may indicate via `inspec:introduces`, see Rules [ENRICH-2](../rules.md#enrich2) and [ENRICH-3](../rules.md#enrich3).

An introduced term must be identical in all its defining occurrences: its texts and its superclasses or superproperties must be the same in each, otherwise it is an error. The domain and range of each defining occurrence are taken after its own `domain` and `range` tags, see [Domain and range](#domain-and-range). A property whose defining occurrences still differ in domain or range gets no domain or range respectively, and an extractor should warn about it. Giving each defining occurrence the same `domain` or `range` tag, `rdfs:Resource` for none, resolves the difference. A redefining attribute is not a defining occurrence, see [Inheritance](#inheritance).

### The data vocabulary resource

The data vocabulary resource (see Rule DV-2 in the [rules](../rules.md#dv2)) is the URI given by `inspec-uml:ontology`, typed as `owl:Ontology`. The texts of the vocabulary packages, taken as in [Texts](#dv-texts), describe it: the label gives `dcterms:title`, the definition `dcterms:description` and the usage note `skos:scopeNote`. When there are several vocabulary packages, each kind of text is taken from those that give it by a tag, which must give the same text, otherwise it is an error. When none of them has a tag for it, it is taken from the first vocabulary package, in the order of the model file, i.e. its UML name as the label and its notes as the definition. An extractor should warn when another vocabulary package has a different text of that kind, which is then left out.

With an ontology diagram, the data vocabulary resource is described by the texts of the package that owns the diagram. If that package lacks a kind of text, that text is taken from the vocabulary packages as described above.

### Classes and properties

#### Domain and range

The domain of a property is the class that owns the attribute or, for an association end, the class at the opposite end. The range is the type of the attribute or association end. Types are resolved as follows:

* a class gives that class,
* a data type or a primitive type with a `uri` tag gives that URI,
* a primitive type name (`String`, `Date`, `DateTime`, `Boolean`, `LangString` etc., matched case-insensitively) gives its XSD datatype or `rdf:langString`,
* `uri` gives a URI value, see [Attributes typed uri](#attributes-typed-uri),
* an unknown type name, or an untagged data type with an unknown name, gives no range and a warning.

The `domain` and `range` tags replace the domain and range of the element they are on, in the data vocabulary only, typically to make them less narrow. The value `rdfs:Resource` means that no domain or range is given.

#### <span id="attributes-typed-uri"></span>Attributes typed uri

An attribute typed `uri` holds a URI. Its property gets no `rdfs:range` unless a `range` tag gives one. An attribute typed `anyURI` holds a literal of the datatype `xsd:anyURI`.

#### Associations

An end is navigable when the model marks it so. When the model leaves an end's navigability unspecified, the end is navigable if it has a role name or a `uri` or `name` tag, and otherwise if the direction of the association points to it. Each navigable end gives a property whose domain is the class at the opposite end and whose range is the class at the end. Introduced association properties need a `uri` or `name` tag. Role names and association names are only used as texts. An association with no navigable end gives no property, and a `uri` or `name` tag on an end that is not navigable is not used; both give a warning.

A property may be tagged on the association instead of on its ends, giving one property for every direction. A `name` tag on an association with no role names and no direction gives one property from its first end to its second, i.e. with the class at the first end as domain. A property tagged on an association that is navigable in both directions between different classes gets no domain or range, with a warning, unless `domain` and `range` tags give them, see [Introduced terms and consistency](#introduced-terms-and-consistency). It is an error to give a `name` or `uri` tag both on the association and on one of its ends. A `package`, `parentURI`, `domain` or `range` tag on the other element is not used, and gives a warning when its value differs from the one used.

An association is skipped with a warning when the element at one of its ends is missing from the model or is not a class. An association class is read as an ordinary association: its class part is skipped with a warning, together with its attributes and the associations attached to it.

### Inheritance

A generalization becomes `rdfs:subClassOf` only, unless it is ignored. A generalization is skipped with a warning when the element at one of its ends is missing from the model or is not a class.

An attribute marked `{subsets x}` gives `rdfs:subPropertyOf` from its property to the property of `x` when its property is introduced. `x` must be in the model, otherwise it is an error. A property gets `rdfs:subPropertyOf` for its `parentURI` tag and for each property it subsets; a class gets `rdfs:subClassOf` for each generalization and for its `parentURI` tag.

An attribute marked `{redefines x}` must resolve to the same URI as `x`, and `x` must be in the model, otherwise it is an error. This applies to each attribute it redefines. The redefining attribute is not a defining occurrence of the property: it is exempt from the rule that all defining occurrences give the same statements (see [Introduced terms and consistency](#introduced-terms-and-consistency)), and it contributes nothing to the data vocabulary. If the property has no other defining occurrence, `x` gives its domain, range and texts.

Subsetting and redefinition are only read between attributes, not between association ends.

### Enumerations

The values of an enumeration are URIs when every enumeration value has a `uri` tag, and plain literals when none of them has one. It is an error if only some of them have a `uri` tag. The `uri` tag of an enumeration value must be an absolute URI. Ignored enumeration values do not count.

The range of an enumeration-typed property is the enumeration's own `uri` or `name` tag if it has one. Otherwise it is `xsd:string` when the values are plain literals, and absent when they are URIs.

### <span id="dv-texts"></span>Texts

Each kind of text, i.e. label, definition and usage note, is taken as a whole from the first source that has it, in every language that source gives. Sources are not mixed language by language. For example, a class with the UML name `Book` and only the tag `label-sv` = `Bok` gets the label `"Bok"@sv` only: its UML name does not give an English label, even when the package's `language` is `en`. To keep both, give `label-en` = `Book` as well.

Statement | Taken from, in order
--- | ---
`rdfs:label` | `label-xx`, else the UML name
`rdfs:comment` | `definition-xx`, else the notes
`skos:scopeNote` | `usageNote-xx`

Untagged texts (UML names and notes) and text tags without a language suffix are in the language given by the `language` tag of the package they are located in. An extractor may let the caller supply a default language when there is none. A text tag without a language suffix gives way, with a warning, to a suffixed tag for the same language.

For a property given by an association, the text tags, the UML name and the notes are those of the element the property is tagged on:

Tagged on | Text tags | UML name | Notes
--- | --- | --- | ---
an association end | the end's | the end's role name | the end's
the association | the association's | the association's name | the association's

A property tagged on the association is the same property for both ends, so text tags and notes on its ends are not used in the data vocabulary.

## <span id="application-profile"></span>Extracting the application profile

### <span id="ap-scope"></span>Scope

The classes drawn on the application profile diagram become node shapes, abstract ones included. A node shape contains only the attributes of its own class and the associations of its own class drawn on the diagram. An association drawn only on other diagrams is left out. Whether a term is introduced or reused does not matter in the application profile, shapes are given for both.

A property given by an association with only a `name` tag is resolved in the package that owns the application profile diagram, on which every association of the profile is drawn. This may differ from where the data vocabulary resolves it, see [Identifying terms](#identifying-terms).

### Node shapes

A node shape is main unless the class is marked as supportive, either by the `«supportive»` stereotype or by the tag `ap-weight` = `supportive`, see Rule AP-5 in the [rules](../rules.md#ap5). The `«main»` stereotype and `ap-weight` = `main` mark a class as main explicitly. A stereotype and an `ap-weight` tag that disagree are an error, and a stereotype other than `«main»` or `«supportive»` gives a warning.

Main node shapes get `sh:targetClass` and `sh:nodeKind sh:IRI`. Supportive node shapes get no target declaration, are reached via `sh:node` and get `sh:nodeKind sh:BlankNodeOrIRI`. Both indicate their class with a property shape with `sh:path rdf:type` and `sh:hasValue` the class. How shape URIs are minted is not part of the convention.

Generalizations are not carried over into the application profile: the property shapes of a superclass are not repeated in the node shapes of its subclasses, and no `inspec:refines` or `inspec:variant` is inferred between their node shapes.

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
`sh:name` (property shape) | `ap-label-xx`, else `label-xx`, else the UML name
`sh:description` (property shape) | `ap-definition-xx`, else `definition-xx`, else the notes
`skos:scopeNote` | `ap-usageNote-xx`, else `usageNote-xx`

For the property shape of an association end, the text tags, the UML name and the notes are those of the end. When the property is tagged on the association, the association fills in what the end lacks:

Tagged on | Text tags | UML name | Notes
--- | --- | --- | ---
an association end | the end's | the end's role name | the end's
the association | the end's, else the association's | the end's role name, else the association's name | the end's, else the association's

"The end's, else the association's" applies to each kind of text separately, e.g. an end with only a label tag takes its definition from the association.

It is an error if a property shape gets no `sh:name`, e.g. for an association end with neither a role name nor a label tag, see Rule AP-6 in the [rules](../rules.md#ap6).

## Ignored elements

An element is ignored when its `ignore` tag has the value `true`, matched case-insensitively. An ignored element gets no definition and no shape, but other elements can still refer to its term, e.g. an attribute can still have an ignored class as its range. The attributes of an ignored class are ignored too. A reference to an ignored class that has no `uri` or `name` tag is an error at the referring attribute or association end. An ignored association end gives no property and no property shape, while the other end is still read. An ignored generalization gives no `rdfs:subClassOf`.

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
  * `{subsets x}` or `{redefines x}` where `x` is not in the model, and `{redefines x}` that resolves to another URI than `x`, see [Inheritance](#inheritance),
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
* an association with no navigable end, a `uri` or `name` tag on an end that is not navigable, an unused `package`, `parentURI`, `domain` or `range` tag with a different value, an association class, and an association whose end is missing or not a class, see [Associations](#associations),
* an association `name` tag without a `package` or `uri` tag, on an association drawn on diagrams of packages with different `baseURI`s, see [Identifying terms](#identifying-terms),
* a generalization whose end is missing or not a class, see [Inheritance](#inheritance),
* a text tag without a language suffix next to a suffixed one, see [Texts](#dv-texts),
* a stereotype other than `«main»` or `«supportive»`, see [Node shapes](#node-shapes),
* an enumeration without usable enumeration values, see [Enumerations](#ap-enumerations).

An extractor may report further warnings.

### Implementation notes

This section is informative.

* To make it easier for the modeller, an extractor can accept a GUID with or without enclosing braces and regardless of case, so that GUIDs can be copied as Enterprise Architect shows them, see [Appendix C](#appendix-c-notes-for-enterprise-architect).

## Appendix A: Worked example

*This section is informative.*

This example extracts the data vocabulary and the application profile of the [specification part example](#example) from a small model. The extraction results were produced by the reference extractor. Only the order of the statements and the shape URIs were changed, for readability.

### Example model

The model has two packages:

Package | Tags | Notes
--- | --- | ---
`Book` | `baseURI` = `https://example.org/ns/book/`, `language` = `en`, `label-en` = `Book vocabulary` | Terms for describing books and their chapters.
`FOAF` | `baseURI` = `http://xmlns.com/foaf/0.1/` |

`Book` owns the diagram *Book model*, which draws `Book`, `Chapter`, `Agent` and `Genre` and both associations. It is the only diagram. The data vocabulary does not depend on it, as it takes the classes owned by `Book` regardless of diagrams, and the specification part names it as the application profile diagram.

Element | Owner | Tags | Notes
--- | --- | --- | ---
Class `Book` | `Book` | `name` = `Book`, `label-en` = `Book`, `label-sv` = `Bok` | A written work published as a whole.
&nbsp;&nbsp;attribute `title : String [1]` | | `uri` = `http://purl.org/dc/terms/title` |
&nbsp;&nbsp;attribute `genre : Genre [0..1]` | | `name` = `genre` | The literary genre of the book.
Class `Chapter`, `«supportive»` | `Book` | `name` = `Chapter` | A numbered part of a book.
&nbsp;&nbsp;attribute `number : Integer [1]` | | `name` = `chapterNumber` | The position of the chapter in the book.
Class `Agent` | `FOAF` | `uri` = `http://xmlns.com/foaf/0.1/Agent` |
Enumeration `Genre` | `Book` | |
&nbsp;&nbsp;value `novel` | | `uri` = `https://example.org/genre/novel` |
&nbsp;&nbsp;value `poetry` | | `uri` = `https://example.org/genre/poetry` |

Association | Ends | Direction | Tags
--- | --- | --- | ---
`Book` – `Chapter` | `Book [1]`, role `chapter` on `Chapter [1..*]` | unspecified | `name` = `hasChapter` on the end `chapter`
`creator` | `Book`, `Agent [0..*]` | `Book` to `Agent` | `uri` = `http://purl.org/dc/terms/creator` on the association

### Extracted data vocabulary

The specification part gives `inspec-uml:ontology` `https://example.org/ns/book/`, so `Book` is the only vocabulary package, see [Scope](#dv-scope).

```turtle
@prefix book: <https://example.org/ns/book/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<https://example.org/ns/book/> a owl:Ontology ;
  dcterms:title "Book vocabulary"@en ;
  dcterms:description "Terms for describing books and their chapters."@en .

book:Book a rdfs:Class ;
  rdfs:isDefinedBy <https://example.org/ns/book/> ;
  rdfs:label "Book"@en, "Bok"@sv ;
  rdfs:comment "A written work published as a whole."@en .

book:Chapter a rdfs:Class ;
  rdfs:isDefinedBy <https://example.org/ns/book/> ;
  rdfs:label "Chapter"@en ;
  rdfs:comment "A numbered part of a book."@en .

book:genre a rdf:Property ;
  rdfs:isDefinedBy <https://example.org/ns/book/> ;
  rdfs:label "genre"@en ;
  rdfs:comment "The literary genre of the book."@en ;
  rdfs:domain book:Book .

book:chapterNumber a rdf:Property ;
  rdfs:isDefinedBy <https://example.org/ns/book/> ;
  rdfs:label "number"@en ;
  rdfs:comment "The position of the chapter in the book."@en ;
  rdfs:domain book:Chapter ;
  rdfs:range xsd:integer .

book:hasChapter a rdf:Property ;
  rdfs:isDefinedBy <https://example.org/ns/book/> ;
  rdfs:label "chapter"@en ;
  rdfs:domain book:Book ;
  rdfs:range book:Chapter .
```

* `dcterms:title`, `dcterms:creator` and `foaf:Agent` are reused terms, as they do not resolve into `Book`, and are left out, see [Introduced terms and consistency](#introduced-terms-and-consistency). `Agent` is owned by `FOAF`, but would be left out even if `Book` owned it.
* The texts of the data vocabulary resource are the label tag and the notes of `Book`, see [The data vocabulary resource](#the-data-vocabulary-resource).
* `Chapter` has no label tag, so its UML name is its label. `chapterNumber` takes its label from the attribute's UML name `number`, see [Texts](#dv-texts).
* `book:genre` has no range, as the values of `Genre` are URIs, see [Enumerations](#enumerations).
* The end `chapter` is navigable as it has a role name, and its role name is the label of `book:hasChapter`, see [Associations](#associations). The end at `Book` has neither a role name nor a tag, and the direction is unspecified, so it gives no property.

### Extracted application profile

The specification part gives `inspec-uml:apDiagram` `"Book model"`. The application profile resource is the interoperable specification resource `https://example.org/spec`, see Rule AP-2 in the [rules](../rules.md#ap2). The shape URIs are not given by the model.

```turtle
@prefix book: <https://example.org/ns/book/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix genre: <https://example.org/genre/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix shape: <https://example.org/spec/shapes/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<https://example.org/spec> a owl:Ontology ;
  owl:imports sh: .

shape:Book a sh:NodeShape ;
  rdfs:isDefinedBy <https://example.org/spec> ;
  rdfs:label "Book"@en, "Bok"@sv ;
  rdfs:comment "A written work published as a whole."@en ;
  sh:targetClass book:Book ;
  sh:nodeKind sh:IRI ;
  sh:property [ sh:path rdf:type ; sh:hasValue book:Book ] ,
    shape:Book-title, shape:Book-genre, shape:Book-chapter, shape:Book-creator .

shape:Book-title a sh:PropertyShape ;
  rdfs:isDefinedBy <https://example.org/spec> ;
  sh:name "title"@en ;
  sh:path dcterms:title ;
  sh:minCount 1 ;
  sh:maxCount 1 ;
  sh:nodeKind sh:Literal ;
  sh:datatype xsd:string .

shape:Book-genre a sh:PropertyShape ;
  rdfs:isDefinedBy <https://example.org/spec> ;
  sh:name "genre"@en ;
  sh:description "The literary genre of the book."@en ;
  sh:path book:genre ;
  sh:maxCount 1 ;
  sh:nodeKind sh:IRI ;
  sh:in ( genre:novel genre:poetry ) .

shape:Book-chapter a sh:PropertyShape ;
  rdfs:isDefinedBy <https://example.org/spec> ;
  sh:name "chapter"@en ;
  sh:path book:hasChapter ;
  sh:minCount 1 ;
  sh:nodeKind sh:BlankNodeOrIRI ;
  sh:class book:Chapter ;
  sh:node shape:Chapter .

shape:Book-creator a sh:PropertyShape ;
  rdfs:isDefinedBy <https://example.org/spec> ;
  sh:name "creator"@en ;
  sh:path dcterms:creator ;
  sh:nodeKind sh:IRI ;
  sh:class foaf:Agent .

shape:Chapter a sh:NodeShape ;
  rdfs:isDefinedBy <https://example.org/spec> ;
  rdfs:label "Chapter"@en ;
  rdfs:comment "A numbered part of a book."@en ;
  sh:nodeKind sh:BlankNodeOrIRI ;
  sh:property [ sh:path rdf:type ; sh:hasValue book:Chapter ] , shape:Chapter-number .

shape:Chapter-number a sh:PropertyShape ;
  rdfs:isDefinedBy <https://example.org/spec> ;
  sh:name "number"@en ;
  sh:description "The position of the chapter in the book."@en ;
  sh:path book:chapterNumber ;
  sh:minCount 1 ;
  sh:maxCount 1 ;
  sh:nodeKind sh:Literal ;
  sh:datatype xsd:integer .

shape:Agent a sh:NodeShape ;
  rdfs:isDefinedBy <https://example.org/spec> ;
  rdfs:label "Agent"@en ;
  sh:targetClass foaf:Agent ;
  sh:nodeKind sh:IRI ;
  sh:property [ sh:path rdf:type ; sh:hasValue foaf:Agent ] .
```

* Reused terms get shapes as well, e.g. `shape:Book-title` and `shape:Agent`, see [Scope](#ap-scope).
* `Chapter` is supportive, so its node shape has no target and is reached via `sh:node` from `shape:Book-chapter`, see [Node shapes](#node-shapes) and [Property shapes](#property-shapes).
* `Agent` is drawn on the diagram and is not supportive, so its node shape is main, and `shape:Book-creator` gets `sh:nodeKind sh:IRI`.
* `shape:Book-creator` takes its name from the association, as the property is tagged on the association and the end has no role name, see [Texts](#ap-texts).

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
* **Associations** are connectors of the type Association. The first and second end of an association are the connector's source and target.
* **Ownership** is what the Project Browser shows: a package owns the elements listed under it, regardless of which diagrams they are drawn on.
* **Navigability** is unspecified by default, so a role name, or a `uri` or `name` tag on the end, is what makes an end navigable, see [Associations](#associations).
* **Drawn on** - a connector hidden on a diagram is not drawn on it, even though it is still in the diagram.
* **Notes** are the Notes field of an element, which may contain formatting markup. The notes of an association end are the notes of the connector's source or target role.
* **GUIDs** are shown by Enterprise Architect in braces and upper case, e.g. `{4F1B…}`, see [Implementation notes](#implementation-notes).
* **Names** of diagrams and packages need not be unique in Enterprise Architect. Use the GUID where they are not, see [Names](#names).

## Appendix D: Open questions

* Nested packages - whether an `inspec-uml:ontology` includes the terms of packages nested in the package it identifies.
* Association terms drawn in several packages - how the data vocabularies should handle an association term whose association is drawn by the diagrams of packages with different ontology URIs.
* Association classes - whether and how to support association classes.
