# Harvesting interoperable specifications

The starting point when you harvest is an expression according to PROF-INSPEC, see rules INSPEC-1 - INSPEC-8.

## Native harvesting according to INSPEC profile

Below we will refer to the interoperable specification resource as INSPEC resource, see by INSPEC-1 what we require of it.

### Data vocabulary

If the data data vocabulary is reused, i.e. `prof:isInheritedFrom` is provided, no loading is done. If the referenced foundational or interoperable specification does not exist already in the system a warning is logged.

If the data vocabulary is not reused it is attempted to be retrieved from either the `prof:hasArtifact` value or the subject. The retrieved RDF datasource is checked against RDFS-INSPEC before being loaded into the triplestore. All classes and properties should be available in the triplestore. The ontology resource should also be available for easy access in the triplestore and also pointed to via `dct:requires` from the INSPEC resource. (The classes and properties will only be pointed to via `dct:requires` if they are explicitly used as indicated in the application profile, see below.)

### Terminology

If the terminology is reused, i.e. `prof:isInheritedFrom` is provided, no loading is done. If the referenced foundational or interoperable specification does not exist already in the system a warning is logged.

If the terminology is not reused it is attempted to be retrieved from either the `prof:hasArtifact` value or the subject. The retrieved RDF datasource is checked against SKOS-INSPEC before being loaded into the triplestore. All concepts, concept schemes and collections should be available in the triplestore for easy access. The terminology should be pointed to via `dct:requires` from the INSPEC resource.

### Application profile

The application is attempted to be retrieved from either the `prof:hasArtifact` value or the subject. The retrieved RDF datasource is checked against SHACL-INSPEC before proceeding. All reusable property and node shapes introduced in this application profile should be indicated via the `dct:hasPart` from the INSPEC resource. Further metadata about the node and property shapes needs not be added to the triplestore directly. Only the metadata about the INSPEC resource itself from the application profile needs to be added. All classes and properties referenced from node and property shapes should be indicated via the `dct:requires` property from the INSPEC resource.

### Diagram

The SVG file need not be loaded into the system as it is not a RDF file, however, it might be a good idea to cache it to minimize external dependencies.

## Harvesting from UML according to OSLO principles

## Harvesting from tabular annotations (CSV on the web)
