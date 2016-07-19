$(function() {
  $('.stock-side-bar').ready(function() {
    var allStocks;

    $.ajax({
      url: '/api/stocks',
      data: {'request_type': 'latest_quotes'},
      contentType: 'json',
      success: function (json) {
        allStocks = json;
        renderStockBar(allStocks);

        // After they're rendered, grab the json for spark lines
        $.ajax({
          url: '/api/stocks',
          data: {'request_type': 'daily_quotes', 'limit': 10},
          contentType: 'json',
          success: function (json) {
            createSparkGraphs(json);
          }
        });
      }
    });

    var hbsStockSource = $('#stock-quote-hbs').html();
    var stockTemplate = Handlebars.compile(hbsStockSource);
    var hbsSparkSource = $('#stock-spark-hbs').html();
    var sparkTemplate = Handlebars.compile(hbsSparkSource);
    var timer;


    $('.stock-side-bar')
      .on('keyup', 'input', function() {
        $(".stock-quote").removeClass("active");
        var searchTerm = $(this).val();
        if (searchTerm === "") {
          $(".stock-quote").addClass("active");
          return false;
        }
        // ensure that the search term is alphanumeric before creating
        // regex based on the search
        var alphaNum = new RegExp(/^\w+$/);
        if (!alphaNum.test(searchTerm)) return false;

        var re = new RegExp(searchTerm, "i");
        allStocks.forEach(function(stock) {
          if (re.test(stock.ticker) || re.test(stock.name) || re.test(stock.sector)) {
            $('.stock-quote[data-ticker="'+stock.ticker+'"]').addClass('active');
          }
        });

      })

    function renderStockBar(stocks) {
      stocks = stocks.filter(function(n){ return n.latest_price != undefined });
      stocks.sort(function(a, b) {
        return a.ticker > b.ticker;
      });
      
      $.each(stocks, function(idx, stock) {
        var contextStock = {
          ticker: stock.ticker,
          price: stock.latest_price,
          name: stock.name,
        };
        var stockHtml = $(stockTemplate(contextStock));
        stockHtml.appendTo('.stock-quote-area');

        stockHtml.tooltip({delay: 50});
      })
    }


    function createSparkGraphs(daily_quotes) {
      //TODO create spark graphs
      $.each(daily_quotes, function(ticker, quotes) {
        var stockHtml = $('.stock-quote[data-ticker="'+ticker+'"]');

        var container = stockHtml.find('')
        var dataArray = [];

        $.each(quotes, function(idx, quote) {
          dataArray.push([quote.date, quote.close_price]);
        });

        var stockTooltip = $('#'+stockHtml.data('tooltip-id')+' span');
        stockTooltip.html($(sparkTemplate()));

        var container = stockTooltip.find(".chart");

        renderSparkChart(dataArray, container);
      });
    }



    function renderSparkChart(chartArray, container) {
      container.highcharts('StockChart', {
        rangeSelector : {
          selected : 1
        },
        title : {
          text : "asdf"
        },
        series : [{
          name: "asdf",
          data : chartArray,
          tooltip: {
            valueDecimals: 2
          }
        }]
      })
    }
  })

  return false;
})