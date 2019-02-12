$( document ).ready(function() {
  
  var items = [];
  //array of books
  var itemsRaw = [];
  
  //API call here
  $.getJSON('/api/books', function(data) {
    //assign array to itemsRaw
    itemsRaw = data;
    $.each(data, function(i, val) {
      //adding string of html for each book to items list, for example:
      // <li class="bookItem" id="123456789">Name of the Wind - 3 comments</li>
      items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
      return ( i !== 14 );
    });
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    //append list inside ul tag to the display in html page
    $('<ul/>', {
      'id': 'listWrap',
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
  });
  
  //move comments to here
  var comments = [];
  
  //when clicking on the listed bookitems in the display
  $('#display').on('click', 'li.bookItem', function() {
    // title here. since each list item has unique id paired to db id, search book array with that
    $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id+')');
    //make api call with the specific id to receive comments
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      comments = [];
      //push comments to the comments array
      $.each(data.comments, function(i, val) {
        comments.push('<li>' +val+ '</li>');
      });
      //add the comment form
      comments.push('<div id="extras"><br>');
      comments.push('<form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
      //assign book's id to buttons' ids for easy ajax calls
      comments.push('<br><button class="btn btn-info addComment" id="'+ data._id+'">Add Comment</button>');
      comments.push('<button class="btn btn-danger deleteBook" id="'+ data._id+'">Delete Book</button>');
      comments.push('<button class="btn" onclick="exitComments()">Exit</button></div>');
      //bring all the html elements together and add to detailComments in page
      $('#detailComments').html(comments.join(''));
    });
  });
  
  $('#bookDetail').on('click','button.deleteBook', function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        //update list
        $('#detailComments').html('<p style="color: red;">'+data+'<br><b>Refresh the page</b></p>');
      }
    });
  });  
  
  $('#bookDetail').on('click','button.addComment',function() {
    let newComment = $('#commentToAdd').val();
    comments.unshift('Refresh the page to see changes');
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift('<br>' + newComment + '<br>'); //adds new comment to top of list
        $('#detailComments').html(comments.join(''));
      }
    });
  });
  
  $('#newBook').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    $('#detailComments').html('<p style="color: red;"><b>Refresh the page</b></p>');
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  }); 
  
});