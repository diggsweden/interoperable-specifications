# Application Profiles and subclassing
The TLDR ("Too Long Did not Read") takeaway from the discussion below is that we should avoid introducing subclasses for the purpose of clarifying which characteristics are expected on a set of instances. We will use application profiles for this instead. The reason is that it comes with a cost of complicating the reuse. More specifically we should not use them purely based on technical limitations of a data modeling language like OWL. This is also the reason for why interoperable specifications rely on the combination of RDFS and Application Profiles rather than OWL. (Or the subset of OWL that coincides with RDFS.)

## The problem with subclassing

Let us consider a situation where you:
1. have a well known class, i.e. many information consumers know how instances of the class should be handled.
2. need to express more information and you are considering using a subclass to indicate this.
3. want existing consumers that are not aware of this new class to be able to treat data from you without further instructions.

Unless you are willing to compromise on requirement nr 3, you have only three options:

**Linked data** - You rely on the receiver to lookup the subclass in a linked data fashion and discover which class it is inheriting from. \
**Send along schema** - You send along the inheritance information in the instance data. \
**Double typing** - Express both superclass and subclass on the instance.

Unfortunately there are problems with all three options. Relying on linked data is sometimes brittle and also requires that the consumer uses inference when interacting with the data. Sending along schema information will enlarge the amount of information you have to send, and will also require inference. The double type option is perhaps the easiest way, but it sets a precedent that the sender needs to provide implicit information (entailment) for consumers to understand. This is perhaps not so bad for an extra type. But since the same argument can be made for subproperty relations the amount of double information can quickly grow.

Formulated differently, there is a cost involved with using subclasses and subproperties when the consumers are not expected to have pre-existing knowledge of them. Hence, the conclusion is to only use subclassing sparingly, and perhaps mostly as a way to introduce new data vocabulary for humans that will be expected to be known by the consumers.

This brings us to the question of why we subclass in the first place.

## What is a class
A class corresponds to grouping a set of instances together into a set, either by including them explicitly (by their names / identities) or based on a rule, e.g. some characteristic / category that unites them. From a more philosophical perspective these two approaches are referred to as the [extensional and intentional definitions of classes](https://en.wikipedia.org/wiki/Class_(knowledge_representation)#Extensional_or_intensional_definitions). RDFS takes the intentional path as it allows two classes to be different even if they correspond to the same set of instances.
The intentional path also allows us to make a lot of inferences about instances of classes based on rules, for instance, a certain property may have domain and range specified so we can infer that entities are instances of a certain class.

However, in many situations the extensional perspective is more useful. E.g. consider a situation where the two classes Hotel and Restaurant both have the same three mandatory properties name, latitude and longitude. Hence, in such a situation it won't be possible to distinguish if an entity is a Hotel or a Restaurant based solely on these properties. Instead we have to declare class membership explicitly. Note that knowing if an entity is a hotel or a restaurant is vital, for instance you don't want to get restaurants when you are searching for hotels.

## Why do we subclass

First of all subclassing is basically a subset relationship. I.e. all instances of a subclass are also instances of the superclass. A common use case is to identify subclasses that capture a distinct set of characteristics that should be expressed. Such a perspective is useful when you are building a model for a specific purpose. The purpose will provide restrictions that make it possible to disregard aspects that are not relevant for the model you are building.

However, if we are considering reuse across organizations the models we agree on will have to be used in a wider range of situations makes it hard to harshly restrict the model. The characteristics to express (in the form of properties) will vary, sometimes from instance to instance and the amount of subclasses we will need to capture this flexibility will quickly explode. For instance, it is certain that all FoodEstablishments serve food, but which characteristics are we certain of will always apply to only a Cafe and not a Restaurant?

Just like classes, subclasses can be important carriers of information, e.g. stating that something is a Cafe or a Restaurant is valuable information in itself. Much more valuable than if we introduce a subclass solely for the purpose to indicate which specific characteristics should be present in a certain context. So, to summarize, from the perspective of interoperable specifications, introducing classes as well as subclasses is:

**very valuable** - when providing information about the instances fundamental character \
**less valuable** - when it is used for the purpose of knowing which properties to use

So how do you reap the benefits of subclasses without paying the cost outlined above? There are basically three options:

1. Establish a set of relatively stable subclasses from the start and make sure everyone knows them.
2. Express both superclasses and subclasses (double typing).
3. Provide an alternative non-class based way of conveying the same information, e.g. something like categories or subject classifications.

Schema.org provides an interesting solution that is somewhere between 2 and 3 as they have introduced schema:additionalType as a variant on double typing. It is a hybrid since schema:additionalType is a subproperty of rdf:type.

## Why using OWL can be problematic
OWL is a very useful tool for making inferences. However, OWL is poorly fitted for expressing reuse of properties in new settings. The reason for this is that it you have to choose between two alternatives:

1. Defining a subclass and use property restrictions
2. Redefine existing classes (use the same URIs)

Alternative 1 is clearly problematic from our discussion above as it would introduce subclasses that are not well known just to circumvent a technical limitation in OWL. Alternative 2 is problematic as it will complicate reuse of data in the same environment. It would require to treat the information from different sources separately as the definitions it relies on could lead to conflicts.

However, please note that there is nothing wrong with using OWL instead of RDFS for defining classes and properties. Just avoid introducing a lot of new classes with property restrictions or redeclare classes for specifying how a class should be used in a certain setting as it will demand the closed world assumptions.


## What does the SEMIC style guide say

The [SEMIC style guide talks about reuse](https://semiceu.github.io/style-guide/1.0.0/clarification-on-reuse.html) of classes and properties and identifies three cases for classes and properties respectively:

1. Reuse as-is
2. Reuse with terminological adoptions
3. Reuse with semantic adoptions

It is only in the case of semantic adoptions that it is recommended to introduce new classes and properties. The style guide outlines how to use either UML or OWL2 for handling all three cases. However, it is clear that the mechanisms outlined for using OWL2 for case 1 and 2 assume the closed world assumption. Multi-level reuses or reuse of the same class or property in parallel will be highly problematic if combined.
This is one of the reasons this profile for interoperable specifications has taken another path and rely on application profiles expressed in SHACL rather than relying on OWL2.
