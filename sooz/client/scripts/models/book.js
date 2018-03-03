'use strict';

var app = app || {};
var __API_URL__ = 'http://localhost:3000';

(function(module) {
  function errorCallback(err) {
    console.error(err);
    module.errorView.initErrorPage(err);
  }

  function Book(rawBookObj) {
    Object.keys(rawBookObj).forEach(key => this[key] = rawBookObj[key]);
  }

  Book.prototype.toHtml = function() {
    let template = Handlebars.compile($('#book-list-template').text());
    return template(this);
  };

  Book.all = [];

  Book.loadAll = rows => Book.all = rows.sort((a, b) => b.title - a.title).map(book => new Book(book));
  Book.fetchAll = callback =>
    $.get(`${__API_URL__}/api/v1/books`)
      .then(Book.loadAll)
      .then(callback)
      .catch(errorCallback);

  Book.fetchOne = (ctx, callback) =>
    $.get(`${__API_URL__}/api/v1/books/${ctx.params.book_id}`)
      .then(results => ctx.book = results[0])
      .then(callback)
      .catch(errorCallback);

  Book.create = book =>
    $.post(`${__API_URL__}/api/v1/books`, book)
      .then(() => page('/'))
      .catch(errorCallback);

  Book.update = (book, bookId) =>
    $.ajax({
      url: `${__API_URL__}/api/v1/books/${bookId}`,
      method: 'PUT',
      data: book,
    })
      .then(() => page(`/books/${bookId}`))
      .catch(errorCallback);

  Book.destroy = id =>
    $.ajax({
      url: `${__API_URL__}/api/v1/books/${id}`,
      method: 'DELETE',
    })
      .then(() => page('/'))
      .catch(errorCallback);

  // COMMENT: Where is this method invoked? What is passed in as the 'book' argument when invoked? What callback will be invoked after Book.loadAll is invoked?
  //RESPONSE: This method is invoked on the book-view.js within the initSearchFormPage function. The book argument, when invoked within this find method, is an object with three key value pairs: title, author, isbn. The initSearchResultsPage function will be invoked after the Book.loadAll is invoked and operates as a call back in the Book.find function.

  Book.find = (book, callback) =>
    $.get(`${__API_URL__}/api/v1/books/find`, book)
      .then(Book.loadAll)
      .then(callback)
      .catch(errorCallback);

  // COMMENT: Where is this method invoked? How does it differ from the Book.find method, above?
  //RESPONSE: This method is invoked within the book-view.js, as part of the initSearchPageResultsPage function. It differs from the method above because it is searching for a single book, solely based on the ISBN property of each book object. 
  Book.findOne = isbn =>
    $.get(`${__API_URL__}/api/v1/books/find/${isbn}`)
      .then(Book.create)
      .catch(errorCallback);

  module.Book = Book;
})(app);
