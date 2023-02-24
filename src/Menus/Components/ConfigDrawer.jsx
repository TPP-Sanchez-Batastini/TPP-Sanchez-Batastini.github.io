import React from 'react';
import { Button, Grid } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


export const ConfigDrawer = ( {openConfigs, handleDrawerClose} ) => {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();

    React.useEffect(() => {
        setOpen(openConfigs);
    }, [openConfigs]);

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        width:'100%',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
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
                    anchor="right"
                    open={open}
                >
                    <DrawerHeader className='drawer-header' onClick={handleDrawerClose}>
                        <ChevronRightIcon />
                        <div style={{width:"100%"}}>
                            <h3 style={{textAlign:"right", paddingRight:30}}>Configurations</h3>
                        </div>
                    </DrawerHeader>
                    <Divider />
                </Drawer>
            </Grid>
        </>
    );
}