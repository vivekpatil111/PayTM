from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    """
    State dictionary for the LangGraph workflow.
    `Annotated[str, operator.add]` can be used if you want to append values, 
    but here we mostly overwrite them just like the JS version.
    """
    message: str
    language: str
    formContext: str
    intent: str
    finalReply: str
