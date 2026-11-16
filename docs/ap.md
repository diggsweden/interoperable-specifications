# Application Profile - SHACL-INSPEC

The purpose of an application profile is to clarify in more detail on how to reuse classes, properties and concepts in new settings.
The needs can to a large extent be covered by the SHACL Shapes Constraint Language, a language for validating RDF graphs against a set of conditions.
However, SHACL is too flexible for the use case of application profiles, hence we define the SHACL-INSPEC to capture the specific requirements / constraints that needs to be met when using SHACL for expressing application profiles. (A side note is that SHACL-INSPEC itself is formally an application profile of SHACL and could therefore be expressed with the help of itself. In time this will perhaps be done, but for now we ignore this as it most likely cause more confusion rather than help to clarify.)

## Glossary

Let's clarify the words we are using in SHACL-INSPEC:

* Entity - a distinct thing/resource/instance/individual described in a dataset
* Property - a specific characteristic of an entity
* Class - a set of entities of the same kind / character / category
* Data graph - data about an entity expressed as RDF
* Node - a reference to a entity in a data graph
* Triple - a fact/statement about an entity (via a node) in a data graph
* Property Shape - constrains the triple expression for a certain property
* Node Shape - joins a set of property shapes into a larger constraint
* Application Profile - groups a set of node and property shapes together for a certain domain/use case

## Application Profile expression

