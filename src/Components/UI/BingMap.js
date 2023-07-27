import React, { useState } from "react";
import BingMapsReact from "bingmaps-react";
import  axios  from "axios";
const BingMap = () => {
  const [result, setResult] = useState([]);
  const pushPin = {
    center: {
      latitude: 19.997454,
      longitude: 73.789803,
    },
    options: {
      title: "Nashik",
    },
  };

  const handleSearchChange = async (value) => {
    try {
      const response = await axios.get(
        `https://dev.virtualearth.net/REST/v1/Autosuggest?query=Mumbai&includeEntityTypes=Address,Place&key=AuVnSwE7RYxQAaqQH9MP9SC7Tx_6u4xzXPwlg0GPFAhiEEqAYIunu_6c_DeLmGIB`
      );
      const data = await response.json();
      console.log({ data });
      const resultRaw = data.suggestionGroups[0].searchSuggestions;
      const results = resultRaw.map((result) => ({
        title: result.displayText,
        url: result.url,
      }));
      setResult(results);
    } catch (error) {
      console.error(`Error fetch search ${value}`);
    }
  };

  const pushPins = [pushPin];
  return (
    <>
      <div>
        <input
          type="text"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {console.log(result)}
      </div>
      <div style={{ width: "100%", height: "100vh" }}>
        <BingMapsReact
          bingMapsKey="AuVnSwE7RYxQAaqQH9MP9SC7Tx_6u4xzXPwlg0GPFAhiEEqAYIunu_6c_DeLmGIB"
          pushPins={pushPins}
          viewOptions={{
            center: {
              latitude: 19.997454,
              longitude: 73.789803,
            },
          }}
        />
      </div>
    </>
  );
};

export default BingMap;
