import React from 'react';
import { Button, Grid } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';


export const ItemsDrawer = ( {openItems, handleDrawerClose} ) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        setOpen(openItems);
    }, [openItems]);

    const theme = useTheme();

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    return (

        <>
            <Grid>
                <Drawer
                    sx={{
                        width: window.innerWidth/6,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                        width: window.innerWidth/6,
                        boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader onClick={handleDrawerClose} className='drawer-header'>
                        <ChevronLeftIcon />
                    </DrawerHeader>
                    <Divider />
                </Drawer>
            </Grid>
            
        </>

    );
}