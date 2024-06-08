import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MyLogIn from "./MyLogIn";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function BasicCard() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #B587EC, #762FCF)", // Linear gradient background
      }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <MyLogIn />
        </CardContent>
      </Card>
    </div>
  );
}
