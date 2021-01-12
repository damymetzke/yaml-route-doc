# CSS Guide

This guide will assume the usage of sass/scss.
It is highly recommended to **not** use plain css.
That said plain CSS is supported.
If you need to quickly understand the different classes used,
see the class reference at the bottom of this document.

This guide will go over both the systems used,
but also the recommended structure of the scss.
The system is quite flexible,
so you can structure things quite differently if you want to.

If you are writing a style for this project you have to follow the structure defined here.

## Class structure

All classes have a common prefix.
This is done in case this system is ever used as a part of a bigger documentation system.
By default the prefix is `routedoc--`.
Currently there are 2 values that should be changed in order to properly chnage the prefix:

- The `classPrefix` property in the config file.
- The `$prefix` variable in `_variables.scss` (assuming you are using the default scss structure).

Classes used by the default html templates can be categorized in 2 different types:

- Generic classes are used in multiple locations and represent a generic concept.
- Specific classes are used once.

Specific classes are structured a specifc way.
The start of a specific class is _always_ the parent class (if any).
All segments are separated by 2 sequential dashes (`--`).

For example:

> There exists a route which has a method which has a decription.
> The resulting classes will be:
> route
> route--method
> route--method--description

## scss Rules

It is recommended to use the following rules when writing scss:

- **Always** use `@use`, never use `@import`.
- A variable called `$prefix` should exist.
  Every time the class prefix is used write something along the lines of `.#{$prefix}`.
  Make sure to not include any selector tokens in the `$prefix` variable.

## scss Structure

scss files should be structured with the following files:

### style.scss

Includes all other files.
Includes a few comments which give information about the stylesheet.
For example (`default` stylesheet):

```scss
// Stylesheet created for `yaml-route-doc` (https://github.com/damymetzke/yaml-route-doc)
// Author: Damy Metzke (damy.metzke@gmail.com)
// Name: Default
// Description: Default stylesheet meant to be functional and explainatory.
// Please use this as a starting point, or as a way to understand the class structure.
// This is not meant for use in an end products.
```

The author will always be the desired display name + email.

### \_variables.scss

Contains all variables.
When determining variables keep the following in mind:

- **All** colors should be defined as a variable.
- Minimize the amount of 'base' colors.
  More complex colors should be derived from the base colors.
  For example: you might have the base colors foreground, background and highlight.
  From these colors the colors dark-highlight and light-highlight could be created.
- Almost all sizes based on px, em, etc. should be defined as a variable.
- It is prefered to put variables in a map.
  Note that this is not always reasonable, make sure to think things through.

Since only variables exist this file will _not_ be included by `style.scss`.

### \_default.scss

Contains default styling for text and such.
Basically this is everything that does not use classes.
Think font of text/headers and putting all content in the center.

### \_generic.scss and \_specific.scss

These will hold the generic and specific classes respectively.
See `class structure` for more information.

Both these files use a specific structure.
At the root you should put the following:

```scss
.#{vars.$prefix} {
  // content
}
```

This will setup the prefix shared by all classes.
Using the `&` symbol it is now possible to use the correct classes with the prefix:

```scss
.#{vars.$prefix} {
  &card {
    // content
  }
}
```

If you don't know how this works,
basically `#{vars.$prefix}` will turn into `routedoc--` (if that is the defined prefix).
`&` will be replaced by its parent, which basically means the following:

```scss
.#{vars.$prefix} {
  &card {
    // All of these are the same
  }
}

.routedoc-- {
  &card {
    // All of these are the same
  }
}

.routedoc--card {
  // All of these are the same
}
```

Specific classes have a recursive structure.
Using similar techniques it is possible to move this recursion into a logical sass structure.
There are 3 rules to follow:

- Every class with css properties exists.
- Every class which is the common ancestor of 2 other classes exists.
- All classes are a child of their nearest existing parent.

This sounds complex, but it can easily be understood by the following example:

```scss
.#{vars.$prefix} {
  &route--method {
    &description {
      // Content
    }
    &--request-parameters,
    &--response-parameters {
      &--item {
        // content

        &--description {
          //content
        }
      }
    }
  }
}
```

### Other Files

These are the standard files, but feel free to add more whenever this makes sense.
For example, you could split `_specific.scss` in their respective types (group, index, route).

## Class Reference

### Generic

| class    | meaning                                                                                     |
| -------- | ------------------------------------------------------------------------------------------- |
| card     | An object with a title (h*), and content (*). Can be any size and nesten inside other cards |
| list     | A sequence of items which are always relatively short strings.                              |
| array    | A sequence of content which are of any size, but never a small string.                      |
| markdown | A block containing HTML which has been generated from markdown.                             |

### Specific

| class                                                  |
| ------------------------------------------------------ |
| group                                                  |
| group--description                                     |
| group--inherited-variables                             |
| group--inherited-variables--authentication-type        |
| group--inherited-variables--authentication-role        |
| group--inherited-variables--request-type               |
| group--inherited-variables--response-type              |
| index                                                  |
| index--route                                           |
| index--route--item                                     |
| index--group                                           |
| index--group--item                                     |
| route                                                  |
| route--method                                          |
| route--method--description                             |
| route--method--authentication-type                     |
| route--method--authentication-role                     |
| route--method--request-type                            |
| route--method--request-parameters                      |
| route--method--request-parameters--item                |
| route--method--request-parameters--item--description   |
| route--method--request-parameters--item--type          |
| route--method--request-parameters--item--restrictions  |
| route--method--response-type                           |
| route--method--response-parameters                     |
| route--method--response-parameters--item               |
| route--method--response-parameters--item--description  |
| route--method--response-parameters--item--type         |
| route--method--response-parameters--item--restrictions |
