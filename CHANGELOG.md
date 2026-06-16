# Changelog

All notable changes to the INSPEC (Interoperable Specifications Profile)
specification are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Each version groups its entries into three sections that are always present,
even when empty: **Specification rules (`rules.md`)**, **Vocabulary
(`datavoc/`)**, and **Other changes**.

The formal specification is published at <http://w3id.org/inspec/specification>.

## [1.0.1-dev] - Unreleased

### Specification rules (`rules.md`)

#### Added

- New enrichment rule set `ENRICH-INSPEC` (`ENRICH-1`–`ENRICH-4`) separating
  optional enrichment from the core rules:
  - `ENRICH-1` — `dcterms:hasPart` from the interoperable specification
    resource to public property/node shapes (previously part of `AP-3`/`AP-4`).
  - `ENRICH-2` — optional `inspec:reuses`/`inspec:introduces` indication of
    classes and properties for profile interoperable specifications (moved from
    the former `AP-16`).
  - `ENRICH-3` — complement to `ENRICH-2` for foundational interoperable
    specifications.
  - `ENRICH-4` — how `prof:isProfileOf` can be inferred from an
    `inspec:refines` relation in the application profile.
- Rules `AP-13` and `AP-15` mandating use of `rdfs:isDefinedBy` to link shapes
  to the application profile resource.

#### Changed

- Relabelled the `INSPEC-#` rules as `PROF-#`.
- `inspec:refines` is now also used between application profile resources,
  replacing the previous `prof:isProfileOf` recommendation. `prof:isProfileOf`
  is left unchanged from the Profiles vocabulary (e.g. between a `prof:Profile`
  and a `dcterms:Standard`).
- Relaxed `AP-3` and `AP-4`: setting `dcterms:hasPart` is no longer required;
  this is now described as part of the harvesting process (see `ENRICH-1`).

#### Fixed

- Fixed capitalisation of `sh:Severity` instances.
- Fixed capitalisation so that only "MAY" is treated as a keyword in "MAY BE".

### Vocabulary (`datavoc/`)

#### Changed

- Extended the range and domain of `inspec:refines` to support its use between
  application profile resources.
- Relabelled the `INSPEC-#` rule references as `PROF-#`.
- Dropped rule numbering from the vocabulary terms.

### Other changes

- Dropped rule numbering from the bootstrapping document.
- Corrected the namespace for `profrole` in the examples.
- Fixed `dcterms:hasPart` references to property shapes in the examples.
- Updated the examples and harvesting documentation to reflect the rule and
  vocabulary changes. During harvesting a derived `prof:isProfileOf` relation
  is additionally added.
- Made `main` the working draft and `deploy` the deployed/released branch.
- Archive specification under e.g. `docs/1.0.0/` to keep older versions available.
- Add a CHANGELOG.

## [1.0.0] - 2025-11-28

Initial released version of the INSPEC specification, defining profiles of:

- PROF (W3C Profiles Vocabulary) — for specification structure.
- RDFS — for data vocabularies.
- SKOS — for terminologies.
- SHACL — for application profiles.
- SVG — for diagrams.

[1.0.1-dev]: https://github.com/diggsweden/interoperable-specifications/compare/v1.0.0...main
[1.0.0]: https://github.com/diggsweden/interoperable-specifications/releases/tag/v1.0.0
