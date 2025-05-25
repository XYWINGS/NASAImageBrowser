import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Paper,
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
  TextField,
  Container,
  Fade,
  Skeleton,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  Badge
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  CalendarToday,
  Search,
  Clear,
  Explore,
  Camera,
  Fullscreen,
  Info
} from '@mui/icons-material';
import Snackbar from '../components/snackbar.jsx';

// Animations
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Enhanced styled components
const MarsContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(135deg, #d2691e 0%, #8b0000 50%, #000000 100%)',
  minHeight: '100vh',
  padding: theme.spacing(4, 2),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(255,69,0,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,140,0,0.1) 0%, transparent 50%)',
    pointerEvents: 'none'
  }
}));

const MarsGlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(139, 0, 0, 0.2)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 69, 0, 0.3)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(139, 0, 0, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(139, 0, 0, 0.4)'
  }
}));

const MarsTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  textAlign: 'center',
  marginBottom: theme.spacing(1),
  letterSpacing: '0.02em'
}));

const RoverCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 69, 0, 0.1)',
  border: '2px solid transparent',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&.selected': {
    borderColor: '#ff6b35',
    background: 'rgba(255, 107, 53, 0.2)',
    transform: 'scale(1.02)'
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 69, 0, 0.3)'
  }
}));

const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  '& .MuiFormControlLabel-root': {
    margin: 0,
    width: '100%',
    '& .MuiFormControlLabel-label': {
      width: '100%'
    }
  },
  '& .MuiRadio-root': {
    display: 'none'
  }
}));

const RoverAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
  fontSize: '1.5rem',
  marginBottom: theme.spacing(1)
}));

const MarsImageListItem = styled(ImageListItem)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '2px solid rgba(255, 69, 0, 0.2)',
  '&:hover': {
    transform: 'scale(1.03) translateY(-8px)',
    boxShadow: '0 20px 40px rgba(139, 0, 0, 0.4)',
    borderColor: '#ff6b35',
    zIndex: 10
  },
  '& img': {
    transition: 'transform 0.3s ease'
  },
  '&:hover img': {
    transform: 'scale(1.1)'
  }
}));

