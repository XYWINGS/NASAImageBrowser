import Card from '../components/card.jsx'
import {React, useState ,useEffect ,Component } from "react";
import axios  from "axios";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Snackbar from '../components/snackbar.jsx';

const PictureOftheDay = () => {

  // State variables
  const [pictureOfTheDay, setPictureOfTheDay] = useState(() => {
    // Try to load the picture from localStorage
    const savedPicture = localStorage.getItem('pictureOfTheDay');
    return savedPicture ? JSON.parse(savedPicture) : [];
  });
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");
  const apiKey = import.meta.env.VITE_NASA_API_KEY;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  // Styled Paper component
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  // Clear localStorage and reset pictureOfTheDay
  const clearStorage = () => {
    localStorage.removeItem('pictureOfTheDay');
    setPictureOfTheDay([]);
  };

  // Event handler for closing Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Fetch picture of the day on component mount
  useEffect(() => {
    fetchPictureOfTheDay()
  }, []);

  // Effect hook to save pictureOfTheDay to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('pictureOfTheDay', JSON.stringify(pictureOfTheDay));
  }, [pictureOfTheDay]);

  // Function to fetch picture of the day from NASA API
  const fetchPictureOfTheDay = async () => {
    if (date) {
      const today = new Date();
      const june16_1995 = new Date('1995-06-16');
      const selectedDate = new Date(date);

      // Check if the selected date is valid
      if (selectedDate >= june16_1995 && selectedDate <= today) {
        try {
          // Fetch picture of the day for the selected date
          const response = await axios.get(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`);
          setPictureOfTheDay(response.data);
        } catch (error) {
          setSnackMessage("An Error Occured While Getting the Picture")
          setOpenSnackbar(true);
          setError(error);
        }
      } else {
        // Show Snackbar for invalid date
        setSnackMessage("Date must be between today and 1995-06-16")
        setOpenSnackbar(true);
      }
    } else {
      // Fetch picture of the day for today if no date is selected
      try {
        setSnackMessage("Getting the Picture of the Day")
        setOpenSnackbar(true);
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
        setPictureOfTheDay(response.data);
      } catch (error) {
        setError(error);
      }
    }
  };

  // Event handler for date input change
  const handleDateChange = (e) => {
    const { value } = e.target;
    setDate(value);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="bodyContent">
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
                    onClick={() => fetchPictureOfTheDay()}>Get the Picture from the Archive
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
        <Card title = {pictureOfTheDay.title} description= {pictureOfTheDay.explanation} url= {pictureOfTheDay.url}/> 
      </div>
    </div>
  )
}

export default PictureOftheDay