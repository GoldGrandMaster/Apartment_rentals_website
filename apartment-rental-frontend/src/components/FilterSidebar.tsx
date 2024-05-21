import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import { Button, Grid } from '@mui/material';
import { FormEvent } from 'react';

const FilterSidebar = ({ onFilter }: { onFilter?: Function }) => {
  const _onFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const items = ["Area", "Price"];
    items.map(key => {
      if (!data["use" + key]) {
        delete data["max" + key]
        delete data["min" + key]
      }
      if (!data["max" + key])
        delete data["max" + key];
      if (!data["min" + key])
        delete data["min" + key];
      delete data["use" + key]
    })
    onFilter && onFilter(data);
  }
  return (
    <Box sx={{ maxWidth: "240px", marginTop: "60px", position: "sticky", top: "50px" }} component="form" onSubmit={_onFilter}>
      <Box sx={{ my: "10px" }}>
        <FormControlLabel
          control={
            <Checkbox
              name="useArea"
            />
          }
          label={<div>Area Size (m<sup>2</sup>)</div>}
        />
        <Grid container spacing={2} sx={{ paddingLeft: '28px' }}>
          <Grid item xs>
            <TextField
              inputProps={{ step: 0.001 }}
              size="small"
              label="Min"
              type="number"
              name="minArea"
              variant="outlined"
            />
          </Grid>
          <Grid item xs>
            <TextField
              inputProps={{ step: 0.001 }}
              size="small"
              label="Max"
              type="number"
              name="maxArea"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mb: "20px" }}>
        <FormControlLabel
          control={
            <Checkbox
              name="usePrice"
            />
          }
          label={<div>Price ($)</div>}
        />
        <Grid container spacing={2} sx={{ paddingLeft: '28px' }}>
          <Grid item xs>
            <TextField
              inputProps={{ step: 0.001 }}
              size="small"
              label="Min"
              type="number"
              name="minPrice"
              variant="outlined"
            />
          </Grid>
          <Grid item xs>
            <TextField
              inputProps={{ step: 0.001 }}
              size="small"
              label="Max"
              type="number"
              name="maxPrice"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container>
        <Grid item xs></Grid>
        <Button variant="outlined" type="submit">Show Result</Button>
      </Grid>
    </Box>
  );
};

export default FilterSidebar;