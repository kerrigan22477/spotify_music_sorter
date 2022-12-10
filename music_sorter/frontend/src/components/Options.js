import React, { Component } from "react";
import {
  Button
} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
  } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";

export default class Options extends Component {
    renderOptions() {
        const ratingValue = React.useState(0);
        const setRatingValue = React.useState(0);
    return (
      <TableContainer style={{ maxHeight: 900 }} component={Paper}>
      <Table stickyHeader aria-label="simple table">
          <TableHead>
          <TableRow>
              <TableCell>Sorting Option</TableCell>
              <TableCell align="right">Description</TableCell>
          </TableRow>
          </TableHead>
          <TableBody>
              <TableRow key={1}>
              <TableCell component="th" scope="row">
                  Key
              </TableCell>
              <TableCell align="right" style={{ width: 400 }}>The musical key associated with each of the songs, in ascending order of <a href = "https://en.wikipedia.org/wiki/Pitch_class">Pitch Class Notation</a>.</TableCell>
              </TableRow>
              <TableRow key={2}>
              <TableCell component="th" scope="row">
                  Valence
              </TableCell>
              <TableCell align="right" style={{width: 400 }}><a href = "https://en.wikipedia.org/wiki/Valence_(psychology)">Valence</a> is the measure of the positivity of a song, tracks with high valence are more positive and sound more euphoric and happy than songs with lower valence, which sound more negative. Our app sorts from low valence to high valence.</TableCell>           
              </TableRow>
              <TableRow key={3}>
              <TableCell component="th" scope="row">
                  BPM: Beats Per Minute
              </TableCell>
              <TableCell align="right" style={{ width: 400 }}>The numeric beats per minute, in ascending order.</TableCell>
              </TableRow>
              <TableRow key={4}>
                <TableCell component="th" scope="row" >
                    How well do you understand these options?
                </TableCell>
                <TableCell align="right">
               
                <Rating
                    name="Rating Label"
                    value={ratingValue}
                    onChange={(event, newValue) => {
                    setRatingValue(newValue);
                    }}
                />
                
                </TableCell>
              </TableRow>
          </TableBody>
      </Table>
      <Button color="primary" to="/" component={Link}>
        Home
      </Button>
      </TableContainer>
    )
  }


render(){

return(this.renderOptions()

)
}
}
