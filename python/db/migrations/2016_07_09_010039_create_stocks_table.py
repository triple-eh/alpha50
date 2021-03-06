from orator.migrations import Migration


class CreateStocksTable(Migration):

    def up(self):
        """
        Run the migrations.
        """
        with self.schema.create('stocks') as table:
            table.increments('id')
            table.text('ticker')
            table.text('sector')
            table.float('market_cap')
            table.string('name')
            table.float('latest_price').nullable()

    def down(self):
        """
        Revert the migrations.
        """
        self.schema.drop('stocks')
