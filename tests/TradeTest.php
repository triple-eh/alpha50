<?php
use PHPUnit\Framework\TestCase;

class TradeTest extends TestCase {
	public function testAfterCreateCallback()
    {
    	$stock = Stock::find_by_ticker('aapl');

    	$user = User::create([
    	  	'email'=>'asdf@gmail.com',
    	  	'password'=>'asdfasdf'
    	]);

    	$portfolio = Portfolio::create([
    		'name'=>'Awesome Port',
    		'user_id'=>$user->id,
    	]);

    	$stocks_portfolio = StocksPortfolio::Create([
    		'stock_id'=>$stock->id,
    		'portfolio_id'=>$portfolio->id,
    		'quantity_held'=>0
    	]);

    	$trade = Trade::create([
    		'stocks_portfolio_id'=>$stocks_portfolio->id,
    		'quantity'=>10,
    		'price'=>100,
    	]);

    	$trade = Trade::create([
    		'stocks_portfolio_id'=>$stocks_portfolio->id,
    		'quantity'=>-5,
    		'price'=>100,
    	]);


    	$stocks_portfolio = $user->portfolios[0]->stocks_portfolios[0];

    	$this->assertEquals(5, $stocks_portfolio->quantity_held);   	
    }


    public static function tearDownAfterClass()
    {
    	echo("\nDeleting all that was added to database...\n");
    	User::query('SET FOREIGN_KEY_CHECKS=0;');
        Portfolio::delete_all();
        User::delete_all();
        Trade::delete_all();
        User::query('SET FOREIGN_KEY_CHECKS=1;');
    }
}