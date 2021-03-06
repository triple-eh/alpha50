import os, sys, inspect
currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0,parentdir)

from orator import Model
from config import db
from orator.orm import belongs_to, scope
import numbers
import arrow

Model.set_connection_resolver(db)

class HalfHourlyQuote(Model):

    __fillable__ = ['datetime', 'price', 'stock_id']
    __dates__ = ['datetime']
    __timestamps__ = False

    @belongs_to
    def stock(self):
        import models.stock 
        return models.stock.Stock

    @staticmethod
    def is_valid_datetime(datetime):
        try:
            valid = datetime and isinstance(datetime, arrow.Arrow) and \
                datetime > arrow.get('2008-12-31', 'YYYY-MM-DD').to('PST') and \
                datetime < arrow.now().replace(minutes = +5)
        except:
            valid = datetime and isinstance(datetime, arrow.Arrow) and \
                datetime > arrow.get('2008-12-31', 'YYYY-MM-DD').to('US/Pacific') and \
                datetime < arrow.now().replace(minutes = +5)
        return True if valid else False

    @staticmethod
    def is_valid_price(price):
        valid = isinstance(price, numbers.Number)
        return True if valid else False

    @scope
    def older(self, query):
        def query_older(tz):
            return query.where('datetime', '<', arrow.now().to(tz).replace(days = -5).format('YYYY-MM-DDTHH:mm:ss')).order_by('datetime', 'asc')
        try:
            return query_older('PST')
        except:
            return query_older('US/Pacific')

    def is_valid(self):
        return HalfHourlyQuote.is_valid_price(self.price) and \
               HalfHourlyQuote.is_valid_datetime(self.datetime)

    def is_new_range(self):
        try:
            count = HalfHourlyQuote.where_between('datetime', [arrow.now().to('PST').replace(minutes = -30), arrow.now().to('PST').replace(minutes = +30)]).count() 
        except:
            count = HalfHourlyQuote.where_between('datetime', [arrow.now().to('US/Pacific').replace(minutes = -30), arrow.now().to('US/Pacific').replace(minutes = +30)]).count() 
        return True if (count > 0) else False

    def is_unique(self):
        count = HalfHourlyQuote.where('stock_id', self.stock_id).where('datetime', self.datetime.format('YYYY-MM-DDTHH:mm:ss')).count()
        return True if (count == 0) else False

    def update_stock(self):
        import models.stock 
        stock = models.stock.Stock.find(self.stock_id)
        latest_quote = stock.half_hourly_quotes().order_by('datetime', 'desc').first()
        if (not latest_quote) or (latest_quote.datetime < self.datetime):
            stock.latest_price = self.price
            stock.save()
        return True

HalfHourlyQuote.creating(lambda half_hourly_quote: half_hourly_quote.is_unique())
HalfHourlyQuote.saving(lambda half_hourly_quote: half_hourly_quote.is_valid() and half_hourly_quote.update_stock())
