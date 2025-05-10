import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { nanoid } from "nanoid";

// Function to init Cohere client with API key from environment variables
const initCohere = () => {
  const apiKey = process.env.COHERE_API_KEY || process.env.COHERE_KEY || '';
  
  if (!apiKey) {
    console.error("Missing Cohere API key. Set COHERE_API_KEY environment variable.");
  }
  
  return {
    apiKey
  };
};

// Get or create a session ID
const getOrCreateSessionId = async (req: Request): Promise<string> => {
  // Check for existing session in request
  const sessionId = req.query.sessionId as string || nanoid();
  
  // Create session if it doesn't exist
  const existingSession = await storage.getSession(sessionId);
  if (!existingSession) {
    await storage.createSession({ sessionId });
  }
  
  return sessionId;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize HTTP server
  const httpServer = createServer(app);
  
  // Initialize Cohere client
  const { apiKey } = initCohere();
  
  // Get chat history
  app.get('/api/chat/history', async (req: Request, res: Response) => {
    try {
      const sessionId = await getOrCreateSessionId(req);
      const messages = await storage.getMessagesBySessionId(sessionId);
      
      res.json({
        sessionId,
        messages
      });
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ message: 'Failed to fetch chat history' });
    }
  });
  
  // Stream chat API endpoint
  app.get('/api/chat/stream', async (req: Request, res: Response) => {
    const message = req.query.message as string;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    try {
      // Get or create session
      const sessionId = await getOrCreateSessionId(req);
      
      // Save user message to storage
      await storage.createMessage({
        role: 'user',
        content: message,
        sessionId
      });
      
      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Create optimized system message to enforce Sorani Kurdish responses
      const systemPrompt = 
        "You are زیرەکی دەستکردی قەڵا (AI Castle), a smart and fast assistant that ALWAYS responds in Sorani Kurdish " +
        "regardless of what language the user writes in. Always keep responses concise, direct and useful. " + 
        "The Sorani Kurdish language uses Arabic script and is read right-to-left. " +
        "Your responses should be informative, accurate, and culturally appropriate for Kurdish speakers. " +
        "Remember to NEVER respond in any language other than Sorani Kurdish under any circumstances.";
      
      // Prepare headers for Cohere API
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // Prepare request body for Cohere API
      const cohereRequestBody = {
        message: message,
        model: 'command-r-plus',
        stream: true,
        preamble: systemPrompt,
      };
      
      // Make streaming request to Cohere API
      const cohereResponse = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(cohereRequestBody)
      });
      
      if (!cohereResponse.ok) {
        const errorText = await cohereResponse.text();
        console.error(`Cohere API error: ${cohereResponse.status} ${errorText}`);
        res.write(`data: Error connecting to AI service: ${cohereResponse.status}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }
      
      // Handle streaming response
      const reader = cohereResponse.body?.getReader();
      
      if (!reader) {
        res.write('data: Error: No response from AI service\n\n');
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }
      
      let completeResponse = '';
      
      // Process chunks from the stream
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode the chunk
        const chunk = Buffer.from(value).toString('utf-8');
        
        // Parse the chunk to get the text content
        try {
          // Process each line in the chunk (Cohere sends JSON lines)
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            if (line.includes('"text"')) {
              try {
                const jsonLine = JSON.parse(line);
                if (jsonLine.text) {
                  completeResponse += jsonLine.text;
                  res.write(`data: ${jsonLine.text}\n\n`);
                }
              } catch (e) {
                // Handle parsing errors gracefully
                console.error('Error parsing JSON line:', e);
              }
            }
          }
        } catch (error) {
          console.error('Error processing chunk:', error);
        }
      }
      
      // Save the assistant's complete response to storage
      if (completeResponse) {
        await storage.createMessage({
          role: 'assistant',
          content: completeResponse,
          sessionId
        });
      }
      
      // Signal end of stream
      res.write('data: [DONE]\n\n');
      res.end();
      
    } catch (error) {
      console.error('Error in chat stream:', error);
      
      // Try to send error response if we still can
      try {
        res.write('data: Error processing your request\n\n');
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (responseError) {
        console.error('Error sending error response:', responseError);
      }
    }
  });

  return httpServer;
}
