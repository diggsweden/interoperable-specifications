# Harvesting interoperable specifications

The starting point when you harvest is an expression according to PROF-INSPEC, see rules PROF-1 - PROF-10.

## Native harvesting according to INSPEC profile

Below we will refer to the interoperable specification resource as INSPEC resource, see by PROF-1 what we require of it.

### Data vocabulary

If the data vocabulary is reused, i.e. `prof:isInheritedFrom` is provided, no loading is done. If the referenced interoperable specification does not exist already in the system a warning is logged.

If the data vocabulary is not reused it is attempted to be retrieved from either the `prof:hasArtifact` value or the subject. The retrieved RDF datasource is checked against RDFS-INSPEC before being loaded into the triplestore. All classes and properties should be available in the triplestore. The ontology resource should also be available for easy access in the triplestore and also pointed to via `dcterms:subject` from the corresponding `prof:ResourceDescriptor`. (The classes and properties will only be pointed to via the `inspec:reuses` or `inspec:introduces` properties from the INSPEC resource if they are explicitly used as indicated in the application profile, see below, or if the specification is a foundational interoperable specification introducing the data vocabulary.)

### Terminology

If the terminology is reused, i.e. `prof:isInheritedFrom` is provided, no loading is done. If the referenced interoperable specification does not exist already in the system a warning is logged.

If the terminology is not reused it is attempted to be retrieved from either the `prof:hasArtifact` value or the subject. The retrieved RDF datasource is checked against SKOS-INSPEC before being loaded into the triplestore. All concepts, concept schemes and collections should be available in the triplestore for easy access. The terminology should be pointed to via `dcterms:subject` from the corresponding `prof:ResourceDescriptor`.

### Application profile

The application is attempted to be retrieved from either the `prof:hasArtifact` value or the subject. The retrieved RDF datasource is checked against SHACL-INSPEC before proceeding. All public property and node shapes introduced in this application profile should be calculated and indicated via `dcterms:hasPart` from the INSPEC resource. Further metadata about the node and property shapes needs not be added to the triplestore directly. Only the metadata about the INSPEC resource itself from the application profile needs to be added. All classes and properties referenced from public node and property shapes should be indicated via the `inspec:reuses` or `inspec:introduces` properties from the INSPEC resource. If there is a second application profile referenced via an `inspec:refines` relationship, then this should also be added as a `prof:isProfileOf` relation from the INSPEC resource.

### Diagram

The SVG file need not be loaded into the system as it is not a RDF file, however, it might be a good idea to cache it to minimize external dependencies.

## Harvesting from UML models

A UML model specification part is detected by `dcterms:conformsTo` pointing to `inspec:UML`, see Rule EXTRACT-3. The model itself need not be loaded into the system, instead interoperable specification parts are extracted from it before harvesting proceeds:

* A data vocabulary is extracted for each `inspec:umlOntology` and an application profile from the `inspec:umlDiagram`, nothing else is extracted regardless of the `prof:hasRole` values.
* If an extracted part is already indicated from the INSPEC resource, i.e. a specification part pointing to the UML model specification part via `dcterms:source`, it is used as it is. Otherwise the extracted part is added, with a `dcterms:source` pointing to the UML model specification part (see Rules EXTRACT-1 and EXTRACT-2).

The extracted data vocabularies and application profile are then harvested as described in the sections above. How the model is interpreted is described in the [INSPEC UML tag convention](uml.md).

## Harvesting from tabular annotations (CSV on the web)
