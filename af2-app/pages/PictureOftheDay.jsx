import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Container,
  Fade,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  CalendarToday,
  Search,
  Clear,
  Stars,
  Fullscreen,
  Share,
  Close
} from '@mui/icons-material';
import Snackbar from '../components/snackbar.jsx';

// Animations
const twinkle = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const drift = keyframes`
  0% { transform: translateX(0) translateY(0); }
  33% { transform: translateX(30px) translateY(-30px); }
  66% { transform: translateX(-20px) translateY(20px); }
  100% { transform: translateX(0) translateY(0); }
`;

const CosmicContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(180deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
  minHeight: '100vh',
  padding: theme.spacing(4, 2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(2px 2px at 20px 30px, #eee, transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 90px 40px, #fff, transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
      radial-gradient(2px 2px at 160px 30px, #ddd, transparent)
    `,
    backgroundRepeat: 'repeat',
    backgroundSize: '200px 100px',
    animation: `${twinkle} 4s ease-in-out infinite`,
    pointerEvents: 'none'
  }
}));

const CosmicGlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }
}));

const CosmicTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #fff, #64b5f6, #90caf9)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  textAlign: 'center',
  marginBottom: theme.spacing(1),
  letterSpacing: '0.02em',
  animation: `${drift} 20s ease-in-out infinite`
}));

const APODCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.25)'
  }
}));

const APODMedia = styled(CardMedia)(({ theme }) => ({
  height: 400,
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
    pointerEvents: 'none'
  }
}));

const FloatingActionButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.1)'
  }
}));

const PictureOftheDay = () => {
  const [pictureOfTheDay, setPictureOfTheDay] = useState(() => {
    const savedPicture = localStorage.getItem('pictureOfTheDay');
    return savedPicture ? JSON.parse(savedPicture) : {};
  });
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const apiKey = import.meta.env.VITE_NASA_API_KEY;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const clearStorage = () => {
    localStorage.removeItem('pictureOfTheDay');
    setPictureOfTheDay({});
    setSnackMessage("Gallery cleared");
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (Object.keys(pictureOfTheDay).length === 0) {
      fetchPictureOfTheDay();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pictureOfTheDay', JSON.stringify(pictureOfTheDay));
  }, [pictureOfTheDay]);

  const fetchPictureOfTheDay = async () => {
    setLoading(true);

    if (date) {
      const today = new Date();
      const june16_1995 = new Date('1995-06-16');
      const selectedDate = new Date(date);

      if (selectedDate < june16_1995 || selectedDate > today) {
        setSnackMessage("Date must be between June 16, 1995 and today");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`);
        setPictureOfTheDay(response.data);
        setSnackMessage(`Found APOD for ${date}`);
        setOpenSnackbar(true);
      } catch (error) {
        setSnackMessage("An error occurred while getting the picture");
        setOpenSnackbar(true);
        setError(error);
      }
    } else {
      try {
        setSnackMessage("Getting today's Picture of the Day");
        setOpenSnackbar(true);
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
        setPictureOfTheDay(response.data);
      } catch (error) {
        setSnackMessage("An error occurred while getting the picture");
        setOpenSnackbar(true);
        setError(error);
      }
    }
    setLoading(false);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const openFullscreenDialog = () => {
    setOpenDialog(true);
  };

  const closeFullscreenDialog = () => {
    setOpenDialog(false);
  };

  const shareContent = async () => {
    if (navigator.share && pictureOfTheDay.url) {
      try {
        await navigator.share({
          title: pictureOfTheDay.title,
          text: pictureOfTheDay.explanation?.substring(0, 100) + '...',
          url: pictureOfTheDay.url,
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(pictureOfTheDay.url);
        setSnackMessage("Link copied to clipboard!");
        setOpenSnackbar(true);
      }
    } else {
      navigator.clipboard.writeText(pictureOfTheDay.url || '');
      setSnackMessage("Link copied to clipboard!");
      setOpenSnackbar(true);
    }
  };

  if (error) {
    return (
      <CosmicContainer maxWidth="xl">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" sx={{ color: '#ff6b6b', mb: 2 }}>
            Houston, we have a problem!
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {error.message}
          </Typography>
        </Box>
      </CosmicContainer>
    );
  }

  return (
    <CosmicContainer maxWidth="xl">
      <Snackbar
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        message={snackMessage}
      />

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <CosmicTitle variant="h2" component="h1">
          <Stars sx={{ mr: 2, fontSize: 'inherit' }} />
          Astronomy Picture of the Day
        </CosmicTitle>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            fontWeight: 300,
            letterSpacing: '0.05em'
          }}
        >
          Discover the cosmos, one picture at a time
        </Typography>
      </Box>

      {/* Controls */}
      <CosmicGlassCard sx={{ mb: 4 }}>
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
                placeholder="Select a date (optional)"
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
                      borderColor: '#64b5f6'
                    }
                  }
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
              onClick={fetchPictureOfTheDay}
              disabled={loading}
              startIcon={loading ? null : <Search />}
              fullWidth
              sx={{
                background: 'linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)',
                borderRadius: 3,
                height: 56,
                boxShadow: '0 3px 15px rgba(100, 181, 246, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #42a5f5 30%, #64b5f6 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(100, 181, 246, 0.4)'
                },
                '&:disabled': {
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {loading ? 'Searching cosmos...' : date ? 'Get APOD' : 'Get Today\'s APOD'}
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
      </CosmicGlassCard>

      {/* Loading State */}
      {loading && (
        <Box sx={{ mb: 4 }}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
              mb: 2
            }}
          />
          <Skeleton
            variant="text"
            height={40}
            sx={{ background: 'rgba(255,255,255,0.1)', mb: 1 }}
          />
          <Skeleton
            variant="text"
            height={20}
            width="60%"
            sx={{ background: 'rgba(255,255,255,0.1)' }}
          />
        </Box>
      )}

      {/* APOD Content */}
      {Object.keys(pictureOfTheDay).length > 0 && !loading && (
        <Fade in={true}>
          <Box>
            {/* Info Chip */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Chip
                icon={<Stars />}
                label={pictureOfTheDay.date ? `APOD • ${pictureOfTheDay.date}` : 'Today\'s APOD'}
                sx={{
                  background: 'rgba(100, 181, 246, 0.2)',
                  color: '#64b5f6',
                  fontSize: '1rem',
                  height: 40,
                  border: '1px solid rgba(100, 181, 246, 0.3)',
                  '& .MuiChip-icon': { color: '#64b5f6' }
                }}
              />
            </Box>

            {/* Main APOD Card */}
            <APODCard>
              {pictureOfTheDay.media_type === 'image' ? (
                <Box sx={{ position: 'relative' }}>
                  <APODMedia
                    component="img"
                    image={pictureOfTheDay.url}
                    alt={pictureOfTheDay.title}
                    onClick={openFullscreenDialog}
                  />
                  <FloatingActionButton onClick={openFullscreenDialog}>
                    <Fullscreen />
                  </FloatingActionButton>
                </Box>
              ) : (
                <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <iframe
                    src={pictureOfTheDay.url}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    title={pictureOfTheDay.title}
                  />
                </Box>
              )}

              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      flex: 1,
                      mr: 2
                    }}
                  >
                    {pictureOfTheDay.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Share">
                      <IconButton
                        onClick={shareContent}
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          '&:hover': { color: '#64b5f6' }
                        }}
                      >
                        <Share />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: 1.6,
                    fontSize: '1.1rem'
                  }}
                >
                  {pictureOfTheDay.explanation}
                </Typography>

                {pictureOfTheDay.copyright && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.5)',
                      mt: 2,
                      display: 'block'
                    }}
                  >
                    © {pictureOfTheDay.copyright}
                  </Typography>
                )}
              </CardContent>
            </APODCard>
          </Box>
        </Fade>
      )}

      {/* Empty State */}
      {Object.keys(pictureOfTheDay).length === 0 && !loading && (
        <Card sx={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
          py: 8
        }}>
          <CardContent>
            <Stars sx={{ fontSize: 80, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>
              Ready to Explore the Universe
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Discover today's featured astronomy picture or explore the archive
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Fullscreen Dialog */}
      <Dialog
        open={openDialog}
        onClose={closeFullscreenDialog}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white'
        }}>
          {pictureOfTheDay.title}
          <IconButton onClick={closeFullscreenDialog} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {pictureOfTheDay.media_type === 'image' && (
            <img
              src={pictureOfTheDay.hdurl || pictureOfTheDay.url}
              alt={pictureOfTheDay.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </CosmicContainer>
  );
};

export default PictureOftheDay;