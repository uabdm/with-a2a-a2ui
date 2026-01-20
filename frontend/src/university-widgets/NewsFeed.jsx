import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Box } from '@mui/material';
import { Newspaper } from 'lucide-react';

export const NewsFeed = ({ category }) => {
    const newsItems = [
        { title: "University Research Grant Approved", date: "2 hours ago", tag: "Research" },
        { title: "Campus Coffee Shop New Hours", date: "5 hours ago", tag: "Campus" },
        { title: "Guest Lecture: AI in Education", date: "Yesterday", tag: "Events" }
    ];

    return (
        <Card variant="elevation">
            <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                    <Newspaper size={20} /> Latest News: {category || "General"}
                </Typography>
                <List>
                    {newsItems.map((item, idx) => (
                        <ListItem key={idx} divider={idx !== newsItems.length - 1}>
                            <ListItemText
                                primary={item.title}
                                secondary={item.date}
                            />
                            <Chip label={item.tag} size="small" color="primary" variant="outlined" />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};
