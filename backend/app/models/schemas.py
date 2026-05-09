from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class AttackRequest(BaseModel):
    model_id: str
    attack_type: str
    payload: str

class AgentVerdict(BaseModel):
    agent_name: str
    verdict: str  # e.g., "PASS", "FAIL", "WARNING"
    confidence: float
    reasoning: str

class SecurityAnalysis(BaseModel):
    security_score: int
    vulnerability_rating: str  # e.g., "Low", "Medium", "High", "Critical"
    hallucination_risk: str
    compliance_score: int
    agent_verdicts: List[AgentVerdict]

class AttackResponse(BaseModel):
    id: str
    timestamp: datetime
    model_id: str
    attack_type: str
    status: str  # "Success", "Failed"
    raw_response: str
    analysis: SecurityAnalysis

class ModelStatus(BaseModel):
    model_id: str
    provider: str
    status: str  # "Online", "Offline", "Degraded"
    latency: float
    risk_level: str  # "Low", "Medium", "High"
