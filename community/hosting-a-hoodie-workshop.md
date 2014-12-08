---
layout: layout-community
---

# Hosting a Hoodie Workshop 

*This is a living document and work in progress. If you want to add your feedback or experiences, please [contact us](http://hood.ie/contact).*

##Prerequisites

- How long is the workshop supposed to take? (At least 3-4 hours should be given, depending on the experience levels of the attendees)
- How many participants?
- Who can do the Coaching? (Ideal: have 1 coach per 3-4 participants)
- Which OS?
- Will they bring their Laptops or are computers available? (If the latter, with admin rights for participants?)
- Which experience levels?
  - HTML / CSS
  - JavaScript
  - Terminal
- If possible, arrange “Installation Party” before the actual workshop (makes it easier to do the setup with everyone and then the workshop can start with everyone on the same level)
  - installation guide is [here](https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/system-requirements-browser-compatibilities-prerequisites-before-getting-started-with-hoodie.md)
- Set up a Code of Conduct (e.g. similar to [Hoodie's Code of Conduct](http://hood.ie/code-of-conduct) )

## To prepare
- Check if there are enough sockets
- Bring extension cords
- Stable Wifi for everyone. Check if special login for participants is required
- Arrange food and enough drinks & snacks
- Prepare (if necessary) short Hoodie intro talk (see [sample talks](http://hood.ie/contribute#talks) or the [Hoodie Events page](http://hood.ie/events))
- Prepare all important commands on slides or handout
- Prepare all important links as shortlinks
- Prepare typical problems + solutions (also: check FAQ on “Known Errors”) for your coaches
- Prepare a bunch of app ideas (beyond to do list apps) that people can then work on when they know enough about Hoodie, but don’t have a concrete app idea themselves
- Print the [Hoodie Cheat Sheet](http://hood.ie//dist/presentations/hoodie-cheat-sheet-print.pdf) for each participant
- Prepare Feedback Form (e.g. like [this one](https://docs.google.com/a/thehoodiefirm.com/forms/d/1toCQfdK4tF2WIXzico5MoMpI_UXpLQ5zvcxFOUhip5M/viewform)
- Check [Hoodie’s FAQ](http://faq.hood.ie) for known bugs and errors – especially 
  - [‘npm ERR! Please try running this command again as root/Administrator’](http://faq.hood.ie/#/question/38210259) 
  - [common Windows installation problems](http://faq.hood.ie/#/question/48204371) 
  - [Error ’could not start Hoodie`](http://faq.hood.ie/#/question/38210193)

## Prerequisites for attendees (to announce)
- Bring own Laptop
- Ask attendees to have the latest (or at least not too old) version of their Operating System – otherwise they may into trouble
If they don’t have one yet, ask them to install an Editor (ideally send a list of suggestions + links)
- Accept Code of Conduct

## Running Order

- Welcome everyone
- Talk about Code of Conduct (name welcome / unwelcome behaviour explicitly) and that it will be enforced
- Ask who knows hat Hoodie is and does, if not all, give a short introduction to Hoodie
- Ask everyone about their levels of experience + skills
- Installation (note: can take much longer than expected)
  - check if everyone has Hoodie up and running
  - [installation guide](https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/system-requirements-browser-compatibilities-prerequisites-before-getting-started-with-hoodie.md) 
  - note special issues which sometimes occur on Windows
- if Hoodie is already installed, have them ensure they have the latest version by running `hoodie new myApp` (all components are then updated automatically)
- Start with first Tutorial: run `hoodie new tutorial -t gr2m/hoodie-store-and-account-tutorial` 
- Admin-Interface – http://127.0.0.1:6002
- …
- …
- [Plugin Tutorial](https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/hoodie-plugin-tutorial/index.md) (for super advanced participants)
- Boilerplate: `hoodie new awesome-app -t zoepage/hoodie-boilerplate`
- …
- … 
- Build your own App
- Present your App to the Group
- Feedback Round
  - ask for Feedback
  - hand out link to Feedback Form
- Go home, get some sleep
- Check Feedback & add to Workshop materials
