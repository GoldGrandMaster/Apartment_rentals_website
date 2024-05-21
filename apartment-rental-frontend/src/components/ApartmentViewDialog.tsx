import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useRef, useState } from 'react';
import Axios from '../config/axios';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { SERVER_URL } from '../config/config';
import ApartmentAddModifyDialog from './ApartmentAddModifyDialog';
import Map from './Map';
import ConfirmationDialog from './ConfirmationDialog';
import { useSnackbar } from 'notistack';

export default function ApartmentViewDialog({ triggerButton, apartmentId, editable = false, refresh }:
  {
    triggerButton: React.ReactNode;
    apartmentId: string;
    editable?: boolean;
    refresh?: Function;
  }
) {
  const [open, setOpen] = useState(false);
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const onUpdated = (data: any) => {
    setApartment({
      ...apartment,
      ...data
    })
    refresh && refresh();
  }

  useEffect(() => {
    if (!open) return;
    Axios.get(`apartment/${apartmentId}`)
      .then(({ data }) => {
        setApartment(data);
      })
      .catch((error) => {
        console.error(error);
      })
  }, [apartmentId, open])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDelete = () => {
    if (!apartmentId)
      return;

    Axios.delete(`/apartment/${apartmentId}`)
      .then(() => {
        enqueueSnackbar("Successfully removed", { variant: "success" });
        refresh && refresh();
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      })
  }

  const descriptionElementRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <>
      <div onClick={handleClickOpen}>
        {triggerButton}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">Details of <b>{apartment?.title}</b></DialogTitle>
        <DialogContent dividers>
          <img src={SERVER_URL + "public/" + apartment?.previewImage} alt="Preview Image" style={{ width: '100%' }} />
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="col">
                    <b>Description</b>
                  </TableCell>
                  <TableCell>{apartment?.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="col">
                    <b>Number of Rooms</b>
                  </TableCell>
                  <TableCell>{apartment?.roomsNo}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="col">
                    <b>price</b>
                  </TableCell>
                  <TableCell>$ {apartment?.price}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="col">
                    <b>Area</b>
                  </TableCell>
                  <TableCell>{apartment?.areaSize} m<sup>2</sup></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="col">
                    <b>location</b>
                  </TableCell>
                  <TableCell>{apartment?.latitude}, {apartment?.longitude}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="col">
                    <b>Realtor</b>
                  </TableCell>
                  <TableCell>{typeof (apartment?.realtor) === "object" && apartment?.realtor?.name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {
            (apartment?.latitude && apartment?.longitude) && (
              <Map latitude={apartment.latitude} longitude={apartment.longitude} />
            )
          }
        </DialogContent>
        <DialogActions>
          {
            editable && <ConfirmationDialog
              triggerButton={<Button variant="contained" color="error">Delete</Button>}
              onYes={onDelete}
              title="Confirm"
              content="Are you sure to delete? Do you understand that it's a permanent action?"
            />
          }
          {
            editable && <ApartmentAddModifyDialog
              triggerButton={<Button variant="contained">Edit</Button>}
              onUpdate={onUpdated}
              apartmentId={apartment?.id}
            />
          }
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
