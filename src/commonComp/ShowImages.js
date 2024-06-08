import React, { useState } from "react";
import axios from "axios";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Box from "@mui/material/Box";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Pagination from "@mui/material/Pagination";
import Swal from "sweetalert2";
import { db } from "../config/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { auth } from "../config/firebase";

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [age, setAge] = React.useState(10);
  const [search, setSearch] = React.useState("");
  //pagination
  const [page, setPage] = React.useState(1);
  const handlePageChange = (event, value) => {
    setPage(value);
    console.log(value);
  };
  //firebase
  const favouriteCollections = collection(db, "Favourites");
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  //fetch data from api
  const fetchData = async (subject, count, page = 1) => {
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${subject}&page=${page}&per_page=${count}`,
        {
          headers: {
            Authorization:
              "xkpsBRTp0Rz7BUHbL1ZtdW9tiy2IYTF2m2snBfMmRk4INKBWkhiSvdgW",
            // Add other headers if required
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //submit function
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData(search, age, page);
  };

  //add images link to the collection
  const addImage = async (id, Link) => {
    try {
      const q = query(
        favouriteCollections,
        where("Id", "==", id),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // If the document exists, log a message and do not add the new document
        console.log("Document with this ID already exists. Skipping addition.");
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Document with this ID already exists.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const x = {
          Id: id,
          ImageLink: Link,
          userId: auth.currentUser.uid,
        };
        await addDoc(favouriteCollections, x);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Item Added To Favourites!",
          timer: 1000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  //html code
  return (
    <>
      <Container maxWidth="bg">
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 400,
            }}
            onSubmit={handleSubmit}
          >
            <IconButton sx={{ p: "10px" }} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Topic"
              inputProps={{ "aria-label": "search Topic " }}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={handleSubmit}
            >
              <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          </Paper>
          {/* form controll */}
          <FormControl required sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-required-label">
              Count
            </InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required"
              value={age}
              label="Count"
              onChange={handleChange}
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </FormControl>
        </div>

        {data && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "70%", height: 550, overflowY: "scroll" }}>
              <ImageList variant="masonry" cols={4} gap={8}>
                {data?.photos?.map((item) => (
                  <ImageListItem key={item.id}>
                    <img
                      srcSet={`${item.src.original}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.src.original}?w=248&fit=crop&auto=format`}
                      alt={item.photographer}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      sx={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                          "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                      }}
                      title={item.title}
                      position="top"
                      actionIcon={
                        <IconButton
                          sx={{ color: "white" }}
                          aria-label={`star ${item.title}`}
                          onClick={() => {
                            console.log(`${item.src.original}`);
                          }}
                        >
                          <StarBorderIcon
                            onClick={async () => {
                              await addImage(item.id, item.src.original);
                            }}
                          />
                        </IconButton>
                      }
                      actionPosition="left"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </div>
        )}
        {data ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "20px",
            }}
          >
            <Pagination
              count={Math.ceil(data.total_results / data.per_page)} // Total number of pages
              onChange={(event, value) => {
                handlePageChange(event, value);
                handleSubmit(event);
              }} // Handle page change event
              size="large" // Adjust size as needed
              color="primary" // Adjust color as needed
              shape="rounded" // Adjust shape as needed
              variant="outlined" // Adjust variant as needed
              page={page}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <h1>No Data Found</h1>
          </div>
        )}
      </Container>
    </>
  );
};

export default MyComponent;
