from sqlalchemy import event

from models.user import User
from models.admin import Admin
from models.consumer import Consumer
from models.hawker import Hawker
from models.review import Review
from models.stall import Stall
from models.dish import Dish
from models.promotion import Promotion
from models.hawkerCenter import HawkerCenter
from models.likeStall import LikeStall

from .seed_data import DATABASE_SEED_DATA


# This method receives a table, a connection and inserts data to that table.
def seed_table(target, connection, **kw):
    tablename = str(target)
    if tablename in DATABASE_SEED_DATA and len(DATABASE_SEED_DATA[tablename]) > 0:
        connection.execute(target.insert(), DATABASE_SEED_DATA[tablename])


def add_event_listener_to_seed_database():
    event.listen(User.__table__, "after_create", seed_table)
    event.listen(Admin.__table__, "after_create", seed_table)
    event.listen(Consumer.__table__, "after_create", seed_table)
    event.listen(Hawker.__table__, "after_create", seed_table)
    event.listen(HawkerCenter.__table__, "after_create", seed_table)
    event.listen(Review.__table__, "after_create", seed_table)
    event.listen(Stall.__table__, "after_create", seed_table)
    event.listen(Dish.__table__, "after_create", seed_table)
    event.listen(Promotion.__table__, "after_create", seed_table)
    event.listen(LikeStall.__table__, "after_create", seed_table)

