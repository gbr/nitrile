# Nitrile

## What is this?

Nitrile is an attempt to implement my dream of simple, potentially code-free creation of beautiful LaTeX documents. Aware of the wonderful [ShareLaTeX](https://www.sharelatex.com/), I wanted a more intuitive web interface for single-user document creation that allowed creating intricate practical, everyday documents (resumes, cover letters, etc.) without writing a single line of TeX markup. The name is a play on this idea: "nitrile" being a material subsitute for "latex" in cleaning gloves for those who have developed an allergy to it due to long-term exposure.

Nitrile, in its current incarnation, uses Node.js in the server, React in the UI and Redux all around.

Since its inception, the project has evolved into an attempt to implement a thought experiment on side effects and a stateless server...

## So let's take a step back

Ultimately, here is what nitrile attempts to accomplish:

- Simple client input in the form of either a form or a textbox, depending on the type of document, and visualization of the last-generated PDF
- Server application running LaTeX and sending PDFs to the client in real time to render in the browser

The way I eventually chose to do this is with a full-stack Redux communication bus. On the server, this meant pushing the side-effects (the DB, logging, PDF generation, etc.) to the edges of the app while communicating state back to the client. For both client and server, the most natural choice for me was a [RFC 6902](https://tools.ietf.org/html/rfc6902)-style JSON API, sending diffs across the wire rather than the full document. This heavily reduces the size of the messages and also made it easier to implement an undo-redo mechanism. Each diff would contain a "type" field, which is like a Redux Action, and a checksum header, which is a hash of the current document data, along with other metadata like timestamps, global ids, etc. that I add as needed.

The server sends an initial diff, which is either state from a previous session hydrated from the database, or a blank header signifying "ready". For the sake of simplicity, the client sends all updates via a "send" button that locks out the UI until a certain timeout period (rather than a complicated optimistic blurring model). The server executes diffs and sends a new revision with a valid checksum, which the client verifies by applying its previous diff and ensuring the calculation holds true. This greatlfy simplifies the data flow model, since it implies a guaranteed, heavily synchronized (i.e., strict) flow of dispatch between client and server. This also helped with speeding undo-redo, since I can cache previously generated PDF documents under the name of that document's checksum. All of this comes practically for free once implemented in the Redux model.

The server was dumbed down to a single process for the sake of prototyping, and the concept of "workers" was diminished to the various side effect jobs (earlier mentioned DB, logging, etc.) which happens asynchronously via Redux Sagas.

## So that's a lot of talk. What does it do right now?

It generates a real resume document from a [jsonresume](https://jsonresume.org/) object using a LaTeX resume template I found here on GitHub, then tweaked in a [private fork](https://github.com/gbr/Awesome-CV) (actually, I've been using this resume, which is partly why I've been so busy). The rest of the code passes some tests, which means the pieces are working, but it's nowhere near a real app. The client is almost nonexistent, and the pieces of the server are implemented in several directions, as I changed my mind many times while working on this.

As of writing, the project has been on hiatus for a few months now as work has consumed more of my free time and I've had other exciting professional developments underway. When I come back to this, I will probably abandon the model described above and try something a little more tried-and-true, just to have a real product to show in the end.

If I had continued with what I had planned to do, below would be my next steps:

TODOs:

1. flesh out action creators for nitrile, on both client and server
2. flesh out global state for both client and server
3. flesh out reducers, root reducers and reducer composition for nitrile, on both client and server
4. flesh out store and data flow design for both client and server
5. tweak saga and async side-effect groundwork to fit nitrile needs
6. hook PDF generator saga into server redux flow
7. (optional) add scribe (redux-logger) into async flow
...?
8. Decouple Foo and Bar examples from real app; keep as tests
9. Create mock design for doc edit page
(10-12 below can be done laterally or vertically, doesn't matter)
10. Integrate static react compoennts for all parts of page (hamburger menu, PDF, bottom sliding window pane form, etc.)
11. Create state for all components
12. Create data flow for all components

...

TODOs too far into the future to tell:

* Use Passport.js recipe for Google (LinkedIn? SO?) auth and do 10-12 for login
* add DB saga (pull in mongoose and mongoDB or maybe rethinkdb, hook into async flow)
* Do 10-12 for settings page
* Do 10-12 for document type selection page
* Do 10-12 for cover letter edit page
* Do 10-12 for "about" page
* Add correct rotuing for all these pages

...

TODOs with no timeline:

* Fix NPM dependency issues
* Fix server routing test to lead to /test rather than /oops
* Beautify LaTeX output: left justify skills columns, redo changes from personal prototype for spacing and font size, etc.
* Implement code coverage (istanbul and isparta) into tests
* Add proper sinon mocks for PDF generator tests

---
Made from [Breko-hub](https://github.com/tomatau/breko-hub).
