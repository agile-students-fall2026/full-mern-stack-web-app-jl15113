import { useState, useEffect } from 'react'
import './AboutMe.css'
import axios from 'axios'

/**
 * A React component that represents one Message in the list of messages.
 * @param {*} param0 an object holding any props and a few function definitions passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */

const AboutMe = props => {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    axios
      .get("http://localhost:5002/about")
      .then((res) => setData(res.data))
      .catch((err) => setError("Failed to retrieve about me."))
  }, [])

  if (error) return <p>{error}</p>
  if (!data) return <p>Loading...</p>

  return (
    <>
      <h1>{data.title}</h1>
      <img src={data.imageUrl} alt="Me" style={{ maxWidth: "300px" }} />
      {data.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  )
}

export default AboutMe