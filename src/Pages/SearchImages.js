import React from "react";
import MiniDrawer from "../commonComp/common/sidebar";
import ShowImages from "../commonComp/ShowImages";

export default function SearchImages() {
  return (
    <>
      <MiniDrawer name="Search Images">
        <ShowImages />
      </MiniDrawer>
    </>
  );
}
