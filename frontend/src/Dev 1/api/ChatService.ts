import axios from 'axios';

// IMPORTANT: Replace with your laptop's local IP address for mobile testing
const API_BASE_URL = 'http://10.132.219.185:8082';

const API_URL = `${API_BASE_URL}/api/chat`;

export const getUserGroups = async () => {
  try {
    const response = await axios.get(`${API_URL}/groups`);
    return response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    // Return mock data for now
    return [];
  }
};

export const getChatMessages = async (chatId: string) => {
  try {
    const response = await axios.get(`${API_URL}/messages/${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const sendMessage = async (chatId: string, message: any) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, {
      chatId,
      ...message,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const createGroup = async (groupData: any) => {
  try {
    const response = await axios.post(`${API_URL}/groups`, groupData);
    return response.data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const joinGroup = async (groupId: string) => {
  try {
    const response = await axios.post(`${API_URL}/groups/${groupId}/join`);
    return response.data;
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
};

export const leaveGroup = async (groupId: string) => {
  try {
    const response = await axios.post(`${API_URL}/groups/${groupId}/leave`);
    return response.data;
  } catch (error) {
    console.error('Error leaving group:', error);
    throw error;
  }
}; 