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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const MarsRoverPhotoes = () => {

  // State variables
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");
  const [snackMessage, setSnackMessage] = useState("");
  const [rover, setRover] = useState(false);
  const apiKey = import.meta.env.VITE_NASA_API_KEY;
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // State for storing fetched pictures, initialized from localStorage
  const [pictures, setPictures] = useState(() => {
    // Try to load the picture from localStorage
    const savedPicture = localStorage.getItem('MarsRoverPhotoes');
    return savedPicture ? JSON.parse(savedPicture) : [];
  });

  // Effect hook to save pictures to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('MarsRoverPhotoes', JSON.stringify(pictures));
  }, [pictures]);

  // Styled Paper component
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  // Clear localStorage and reset pictures
  const clearStorage = () => {
    localStorage.removeItem('MarsRoverPhotoes');
    setPictures([]);
  };

  // Fetch pictures from NASA API
  const fetchPictures= async () => {
    if (date && rover) {
      const today = new Date();
      const june16_1995 = new Date('1995-06-16');
      const selectedDate = new Date(date);

      // Check if the selected date is valid
      if (selectedDate >= june16_1995 && selectedDate <= today) {
        try {
          // Fetch pictures from NASA API
          const response = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${apiKey}`);
          // Update state with fetched pictures
          setPictures(response.data.photos);
          // Show Snackbar if no pictures found
          if(response.data.photos.length === 0){
            setSnackMessage("No Pictures Captured in the Selected Day")
            setOpenSnackbar(true);
          }
        } catch (error) {
          setError(error);
        }
      } else {
        // Show Snackbar for invalid date
        setSnackMessage("Please Select a Valid Date")
        setOpenSnackbar(true);
      }
    }else{
      // Show Snackbar if date or rover is not selected
      setSnackMessage("Please Select a Date and a Rover")
      setOpenSnackbar(true);
    }
  };

  // Event handler for closing Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Event handler for date input change
  const handleDateChange = (e) => {
    const { value } = e.target;
    setDate(value);
  };

  // Event handler for rover selection change
  const handleRoverChange = (e) => {
    const { value } = e.target;
    setRover(value);
  };
  return (
    <div>
    <div className="bodyContent">  
     
      <Box sx={{ flexGrow: 1}}>   
      <Item>
        <Grid container spacing={7}>
          <Grid item xs={4}>
           
              <label className='datebtnContainer' htmlFor="startDate">Select from Earth Date:</label>
                  <input
                    style={{marginTop:"10px", paddingLeft:"10px", marginLeft:"10px"}} 
                    type="date"
                    id="date"
                    name="Date"
                    value={date}
                    onChange={handleDateChange}/> 
          </Grid>

          <Grid item xs={4}>
           
              <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    defaultValue="curiosity"
                    name="radio-buttons-group"
                    value={rover}
                    onChange={handleRoverChange}
                  >
                    <FormControlLabel value="curiosity" control={<Radio />} label="Curiosity" />
                    <FormControlLabel value="opportunity" control={<Radio />} label="Opportunity" />
                    <FormControlLabel value="spirit" control={<Radio />} label="Spirit" />
                  </RadioGroup>
              </FormControl>
           
          </Grid>

          <Grid item xs={2}>
                <Button variant="contained" 
                  onClick={() => fetchPictures()}>Get the Pictures
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

      <Snackbar 
          open={openSnackbar} 
          handleClose={handleCloseSnackbar} 
          message= {snackMessage}
      />

      <ImageList variant="masonry" cols={3} gap={8}>
        {pictures.map((item) => (
          <ImageListItem key={item.id}>
            <img
              srcSet={`${item.img_src}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img_src}?w=248&fit=crop&auto=format`}
              alt={item.id}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>

      </div>
    </div>
  )
}

export default MarsRoverPhotoes