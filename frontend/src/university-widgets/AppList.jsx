import React from 'react';
import { Card, CardContent, Typography, Grid, Chip, Box } from '@mui/material';
import { LayoutGrid, CheckCircle } from 'lucide-react';

export const AppList = ({ apps }) => {
    // apps is usually an array of strings like ["Asana", "Zoom"]
    // We can map these to pretty cards

    const appData = {
        "Asana": { color: "#F06A6A", icon: "A" },
        "Zoom": { color: "#2D8CFF", icon: "Z" },
        "Box": { color: "#0061D5", icon: "B" },
        "Oracle": { color: "#C74634", icon: "O" },
        "Qualtrics": { color: "#00B4EF", icon: "Q" },
        "Canvas": { color: "#E72429", icon: "C" }
    };

    const list = apps || Object.keys(appData);

    return (
        <Box>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <LayoutGrid size={20} /> University Applications
            </Typography>
            <Grid container spacing={2}>
                {list.map((appName) => (
                    <Grid item xs={6} sm={4} md={3} key={appName}>
                        <Card variant="outlined" sx={{ '&:hover': { borderColor: 'primary.main', cursor: 'pointer' } }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: appData[appName]?.color || 'grey.300',
                                        borderRadius: 2,
                                        mx: 'auto',
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: 24,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {appData[appName]?.icon || appName[0]}
                                </Box>
                                <Typography variant="subtitle2">{appName}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
