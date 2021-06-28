import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"

// material-ui
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import Button from "@material-ui/core/Button"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

// styles
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    fontWeight: 500,
    backgroundColor: "#00e676",
    padding: "2%",
  },
  grid: {
    marginTop: "10px",
    boxShadow: "0 0 4px #1b5e20",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    backgroundColor: "",
  },
  inputLink: {
    width: "80%",
  },
  inputDesc: {
    width: "80%",
  },
  button: {
    margin: theme.spacing(1),
    backgroundColor: "#00e676",
    fontWeight: "500",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
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

  const { loading, error, data } = useQuery(APOLLO_QUERY)
  const [addBookmark] = useMutation(addBookmarkMutation)
  console.log(`data`, data)

  let textfield
  let desc
  const addBookmarkSubmit = e => {
    e.preventDefault()
    addBookmark({
      variables: {
        url: textfield.value,
        desc: desc.value,
      },
      refetchQueries: [{ query: APOLLO_QUERY }],
    })
  }

  return (
    <div className={classes.root}>
      <Grid item xs={12} className={classes.grid}>
        <Paper className={classes.paper}>
          <h2>Bookmark Application</h2>
        </Paper>
      </Grid>
      <Grid item xs={12} className={classes.grid}>
        <form onSubmit={addBookmarkSubmit}>
          <Paper className={classes.paper}>
            <TextareaAutosize
              className={classes.inputLink}
              ref={node => (textfield = node)}
              aria-label="minimum height"
              rowsMin={2}
              placeholder="Enter Link"
              required
            />
            <br />
            <TextareaAutosize
              className={classes.inputDesc}
              ref={node => (desc = node)}
              aria-label="minimum height"
              rowsMin={2}
              placeholder="Enter Description"
              required
            />
            <br />
            <Button
              type="submit"
              variant="contained"
              color="default"
              className={classes.button}
            >
              Add Bookmark
            </Button>
          </Paper>
        </form>
      </Grid>
      <Grid item xs={12} className={classes.grid}>
        {loading && <p>Loading...</p>}
        {error && <p>Error: ${error.message}</p>}
        {data && data.bookmark && (
          <Paper className={classes.paper}>
            <ul>
              {data.bookmark.map(b => {
                return (
                  <Accordion key={b.id}>
                    {/* bookmark link */}
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        {b.url}
                      </Typography>
                    </AccordionSummary>

                    {/* bookmark description */}
                    <AccordionDetails>
                      <Typography>{b.desc}</Typography>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </ul>
          </Paper>
        )}
      </Grid>
    </div>
  )
}
