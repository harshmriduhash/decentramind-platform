import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface ChatMessage {
  id?: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
  context?: {
    agents?: any[];
    staking?: any[];
    proposals?: any[];
  };
}

export interface ChatSession {
  id?: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export class ChatService {
  private static instance: ChatService;

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Save a new chat message
  async saveMessage(userId: string, message: string, response: string, context?: any): Promise<string> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return '';
      }

      const chatMessage: Omit<ChatMessage, 'id'> = {
        userId,
        message,
        response,
        timestamp: new Date(),
        context
      };

      const docRef = await addDoc(collection(db, 'chat_messages'), chatMessage);
      return docRef.id;
    } catch (error) {
      console.error('Failed to save chat message:', error);
      throw error;
    }
  }

  // Get chat history for a user
  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return [];
      }

      const q = query(
        collection(db, 'chat_messages'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const messages: ChatMessage[] = [];
      
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Failed to get chat history:', error);
      return [];
    }
  }

  // Subscribe to real-time chat updates
  subscribeToChatHistory(userId: string, callback: (messages: ChatMessage[]) => void): () => void {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return () => {};
      }

      const q = query(
        collection(db, 'chat_messages'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages: ChatMessage[] = [];
        querySnapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
        });
        callback(messages.reverse()); // Return in chronological order
      });

      return unsubscribe;
    } catch (error) {
      console.error('Failed to subscribe to chat history:', error);
      return () => {};
    }
  }

  // Clear chat history for a user
  async clearChatHistory(userId: string): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return false;
      }

      const q = query(
        collection(db, 'chat_messages'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      return true;
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      return false;
    }
  }

  // Update a chat message
  async updateMessage(messageId: string, updates: Partial<ChatMessage>): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return false;
      }

      await updateDoc(doc(db, 'chat_messages', messageId), updates);
      return true;
    } catch (error) {
      console.error('Failed to update chat message:', error);
      return false;
    }
  }

  // Delete a specific chat message
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return false;
      }

      await deleteDoc(doc(db, 'chat_messages', messageId));
      return true;
    } catch (error) {
      console.error('Failed to delete chat message:', error);
      return false;
    }
  }
}

export default ChatService; 