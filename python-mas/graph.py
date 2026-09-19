from langgraph.graph import StateGraph, START, END
from state import AgentState
from agents import (
    router_agent,
    form_assistant_agent,
    underwriting_agent,
    memory_agent,
    general_agent
)

def route_next(state: AgentState) -> str:
    intent = state.get("intent")
    print(f"🔀 Routing to intent: {intent}")
    if intent == "FORM_ASSISTANCE":
        return "form_assistant"
    elif intent == "UNDERWRITING":
        return "underwriting"
    elif intent == "MEMORY":
        return "memory"
    else:
        return "general"

# Build the graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("router", router_agent)
workflow.add_node("form_assistant", form_assistant_agent)
workflow.add_node("underwriting", underwriting_agent)
workflow.add_node("memory", memory_agent)
workflow.add_node("general", general_agent)

# Add edges
workflow.add_edge(START, "router")

workflow.add_conditional_edges(
    "router",
    route_next,
    {
        "form_assistant": "form_assistant",
        "underwriting": "underwriting",
        "memory": "memory",
        "general": "general"
    }
)

workflow.add_edge("form_assistant", END)
workflow.add_edge("underwriting", END)
workflow.add_edge("memory", END)
workflow.add_edge("general", END)

# Compile graph
mas_graph = workflow.compile()
