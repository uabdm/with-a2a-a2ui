// A2UI compliant schema for UI rendering
// This schema defines the structure for surfaceUpdate payloads used with @copilotkit/a2ui-renderer
export const A2UI_SCHEMA = {
    type: "object",
    properties: {
        surfaceUpdate: {
            type: "object",
            description: "The A2UI surface update containing components to render",
            properties: {
                surfaceId: {
                    type: "string",
                    description: "Unique identifier for the UI surface"
                },
                components: {
                    type: "array",
                    description: "Array of A2UI components to render",
                    minItems: 1,
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "Unique component identifier"
                            },
                            component: {
                                type: "object",
                                description: "Component definition - must contain exactly one component type",
                                oneOf: [
                                    {
                                        type: "object",
                                        properties: {
                                            Text: {
                                                type: "object",
                                                properties: {
                                                    text: {
                                                        type: "object",
                                                        properties: {
                                                            literalString: { type: "string" },
                                                            path: { type: "string" }
                                                        }
                                                    },
                                                    usageHint: {
                                                        type: "string",
                                                        enum: ["h1", "h2", "h3", "h4", "h5", "h6", "caption", "body"]
                                                    }
                                                },
                                                required: ["text"]
                                            }
                                        }
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            Button: {
                                                type: "object",
                                                properties: {
                                                    child: { type: "string" },
                                                    action: {
                                                        type: "object",
                                                        properties: {
                                                            name: { type: "string" }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            Card: {
                                                type: "object",
                                                properties: {
                                                    child: { type: "string" }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            Row: {
                                                type: "object",
                                                properties: {
                                                    children: {
                                                        type: "object",
                                                        properties: {
                                                            explicitList: {
                                                                type: "array",
                                                                items: { type: "string" }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            Column: {
                                                type: "object",
                                                properties: {
                                                    children: {
                                                        type: "object",
                                                        properties: {
                                                            explicitList: {
                                                                type: "array",
                                                                items: { type: "string" }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            List: {
                                                type: "object",
                                                properties: {
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            explicitList: {
                                                                type: "array",
                                                                items: { type: "string" }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        required: ["id", "component"]
                    }
                }
            },
            required: ["surfaceId", "components"]
        }
    }
};