const MarsRoverPhotoes = () => {
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");
  const [snackMessage, setSnackMessage] = useState("");
  const [rover, setRover] = useState("curiosity");
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_NASA_API_KEY;
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [pictures, setPictures] = useState(() => {
    const savedPicture = localStorage.getItem('MarsRoverPhotoes');
    return savedPicture ? JSON.parse(savedPicture) : [];
  });

  const rovers = [
    { 
      name: 'curiosity', 
      displayName: 'Curiosity', 
      icon: '🔍',
      description: 'Nuclear-powered rover',
      active: '2012 - Present'
    },
    { 
      name: 'opportunity', 
      displayName: 'Opportunity', 
      icon: '⚡',
      description: 'Solar-powered rover',
      active: '2004 - 2018'
    },
    { 
      name: 'spirit', 
      displayName: 'Spirit', 
      icon: '🔥',
      description: 'Solar-powered rover',
      active: '2004 - 2010'
    }
  ];

  useEffect(() => {
    localStorage.setItem('MarsRoverPhotoes', JSON.stringify(pictures));
  }, [pictures]);

  const clearStorage = () => {
    localStorage.removeItem('MarsRoverPhotoes');
    setPictures([]);
    setSnackMessage("Gallery cleared");
    setOpenSnackbar(true);
  };

  const fetchPictures = async () => {
    if (!date || !rover) {
      setSnackMessage("Please select a date and a rover");
      setOpenSnackbar(true);
      return;
    }

    const today = new Date();
    const june16_1995 = new Date('1995-06-16');
    const selectedDate = new Date(date);

    if (selectedDate < june16_1995 || selectedDate > today) {
      setSnackMessage("Please select a valid date");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${apiKey}`
      );
      
      setPictures(response.data.photos);
      
      if (response.data.photos.length === 0) {
        setSnackMessage("No pictures captured on the selected day");
        setOpenSnackbar(true);
      } else {
        setSnackMessage(`Found ${response.data.photos.length} photos from ${rovers.find(r => r.name === rover)?.displayName}`);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackMessage("Error fetching photos");
      setOpenSnackbar(true);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleRoverChange = (e) => {
    setRover(e.target.value);
  };

  const openImageFullscreen = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <MarsContainer maxWidth="xl">
      <Snackbar 
        open={openSnackbar} 
        handleClose={handleCloseSnackbar} 
        message={snackMessage}
      />

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <MarsTitle variant="h2" component="h1">
          <Explore sx={{ mr: 2, fontSize: 'inherit', animation: `${rotate} 10s linear infinite` }} />
          Mars Rover Gallery
        </MarsTitle>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255,140,0,0.9)', 
            textAlign: 'center',
            fontWeight: 300,
            letterSpacing: '0.05em'
          }}
        >
          Discover the Red Planet through robotic eyes
        </Typography>
      </Box>

      {/* Controls */}
      <MarsGlassCard sx={{ mb: 4 }}>
        <Grid container spacing={4}>
          {/* Date Picker */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CalendarToday sx={{ color: '#ff6b35' }} />
              <Typography variant="h6" sx={{ color: '#ff6b35', fontWeight: 600 }}>
                Select Earth Date
              </Typography>
            </Box>
            <TextField
              type="date"
              value={date}
              onChange={handleDateChange}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: {
                  color: '#ff6b35',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 53, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 53, 0.6)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b35'
                  }
                }
              }}
              sx={{
                '& .MuiInputBase-input': {
                  colorScheme: 'dark'
                }
              }}
            />
          </Grid>

          {/* Rover Selection */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#ff6b35', fontWeight: 600 }}>
                Choose Your Rover
              </Typography>
            </Box>
            <StyledRadioGroup
              value={rover}
              onChange={handleRoverChange}
            >
              {rovers.map((roverData) => (
                <FormControlLabel
                  key={roverData.name}
                  value={roverData.name}
                  control={<Radio />}
                  label={
                    <RoverCard className={rover === roverData.name ? 'selected' : ''}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <RoverAvatar>
                          {roverData.icon}
                        </RoverAvatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ color: '#ff6b35', fontWeight: 600 }}>
                            {roverData.displayName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,140,0,0.7)' }}>
                            {roverData.description}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,140,0,0.5)' }}>
                            {roverData.active}
                          </Typography>
                        </Box>
                      </Box>
                    </RoverCard>
                  }
                />
              ))}
            </StyledRadioGroup>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={fetchPictures}
                disabled={loading}
                startIcon={loading ? null : <Camera />}
                sx={{
                  background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
                  borderRadius: 3,
                  height: 56,
                  boxShadow: '0 3px 15px rgba(255, 107, 53, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #e55a2b 30%, #d4841a 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.5)'
                  },
                  '&:disabled': {
                    background: 'rgba(255,107,53,0.3)'
                  }
                }}
              >
                {loading ? 'Searching Mars...' : 'Get Photos'}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={clearStorage}
                startIcon={<Clear />}
                sx={{
                  borderColor: 'rgba(255, 107, 53, 0.5)',
                  color: '#ff6b35',
                  height: 56,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: '#ff6b35',
                    background: 'rgba(255, 107, 53, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Clear Gallery
              </Button>
            </Box>
          </Grid>
        </Grid>
      </MarsGlassCard>

      {/* Loading State */}
      {loading && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton 
                  variant="rectangular" 
                  height={250} 
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, rgba(255,107,53,0.1) 25%, rgba(255,107,53,0.2) 50%, rgba(255,107,53,0.1) 75%)'
                  }} 
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Results Header */}
      {pictures.length > 0 && !loading && (
        <Fade in={true}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Chip
              icon={<Camera />}
              label={`${pictures.length} Mars Photos Found • ${rovers.find(r => r.name === rover)?.displayName} Rover`}
              sx={{
                background: 'rgba(255, 107, 53, 0.2)',
                color: '#ff6b35',
                fontSize: '1rem',
                height: 40,
                border: '1px solid rgba(255, 107, 53, 0.3)',
                '& .MuiChip-icon': { color: '#ff6b35' }
              }}
            />
          </Box>
        </Fade>
      )}

      {/* Image Gallery */}
      {pictures.length > 0 && !loading && (
        <Fade in={true}>
          <ImageList variant="masonry" cols={3} gap={16}>
            {pictures.map((item) => (
              <MarsImageListItem key={item.id}>
                <img
                  srcSet={`${item.img_src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img_src}?w=248&fit=crop&auto=format`}
                  alt={`Mars photo ${item.id}`}
                  loading="lazy"
                  onClick={() => openImageFullscreen(item.img_src)}
                />
                <ImageListItemBar
                  title={`📸 Sol ${item.sol} • ${item.camera.full_name}`}
                  subtitle={`Earth Date: ${item.earth_date}`}
                  sx={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(139,0,0,0.8) 100%)',
                    '& .MuiImageListItemBar-title': {
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#ff6b35'
                    },
                    '& .MuiImageListItemBar-subtitle': {
                      fontSize: '0.75rem',
                      opacity: 0.9,
                      color: 'rgba(255,140,0,0.8)'
                    }
                  }}
                  actionIcon={
                    <Tooltip title="View Fullscreen">
                      <IconButton
                        sx={{ color: 'rgba(255, 107, 53, 0.8)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openImageFullscreen(item.img_src);
                        }}
                      >
                        <Fullscreen />
                      </IconButton>
                    </Tooltip>
                  }
                />
              </MarsImageListItem>
            ))}
          </ImageList>
        </Fade>
      )}

      {/* Empty State */}
      {pictures.length === 0 && !loading && (
        <Card sx={{ 
          background: 'rgba(139, 0, 0, 0.2)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 69, 0, 0.3)',
          textAlign: 'center',
          py: 8
        }}>
          <CardContent>
            <Box sx={{ animation: `${pulse} 2s ease-in-out infinite` }}>
              <Explore sx={{ fontSize: 80, color: '#ff6b35', mb: 2 }} />
            </Box>
            <Typography variant="h5" sx={{ color: '#ff6b35', mb: 1, fontWeight: 600 }}>
              Ready to Explore Mars
            </Typography>
            <Typography sx={{ color: 'rgba(255,140,0,0.8)' }}>
              Select a date and rover to discover amazing photos from the Red Planet
            </Typography>
          </CardContent>
        </Card>
      )}
    </MarsContainer>
  );
};

export default MarsRoverPhotoes;