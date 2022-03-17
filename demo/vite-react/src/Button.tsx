import { Component } from "react";
import Button from "@mui/material/Button";

export default class Btn extends Component {
  render() {
    return (
      <Button
        variant="contained"
        onClick={() => {
          console.log("Hello world!");
        }}
      >
        {this.props.children}
      </Button>
    );
  }
}

export function AutoPreview_Btn() {
  return <Btn>按钮</Btn>;
}

export function AutoPreview_Btn2() {
  return <Btn>二</Btn>;
}
