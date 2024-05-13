import {React, useState ,useEffect} from "react";
import axios  from "axios";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Snackbar from '../components/snackbar.jsx';
import ImageListItemBar from '@mui/material/ImageListItemBar';


// Define the HomePage component
const HomePage = () => {
  // State variables
  const [date, setDate] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [pictures, setPictures] = useState(() => {
    // Try to load the picture from localStorage
    const savedPicture = localStorage.getItem('EPICPhotoes');
    return savedPicture ? JSON.parse(savedPicture) : [];
  });

  // Effect hook to save pictures to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('EPICPhotoes', JSON.stringify(pictures));
  }, [pictures]);

  // Styling for Paper component
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  // Fetch pictures on component mount (currently commented out)
  useEffect(() => {
    //fetchPictures()
  }, []);

  // Event handler for date input change
  const handleDateChange = (e) => {
    const { value } = e.target;
    setDate(value);
  };

  // Event handler for closing Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Fetch pictures from NASA API
  const fetchPictures = async () => {
    if(date){
      try {
        const selectedDate = new Date(date);
        const response = await axios.get(`https://epic.gsfc.nasa.gov/api/enhanced/date/${date}`);
        const data = response.data;
        if(data.length === 0){
          setSnackMessage("No Pictures Captured in the Selected Day")
          setOpenSnackbar(true);
        }
        const pictureData = data.map(item => {
          const name = item.image + '.png'; // Construct the image name
          const year = selectedDate.getFullYear(); // Get the year from the date
          const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Get the month from the date
          const day = String(selectedDate.getDate()).padStart(2, '0'); // Get the day from the date
          const archiveUrl = `https://epic.gsfc.nasa.gov/archive/enhanced/${year}/${month}/${day}/png/`; // Construct the archive URL
          const imageUrl = archiveUrl + name; // Combine the archive URL with the image name
          return {
            imageUrl,
            latitude: item.centroid_coordinates.lat,
            longitude: item.centroid_coordinates.lon,
            identifier : item.identifier
          };
        });
        setPictures(pictureData);
      } catch (error) {
        setSnackMessage("No Pictures Captured in the Selected Day")
        setOpenSnackbar(true);
        console.error('Error fetching pictures:', error);
      }
    }else{
      setSnackMessage("Please Select a Valid Date")
      setOpenSnackbar(true);
    }
  };

  // Clear localStorage and reset pictures
  const clearStorage = () => {
    localStorage.removeItem('EPICPhotoes');
    setPictures([]);
  };

  return (
    <div>
      <div className="bodyContent">
        {/* {pictures.map((picture, index) => (
            <img key={index} src={picture} alt={`NASA EPIC Picture ${index}`} />
          ))}
 */}
      <Snackbar 
          open={openSnackbar} 
          handleClose={handleCloseSnackbar} 
          message= {snackMessage}
      />

        <Box sx={{  textAlign:"center"}}>   
          <Item> 
            <Grid container spacing={0}>
              <Grid item xs={8}>
                  <label className='datebtnContainer' htmlFor="startDate">Pick a Date:</label>
                      <input
                        style={{marginTop:"10px", paddingLeft:"10px", marginLeft:"10px"}} 
                        type="date"
                        id="date"
                        name="Date"
                        value={date}
                        onChange={handleDateChange}/>
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" 
                  onClick={() => fetchPictures()}>Get the Pictures from Archive
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button variant="contained" 
                  onClick={() => clearStorage()}>CLEAR
                </Button>
              </Grid>
            </Grid>   
          </Item>  
          </Box>

        <ImageList variant="masonry" cols={3} gap={8}>
          {pictures.map((item,index) => (
            <ImageListItem key={index}>
              <img
                srcSet={`${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.imageUrl}?w=248&fit=crop&auto=format`}
                loading="lazy"
                title={`${item.latitude} ${item.longitude}`} 
              />
              
            <Paper>
              <ImageListItemBar
                  title={`${item.latitude} ${item.longitude}`} 
                  subtitle={<span> {item.identifier}</span>}
                  position="below"
                  style={{textAlign:"center"}}/>
              </Paper>
            </ImageListItem>
            ))}
          </ImageList>
      
      </div>
     </div>
  )
}

export default HomePage