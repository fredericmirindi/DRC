import React, { useState, useEffect, useRef } from 'react';
import { MapLocation, LocationType, ChatMessage } from '../types';
import { analyzeRegion } from '../services/geminiService';
import { X, Send, Bot, User, AlertTriangle, Database, Info, Loader2 } from 'lucide-react';

interface InfoPanelProps {
  location: MapLocation | null;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ location, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when location changes
  useEffect(() => {
    setMessages([]);
    setInput('');
  }, [location]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!location) return null;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await analyzeRegion(
        location.name,
        location.description,
        userMsg.text
      );

      const aiMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        role: 'model',
        text: "Sorry, I encountered an error analyzing this region. Please check your connection or API key.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    let query = "";
    switch (action) {
      case "conflict":
        query = "Are there recent armed conflicts reported in or near this area?";
        break;
      case "supply_chain":
        query = "How important is this location to the global supply chain? Are there ethical sourcing concerns?";
        break;
      case "actors":
        query = "Which companies or armed groups operate in this specific area?";
        break;
    }
    setInput(query);
    // Optional: auto-send
    // handleSend() could be called here if we moved the logic out or used a ref for input, 
    // but putting it in the input box for the user to confirm is better UX.
  };

  return (
    <div className="absolute top-0 right-0 h-full w-full md:w-96 bg-gray-900 border-l border-gray-700 shadow-2xl z-[1000] flex flex-col transition-transform duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
        <div>
          <h2 className="font-bold text-xl text-white">{location.name}</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            location.type === LocationType.CONFLICT ? 'bg-red-900 text-red-200' : 
            location.type === LocationType.MINERAL ? 'bg-yellow-900 text-yellow-200' : 'bg-gray-700 text-gray-200'
          }`}>
            {location.type} {location.mineralType ? `- ${location.mineralType}` : ''}
          </span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Static Details */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2 flex items-center gap-2">
            <Info size={16} /> Overview
          </h3>
          <p className="text-gray-200 text-sm leading-relaxed">{location.description}</p>
          
          {location.type === LocationType.CONFLICT && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-sm font-bold bg-red-900/20 p-2 rounded">
              <AlertTriangle size={16} />
              Severity: {location.severity}
            </div>
          )}
        </div>

        {/* AI Analysis Section */}
        <div className="flex flex-col h-[400px] bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-3 bg-gray-750 border-b border-gray-700 flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-400 flex items-center gap-2">
              <Bot size={16} /> Intelligence Analyst
            </span>
            <span className="text-xs text-gray-500">Gemini 2.5 Flash</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-900/50">
             {messages.length === 0 && (
               <div className="text-center mt-10 opacity-50">
                 <Database size={32} className="mx-auto mb-2 text-gray-500" />
                 <p className="text-sm text-gray-400">Ask for a live situation report.</p>
               </div>
             )}
             
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                   msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'
                 }`}>
                   {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                 </div>
                 <div className={`rounded-lg p-3 text-sm max-w-[85%] ${
                   msg.role === 'user' ? 'bg-blue-600/20 text-blue-100' : 'bg-gray-700 text-gray-100'
                 }`}>
                   <p className="whitespace-pre-wrap">{msg.text}</p>
                   {msg.isError && <AlertTriangle size={14} className="mt-2 text-red-400" />}
                 </div>
               </div>
             ))}
             
             {isLoading && (
               <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 animate-pulse">
                    <Bot size={16} />
                 </div>
                 <div className="bg-gray-700 rounded-lg p-3 flex items-center">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 0 && (
             <div className="px-3 py-2 flex gap-2 overflow-x-auto border-t border-gray-700 bg-gray-800">
               <button onClick={() => handleQuickAction('conflict')} className="whitespace-nowrap px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs text-gray-300 transition">Conflict Update</button>
               <button onClick={() => handleQuickAction('supply_chain')} className="whitespace-nowrap px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs text-gray-300 transition">Supply Chain</button>
               <button onClick={() => handleQuickAction('actors')} className="whitespace-nowrap px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs text-gray-300 transition">Key Actors</button>
             </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-gray-800 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about this region..."
                className="flex-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-gray-500"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-md transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InfoPanel;
