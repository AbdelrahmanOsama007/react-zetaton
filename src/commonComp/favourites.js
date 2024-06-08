import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth } from "../config/firebase";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export default function Favourites() {
  const favouriteCollections = collection(db, "Favourites");
  const [favourites, setfavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get all items
  useEffect(() => {
    const getmovies = async () => {
      try {
        const q = query(
          favouriteCollections,
          where("userId", "==", auth.currentUser.uid)
        );
        const data = await getDocs(q);
        const filterData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setfavourites(filterData);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    getmovies();
  }, []);

  // Remove item
  const removeImage = async (id) => {
    try {
      const imageDoc = doc(db, "Favourites", id);
      await deleteDoc(imageDoc);
      setfavourites((prevFavourites) =>
        prevFavourites.filter((item) => item.id !== id)
      );
      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: "The image has been removed from your favourites.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "90%", maxWidth: 1200 }}>
        <ImageList variant="masonry" cols={4} gap={24}>
          {favourites.map((item) => (
            <ImageListItem
              key={item.id}
              sx={{
                cursor: "pointer",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <img
                srcSet={`${item.ImageLink}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.ImageLink}?w=248&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
              <ImageListItemBar
                sx={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  "& .MuiImageListItemBar-titleWrap": {
                    paddingBottom: "8px",
                  },
                }}
                title={item.title}
                position="top"
                actionIcon={
                  <IconButton
                    sx={{ color: "yellow" }}
                    onClick={() => removeImage(item.id)}
                  >
                    <StarBorderIcon />
                  </IconButton>
                }
                actionPosition="left"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </div>
  );
}
