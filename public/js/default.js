var _json;

$(document).ready(function(){
    $('#btnSearch').on('click', function(){
        var location = $('#ddlLocation option:selected').text();
        var parameters = {location: location};
        $('#divError').hide();

        $.ajax({
            url: '/search',
            data: parameters,
            success: function(data) {
                _json = data;
                var text = '';

                for(var i = 0; i < _json.categories.length; i++)
                {
                    var category = _json.categories[i];
                    text += '<tr>' +
                    '<td>'
                        + category.category + '</td>'
                            + '<td>'
                            + '<input type="button" class="btn btn-link" '
                            + 'onclick="CategoryClicked(\''
                        + category.category + '\','
                        + i + ')" value="Edit"/>'
                    +'</td>'
                        + '</tr>';
                }
                $('#tbodyResults').html(text);
                $('#divResults').show();
            }

        });
        return false;
    });
});

function CategoryClicked(category, cIndex){
    $('#btnBack').show();
    $('#btnsearch').hide();
    $('#divSearch').hide();
    $('#divResults').hide();
    $('#divTweets').show();

    var text = '';
    $('#h2Tweets').html(category);

    var tweets = _json.categories[cIndex].tweets;

    for (var i = 0; i < tweets.length; i++){
        var tweet = tweets[i];
        text += '<tr>'
            + '<td>'
            + tweet.created
            + '</td>'
            + '<td>'
            + tweet.text
            + '</td>'
            + '<td>'
            + tweet.author
            + '</td>'
            + '</tr>';
    }

    $('#tbodyTweets').html(text);
}

function GoBack(){
    $('#divSearch').show();
    $('#divResults').show();
    $('#divTweets').hide();
    $('#btnBack').hide();
}