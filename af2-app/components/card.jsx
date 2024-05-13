import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {React, useState ,useEffect, Fragment} from "react";

export default function MediaCard(props) {

    const [colors, setColors] = useState([]);
    const handleDownload = () => {
        // Create a temporary anchor element
        const anchor = document.createElement('a');
        // Set the href attribute to the image URL
        anchor.href = props.url;
        // Set the download attribute to force download
        anchor.download = `${props.title}.jpg`; // You can set the desired file name here
        // Append the anchor to the body
        document.body.appendChild(anchor);
        // Click the anchor to trigger download
        anchor.click();
        // Remove the anchor from the body
        document.body.removeChild(anchor);
      };
      
  return (
    <div 
    style={{ 
      textAlign:"center",
      padding:"20px"
    }}
    >
      <img
        src= {props.url}
        style={{ 
        objectFit: "contain",
        margin:"auto auto",
        textAlign:"center",
        maxHeight:"700px",
        maxWidth:"1000px"
         }}/>
    <Card>

      {/* <CardMedia
            component="img"
            height="500"
            image={props.url}
            alt= {props.title}
            sx={{
                paddingTop: "1rem",
                paddingBottom: "1rem",
                objectFit: "contain",
                backgroundColor: colors[0] || 'transparent',
              }}
        /> */}

        <CardContent>
            <Typography style={{textAlign:"center"}} gutterBottom variant="h5" component="div">
            {props.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {props.description}
            </Typography>
        </CardContent>
        <CardActions>
        <a href={props.url} download={`${props.title}.jpg`} style={{ textDecoration: 'none' }}>
          <Button size="small" onClick={handleDownload}>
            Download Original Image
          </Button>
        </a>
      </CardActions>
    </Card>
    </div>
  );
}