<div class="row">
  <?php render_file('/portfolios/stock-side-bar.php'); ?>

  <div class="portfolio-section col s12 m10 l10">

    <div class="container new-portfolio">
      <div class='new-portfolio-overview'>
        <h5>My Awesome Portoflio</h5>
        <p> Instructions </p>
        <p><strong>Cash: </strong><span class='cash-holdings'></span></p>
        <p><strong>Allocated Capital: </strong><span class='equity-holdings'></span></p>
      </div>

      <div class='new-portfolio-data'>
        <table class='bordered'>
          <thead>
            <tr>
              <th data-field="stock-ticker">Ticker</th>
              <th data-field="stock-name">Company Name</th>
              <th data-field="stock-price">Price</th>
              <th data-field="number-of-shares">Number of Shares</th>
              <th data-field="total-value">Value ($)</th>
              <th data-field="pct-of-total">% of Total ($)</th>
            </tr>
            <?php $portfolio_info = Spark\locals()['portfolio_info'] ?>
            <?php $index_value = Spark\locals()['index_value'] ?>
            <?php $startingCapital = 1000000 ?>
            <form id='create-portfolio' method='GET' action='/portfoliossss'></form>
            <tbody>
              <?php foreach($portfolio_info as $stock): ?>
              <?php $pct_weight = $stock->stock_value / $index_value ?>
              <?php $number_of_shares = floor($startingCapital * $pct_weight / $stock->latest_price) ?>
                <tr> 
                  <td class='stock-ticker'>
                    <input form='create-portfolio' type='text' name='ticker' value='<?= $stock->ticker ?>' readonly>
                  </td>
                  <td class='stock-name'><?php echo $stock->name ?></td>
                  <td class='stock-price'>
                    <input form='create-portfolio' type='number' name='price' value='<?= $stock->latest_price ?>' readonly>
                  </td>
                  <td class='number-of-shares'>
                    <input form='create-portfolio' type='number' name='tradeQ' value='<?= $number_of_shares ?>'>
                  </td>
                  <td class='total-value'>
                    <input form='create-portfolio' type='number' value='' readonly>
                  </td>
                  <td><?= $pct_weight ?></td>
                </tr>
              <?php endforeach ; ?>    
            </tbody>
          </thead>
        </table>
        <button form='create-portfolio' class='btn create-portfolio-btn'>Create Portfolio</button>
      </div>
      </div>
  </div>
</div>

</div>

<?php 

render_file('/layouts/preloader.php');
load_template('/stock_sidebar.hbs');
