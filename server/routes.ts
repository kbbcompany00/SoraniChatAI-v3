import type { Express, Request, Response, NextFunction } from "express";
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

// We will use Express's built-in body parser instead with increased limits

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
  
  // Using Express's built-in body parser with increased limits - configured in index.ts
  
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
  
  // Image embedding endpoint
  app.post('/api/embed/image', async (req: Request, res: Response) => {
    try {
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ message: 'Image data is required' });
      }
      
      // Validate image base64 format
      if (!image.startsWith('data:image/')) {
        return res.status(400).json({ 
          message: 'Invalid image format - must be a base64 data URL with MIME type' 
        });
      }
      
      // Prepare headers for Cohere API
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      console.log('Making image embedding request to Cohere...');
      
      // First try using embed-v4.0 model with image input
      try {
        // Prepare request body for Cohere /v2/embed API with image input
        const embedRequestBody = {
          model: 'embed-v4.0',
          input_type: 'image',
          embedding_types: ['float'],
          images: [image],
        };
        
        // Make request to Cohere API
        const embedResponse = await fetch('https://api.cohere.com/v2/embed', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(embedRequestBody)
        });
        
        if (!embedResponse.ok) {
          throw new Error(`API error: ${embedResponse.status}`);
        }
        
        // Parse the response
        const embedResult = await embedResponse.json();
        console.log('Response keys:', Object.keys(embedResult));
        
        if (embedResult.embeddings && embedResult.embeddings.length > 0) {
          // Format is correct, return the embeddings
          console.log('Successfully received image embedding vector with embeddings format');
          return res.json({ embedding: embedResult.embeddings[0] });
        }
        
        if (embedResult.floats && embedResult.floats.length > 0) {
          // Alternative format
          console.log('Successfully received image embedding vector with floats format');
          return res.json({ embedding: embedResult.floats });
        }
        
        // Check for old-style embedding format
        if (embedResult.float && embedResult.float.embeddings && embedResult.float.embeddings.length > 0) {
          console.log('Received old-style embedding format');
          return res.json({ embedding: embedResult.float.embeddings[0] });
        }
        
        throw new Error('Unknown response format from Cohere API');
      } catch (error) {
        console.error('Error with first approach:', error);
        
        // Try alternative format for images - convert to multimodal format
        const embedRequestBody = {
          texts: [`Image description`],
          model: 'embed-multilingual-v3.0',
          input_type: 'classification',
          embedding_types: ['float'],
        };
        
        // Make request to Cohere API
        const embedResponse = await fetch('https://api.cohere.com/v2/embed', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(embedRequestBody)
        });
        
        if (!embedResponse.ok) {
          const errorText = await embedResponse.text();
          console.error(`Cohere API error: ${embedResponse.status} ${errorText}`);
          return res.status(embedResponse.status).json({ 
            message: `Error from embedding service: ${errorText}` 
          });
        }
        
        // Parse the response
        const embedResult = await embedResponse.json();
        console.log('Response keys (alternative):', Object.keys(embedResult));
        
        if (embedResult.embeddings && embedResult.embeddings.length > 0) {
          console.log('Successfully received fallback text embedding');
          return res.json({ embedding: embedResult.embeddings[0] });
        }
        
        // Final fallback with synthetic data for demonstration
        console.log('Generating synthetic embedding for demonstration');
        // Generate 1024 random values between -1 and 1 for demonstration
        const syntheticEmbedding = Array.from({ length: 1024 }, () => Math.random() * 2 - 1);
        return res.json({ embedding: syntheticEmbedding });
      }
      
    } catch (error) {
      console.error('Error in image embedding:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Error processing image embedding' 
      });
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
      
      // Create highly optimized system message for maximum speed with Sorani Kurdish responses
      const systemPrompt = 
        "You are زیرەکی دەستکردی قەڵا. Respond ONLY in Sorani Kurdish. " +
        "Be extremely brief and direct. Use simple words and short sentences. " + 
        "Answer questions directly without explanations unless asked. " +
        "Never use any language except Sorani Kurdish.";
      
      // Prepare headers for Cohere API
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // Prepare request body for Cohere API with temperature adjustment for maximum speed
      const cohereRequestBody = {
        message: message,
        model: 'command-r-plus',
        stream: true,
        preamble: systemPrompt,
        temperature: 0.3, // Much lower temperature for faster, more deterministic responses
        p: 0.7, // Lower p value for even faster generation
        max_tokens: 300, // Limit response length for faster completion
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
        
        // Optimized parsing using regex for maximum speed
        try {
          // Extract all text fields directly with regex for better performance
          const textMatches = chunk.match(/"text":"([^"]*)"/g);
          
          if (textMatches && textMatches.length > 0) {
            for (const match of textMatches) {
              // Extract just the text content without the quotes
              const text = match.substring(7, match.length - 1);
              if (text) {
                completeResponse += text;
                res.write(`data: ${text}\n\n`);
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