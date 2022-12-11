import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default class CreateRoomPage extends Component {

  constructor(props) {
	super(props);
	this.state = {
	  sorting_criteria: 'key'
	};
	this.handleSelectSortingCriteria = this.handleSelectSortingCriteria.bind(this);
	this.handleGeneratePlaylistButton = this.handleGeneratePlaylistButton.bind(this);
  }

  handleSelectSortingCriteria(e) {
	this.setState({
	  sorting_criteria: e.target.value
	});
	console.log(this.state.sorting_criteria)
  }

  handleGeneratePlaylistButton() {
	const requestOptions = {
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
	  body: JSON.stringify({
		sorting_criteria: this.state.sorting_criteria
	  }),
	};
	fetch("/api/sorting-page", requestOptions)
	  .then((response) => response.json())
	  .then((data) => this.props.history.push("/user/" + data.code));
  }
	// Grid is used to align items (horizontal or vertical)
	// default is vertically in col structure 1 = 8px between each

	// item xs can be s m or l (small med large) defines screen width
	// tells us grid width when size is small
	// 12 means it fills the entire grid

	// more info about all this jazz in notes

  render() {
	return (
	  <Grid container spacing={1}>
		<Grid item xs={12} align="center">
		  <Typography component="h4" variant="h4">
			Select Sorting Requirements
		  </Typography>
		</Grid>
		<Grid item xs={12} align="center">
		  <FormControl>
			<RadioGroup
			  aria-labelledby="demo-radio-buttons-group-label"
			  defaultValue="key"
			  name="radio-buttons-group"
			  onChange={this.handleSelectSortingCriteria}
			>
			  <FormControlLabel value="danceability" control={<Radio />} label="Danceability" />
			  <FormControlLabel value="energy" control={<Radio />} label="Energy" />
			  <FormControlLabel value="key" control={<Radio />} label="Key" />
			  <FormControlLabel value="valence" control={<Radio />} label="Valence" />
			  <FormControlLabel value="tempo" control={<Radio />} label="Tempo" />
			  <FormControlLabel value="instrumentalness" control={<Radio />} label="Instrumentalness" />
			</RadioGroup>
		  </FormControl>  
		</Grid>
		<Grid item xs={12} align="center">
		  <Button color="primary" variant="contained" onClick={this.handleGeneratePlaylistButton}>
			Generate
		  </Button>
		</Grid>
		<Grid item xs={12} align="center">
		  <Button color="secondary" variant="contained" to="/" component={Link}>
			Back
		  </Button>
		</Grid>
	  </Grid>
	);
  }
}