import { ChangeEvent, useEffect, useState } from "react";
import Axios from "../../config/axios";
import { Box, Container, Divider, Fab, Grid, IconButton, Pagination, Typography } from "@mui/material";
import ApartmentCard from "../../components/ApartmentCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ApartmentAddModifyDialog from "../../components/ApartmentAddModifyDialog";
import FilterSidebar from "../../components/FilterSidebar";

export default function ApartmentPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [pagination, setPagination] = useState({
    count: 0,
    page: 0
  });
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterString, setFilterString] = useState("");

  const showMine = query.get("mine") !== null && user?.role === "realtor";

  const getApartments = (page: number = 1) => {
    Axios.get(`/apartment?mine=${showMine}&page=${page}&${filterString}`)
      .then(({ data }) => {
        setApartments(data.results);
        setPagination({
          count: data.totalPages,
          page: data.page
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    if (user)
      getApartments();
  }, [showMine, user, filterString])

  const onPageChange = (e: ChangeEvent<any>, page: number) => {
    getApartments(page);
  }

  const filter = (e: any) => {
    const searchParams = new URLSearchParams(e);
    setFilterString(searchParams.toString());
  }

  const onRefreshContent = () => {
    getApartments(pagination.page);
  }

  return (
    <Container sx={{ mt: '12px' }} maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item>
          <FilterSidebar onFilter={filter} />
        </Grid>
        <Grid item xs>
          <>
            <Typography variant="h4" lineHeight={2}>
              {showMine ? <div>
                <IconButton sx={{ mr: '12px' }} onClick={() => navigate(-1)}>
                  <ArrowBackIcon />
                </IconButton>
                My apartments
              </div> : "All apartments"}
            </Typography>
            <Divider sx={{ mb: '12px' }} />
            {
              pagination.count === 0 ? <div>No apartments yet</div>
                : <>
                  <Grid container spacing={2}>
                    {
                      apartments.map(it =>
                        <Grid item key={it.id} xs={12} sm={6} md={4} lg={3}>
                          <ApartmentCard apartment={it} editable={showMine} refresh={onRefreshContent} />
                        </Grid>
                      )
                    }
                  </Grid>
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: '16px' }}>
                    <Pagination count={pagination.count} page={pagination.page} onChange={onPageChange} />
                  </Box>
                </>
            }
            {
              showMine && <ApartmentAddModifyDialog
                triggerButton={
                  <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 20, right: 20 }}>
                    <AddIcon />
                  </Fab>
                }
                onCreated={() => getApartments()}
              />
            }
          </>
        </Grid>
      </Grid>
    </Container>
  )
}