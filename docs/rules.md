# Rules for interoperable specifications

The rules for interoperable specifications are divided into five parts:

1. Rules for interoperable specifications - PROF-INSPEC - based on [[[DX-PROF]]]
2. Rules for data vocabularies - RDFS-INSPEC - based on [[[RDF-SCHEMA]]]
3. Rules for terminologies - SKOS-INSPEC - based on [[[SKOS-REFERENCE]]]]
4. Rules for application profiles - SHACL-INSPEC - based on [[[SHACL]]]
5. Rules for diagrams - SVG-INSPEC - based on  [[[SVG11]]]

## Rules for interoperable specifications - PROF-INSPEC

<img src="pics/interoperable_specifications_overview.svg" width="800">

For a specification to be considered a interoperable specification the following must apply:

><span id="inspec1"></span> **Rule INSPEC-1:** The "interoperable specification resource" and its parts MUST have URIs and be described with PROF, the interoperable specification resource MUST be typed as `prof:Profile` or `dcterms:Standard` and have a `dcterms:conformsTo` point to `inspec:PROF`

><span id="inspec2"></span> **Rule INSPEC-2:** All specification parts MUST be indicated via the `prof:hasResource` property from the interoperable specification and be typed as `prof:ResourceDescriptor`. An interoperable specification part MAY be a data vocabulary, a terminology, an application profile or a diagram. Other parts may exist but have no prescribed meaning by the interoperable specification profile.

><span id="inspec3"></span> **Rule INSPEC-3:** Each data vocabulary MUST be detected by `dcterms:conformsTo` pointing to `inspec:RDFS` and MUST be possible to interpret as RDFS-INSPEC.

><span id="inspec4"></span> **Rule INSPEC-4:** Each terminology MUST be detected by `dcterms:conformsTo` pointing to `inspec:SKOS` and MUST be possible to interpret as SKOS-INSPEC.

><span id="inspec5"></span> **Rule INSPEC-5:** Each application profile MUST be detected by `dcterms:conformsTo` pointing to `inspec:SHACL` and MUST be possible to interpret as SHACL-INSPEC

><span id="inspec6"></span> **Rule INSPEC-6:** A diagram MUST be detected by `dcterms:conformsTo` property pointing to `inspec:SVG` and MUST follow SVG-INSPEC

><span id="inspec7"></span> **Rule INSPEC-7:** A **foundational** interoperable specification MUST contain at least one data vocabulary or one terminology, MUST NOT contain an application profile and MUST be typed as `dcterms:Standard`

><span id="inspec8"></span> **Rule INSPEC-8:** A **profile** interoperable specification MUST contain at least one application profile and MUST be typed as `prof:Profile`

><span id="inspec9"></span> **Rule INSPEC-9:** A profile interoperable specification MUST list all data vocabularies and terminologies it **uses** in the application profile explicitly as interoperable specification parts

><span id="inspec10"></span> **Rule INSPEC-10:** Interoperable specification parts that are **reused** (as opposed to **introduced**) SHOULD indicate that by referring to the interoperable specification where they where introduced via the `prof:isInheritedFrom` property

## Rules for data vocabularies - RDFS-INSPEC

RDFS-INSPEC builds on top of the RDF Schema specification by providing the following additional restrictions:

><span id="dv1"></span> **Rule DV-1:** A data vocabulary MUST be expressed in a single RDF Dataset.<sup><a href="#fn1" id="fn1_1">[1]</a></sup>

><span id="dv2"></span> **Rule DV-2:** There MUST be a single "data vocabulary resource" typed as `owl:Ontology` in the RDF Dataset

><span id="dv3"></span> **Rule DV-3:** All included classes and properties of the data vocabulary MUST point to the "data vocabulary resource" via the `rdfs:isDefinedBy` property

><span id="dv4"></span> **Rule DV-4:** All included classes and properties as well as the data vocabulary resource MUST have URIs

