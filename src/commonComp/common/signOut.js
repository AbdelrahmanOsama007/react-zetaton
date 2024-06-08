import Button from "@mui/material/Button";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

export default function SignOut() {
  return (
    <Button
      sx={{ marginTop: "5px", width: "100%" }}
      onClick={async () => {
        try {
          await signOut(auth);
        } catch (error) {
          console.log("Error signing out", error);
        }
      }}
    >
      Sign out
    </Button>
  );
}
