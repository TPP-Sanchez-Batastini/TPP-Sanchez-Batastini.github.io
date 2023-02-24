import React from 'react';
import { Grid } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { ItemsContext } from '../LevelEditorContext/ItemsContext';


const allUnselected = {
    "cone": null,
    "trapecio": null,
    "street": null
};


export const ItemsDrawer = ( {openItems, handleDrawerClose} ) => {
    
    const [open, setOpen] = React.useState(false);
    const {setLastSelectedItem, lastSelectedItem} = React.useContext(ItemsContext);

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

    const [itemSelected, setItemSelected] = React.useState(allUnselected);


    const handleSelection = (item) => {
        const dictSelection = {...allUnselected};
        dictSelection[item] = "selected";
        setItemSelected(dictSelection);
        setLastSelectedItem({
            selectedItem: item,
            scale: 1.0,
            positionX: 0.0,
            positionY: 0.0,
            zIndex: lastSelectedItem ? lastSelectedItem.zIndex + 1 : 1
        });
    }

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
                        <div style={{width:"100%"}}>
                            <h3 style={{textAlign:"left", paddingLeft:10}}>Items</h3>
                        </div>
                        <ChevronLeftIcon />
                    </DrawerHeader>
                    <Divider />
                    <Grid style={{justifyContent: "center", display: "flex", alignItems:"center", flexDirection:"column"}}>
                        {
                            Object.entries(itemSelected).map(([nameItem, isSelected]) => {
                                return (
                                    <img 
                                        key={nameItem}
                                        src={`${nameItem}.png`} 
                                        width={75}
                                        height={75} 
                                        className={`imageLevelEditor ${isSelected}`} 
                                        onClick={() => handleSelection(nameItem)}
                                    />
                                );
                            })
                        }
                    </Grid>
                </Drawer>
            </Grid>
            
        </>

    );
}