var axios = require('axios');
var moment = require('moment');

var listAll = [];
var nextPage;

var date = '2017-01-01';
var datePublishedBefore = moment(date).format();

function getList(nextListPage) {
    return new Promise(function(resolve){
        (function get(nextListPage) {
            axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        channelId: 'UCT8ny3aoHGFPILpCsFuEq9A',
                        key: 'AIzaSyBiwV8xo81yuKFP2AewtjgpedQzHYsq5Tw',
                        part: 'snippet',
                        publishedBefore: datePublishedBefore,
                        pageToken: nextListPage,
                        maxResults: '50'
                    }
                })
            .then(function (response) {
                var list = response.data.items;
                listAll = listAll.concat(list);
                nextPage = response.data.nextPageToken;
                var resultsPerPage = response.data.pageInfo.resultsPerPage;
                // console.log(resultsPerPage);
                var last = listAll.length-1;
                // console.log(listAll.length);
                // console.log(resultsPerPage);
                // console.log(nextPage);
                // console.log(response.data.items.length);

                if (response.data.items.length !== 50) {
                    resolve();
                    return;
                }
                get(nextPage);
                
            })
            .catch(function (error) {
                console.log(error);
                });
            })();
            
        });
        
}

getList(nextPage)
.then(() => {
    listAll.forEach(function(item, index) {
        var date = moment(item.snippet.publishedAt).subtract(10, 'days').calendar();
        console.log(`${++index}: ${date} - ${item.snippet.title}`);
    }, this);
});