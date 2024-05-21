import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ApartmentViewDialog from './ApartmentViewDialog';
import { SERVER_URL } from '../config/config';
import { Box } from '@mui/material';

export default function ApartmentCard({ apartment, editable = false, refresh }:
  {
    apartment: Apartment;
    editable?: boolean;
    refresh?: Function;
  }) {
  return (
    <Card sx={{ background: "#eef1f2", height: '100%', display: 'flex', flexDirection: "column" }}>
      <CardMedia
        sx={{ height: 140 }}
        image={SERVER_URL + "public/" + apartment.previewImage}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {apartment.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {apartment.description}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <CardActions>
        <Box sx={{ flexGrow: 1 }} />
        <ApartmentViewDialog
          editable={editable}
          triggerButton={<Button size="small">View Details</Button>}
          apartmentId={apartment.id}
          refresh={refresh}
        />
      </CardActions>
    </Card>
  );
}