><span id="dv5"></span> **Rule DV-5:** Classes and properties from other vocabularies MAY BE included in the RDF Dataset, e.g. when being pointed to via `rdfs:subClassOf` and `rdfs:subProperty`, but MUST NOT point to the same "data vocabulary resource" via the `rdfs:isDefinedBy` property

><span id="dv6"></span> **Rule DV-6:** The "data vocabulary resource" MUST be indicated via the `dcterms:subject` property from the "interoperable specification part" (introduced in Rule INSPEC-2).

## Rules for terminologies - SKOS-INSPEC

SKOS-INSPEC builds on top of the SKOS specification by providing the following additional restrictions:

><span id="te1"></span> **Rule TE-1:** A terminology MUST be expressed in a single RDF Dataset.<sup><a href="#fn1" id="fn1_2">[1]</a></sup>

><span id="te2"></span> **Rule TE-2:** There MUST be a single "terminology resource" with a URI typed as `skos:ConceptScheme` in the RDF Dataset

><span id="te3"></span> **Rule TE-3:** All concepts and collections in the terminology MUST point to the "terminology resource" via the `skos:inScheme` property

><span id="te4"></span> **Rule TE-4:** All concepts, collections as well as the terminology resource MUST have URIs

><span id="te5"></span> **Rule TE-5:** The "terminology resource" MUST be indicated via the `dcterms:subject` property from the "interoperable specification part" (introduced in Rule INSPEC-2).

## Rules for application profiles - SHACL-INSPEC

SHACL-INSPEC builds on top of the SHACL specification by providing additional restrictions. Since SHACL is a rich language the following rules does not cover all situations. For instance, the following rules does not indicate how to specify how to restrict to concepts from a specific terminology. For a more complete treatment see the [SHACL-INSPEC separate document](ap.md) for patterns on how to use the profile in various situations.

><span id="ap1"></span> **Rule AP-1:** An application profile MUST be expressed in a single RDF Dataset<sup><a href="#fn2" id="fn2_1">[2]</a></sup>

><span id="ap2"></span> **Rule AP-2:** There MUST be a single "application profile resource" with a URI in the RDF Dataset AND it MUST be the same as the "interoperable specification resource" (introduced in Rule INSPEC-1)

><span id="ap3"></span> **Rule AP-3:** All property shapes with a severity of `sh:VIOLATION` and with at least one constraint (`sh:and` for specialization does not count) are considered **public** and they MUST have URIs and MUST also be pointed to from the application profile resource via the `dcterms:hasPart` property

><span id="ap4"></span> **Rule AP-4:** All node shapes with a severity of `sh:VIOLATION` are considered **public** and MUST have URIs and MUST also be pointed to from the application profile resource via the `dcterms:hasPart` property

><span id="ap5"></span> **Rule AP-5:** Public node shapes are considered **main** if they have a target declaration, otherwise they are considered **supportive**

><span id="ap6"></span> **Rule AP-6:** All public node shapes, as well as all property shapes pointed to from those, MUST provide a label and MAY also provide a definition and a usage note

><span id="ap7"></span> **Rule AP-7:** A property shape MAY express that it **refines** a public property shape via both the `inspec:refines` property as well as via a `sh:and` construct, the latter to be compatible with normal SHACL validation.

><span id="ap8"></span> **Rule AP-8:** A property shape MAY express that it is a **variant** of a public property shape via the `inspec:variant` property

><span id="ap9"></span> **Rule AP-9:** A node shape *B* MAY express that it **refines** a public node shape *A* via the `inspec:refines` property only if for every property shape *X* in *A* either *X* or a refinement *Y* of *X* is in *B*.

><span id="ap10"></span> **Rule AP-10:** A node shape *B* MAY express that it is a **variant** of a public node shape *A* via the `inspec:variant` property only if for every property shape *X* in *A* either *X* or *Y* is in *B* where *Y* is a refinement or a variant of *X*. At least one of the property shapes must be a variant and not a refinement.

><span id="ap11"></span> **Rule AP-11:** An application profile *B* MAY express that it is a **subprofile of** of an application profile *A* via the `inspec:refines` property only if for every node shape *X* in *A* there is a refined node shape *Y* in *B*.

