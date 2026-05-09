from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class DBAttackSession(Base):
    __tablename__ = "attack_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime, default=datetime.utcnow)
    model_id = Column(String)
    status = Column(String)  # e.g., "COMPLETED", "FAILED", "RUNNING"
    
    # Relationships
    attacks = relationship("DBAttackHistory", back_populates="session")

class DBAttackHistory(Base):
    __tablename__ = "attack_history"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("attack_sessions.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    attack_type = Column(String)
    payload = Column(Text)
    raw_response = Column(Text)
    
    # Analysis Metrics
    security_score = Column(Integer)
    vulnerability_rating = Column(String)
    hallucination_risk = Column(String)
    compliance_score = Column(Integer)
    
    # Store agent verdicts as JSON
    agent_verdicts = Column(JSON)
    
    # Relationships
    session = relationship("DBAttackSession", back_populates="attacks")

class DBModelBenchmark(Base):
    __tablename__ = "model_benchmarks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    model_id = Column(String)
    provider = Column(String)
    avg_security_score = Column(Float)
    avg_latency = Column(Float)
    trust_score = Column(Float)
    last_updated = Column(DateTime, default=datetime.utcnow)