If you have not already, take a look at the [fifteen rules of SHACL-INSPEC](rules.md#rules-for-application-profiles---shacl-inspec).
These rules may be a bit hard to take in, especially since SHACL is a complex language. Hence, below we list what is to be expected based on the application profile as a whole as well as on the shapes.

First of all, for simplicity the requirement on multilinguality are not written explicitly below, i.e. labels, description / definition and usage note are all expected to be expressed with a language and potentially translated into several languages.

The following picture shows the important relations between the different parts of an application profile expression:
<img src="pics/application_profile_model2.svg" width="800">

### Application Profile resource

The following information MUST be provided for an application profile resource:

* The application profile resource must have a stable identity in the form of a URI (subject position in triples)
* The application profile resource must be typed as `prof:Profile`
* A label expressed via the property `dcterms:title`

The following information SHOULD/MAY be provided:

* A description / definition expressed via the property `dcterms:description`
* A usage note expressed via the property `skos:scopeNote`
* A reference to another application profile that expresses that it is a
  * "subprofile" of another profile via `inspec:refines`
  * "variant of" another profile via the `inspec:variant`

Note that for B being a subprofile of A:

* Data following application profile B will also follow application profile A.
* Data following application profile A will not always follow application profile B.

Note also that the concepts of Application profiles being subprofiles and variant of each other of are exclusive since for the variant relation there is a requirement that at least one of the node shapes has to be a variant.

### Interoperable specification resource

The following information derived from the Application Profile MAY be provided for a profil interoperable specification resource:

* A list of public node shapes in the application profile, indicated via the property `dcterms:hasPart`
* A list of public property shapes in the application profile, indicated via the property `dcterms:hasPart`
* A list of all classes and properties used in the application profile, indicated via the properties `inspec:reuses` or `inspec:introduces`
* A relation, indicated via the `prof:isProfileOf` property, to any specification introducing an application profile for which there is a subprofile relation from the application profile

### Main and supportive node shapes

Note that there are node shapes of more technical nature that are excluded from the requirements below, all those must have a `sh:severity` set to `sh:Info` or `sh:Warning`. For example this covers node shapes pointed to via `sh:node` used to express more complex constraints such as indicating which terminology to choose concepts from.

The following information MUST be provided for a node shape:

* A stable identity in the form of a URI (subject position in triples)
* A label expressed via the property `rdfs:label` (RECOMMENDED) or `sh:name`
* A list of property shapes via the property `sh:property` (see [section on defining order](#order))
* (For main node shapes) The class it corresponds to via the target declaration `sh:targetClass`

The following information SHOULD/MAY be provided:

* A description / definition expressed via the property `rdfs:comment` (RECOMMENDED) or `sh:description`
* A usage note expressed via the property `skos:scopeNote`
* A reference to another node shape it
  * "refines" via `inspec:refines` (see [section on refinement](#node_refinement)), OR
  * "is a variant of" via the `inspec:variant` property (see [section on variants](#node_variant))

Note: SHACL 1.0 defines `sh:name` and `sh:description` for property shapes only, as their `rdfs:domain` is `sh:PropertyShape`, so under RDFS inference a node shape carrying them is typed as a property shape. The SHACL 1.2 draft allows them on node shapes. Until it is a Recommendation, `rdfs:label` and `rdfs:comment` are recommended on node shapes, and consumers should accept either.

### Property Shapes pointed to from main and supportive node shapes

Note that there are property shapes of more technical nature that are excluded from the requirements below. Property shapes are either excluded as they are referred to only from excluded node or from logical constraint components.  

The following information MUST be provided for a property shape:

* A stable identity in the form of a URI (subject position in triples)
* A label expressed via the property `sh:name`
* The property it describes how to use via `sh:path`
* The value type to match against, `sh:nodeKind` pointing to `sh:IRI`, `sh:BlankNode`, `sh:Literal` etc.

The following information SHOULD/MAY be provided:

* Express cardinality by:
  * `sh:minCount "1"^^xsd:integer` for mandatory
  * `sh:minCount "0"^^xsd:integer` for preferred
  * `sh:minCount "-1"^^xsd:integer` for optional (or, if left out it should be interpreted as -1)
  * `sh:maxCount "N"^^xsd:integer` for a maximum cardinality of `N`
* A description / definition expressed via the property `sh:description`
* A usage note expressed via the property `skos:scopeNote`
* That a datatype is required on literals by using `sh:datatype`. If several datatypes are allowed, use `sh:or` in the property shape with one path-less shape per datatype, for example `sh:or ( [ sh:datatype xsd:date ] [ sh:datatype xsd:dateTime ] )`, so that each value must have one of them
* That a language is required on literals by setting `sh:datatype` to `rdf:langString`
* Constraints on which literals that is allowed by:
  * An explicit list by using `sh:in` pointing to a SHACL list
  * A constraining pattern expressed by `sh:pattern` (Regular expression)
* Constraints on which URIs that is allowed by:
  * An explicit list by using `sh:in` pointing to a SHACL list
  * A constraining URI pattern expressed by `sh:pattern` (Regular expression)
  * Constrain to concepts in a terminology (see [section below](#terminology))
  * Constrain to concepts in a concept collection (see [section below](#collection))
  * Constrain to instances of a class by `sh:class`. If instances of several classes are allowed, use `sh:or` in the property shape with one path-less shape per class, for example `sh:or ( [ sh:class foaf:Person ] [ sh:class foaf:Organization ] )`, so that each value must be an instance of one of them
* A reference to another property shape it:
  * "refines" via `inspec:refines` (see [section on property refinement](#property_refinement)), OR
  * "is variant of" via the `inspec:variant` property (see [section on property variants](#property_variant))

## Property shape refinement - how to refine/specialize/inherit property shapes ([Rule AP-7](rules.md#ap7))

<a id="property_refinement"></a>

A property shape can specialize another property shape by pointing to it via `inspec:refines`. The refining property shape states only what it adds or changes, and gets everything else from the refined property shape. E.g. consider the following property shape for the property `dcterms:publisher` where the range is `foaf:Agent`.

```turtle
ex:ps-publisher a sh:PropertyShape ;
  sh:name "Publisher" ;
  sh:path dcterms:publisher ;
  sh:nodeKind sh:IRI ;
  sh:minCount 1 ;
  sh:class foaf:Agent .
```

we can further constrain it to the subclass `foaf:Organization` via the following construction:

```turtle
ex:ps-publisher2 a sh:PropertyShape ;
  sh:path dcterms:publisher ;
  sh:class foaf:Organization ;
  inspec:refines ex:ps-publisher .
```

Note that at a minimum we have to repeat the `sh:path` property, which must be the same as in the refined property shape.

The refining property shape gets the constraints and characteristics of the refined property shape that it does not state itself. In the example above, `ex:ps-publisher2` gets `sh:name`, `sh:nodeKind` and `sh:minCount` from `ex:ps-publisher`, while its own `sh:class foaf:Organization` takes the place of `sh:class foaf:Agent`. If the refined property shape itself refines another property shape, that refinement is resolved first. A shape cannot refine itself, directly or through other shapes.

<!-- TODO(ESM-285): link the ENRICH rule that defines how a refinement is resolved. -->

A standard SHACL validator does not know about `inspec:refines`, so to it the refining property shape carries only what it states itself. To validate data as intended, the refinements have to be resolved first, by copying the refined property shape's constraints onto the refining one. The result is called *validating SHACL*.

### A refinement must not loosen constraints

A refining property shape *B* may tighten the constraints of the refined property shape *A*, but not loosen them ([Rule AP-7](rules.md#ap7)): for every constraint that both *A* and *B* state, every value that *B* accepts must also be accepted by *A*. Per constraint parameter, this means:

| Parameter | *B*'s value must be |
| --- | --- |
| `sh:minCount`, `sh:minLength`, `sh:minInclusive`, `sh:minExclusive` | ≥ *A*'s |
| `sh:maxCount`, `sh:maxLength`, `sh:maxInclusive`, `sh:maxExclusive` | ≤ *A*'s |
| `sh:in` | a subset of *A*'s list |
| `sh:nodeKind` | within *A*'s (e.g. `sh:IRI` ⊆ `sh:BlankNodeOrIRI`) |
| `sh:hasValue` | equal to *A*'s |
| `sh:datatype` / an `sh:or` of datatypes | a set of datatypes ⊆ *A*'s set |
| `sh:class` / an `sh:or` of classes | each class equal to, or a subclass of, one of *A*'s classes |
| `sh:severity` | at least as strict as *A*'s (no severity means `sh:Violation`) |
| `sh:pattern` (with any `sh:flags`), `sh:and`, any other `sh:or`, `sh:xone`, `sh:not`, `sh:node`, `sh:sparql` | see below |

For the parameters in the last row a narrower value is allowed, e.g. a stricter `sh:pattern`, but a general implementation can only be expected to verify that an equal value does not loosen the constraint; for other values it cannot conclude either way.

A single `sh:datatype` *D* counts as the set {*D*}, and an `sh:or` where every member is exactly one `sh:datatype`, as described for property shapes above, as the set of those datatypes. So `sh:datatype xsd:date` on *B* is within `sh:or ( [ sh:datatype xsd:date ] [ sh:datatype xsd:dateTime ] )` on *A*. Classes are treated the same way.

### Why not `sh:and`

SHACL can combine shapes via `sh:and`, but in a property shape `sh:and` applies to the value nodes, i.e. the values of `sh:path`, not to the focus node ([SHACL, section 4.6.2](https://www.w3.org/TR/shacl/#AndConstraintComponent)). If `ex:ps-publisher2` above stated `sh:and ( ex:ps-publisher )`, each publisher would be checked for a `dcterms:publisher` of its own. A book with a publisher would then fail the `sh:minCount 1`, and a book without one would pass, since there is no value to check. So `sh:and` cannot be used to refine a property shape.

### Refined shapes in other datasets

A refined shape may reside in another RDF Dataset pointed to via `owl:imports` ([Rule AP-14](rules.md#ap14)). That dataset has to be imported before the refinement can be resolved or checked.

## Property shape variants - when property refinement breaks down ([Rule AP-8](rules.md#ap8))

<a id="property_variant"></a>

Note that we are not allowed to relax constraints via the refinement construction (see [Rule AP-7](rules.md#ap7)). For instance if we need to relax the constraint and make the publisher optional we cannot specialize the property shape, instead we have to duplicate all information. But we can still provide an indication that we have provided a "variant" of our property shape via the `inspec:variant` property like this:

```turtle
ex:ps-publisher3 a sh:PropertyShape ;
  sh:name "Publisher" ;
  sh:path dcterms:publisher ;
  sh:nodeKind sh:IRI ;
  sh:class foaf:Agent ;
  inspec:variant ex:ps-publisher .
```

Note that for node shapes it is more common to have "variants" as you often want to change the order or include a slightly different set of property shapes.

## Node shape refinement - how to refine/specialize/inherit node shapes ([Rule AP-9](rules.md#ap9))

<a id="node_refinement"></a>

A node shape refines another node shape via `inspec:refines`, just as for property shapes. What differs is how the property shapes are handled. Either the refining node shape lists no property shapes of its own via `sh:property` and gets those of the refined node shape, e.g. when it refines only to change its label. Or it lists all of them, each either as is or as a refinement of it ([Rule AP-9](rules.md#ap9)). The latter is needed to refine some of the property shapes, or to change their order (see [section on order](#order)). Property shapes that are used as is are listed directly.

A node shape may also refine several node shapes, e.g. to combine them. If it then lists no property shapes of its own, it gets the property shapes of all of them. Whether they can be combined is not checked, e.g. two property shapes with the same `sh:path` whose constraints no value can meet. This is the same as for a refinement whose own `sh:minCount` exceeds an inherited `sh:maxCount`.

Let us introduce a node shape for a book profile that we want to extend including it's two property shapes (we define the property shape ps-publisher from above again to make it easier to read):

```turtle
ex:ns-book a sh:NodeShape ;
  rdfs:label "Book"@en ;
  sh:property ex:ps-title, ex:ps-publisher .
ex:ps-title a sh:PropertyShape ;
  sh:path dcterms:title ;
  sh:nodeKind sh:Literal ;
  sh:name "Title"@en ;
  sh:order "1"^^xsd:decimal .
ex:ps-publisher a sh:PropertyShape ;
  sh:name "Publisher" ;
  sh:path dcterms:publisher ;
  sh:nodeKind sh:IRI ;
  sh:minCount 1 ;
  sh:class foaf:Agent .
```

Now we want to extend the book profile with the publisher restricted to organizations (again we duplicate the property shape ps-publisher2 from above for readability):

```turtle
ex:ns-book2 a sh:NodeShape ;
  rdfs:label "Book2"@en ;
  inspec:refines ex:ns-book ;
  sh:property ex:ps-title, ex:ps-publisher2 .
ex:ps-publisher2 a sh:PropertyShape ;
  sh:path dcterms:publisher ;
  sh:class foaf:Organization ;
  inspec:refines ex:ps-publisher .
```

## Node shape variant - provide variants of node shapes ([Rule AP-10](rules.md#ap10))

<a id="node_variant"></a>

The solution for node shape variants is very similar to refinements, we can look at an example directly (again we repeat everything for readability):

```turtle
ex:ns-book a sh:NodeShape ;
  rdfs:label "Book"@en ;
  sh:property ex:ps-title, ex:ps-publisher .
ex:ps-title a sh:PropertyShape ;
  sh:path dcterms:title ;
  sh:nodeKind sh:Literal ;
  sh:name "Title"@en ;
  sh:order "1"^^xsd:decimal .
ex:ps-publisher a sh:PropertyShape ;
  sh:name "Publisher" ;
  sh:path dcterms:publisher ;
  sh:nodeKind sh:IRI ;
  sh:minCount 1 ;
  sh:class foaf:Agent .
```

Now to provide a variant of the book profile we use the `inspec:variant` property (again we duplicate the property shape ps-publisher3 from above for readability):

```turtle
ex:ns-book3 a sh:NodeShape ;
  rdfs:label "Book3"@en ;
  inspec:variant ex:ns-book ;
  sh:property ex:ps-title, ex:ps-publisher3 .
ex:ps-publisher3 a sh:PropertyShape ;
  sh:name "Publisher" ;
  sh:path dcterms:publisher ;
  sh:nodeKind sh:IRI ;
  sh:class foaf:Agent ;
  inspec:variant ex:ps-publisher .
```

A node shape may also be a variant of several node shapes. For each of them it then has every property shape, or a refinement or variant of it, and at least one of these must be a variant ([Rule AP-10](rules.md#ap10)).

## Providing order of property shapes

<a id="order"></a>

An important aspect of application profiles is to generate specification documents in a predictable manner. Furthermore, since we aim for multilinguality the order cannot be based on alphabetical sorting of labels. Consequently we outline two rules:

1. Provide an explicit order of all property shapes via `sh:order`.
2. Sort all property shapes that have no sh:order via the alphabetical order of the local name of the property given via sh:path.

Note that if two property shapes have the same property, they must be separated by an explicit `sh:order`.

> It is a strong recommendation to always provide an explicit order on every property shape.

If you are reusing property shapes in new settings (e.g. in specialization of node shapes) you may want to change the order. Lets consider the example where we have a profile for a book with a title and an identifier:

```turtle
ex:ns-book a sh:NodeShape ;
  rdfs:label "Book"@en ;
  sh:property ex:ps-title, ex:ps-identifier .
ex:ps-title a sh:PropertyShape ;
  sh:path dcterms:title ;
  sh:nodeKind sh:Literal ;
  sh:name "Title"@en ;
  sh:order "1"^^xsd:decimal .
ex:ps-identifier a sh:PropertyShape ;
  sh:path dcterms:identifier ;
  sh:nodeKind sh:Literal ;
  sh:name "Identifier"@en ;
  sh:order "2"^^xsd:decimal .
```

To change the order so the `dcterms:identifier` is at the top you can make a minimal refinement of that property shape with another `sh:order`:

```turtle
ex:ns-book2 a sh:NodeShape ;
  rdfs:label "Book 2"@en ;
  sh:property [
      sh:path dcterms:identifier ;
      sh:order "0.5"^^xsd:decimal ;
      inspec:refines ex:ps-identifier
    ], ex:ps-title .
```

Note that you have to repeat the `sh:path` (see [section on property refinement](#property_refinement)). We have chosen to not give the new property shape a URI since it does not provide any additional value beyond the order, which is specific to the node shape. Since it holds no SHACL constraints, it is **private** under [Rule AP-3](rules.md#ap3).

## Restricting to concepts in a terminology

<a id="terminology"></a>

To restrict to concepts in a terminology you should specify:

1. That you are expecting instances of the class `skos:Concept`.
2. That you are expecting the concepts to have a `skos:inScheme` property pointing to the terminology.
3. A regular expression for the concept URIs (optional).

```turtle
ex:ps1 a sh:PropertyShape ;
  sh:path dcterms:subject ;
  sh:pattern "^http://example.com/terminologyA/.*$" ;
  sh:node [
      a sh:NodeShape ;
      sh:severity sh:Info ;
      sh:property [
        sh:path rdf:type ;
        sh:hasValue skos:Concept
      ], [
        sh:path skos:inScheme ;
        sh:hasValue ex:terminologyA
      ]
    ] .
```

The reason we set the `sh:severity` to `sh:Info` is that if we try validate a data graph against this SHACL expression we do not always expect to have the entire terminology loaded with `rdf:type` and `skos:inScheme` triples for all concepts. In this case we instead rely on the `sh:pattern` to give us a more syntactical indication that the URI in the data graph corresponds to a correct concept. The expression with `rdf:type` and `skos:inScheme` (1 & 2 above) is provided to allow us to both detect that this is in fact a terminology when we render the specification and a more correct way to search for the intended concepts.[^1]

[^1]: We here introduced a node shape and two property shapes which we consider to be private (as opposed to public, see [AP-3](rules.md#ap3) and [AP-4](rules.md#ap4)) as they are primarily a technical construction. This also necessitates setting the `sh:severity` below `sh:Violation` but allows us to use blank blank nodes for these shapes.

## Restricting to concepts in a concept collection

<a id="collection"></a>

To restrict to concepts in a concept collection you should specify:

1. That you are expecting instances of the class `skos:Concept`.
2. That you are expecting the concept collection to have a `skos:member` property pointing to the concepts.

Add missing section on Restricting to concepts in a concept collection

The section was purposefully kept very similar to the section on Restricting to concepts in a terminology

```turtle
ex:ps1 a sh:PropertyShape ;
  sh:path dcterms:subject ;
  sh:node [
      a sh:NodeShape ;
      sh:severity sh:Info ;
      sh:property [
        sh:path rdf:type ;
        sh:hasValue skos:Concept
      ], [
        sh:path [
          sh:inversePath skos:member
        ] ;
        sh:hasValue ex:collectionA
      ]
    ] .
```

The reason we set the `sh:severity` to `sh:Info` is that if we try validate a data graph against this SHACL expression we do not always expect to have the entire terminology loaded with `rdf:type` and `skos:member` triples for all concepts in the collection. The expression with `rdf:type` and `skos:member` (1 & 2 above) is provided to allow us to both detect that this is in fact a concept collection when we render the specification and a more correct way to search for the intended concepts.[^1]

## Anti patterns

### Multiple top-level property shapes for the same triple

SHACL allows a node shape to include multiple property shapes that together constrain a single triple. For instance, one property shape may constrain the node type and another the cardinality. This is problematic and should be avoided as it both makes it hard to generate documentation and complicates reuse. E.g. the following example is not encouraged:

```turtle
ex:ns1 a sh:NodeShape ;
  rdfs:label "Person" ;
  sh:property ex:ps1, ex:ps2 .
ex:ps1 a sh:PropertyShape ;
  sh:name "Name" ;
  sh:path foaf:givenName ;
  sh:nodeKind sh:Literal .
ex:ps2 a sh:PropertyShape ;
  sh:path foaf:givenName ;
  sh:minCount 1 .
```

Instead the expression should be done via a single property shape:

```turtle
ex:ns1 a sh:NodeShape ;
  rdfs:label "Person" ;
  sh:property ex:ps1 .
ex:ps1 a sh:PropertyShape ;
  sh:name "Name" ;
  sh:path foaf:givenName ;
  sh:minCount 1 ;
  sh:nodeKind sh:Literal .
```

However, there are situations where the same property is reused on the same node for different reasons. But then the constraints should be made in such a way that the triples matched for each property shape are disjoint. Mechanism to ensure that they match different sets of triples includes `sh:nodeKind` and `sh:pattern`. The following example shows how to point to two different sets of concepts using the same property (`foaf:topic_interests`):

```turtle
ex:ns1 a sh:NodeShape ;
  rdfs:label "Person" ;
  sh:property ex:ps1, ex:ps2 .
ex:ps1 a sh:PropertyShape ;
  sh:name "Hobbies" ;
  sh:path foaf:topic_interests ;
  sh:nodeKind sh:IRI ;
  sh:pattern "^http://example.com/hobbies/.*$" .
ex:ps2 a sh:PropertyShape ;
  sh:name "Professional interests in computer science" ;
  sh:path foaf:topic_interests ;
  sh:nodeKind sh:IRI ;
  sh:pattern "^http://example.com/computer_science/.*$" .
```

Read the chapter "[Using the same property for different purposes](property-reuse.md)" for a longer background and recommendations on when it is suitable to reuse properties in this manner.
