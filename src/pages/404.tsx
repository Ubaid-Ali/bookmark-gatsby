import React from "react"
import { Link } from "gatsby"

const _404_page = () => {
  return (
    <div
      style={{
        textAlign: "center",
        margin: "0, auto",
        fontWeight: "bolder",
        padding: "20px 0px",
        color: "white",
        backgroundColor: "#00e676",
      }}
    >
      <p>Sorry Page Not Found :(</p>
      <p>
        Go back to{" "}
        <Link to="/">Home</Link>
      </p>
    </div>
  )
}

export default _404_page
