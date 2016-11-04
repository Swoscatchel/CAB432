var _json;

$(document).ready(function(){
    $('#btnSearch').on('click', function(){
        var location = $('#ddlLocation option:selected').text();
        var txtSearch = $('#txtSearch');
        var terms = txtSearch.val().split('|');
        var parameters = {location: location, terms: terms};
        var divError = $('#divError');
        divError.hide();

        if (txtSearch.val() == null || txtSearch.val() == ''){
            divError.text('Please enter a search value');
            divError.show();
        }
        else if (terms.length > 5){
            divError.text('Please enter a maximum of 5 terms');
            divError.show();
        }
        else if($('#ddlLocation option:selected').text() == '- select location -')
        {
            divError.text('Please select a location to filter by');
            divError.show();
        }
        else {
            $.ajax({
                url: '/search',
                data: parameters,
                success: function (data) {
                    paremeters = {terms: terms, data: data};
                    _json = data;
                    var text = '';

                    for (var i = 0; i < _json.categories.length; i++) {
                        var category = _json.categories[i];

                        if(category.tweets.length == 0){
                            text += '<tr>' +
                                '<td>'
                                + category.category +' - no results found</td>'
                                + '<td>'
                                + '</td>'
                                + '</tr>';
                        }
                        else{
                            text += '<tr>' +
                                '<td>'
                                + category.category + ' - ' + category.tweets.length + ' results found</td>'
                                + '<td>'
                                + '<input type="button" class="btn btn-link" '
                                + 'onclick="CategoryClicked(\''
                                + category.category + '\','
                                + i + ')" value="View"/>'
                                + '</td>'
                                + '</tr>';
                        }
                    }
                    $('#tbodyResults').html(text);
                    $('#divResults').show();
                }
            });
        }
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
