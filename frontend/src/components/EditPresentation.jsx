import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EditPresentation = () => {
  console.log("EditPresentation component is rendering");
  const { id } = useParams();  // Get the ID from the URL
  const [presentation, setPresentation] = useState(null);

  useEffect(() => {
    const fetchPresentation = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
    
      try {
        const headers = {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.get(`http://localhost:5005/store`, headers);
        const presentations = response.data.store.presentations;
        const presentation = presentations.find(pres => pres.id === id);

        if (presentation) {
          console.log("presentation found")
          setPresentation(presentation);
          // console.log(presentation.name)
          console.log("Presentation data:", presentation);
        } else {
          console.error("Presentation not found");
        }
      } catch (error) {
        console.error("Error fetching presentation:", error);
      }
    };
    
    fetchPresentation();
  }, [id]);

  return (
    <div className="edit-presentation">
      {presentation ? (
        <div>
          <h1>{presentation.name}</h1>
          <h1>{presentation.name}</h1>
          <h1>{presentation.name}</h1>
          <h1>{presentation.name}</h1>
          <h1>{presentation.name}</h1>
          <h1>{presentation.name}</h1>
          <h1>{presentation.name}</h1>
          <h1>{presentation.name}</h1>
          <h1>{presentation.name}</h1>
        </div>
      ) : (
        <p>Loading presentation...</p>
      )}
    </div>
  );
};

export default EditPresentation;
