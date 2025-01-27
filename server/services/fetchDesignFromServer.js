import axios from "axios";

const fetchDesignFromServer = async () => {
  try {
    const response = await axios.get("/api/design-config"); 
    return response.data; 
  } catch (error) {
    console.error("Error fetching design configuration:", error);
    throw error;
  }
};

export default fetchDesignFromServer;