import { useState } from 'react'
import './App.css'
import BannedList from '../components/BannedList'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  // State variable to store current API result
  const [currentTags, changeTags] = useState({
    date: "",
    technique: "",
    imageUrl: ""
  })

  // Banned tag lists
  const [bannedTags, updateBans] = useState({
    date: [],
    technique: []
  })

  // ✨ Function to ban a tag
  const increaseBans = (type, value) => {
    updateBans(prev => {
      if (!prev[type].includes(value)) {
        return {
          ...prev,
          [type]: [...prev[type], value]
        }
      }
      return prev
    })
  }

  // ✨ Function to unban a tag
  const decreaseBans = (type, value) => {
    updateBans(prev => ({
      ...prev,
      [type]: prev[type].filter(tag => tag !== value)
    }))
  }

  // 🧠 Function to construct a fetch query and update the currentTags
  const makeQuery = async () => {
  let foundValid = false;

  while (!foundValid) {
    const baseURL = "https://api.harvardartmuseums.org/image";
    const fields = ["baseimageurl", "date", "technique"].join(",");

    const url = `${baseURL}?apikey=${API_KEY}&size=1&sort=random&hasimage=1&fields=${fields}`;

    const res = await fetch(url);
    const data = await res.json();

    const item = data.records?.[0];
    if (!item || !item.baseimageurl) continue;

    const result = {
      imageUrl: item.baseimageurl,
      date: item.date || "Unknown",
      technique: item.technique || "Unknown"
    };

    const isBanned =
      bannedTags.date.includes(result.date) ||
      bannedTags.technique.includes(result.technique);

    if (!isBanned) {
      changeTags(result);
      foundValid = true;
    }
  }
  };

  // 👆 Click handler for banning attributes
  const handleAttributeClick = (type, value) => {
    if (bannedTags[type].includes(value)) {
      decreaseBans(type, value)
    } else {
      increaseBans(type, value)
    }
  }

  return (
    <div>
      <h1>Harvard Art</h1>
      <button onClick={makeQuery}>Discover Art</button>

      {currentTags.imageUrl && (
        <div>
          <img src={currentTags.imageUrl} alt="Artwork" width="300" />
          <p onClick={() => handleAttributeClick("date", currentTags.date)}>
            <strong>Date:</strong> {currentTags.date}
          </p>
          <p onClick={() => handleAttributeClick("technique", currentTags.technique)}>
            <strong>Technique:</strong> {currentTags.technique}
          </p>
        </div>
      )}

      <BannedList
        banned_tags={bannedTags}
        toggleBan={handleAttributeClick}
      />
    </div>
  )
}

export default App
