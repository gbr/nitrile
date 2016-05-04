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
