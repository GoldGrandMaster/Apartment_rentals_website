import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useRef, useState } from 'react';
import { FormControl, Grid, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import Axios from '../config/axios';
import { useSnackbar } from 'notistack';

export default function ApartmentAddModifyDialog({ apartmentId, triggerButton, onUpdate, onCreated }:
  {
    apartmentId?: string;
    triggerButton: React.ReactNode;
    onUpdate?: Function;
    onCreated?: Function;
  }
) {
  const [open, setOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLInputElement>();
  const priceRef = useRef<HTMLInputElement>();
  const areaRef = useRef<HTMLInputElement>();
  const roomsNoRef = useRef<HTMLInputElement>();
  const latitudeRef = useRef<HTMLInputElement>();
  const longitudeRef = useRef<HTMLInputElement>();

  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    Axios.get(`/apartment/${apartmentId}`)
      .then(({ data }) => {
        if (titleRef.current && data.title)
          titleRef.current.value = data.title;
        if (descriptionRef.current && data.description)
          descriptionRef.current.value = data.description;
        if (priceRef.current && data.price)
          priceRef.current.value = data.price;
        if (areaRef.current && data.areaSize)
          areaRef.current.value = data.areaSize;
        if (roomsNoRef.current && data.roomsNo)
          roomsNoRef.current.value = data.roomsNo;
        if (latitudeRef.current && data.latitude)
          latitudeRef.current.value = data.latitude;
        if (longitudeRef.current && data.longitude)
          longitudeRef.current.value = data.longitude;
      })
      .catch(error => {
        console.error(error);
      })
  }, [open, apartmentId])

  return (
    <>
      <div onClick={handleClickOpen}>
        {triggerButton}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            if (apartmentId) {
              // update
              Axios.put(`/apartment/${apartmentId}`, formData)
                .then(({ data }) => {
                  delete data.realtor;
                  enqueueSnackbar("Updated", { variant: "success" });
                  onUpdate && onUpdate(data);
                  handleClose();
                })
                .catch(error => {
                  enqueueSnackbar(error.data.message, { variant: "error" });
                  console.error(error);
                })
            }
            else {
              // create
              Axios.post("/apartment", formData)
                .then(({ data }) => {
                  enqueueSnackbar("Added", { variant: "success" });
                  onCreated && onCreated(data);
                  handleClose();
                })
                .catch(error => {
                  enqueueSnackbar(error.data.message, { variant: "error" });
                  console.error(error);
                })
            }
          },
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{apartmentId ? "Edit apartment info" : "Add new apartment"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            fullWidth
            margin="dense"
            name="title"
            label="Title"
            inputRef={titleRef}
          />
          <TextField
            label="Description"
            name="description"
            multiline
            fullWidth
            margin="dense"
            rows={3}
            inputRef={descriptionRef}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="price">Price</InputLabel>
            <OutlinedInput
              id="price"
              type="number"
              name="price"
              inputProps={{ step: 0.01 }}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Price"
              inputRef={priceRef}
            />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="areasize">Area Size</InputLabel>
            <OutlinedInput
              id="areasize"
              name="areaSize"
              type="number"
              startAdornment={<InputAdornment position="start">m<sup>2</sup></InputAdornment>}
              label="Area Size"
              inputRef={areaRef}
            />
          </FormControl>
          <TextField
            required
            fullWidth
            type="number"
            margin="dense"
            name="roomsNo"
            label="Number of Rooms"
            inputRef={roomsNoRef}
          />
          <div>
            Preview Image:
            <input
              type="file"
              name="previewImage"
              style={{ marginLeft: '10px' }}
              accept="image/*"
            />
          </div>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                type="number"
                inputProps={{ step: 0.0001 }}
                margin="dense"
                name="latitude"
                label="latitude"
                inputRef={latitudeRef}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                type="number"
                inputProps={{ step: 0.0001 }}
                margin="dense"
                name="longitude"
                label="longitude"
                inputRef={longitudeRef}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            {apartmentId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
