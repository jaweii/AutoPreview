import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";

export default function Textfield() {
  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 200 }}
    >
      <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Phone" />
    </Paper>
  );
}

export function AutoPreview_Textfield() {
  return (
    <div>
      <Textfield />
    </div>
  );
}
