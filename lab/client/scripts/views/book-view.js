'use strict';
var app = app || {};

(function(module) {
  $('.icon-menu').on('click', function(event) {
    $('.nav-menu').slideToggle(350);
  });

  function resetView() {
    $('.container').hide();
    $('.nav-menu').slideUp(350);
  }

  const bookView = {};

  bookView.initIndexPage = function(ctx, next) {
    resetView();
    $('.book-view').show();
    $('#book-list').empty();
    module.Book.all.map(book => $('#book-list').append(book.toHtml()));
    next();
  };

  bookView.initDetailPage = function(ctx, next) {
    resetView();
    $('.detail-view').show();
    $('.book-detail').empty();
    let template = Handlebars.compile($('#book-detail-template').text());
    $('.book-detail').append(template(ctx.book));

    $('#update-btn').on('click', function() {
      page(`/books/${$(this).data('id')}/update`);
    });

    $('#delete-btn').on('click', function() {
      module.Book.destroy($(this).data('id'));
    });
    next();
  };

  bookView.initCreateFormPage = function() {
    resetView();
    $('.create-view').show();
    $('#create-form').on('submit', function(event) {
      event.preventDefault();

      let book = {
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.create(book);
    });
  };

  bookView.initUpdateFormPage = function(ctx) {
    resetView();
    $('.update-view').show();
    $('#update-form input[name="title"]').val(ctx.book.title);
    $('#update-form input[name="author"]').val(ctx.book.author);
    $('#update-form input[name="isbn"]').val(ctx.book.isbn);
    $('#update-form input[name="image_url"]').val(ctx.book.image_url);
    $('#update-form textarea[name="description"]').val(ctx.book.description);

    $('#update-form').on('submit', function(event) {
      event.preventDefault();

      let book = {
        book_id: ctx.book.book_id,
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.update(book, book.book_id);
    });
  };

  // COMMENT: What is the purpose of this method?
  // RESPONSE: This method creates the search form view within our single page application (SPA). This function (along with its similiar sibling functions) allows us to use a single index.html page and render different views depending on the users intent and action on the page, i.e. it shows the search form if the user wants to search.
  bookView.initSearchFormPage = function() {
    resetView();
    $('.search-view').show();
    $('#search-form').on('submit', function(event) {
      // COMMENT: What default behavior is being prevented here?
      // RESPONSE: The default action of clicking on a button is to refresh the entire html page. This prevents that page reload.
      event.preventDefault();

      // COMMENT: What is the event.target, below? What will happen if the user does not provide the information needed for the title, author, or isbn properties?
      // RESPONSE: The event.target values are paired with the following keys: title, author, isbn. These key value pairs help to create an object to be searched for from the form inputs.
      let book = {
        title: event.target.title.value || '',
        author: event.target.author.value || '',
        isbn: event.target.isbn.value || '',
      };

      module.Book.find(book, bookView.initSearchResultsPage);

      // COMMENT: Why are these values set to an empty string?
      // RESPONSE: This resets the form to blanks so a new search may be preformed.
      event.target.title.value = '';
      event.target.author.value = '';
      event.target.isbn.value = '';
    });
  };

  // COMMENT: What is the purpose of this method?
  // RESPONSE: This builds the search results on the index.html page for the user to view.
  bookView.initSearchResultsPage = function() {
    resetView();
    $('.search-results').show();
    $('#search-list').empty();

    // COMMENT: Explain how the .map() method is being used below.
    // RESPONSE: The .map() method below is being used in this case to create an object-like array of all the values of a book based on the search parameters and then append the content of that book object to the DOM.
    module.Book.all.map(book => $('#search-list').append(book.toHtml()));
    $('.detail-button a').text('Add to list').attr('href', '/');
    $('.detail-button').on('click', function(e) {
      // COMMENT: Explain the following line of code.
      // RESPONSE: This line of code helps to find a book in the database and return that single book in the correct part of the DOM on the index.html page
      module.Book.findOne($(this).parent().parent().parent().data('bookid'));
    });
  };

  // COMMENT: Explain the following line of code.
  // RESPONSE: This line invokes the functions within the IFFE function when invoked.
  module.bookView = bookView;

  // COMMENT: Explain the following line of code.
  //RESPONSE: This creates an object-like function that allows us to access all the methods within upon page load using the variable "app" (currently an arguement below).
})(app);

