---
layout: layout-community
locales: en
---

# Hosting a Hoodie Workshop 

*This is a living document and work in progress. If you want to add your feedback or experiences, please [contact us](http://hood.ie/contact).*

## Prerequisites

- How long is the workshop supposed to take? (At least 3-4 hours should be given, depending on the experience levels of the attendees)
- How many participants?
- Who can do the Coaching? (Ideal: have 1 coach per 3-4 participants)
- Which OS?
- Will they bring their Laptops or are computers available? (If the latter, with admin rights for participants?)
- Which experience levels?
  - HTML / CSS
  - JavaScript
  - Terminal
- If possible, arrange “Installation Party” before the actual workshop (Participants can meet and also they know, all is setup. So they will feel more comfortable the next day.)
  - installation guide is [here](../start)
- Set up a Code of Conduct (e.g. similar to [Hoodie's Code of Conduct](http://hood.ie/code-of-conduct) or [how to design a Code of Conduct](https://adainitiative.org/2014/02/howto-design-a-code-of-conduct-for-your-community/))

## To prepare
- Check if there are enough sockets
- Bring extension cords
- Stable WiFi for everyone. Check if special login for participants is required
- Arrange food and enough drinks & snacks. If you can't do that, make sure to ask the participants to bring some snacks and look up some places you all can eat together.
- Prepare (if necessary) short Hoodie intro talk (see [sample talks](http://hood.ie/contribute#talks) or the [Hoodie Events page](http://hood.ie/events))
- Prepare all important commands on slides or handout. 
- If you have more than one person per laptop, please print out the tutorial you are teaching.
- Print the [Hoodie Cheat Sheet](http://hood.ie/dist/presentations/hoodie-cheat-sheet-print.pdf) for each participant
- Prepare all important links as shortlinks
- Prepare typical problems + solutions (also: check FAQ on “Known Errors”) for your coaches
- Prepare a bunch of app ideas (beyond to do list apps) that people can then work on when they know enough about Hoodie, but don’t have a concrete app idea themselves
- Prepare Feedback Form (e.g. like [this one](https://docs.google.com/a/thehoodiefirm.com/forms/d/1toCQfdK4tF2WIXzico5MoMpI_UXpLQ5zvcxFOUhip5M/viewform))
- Check [Hoodie’s FAQ](http://faq.hood.ie) for known bugs and errors – especially 
  - [‘npm ERR! Please try running this command again as root/Administrator’](http://faq.hood.ie/#/question/38210259) 
  - [common Windows installation problems](http://faq.hood.ie/#/question/48204371) 
  - [Error ’could not start Hoodie`](http://faq.hood.ie/#/question/38210193)

## Prerequisites for attendees (to announce)
- Bring own Laptop
- Ask attendees to have the latest (or at least not too old) version of their Operating System and Browser – otherwise they run may into trouble. You can find Hoodies prequisites [here](../hoodieverse/system-requirements-browser-compatibilities-prerequisites-before-getting-started-with-hoodie.html)
- If they don’t have one yet, ask them to install an Editor (ideally send a list of suggestions + links)
- Accept Code of Conduct

## Running Order

- Welcome everyone
- Talk about Code of Conduct (name welcome / unwelcome behaviour explicitly) and that it will be enforced
- Ask who knows what Hoodie is and does, if not all, give a short introduction to Hoodie
- Ask everyone about their levels of experience + skills, motivation and let them tell you a bit about themselves
- Installation (note: can take much longer than expected)
  - check if everyone has Hoodie up and running
  - [installation guide](../start)
  - note special issues which sometimes occur on Windows
- if Hoodie is already installed, have them ensure they have the latest version by running
<pre><code>hoodie new myApp</code></pre>
- If Hoodie is not the latest version, the Hoodie-CLI will tell you that and prompt the next steps
- Start with first Tutorial: run 
<pre><code>hoodie new tutorial /
  -t gr2m/hoodie-store-and-account-tutorial</code></pre> 
- Admin-Interface – http://127.0.0.1:6002
- …
- …
- [Plugin Tutorial](../plugins/tutorial.html) (for super advanced participants)
- Boilerplate: <pre><code>hoodie new awesomeApp /
-t zoepage/hoodie-boilerplate</code></pre> 
- …
- … 
- Build your own App
- Present your App to the Group
- Feedback Round
  - ask for Feedback
  - hand out link to Feedback Form
  - Do not forget to give some feedback. Be nice and ecouraging.
- Say thank you to all the people involved and be proud of yourself.
- If you'd like to, socialize with the group in the next restaurant / coffeeshop / pub. 
- Go home, get some sleep
- Check Feedback & add to Workshop materials