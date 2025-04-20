from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class CSSMessageDB(Base):
    __tablename__ = 'css_messages' 
    
  
    css_message_id = Column(String, primary_key=True, index=True)
    css_history_id = Column(String)
    sender_user_id = Column(String)
    receiver_user_id = Column(String)
    text = Column(String)
    datetime = Column(String)

