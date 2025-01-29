import { useState } from 'react'
import styled from 'styled-components'

const InputContainer = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  max-width: 500px;
`

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  margin-bottom: 1rem;
  background: #282828;
  color: white;
`

const Button = styled.button`
  padding: 0.8rem 2rem;
  background: #1ed760;
  border: none;
  border-radius: 5px;
  color: black;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background: #1db954;
  }
`

// eslint-disable-next-line react/prop-types
function PlaylistInput({ onSubmit }) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(url)
  }

  return (
    <InputContainer>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter YouTube playlist URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="submit">Load Playlist</Button>
      </form>
    </InputContainer>
  )
}

export default PlaylistInput