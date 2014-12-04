# Markdown Style Guide

This Document contains some basic formatting standards to facilitate the use of
readable documentation using Markdown.

I spend a lot of my time adjusting and tweaking Markdown documents so that they
look pleasing both in-editor and in-browser, so I feel it makes sense to have a
unified style guide, that is of course open to debate, in our documentation
repo.

I'll flesh this out into a proper documentation file soon, but for now I'll
propose a few pointers so that we can better use Markdown to it's fullest. (Note
at least one of these I haven't been following, but I think it's a good idea to
do so, and will alter my documents at least to follow this guide.) If anyone
does take issue with anything here, or believes something should be added, then
feel free to either create an issue, or submit a Pull Request.


# Conventions

* We should have some kind of character wrap on words, just in case some editors
  don't wrap automatically, so I propose 80 characters as a limit, just so that
  we have a unified standard.
* Always have a space between the # character and the text of a heading,
  regardless of which level of heading it is.

```
# Heading 1
## Heading 2
### Heading 3
```

* Headers should be preceded by two new lines, except for at the top of a file,
  and also have a new line between the heading and the content.

```
This is normal text


# Heading 1

This is the content of Heading 1
```

* Code snippets to be highlighted should always specify the language of the
  code to be highlighted. This is a quick thing to do and helps GitHub's built
  in highlighter pick up the correct language.

```javascript
  Array(16).join('wat' -1) + ' Batman!'
```

* The first level of list items should not be preceded by a newline.
* List items should be indented with two spaces further than the parent item.
* All lists should be followed by new lines.

```
This text precedes a list.
  * list item 1
  * list item 2
    * sub-list item 1
    * sub-list item 2

  * list item 3
  * list item 4

This text comes after a list.
```

* Code sections should come with the backtick (`) on their own lines.
