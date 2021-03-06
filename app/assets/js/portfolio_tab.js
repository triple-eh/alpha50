$(function() {


  $('[href="' + location.pathname + '"]').closest('li').addClass('current');

  $('.dropdown-button').dropdown({
    belowOrigin: true,
    constrain_width: false
  })

  $('.portfolio-area').ready(function() {

    renderPortfolioSection();

    var routes = [
      "#overview-tab",
      "#all-stocks-tab",
      "#analysis-tab",
      "#comparison-tab",
      "#trades-tab"    
    ];

    $('.portfolio-nav').on('click','a', function(e) {
      if ($(this).closest('li').hasClass('active')) {
        e.preventDefault();
        return false;
      };
    })

    $(window).on('hashchange', function (event) {
      if (routes.includes(location.hash) && !$(location.hash).hasClass('active')) 
        renderPortfolioSection();
      return false;
    });

  });

  return false; 

})

function renderPortfolioSection() {
  if (location.hash !== "") $(location.hash).siblings().removeClass('active');

  var preloader = $("#preloader").html();
  $("div.portfolio-content").append(preloader);

  setTimeout(function() {
    $('.portfolio-content .preloader-wrapper').remove();
    if (location.hash == "") $('#overview-tab, li:has(a[href="#overview-tab"])').addClass('active');
    if (location.hash !== "") {
      $(location.hash).addClass('active') ;
      $('[href="' + location.hash + '"]').closest('li').addClass('active').siblings().removeClass('active');
    };
    $('.portfolio-content div.active').trigger('tabactive');
  }, 500);

};

function createChartArray(valuations) {
  if (Array.isArray(valuations)) {
    var dailyDatePrice = [];
    $.each(valuations,function(idx,valuation) {
      dailyDatePrice.push([Date.parse(valuation[0]),parseInt(valuation[1])]);
    });
    return dailyDatePrice.sort(function(a,b){return a[0]-b[0]});
  }
  var dailyDatePrice = {};
  var user = [];
  var monkey = [];
  var index = [];

  $.each(valuations['user'],function(idx,valuation) {
    user.push([Date.parse(valuation[0]),parseInt(valuation[1])]);
  });
  $.each(valuations['monkey'],function(idx,valuation) {
    monkey.push([Date.parse(valuation[0]),parseInt(valuation[1])]);
  });
  $.each(valuations['index'],function(idx,valuation) {
    index.push([Date.parse(valuation[0]),parseInt(valuation[1])]);
  });

  user.sort(function(a, b){return a[0]-b[0]}); 
  monkey.sort(function(a,b){return a[0]-b[0]});
  dailyDatePrice['User'] = user;
  dailyDatePrice['Monkey'] = monkey;
  dailyDatePrice['Index'] = index;
  return dailyDatePrice;

}

function renderTimeChart(chartArrays, container, chartName, seriesName) {
  if ((Array.isArray(chartArrays) && chartArrays.length < 2) || (chartArrays['User'] != undefined && chartArrays['User'].length < 2)) {
    container.height(0);
    return false;
  }

  options = {
    colors: ["#283593","#4fc3f7","#009688","#1976d2","#757575","#212121","#ad1457"],
    rangeSelector : {
      selected : 1
    },
    title : {
      text : chartName,
      style: {
        color: "#009688",
        fontSize: "1.2rem"
      }
    },
    legend: {
      enabled:true
    }
  };
  var seriesOptions = [];

  if (Array.isArray(chartArrays)) {
    //console.log(chartArrays);
    seriesOptions = [{
      name: 'Daily Trade Amount',
      data: chartArrays
    }]
  } else {
    var i = 0;
    $.each(chartArrays, function(key, arr) {
      seriesOptions[i] = {
        name: key,
        data: arr
      }
    i++;
    });
  };


  options.series = seriesOptions;

  container.highcharts('StockChart', options);
}

function align() {
  var preloader = $('.portfolio-content .preloader-wrapper');
  var parent = preloader.parent().last();
  var marginTop = (parent.height()-preloader.height())/2;
  var marginLeft= (parent.width()-preloader.width())/2;
  preloader.css('margin-top', marginTop).css('margin-left', marginLeft);
}