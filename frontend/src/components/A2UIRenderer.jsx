import React from 'react';
import { Box, Button, Typography, Card, Grid, Divider } from '@mui/material';
import { AppList } from '../university-widgets/AppList';
import { NewsFeed } from '../university-widgets/NewsFeed';

// Component Registry
const COMPONENT_MAP = {
    // Primitives
    Box: Box,
    Text: ({ text, usageHint }) => {
        const variantMap = {
            h1: 'h3', // h1 is too big usually
            h2: 'h4',
            h3: 'h5',
            h4: 'h6',
            h5: 'subtitle1',
            caption: 'caption',
            body: 'body1'
        };
        const content = typeof text === 'object' ? (text.literalString || "Dynamic Text") : text;
        return <Typography variant={variantMap[usageHint] || 'body1'}>{content}</Typography>;
    },
    Button: ({ child, action, label }) => ( // 'label' might be passed directly or via 'child'
        <Button variant="contained" onClick={() => console.log("Action:", action)}>
            {/* If there is a child ID, we'd need to look it up, but for simplicity we might assume text props here for the demo or simple children */}
            {label || "Button"}
        </Button>
    ),
    Card: ({ child, children }) => (
        <Card sx={{ p: 2 }}>{child || children}</Card>
    ),

    // Layouts
    Row: ({ children }) => <Box display="flex" flexDirection="row" gap={2} alignItems="center">{children}</Box>,
    Column: ({ children }) => <Box display="flex" flexDirection="column" gap={2}>{children}</Box>,

    // Domain Specific
    AppList: AppList,
    NewsFeed: NewsFeed
};

// Recursive Renderer
const renderNode = (node) => {
    if (!node) return null;
    // If we have a surfaceUpdate structure (from the root), we might need to find the root component.
    // But for the 'render_ui' action, we might just get the component tree directly if we design the tool that way.
    // Let's assume the tool returns a 'surfaceUpdate' object or a 'component' object.

    // Checking for A2UI structure
    if (node.component) {
        const type = Object.keys(node.component)[0];
        const props = node.component[type];
        const Component = COMPONENT_MAP[type];

        if (!Component) return <Typography color="error">Unknown Component: {type}</Typography>;

        // Resolve children
        let children = null;
        if (props.children) {
            if (props.children.explicitList) {
                // In a real A2UI, these are IDs referencing a flat list of components.
                // For this simplified Node.js demo, we might want to support nested structures 
                // OR implement the flat list lookup.
                // Let's assume nested for simplicity of the prompt, OR we implement the lookup if we have the full 'components' array context.

                // If we are strictly following A2UI, we need the context of all components.
                // Let's accept 'componentsMap' as a second argument.
            }
        }

        // ... WAIT. The standard A2UI is flat list + references.
        // To make it easier for the "Node.js demo", let's ask the LLM to output a NESTED tree 
        // instead of a flat list, OR we handle the flat list. 
        // Handling flat list is more robust.

        return <Component {...props} />;
    }

    return null;
};

// We need a wrapper to handle the Flat List -> Tree conversion if we stick to strict A2UI.
// Or we can just build a "Smart Renderer" that takes the 'surfaceUpdate' payload.
export const A2UIRenderer = ({ uiJson }) => {
    if (!uiJson) return null;

    // Handle "surfaceUpdate" payload
    if (uiJson.surfaceUpdate) {
        const { components } = uiJson.surfaceUpdate;
        // Convert array to map
        const componentMap = components.reduce((acc, c) => {
            acc[c.id] = c;
            return acc;
        }, {});

        // Recursive helper with map context
        const renderRecursive = (componentId) => {
            const node = componentMap[componentId];
            if (!node) return null;

            const type = Object.keys(node.component)[0];
            const props = node.component[type];
            const Component = COMPONENT_MAP[type];

            if (!Component) return <Typography color="error">Unknown: {type}</Typography>;

            const renderedProps = { ...props };

            // Handle Children
            if (props.children && props.children.explicitList) {
                renderedProps.children = props.children.explicitList.map(id => (
                    <React.Fragment key={id}>{renderRecursive(id)}</React.Fragment>
                ));
            }
            if (props.child) {
                renderedProps.children = renderRecursive(props.child);
            }
            // Handle other props like 'tabItems' containing references to children
            if (props.tabItems) {
                // ... implementation detail ...
            }

            return <Component {...renderedProps} />;
        };

        // We need a root to start. Usually 'surfaceUpdate' doesn't specify root, 'beginRendering' does.
        // But for upgrades, we might just render all roots? No, that's messy.
        // Let's assume the FIRST component is the root for this demo, or look for a specific ID.
        const rootId = components[0]?.id;
        return <div className="a2ui-surface">{renderRecursive(rootId)}</div>;
    }

    return <div>Invalid UI Data</div>;
};
