$(document).ready(() => {
  const createTweetElement = function (tweet) {
    const markup = `
    <article class="tweet">
    <header>
     <img src="${tweet.user.avatars}">
      <span class="user-name">${tweet.user.name}</span>
      <span class="user-alias">${tweet.user.handle}</span>
    </header>
    <p>${escape(tweet.content.text)}</p>
    <footer>
    <span>${moment(tweet.created_at).fromNow()}</span>
    <div>
    <i class="fas fa-flag"></i>
    <i class="fas fa-retweet"></i>
    <i class="fas fa-thumbs-up"></i>
    </div>
    </footer>
    </article>
    `;
    return $(markup);
  };

  const renderTweets = function (tweets) {
    //reorders tweet by date.
    const orderedTweets = tweets.sort((tweet) => tweet.created_at);

    for (let tweet of orderedTweets) {
      $('#tweets-container').prepend(createTweetElement(tweet));
    }
  };

  const loadTweets = function () {
    $.get("/tweets", function (data) {
      $('#tweets-container').empty();
      renderTweets(data);
    });
  };

  const postForm = function ($jqueryForm) {
    $jqueryForm.on("submit", function (event) {
      event.preventDefault();
      //removes error message
      $('.error').remove();
      //tweet is the data entered by the user trying to tweet as a string
      const tweet = $(this).serialize().substring(5);
      if (isTweetValid(tweet)) {
        $.post('/tweets', $($jqueryForm).serialize()).then((value) => {
          $jqueryForm.children("textarea").val('');
        }).done(loadTweets)
      } else {
        $('.new-tweet').prepend($(`<p class="error"><b>Error: there must be between 1 and 140 characters.</b></p>`));
      }
    });
  };

  const writeNewTweetButton = function () {
    $(".write-new-tweet").click(function () {
      //height of the first tweet
      const firstTweetTop = ($('#tweets-container').offset().top - $("main").offset().top) + 10   ;
      $('html').animate({
        scrollTop: (!!$(document).scrollTop() ? 0 : firstTweetTop)
      }, 500);
      $('textarea').focus();
    });

  }

  const isTweetValid = (tweet) => {
    return Boolean(tweet && tweet.length <= 140);
  };

  const escape = function (str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  writeNewTweetButton();
  postForm($('#new-tweet-form'));
  //reloads tweet every second for testing
  //setInterval(loadTweets, 1000);

  loadTweets();
});
