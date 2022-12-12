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
import Grid from "@material-ui/core/Grid"
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
import Rating from "@material-ui/lab/Rating";

export default class Options extends Component {
  constructor(props) {
    super(props);
  };


  renderOptions() {
    return (
      <>
      <Grid container spacing={1}>
        <Grid style={{ maxHeight: 500, maxoverflowY: 'scroll' }} item xs={12} align="center">
          <TableContainer style={{ maxHeight: 500, maxoverflowY: 'scroll' }} component={Paper}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Sorting Options</TableCell>
                  <TableCell align="right">Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={1} style={{ maxHeight: 600, maxoverflowY: 'scroll' }}>
                  <TableCell component="th" scope="row">
                    Key
                  </TableCell>
                  <TableCell align="right" style={{ width: 400 }}>The musical key associated with each of the songs, in ascending order of <a href="https://en.wikipedia.org/wiki/Pitch_class">Pitch Class Notation</a>.</TableCell>
                </TableRow>
                <TableRow key={2} style={{ maxHeight: 600, maxoverflowY: 'scroll' }}>
                  <TableCell component="th" scope="row">
                    Valence
                  </TableCell>
                  <TableCell align="right" style={{ width: 400 }}><a href="https://en.wikipedia.org/wiki/Valence_(psychology)">Valence</a> is the measure of the positivity of a song, tracks with high valence are more positive and sound more euphoric and happy than songs with lower valence, which sound more negative. Our app sorts from low valence to high valence.</TableCell>
                </TableRow>
                <TableRow key={3} style={{ maxHeight: 600, maxoverflowY: 'scroll' }}>
                  <TableCell component="th" scope="row">
                    Tempo
                  </TableCell>
                  <TableCell align="right" style={{ width: 400 }}>The tempo is the numeric beats per minute, in ascending order.</TableCell>
                </TableRow>
                <TableRow key={4} style={{ maxHeight: 600, maxoverflowY: 'scroll' }}>
                  <TableCell component="th" scope="row">
                    Dancebility
                  </TableCell>
                  <TableCell align="right" style={{ width: 400 }}>Describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. We sort from low to high danceability.</TableCell>
                </TableRow>
                <TableRow key={5} style={{ maxHeight: 600, maxoverflowY: 'scroll' }}>
                  <TableCell component="th" scope="row">
                    Energy
                  </TableCell>
                  <TableCell align="right" style={{ width: 400 }}>The representation of the precieved intensity and activity associated with teh song. Typically, energetic tracks feel fast, loud and noisy. We sort from low to high.</TableCell>
                </TableRow>
                <TableRow key={6} style={{ maxHeight: 600, maxoverflowY: 'scroll' }}>
                  <TableCell component="th" scope="row">
                    Instrumentallness
                  </TableCell>
                  <TableCell align="right" style={{ width: 400 }}>The instrumentalness is the measure of vocals in a song, high instrumentalness will have a low ammount of vocals and visa versa. We sort from low to high instrumentalness.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
          <Grid item xs={12} align="center">
            <Button color="secondary" variant="contained" to="/" component={Link}>
              Home
            </Button>
          </Grid>
      </Grid>
    </>
    )
  }

  render() {
    return this.renderOptions();
  }
}