><span id="ap12"></span> **Rule AP-12:** An application profile *B* MAY express that it is a **variant** of a application profile *A* via the `inspec:variant` property only if for every node shape *X* in *A* there is a variant or refined node shape *Y* in *B*, at least one of the node shapes must be a variant and not a refinement.

><span id="ap13"></span> **Rule AP-13:** Shapes used for refinement or for variants MAY reside in other RDF Datasets as long as the dataset is pointed to via `owl:imports` AND there is either a `inspec:refines` or a `inspec:variant` relation between the application profile resources.

><span id="ap14"></span> **Rule AP-14:** All classes and properties referred to via shapes SHOULD be explicitly indicated from the "application profile resource". The indication should use `inspec:reuses` if the referred resource is part of a **reused** specification part (see Rule INSPEC-10), otherwise `inspec:introduces` should be used.

## Rules for diagrams - SVG-INSPEC

SVG-INSPEC builds on top of SVG to provide a way to clarify whether objects in a diagram corresponds to an entity recognized in interoperable specifications, i.e. a class, a property, a node-shape, a property-shape, a concept, a terminology, or a concept collection. Also interoperable specifications or foundational specifications should be possible to indicate as well as diagrams and data vocabularies if they are included in the diagram. Note that there are no hard restrictions on the diagrammatic style used. Although it should be noted that it is good idea to choose a style that is well known like something akin to UML class diagrams.

><span id="svg1"></span> **Rule SVG-1:** An element corresponding to an INSPEC entity MUST have a href pointing to it's URI. If the element corresponds to two things, e.g. both a class and a node-shape, the URI of the dominant one should be used.

><span id="svg2"></span> **Rule SVG-2:** An element corresponding to an INSPEC entity MUST have a custom data attribute on the form `data-inspec-type="TYPE"` where TYPE is one of foundational, application-profile, diagram, data-vocabulary, class, property, node-shape, property-shape, concept, terminology and concept-collection. If the element corresponds to two things, e.g. both a class and a node-shape they can be listed both with a separating comma, the first should be considered dominant.

><span id="svg3"></span> **Rule SVG-3:** An element corresponding to an INSPEC entity MAY have an id on the form `id="d_EID"` where EID is the md5 sum<sup><a href="#fn3" id="fn3_1">[3]</a></sup> of the entity's URI.

><span id="svg4"></span> **Rule SVG-4:** An element with type node-shape or property-shape MAY have a custom data attribute on the form `data-inspec-public="true"` if it is public according to rule AP-3 or AP-4.

><span id="svg5"></span> **Rule SVG-5:** An element with type node-shape that is also public MAY have a custom data attribute on the form `data-inspec-weight="WEIGHT"` where WEIGHT is either "main" or "supportive" according to rule AP-5.

<section id="footnotes" style="font-size:smaller;border-top:1px solid" class="informative">
<ol>
 <li id="fn1">Both RDFS and SKOS introduce building blocks (classes and properties) for defining things (other classes, properties, concepts, collections) in an open world manner. However, both vocabularies and terminologies needs to work in the context of semantic specifications where it is stated explicitly what is included, hence it corresponds to a closed world perspective. Hence, in both RDFS-INSPEC and SKOS-INSPEC there is a restriction to assume that everything needed is provided in the indicated RDF Datasets. <a href="#fn1_1">↩<sup>1</sup></a><a href="#fn1_2">↩<sup>2</sup></a></li>
 <li id="fn2">SHACL supports imports declared via `owl:imports`, the rules are written from the perspective that these are respected and all RDF Datasets (potentially recursively) are imported first into a single RDF Dataset. <a href="#fn2_1">↩</a></li>
 <li id="fn3">The id value could in principle be the URI, however, it is highly likely that we want to write CSS rules targeting individual elements and then we need to be more restrictive as CSS rules cannot use URIs as part of selectors. <a href="#fn3_1">↩</a></li>
</ol>
</section>
