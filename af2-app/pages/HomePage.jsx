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
  Alert
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  CalendarToday,
  Search,
  Clear,
  Public,
  Satellite,
  Download,
  Fullscreen
} from '@mui/icons-material';
import Snackbar from '../components/snackbar.jsx';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Enhanced styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    background: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
    pointerEvents: 'none'
  }
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
  }
}));

const AnimatedTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #fff, #e3f2fd)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  textAlign: 'center',
  marginBottom: theme.spacing(1),
  animation: `${float} 6s ease-in-out infinite`,
  letterSpacing: '0.02em'
}));

const StyledImageListItem = styled(ImageListItem)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05) translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    zIndex: 10
  },
  '& img': {
    transition: 'transform 0.3s ease'
  },
  '&:hover img': {
    transform: 'scale(1.1)'
  }
}));

const StyledImageListItemBar = styled(ImageListItemBar)(({ theme }) => ({
  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
  '& .MuiImageListItemBar-title': {
    fontSize: '0.9rem',
    fontWeight: 600
  },
  '& .MuiImageListItemBar-subtitle': {
    fontSize: '0.75rem',
    opacity: 0.9
  }
}));

const LoadingSkeleton = styled(Box)(({ theme }) => ({
  background: `linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)`,
  backgroundSize: '200px 100%',
  animation: `${shimmer} 2s infinite`,
  borderRadius: theme.spacing(2)
}));

const HomePage = () => {
  const [date, setDate] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState(() => {
    const savedPicture = localStorage.getItem('EPICPhotoes');
    return savedPicture ? JSON.parse(savedPicture) : [];
  });

  useEffect(() => {
    localStorage.setItem('EPICPhotoes', JSON.stringify(pictures));
  }, [pictures]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const fetchPictures = async () => {
    if (!date) {
      setSnackMessage("Please select a valid date");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const selectedDate = new Date(date);
      const response = await axios.get(`https://epic.gsfc.nasa.gov/api/enhanced/date/${date}`);
      const data = response.data;
      
      if (data.length === 0) {
        setSnackMessage("No pictures captured on the selected day");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }

      const pictureData = data.map(item => {
        const name = item.image + '.png';
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const archiveUrl = `https://epic.gsfc.nasa.gov/archive/enhanced/${year}/${month}/${day}/png/`;
        const imageUrl = archiveUrl + name;
        return {
          imageUrl,
          latitude: item.centroid_coordinates.lat,
          longitude: item.centroid_coordinates.lon,
          identifier: item.identifier
        };
      });
      
      setPictures(pictureData);
      setSnackMessage(`Found ${pictureData.length} images from ${date}`);
      setOpenSnackbar(true);
    } catch (error) {
      setSnackMessage("No pictures captured on the selected day");
      setOpenSnackbar(true);
      console.error('Error fetching pictures:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('EPICPhotoes');
    setPictures([]);
    setSnackMessage("Gallery cleared");
    setOpenSnackbar(true);
  };

  const openImageFullscreen = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <StyledContainer maxWidth="xl">
      <Snackbar 
        open={openSnackbar} 
        handleClose={handleCloseSnackbar} 
        message={snackMessage}
      />

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <AnimatedTitle variant="h2" component="h1">
          <Satellite sx={{ mr: 2, fontSize: 'inherit' }} />
          NASA EPIC Earth Images
        </AnimatedTitle>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255,255,255,0.8)', 
            textAlign: 'center',
            fontWeight: 300,
            letterSpacing: '0.05em'
          }}
        >
          Explore stunning Earth photography from space
        </Typography>
      </Box>

      {/* Controls */}
      <GlassCard sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarToday sx={{ color: 'rgba(255,255,255,0.7)' }} />
              <TextField
                type="date"
                value={date}
                onChange={handleDateChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  sx: {
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.3)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.5)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255,255,255,0.7)' }
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    colorScheme: 'dark'
                  }
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              size="large"
              onClick={fetchPictures}
              disabled={loading}
              startIcon={loading ? null : <Search />}
              fullWidth
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: 3,
                height: 56,
                boxShadow: '0 3px 15px rgba(33, 203, 243, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #0097A7 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(33, 203, 243, 0.4)'
                },
                '&:disabled': {
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {loading ? 'Searching...' : 'Get Images'}
            </Button>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              size="large"
              onClick={clearStorage}
              startIcon={<Clear />}
              fullWidth
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                height: 56,
                borderRadius: 3,
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.8)',
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </GlassCard>

      {/* Loading State */}
      {loading && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <LoadingSkeleton sx={{ height: 250 }} />
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
              icon={<Public />}
              label={`${pictures.length} Earth Images Found`}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                height: 40,
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Box>
        </Fade>
      )}

      {/* Image Gallery */}
      {pictures.length > 0 && !loading && (
        <Fade in={true}>
          <ImageList variant="masonry" cols={3} gap={16}>
            {pictures.map((item, index) => (
              <StyledImageListItem key={index}>
                <img
                  srcSet={`${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.imageUrl}?w=248&fit=crop&auto=format`}
                  loading="lazy"
                  alt={`Earth view at ${item.latitude}, ${item.longitude}`}
                  onClick={() => openImageFullscreen(item.imageUrl)}
                />
                <StyledImageListItemBar
                  title={`📍 ${Number(item.latitude).toFixed(2)}°, ${Number(item.longitude).toFixed(2)}°`}
                  subtitle={`ID: ${item.identifier}`}
                  actionIcon={
                    <Tooltip title="View Fullscreen">
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openImageFullscreen(item.imageUrl);
                        }}
                      >
                        <Fullscreen />
                      </IconButton>
                    </Tooltip>
                  }
                />
              </StyledImageListItem>
            ))}
          </ImageList>
        </Fade>
      )}

      {/* Empty State */}
      {pictures.length === 0 && !loading && (
        <Card sx={{ 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          py: 8
        }}>
          <CardContent>
            <Public sx={{ fontSize: 80, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>
              Ready to Explore Earth
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Select a date to view stunning Earth images captured by NASA's EPIC camera
            </Typography>
          </CardContent>
        </Card>
      )}
    </StyledContainer>
  );
};

export default HomePage;