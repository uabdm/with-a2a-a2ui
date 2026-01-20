export const A2UI_SCHEMA = {
    "title": "A2UI Message Schema",
    "description": "Describes a JSON payload for an A2UI (Agent to UI) message, which is used to dynamically construct and update user interfaces. A message MUST contain exactly ONE of the action properties: 'beginRendering', 'surfaceUpdate', 'dataModelUpdate', or 'deleteSurface'.",
    "type": "object",
    "properties": {
        "beginRendering": {
            "type": "object",
            "description": "Signals the client to begin rendering a surface with a root component and specific styles.",
            "properties": {
                "surfaceId": {
                    "type": "string",
                    "description": "The unique identifier for the UI surface to be rendered."
                },
                "root": {
                    "type": "string",
                    "description": "The ID of the root component to render."
                },
                "styles": {
                    "type": "object",
                    "description": "Styling information for the UI.",
                    "properties": {
                        "font": {
                            "type": "string",
                            "description": "The primary font for the UI."
                        },
                        "primaryColor": {
                            "type": "string",
                            "description": "The primary UI color as a hexadecimal code (e.g., '#00BFFF').",
                            "pattern": "^#[0-9a-fA-F]{6}$"
                        }
                    }
                }
            },
            "required": ["root", "surfaceId"]
        },
        "surfaceUpdate": {
            "type": "object",
            "description": "Updates a surface with a new set of components.",
            "properties": {
                "surfaceId": {
                    "type": "string",
                    "description": "The unique identifier for the UI surface to be updated. If you are adding a new surface this *must* be a new, unique identified that has never been used for any existing surfaces shown."
                },
                "components": {
                    "type": "array",
                    "description": "A list containing all UI components for the surface.",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "description": "Represents a *single* component in a UI widget tree. This component could be one of many supported types.",
                        "properties": {
                            "id": {
                                "type": "string",
                                "description": "The unique identifier for this component."
                            },
                            "weight": {
                                "type": "number",
                                "description": "The relative weight of this component within a Row or Column. This corresponds to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
                            },
                            "component": {
                                "type": "object",
                                "description": "A wrapper object that MUST contain exactly one key, which is the name of the component type (e.g., 'Heading'). The value is an object containing the properties for that specific component.",
                                "properties": {
                                    "Text": {
                                        "type": "object",
                                        "properties": {
                                            "text": {
                                                "type": "object",
                                                "description": "The text content to display.",
                                                "properties": {
                                                    "literalString": { "type": "string" },
                                                    "path": { "type": "string" }
                                                }
                                            },
                                            "usageHint": {
                                                "type": "string",
                                                "enum": ["h1", "h2", "h3", "h4", "h5", "caption", "body"]
                                            }
                                        },
                                        "required": ["text"]
                                    },
                                    "Row": {
                                        "type": "object",
                                        "properties": {
                                            "children": {
                                                "type": "object",
                                                "properties": {
                                                    "explicitList": { "type": "array", "items": { "type": "string" } }
                                                }
                                            }
                                        }
                                    },
                                    "Column": {
                                        "type": "object",
                                        "properties": {
                                            "children": {
                                                "type": "object",
                                                "properties": {
                                                    "explicitList": { "type": "array", "items": { "type": "string" } }
                                                }
                                            }
                                        }
                                    },
                                    "Button": {
                                        "type": "object",
                                        "properties": {
                                            "child": { "type": "string" },
                                            "action": {
                                                "type": "object",
                                                "properties": {
                                                    "name": { "type": "string" }
                                                }
                                            }
                                        }
                                    },
                                    "Card": {
                                        "type": "object",
                                        "properties": {
                                            "child": { "type": "string" }
                                        }
                                    },
                                    "AppList": {
                                        "type": "object",
                                        "description": "A list of applications (e.g. Asana, Zoom).",
                                        "properties": {
                                            "apps": { "type": "array", "items": { "type": "string" } }
                                        },
                                        "required": ["apps"]
                                    },
                                    "NewsFeed": {
                                        "type": "object",
                                        "description": "A feed of university news.",
                                        "properties": {
                                            "category": { "type": "string" }
                                        },
                                        "required": ["category"]
                                    }
                                }
                            }
                        },
                        "required": ["id", "component"]
                    }
                }
            },
            "required": ["surfaceId", "components"]
        }
    }
};
