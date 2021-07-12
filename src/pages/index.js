import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"

// import material-ui
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"

import Footer from "../components/footer"

// styles
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    fontWeight: 500,
    paddingLeft: "3%",
    paddingRight: "3%",
    margin: "0",
    height: "100%",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    backgroundColor: "#55B4B0",
    minHeight: "700px",
  },
  grid: {
    marginTop: "15px",
    backgroundColor: "#55B4B0",
    borderRadius: "10px",
  },
  paper: {
    // backgroundColor: "transparent",
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    borderRadius: "5px 5px 10px 10px",
    height: "85%",
    marginTop: "10px",
    textAlign: "left",
  },
  inputLink: {
    marginTop: "10px",
    width: "80%",
    fontSize: "20px",
  },
  inputDesc: {
    marginTop: "10px",
    width: "80%",
    fontSize: "20px",
  },
  button: {
    marginTop: "10px",
    backgroundColor: "#55B4B0",
    fontWeight: "bolder",
    color: "#fff",
    border: "2px solid #55B4B0",
    borderRadius: "7px",
    "&:hover": {
      border: "2px solid #55B4B0",
      backgroundColor: "#fff",
      color: "#55B4B0",
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color: "#00e676",
  },
  bookmark_url: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#03a1fc",
    overflowWrap: "break-word",
    // wordWrap: "break-word",
    // hyphens: "auto",
  },
  desc: {
    fontSize: "20px",
    fontWeight: "600",
    overflowWrap: "break-word",
  },
}))

// This query is executed at run time by Apollo.
const APOLLO_QUERY = gql`
  {
    bookmark {
      id
      url
      desc
    }
  }
`

const addBookmarkMutation = gql`
  mutation addBookmark($url: String!, $desc: String!) {
    addBookmark(url: $url, desc: $desc) {
      url
    }
  }
`

export default function Home() {
  const classes = useStyles()

  const [userInput, setUserInput] = useState({
    userLink: "",
    desc: "",
  })

  const { loading, error, data } = useQuery(APOLLO_QUERY)
  const [addBookmark] = useMutation(addBookmarkMutation)
  // console.log(`data`, data)

  const addBookmarkSubmit = e => {
    e.preventDefault()
    addBookmark({
      variables: {
        url: userInput.userLink,
        desc: userInput.desc,
      },
      refetchQueries: [{ query: APOLLO_QUERY }],
    })
    setUserInput({
      userLink: "",
      desc: "",
    })
  }

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} sm={12} className={classes.grid}>
          <h2 style={{ color: "#fff", fontSize: "30px", textAlign: "center" }}>
            Bookmark /\pp
          </h2>
        </Grid>
        <Grid item xs={12} sm={12} className={classes.grid}>
          <form onSubmit={addBookmarkSubmit}>
            <Paper
              className={classes.paper}
              style={{ textAlign: "center", padding: "3%" }}
            >
              <TextareaAutosize
                value={userInput.userLink}
                onChange={e =>
                  setUserInput(state => ({
                    ...state,
                    userLink: e.target.value,
                  }))
                }
                className={classes.inputLink}
                aria-label="minimum height"
                rowsMin={2}
                placeholder="Enter Link"
                required
              />
              <br />
              <TextareaAutosize
                value={userInput.desc}
                onChange={e =>
                  setUserInput(state => ({ ...state, desc: e.target.value }))
                }
                className={classes.inputDesc}
                aria-label="minimum height"
                rowsMin={2}
                placeholder="Enter Description"
                required
              />
              <p style={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="default"
                  className={classes.button}
                >
                  Add Bookmark
                </Button>
              </p>
            </Paper>
          </form>
        </Grid>
      </Grid>

      {loading && (
        <Grid container spacing={3} className={classes.grid}>
          <Grid item sm={12}>
            <Paper
              className={classes.paper}
              style={{ textAlign: "center", color: "#55B4B0" }}
            >
              Loading...
            </Paper>
          </Grid>
        </Grid>
      )}
      {error && (
        <Grid container spacing={3} className={classes.grid}>
          <Grid item sm={12}>
            <Paper
              className={classes.paper}
              style={{ textAlign: "center", color: "#55B4B0" }}
            >
              Error: ${error.message}
            </Paper>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={1}>
        {data &&
          data.bookmark &&
          data.bookmark.map((b, index) => {
            // b = bookmark
            return (
              <Grid item xs={12} sm={4} key={index} className={classes.grid}>
                <Paper elevation={3} className={classes.paper}>
                  {/* bookmark link */}
                  <Typography className={classes.heading}>
                    <a
                      href={b.url}
                      component="button"
                      variant="body2"
                      className={classes.bookmark_url}
                    >
                      <span>{b.url}</span>
                    </a>
                  </Typography>

                  {/* bookmark description */}
                  <Typography className={classes.desc}>{b.desc}</Typography>
                </Paper>
              </Grid>
            )
          })}
      </Grid>

      <Grid item xs={12} sm={12}>
        <Footer />
      </Grid>
    </div>
  )
}
