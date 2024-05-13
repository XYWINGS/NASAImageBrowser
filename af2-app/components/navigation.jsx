import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);
  return (
    <Box sx={{ alignContent:"center" , textAlign:"center"}}>
    
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
      <BottomNavigationAction label="EPIC Images" icon={<RestoreIcon />} component={Link} to="/epicpictures" />
      <BottomNavigationAction label="Picture Of the Day" icon={<FavoriteIcon />} component={Link} to="/pictureoftheday" />
      <BottomNavigationAction label="Mars Images" icon={<LocationOnIcon />} component={Link} to="/marsroverpictures" />
        {/* <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} /> */}  
      </BottomNavigation>
     
    </Box>
  );
}