import React, { useState, useEffect } from 'react';
import { BotMessageSquare, MessageCircleX, Send, CalendarClock, HandCoins, Bike, Menu } from 'lucide-react';
import './ChatBot.css';
import useWasteData from '../../hooks/useWasteData';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoadingEcoTrip, setIsLoadingEcoTrip] = useState(false);
  const [isLoadingRecycleValue, setIsLoadingRecycleValue] = useState(false);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validatedDays, setValidatedDays] = useState(null);
  const [validatedTime, setValidatedTime] = useState(null);
  const [optionSelected, setOptionSelected] = useState(false);
  const [currentContext, setCurrentContext] = useState(null);
  const [lastRecycleValue, setLastRecycleValue] = useState(null);
  const [lastSchedule, setLastSchedule] = useState(null);
  const [lastTripPlan, setLastTripPlan] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const { wasteItems, accumulatedWeights } = useWasteData();

  // Auto-scrolling to the bottom of the chat
  useEffect(() => {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [messages]);

  const initialMessages = [
    {
      text: "This assistant uses OpenAI's GPT API. Any message or image you submit will be processed by OpenAI's servers and is subject to OpenAI's Terms of Use and Privacy Policy. Do not submit personal or sensitive information.",
      isBot: true
    },
    {
      text: "Hi, my name is Kitara, your friendly neighborhood Carbon Patrol Officer!",
      isBot: true
    },
    { 
      text: "What can I do for you today?",
      options: [
        { icon: <HandCoins size={18} />, text: "Check My Current Recycling Value" },
        { icon: <CalendarClock size={18} />, text: "Plan My Recycling Schedule" },
        { icon: <Bike size={18} />, text: "Plan My Eco Trip" }
      ],
      isBot: true 
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setOptionSelected(false);
      setMessages([initialMessages[0]]);

      setTimeout(() => {
        setMessages(prev => [...prev, initialMessages[1]]);
      }, 1000);

      setTimeout(() => {
        setMessages(prev => [...prev, initialMessages[2]]);
      }, 2000);
    }
  }, [isOpen]);

  const defaultOptions = [
    { icon: <HandCoins size={18} />, text: "Check My Current Recycling Value" },
    { icon: <CalendarClock size={18} />, text: "Plan My Recycling Schedule" },
    { icon: <Bike size={18} />, text: "Plan My Eco Trip" }
  ];

  const showOptions = () => {
    setMessages(prev => [...prev, {
      text: "Here are all available options:",
      options: defaultOptions,
      isBot: true
    }]);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setOptionSelected(false);
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          navigator.geolocation.clearWatch(watchId);
          console.log('Location obtained:', position);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          navigator.geolocation.clearWatch(watchId);
          console.error('Location error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const formatTripPlan = (data) => {
    if (!data.summary) return JSON.stringify(data);
    
    // Convert markdown headings to HTML
    let formattedText = data.summary
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/^---$/gm, '<hr/>');

    formattedText = formattedText.replace(
      /(?:<li>.*<\/li>\n?)+/g,
      match => `<ul>${match}</ul>`
    );

    formattedText = formattedText.replace(
      /^(?!<[h|u|l|p])(.*$)/gm,
      '<p>$1</p>'
    );

    formattedText = formattedText.replace(/>\n+</g, '><');

    return formattedText;
  };

  // Function to calculate recycling value
  const calculateRecyclingValue = async () => {
    try {
      setIsLoadingRecycleValue(true);
      
      const filteredWasteItems = wasteItems.filter(item => item.item !== "Unrecyclable");
      
      const recyclingData = filteredWasteItems.map(item => ({
        item: item.item,
        weight: (accumulatedWeights[item.id] || 0).toFixed(2),
        weight_per_item: item.kg_per_item,
        co2_per_kg: item.kg_co2_per_kg_item
      }));

      const response = await fetch('https://carbonpatrol.top:8081/api/general_reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Instructions: You are a recycling value assessment expert. Use current market rates for recycling items in Malaysia to calculate values. Provide only final results without any calculations or formulas.

Data to analyze:
${JSON.stringify(recyclingData, null, 2)}

Kindly generate a tips about recycling and a disclaimer about using current market rates for recycling items in Malaysia.
Make both really short and concise.
Respond using this format:

# Recycling Value Assessment

Item Breakdown that shows in one line the item name, weight in kg, and their market rate in MYR in a bracket (Specify the unit of the market rate, without the word "Market Rate")

Generate the total estimated value with the line:
Total estimated value: MYR ...

Generate some short tips about recycling with the title (Tips for Recycling)

Draw a line here

Generate a short disclaimer about using current market rates for recycling items in Malaysia. 
Disclaimer: ...
`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate recycling value');
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Error calculating recycling value:', error);
      return `I apologize, but I couldn't calculate the recycling value at the moment. Please try again later.`;
    } finally {
      setIsLoadingRecycleValue(false);
    }
  };

  const validateDaysInput = async (daysInput) => {
    try {
      setIsValidating(true);
      const response = await fetch('https://carbonpatrol.top:8081/api/general_reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Validate if this is a valid days of the week format: "${daysInput}". 
          Valid formats include:
          - Single days (e.g., "Monday", "Tuesday")
          - Day ranges (e.g., "Monday to Friday", "Monday-Friday")
          - Multiple days (e.g., "Monday, Wednesday, Friday")
          - Special terms (e.g., "weekdays", "weekends", "everyday")
          - Do not need to be case sensitive.
          Respond with true or false only.`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to validate days');
      }

      const data = await response.json();
      return data.reply.toLowerCase().includes('true');
    } catch (error) {
      console.error('Error validating days:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const validateTimeInput = async (timeInput) => {
    try {
      setIsValidating(true);
      const response = await fetch('https://carbonpatrol.top:8081/api/general_reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Validate if this is a valid time format: "${timeInput}". 
          Valid formats include:
          - 12-hour format (e.g., "9 AM", "2:30 PM")
          - 24-hour format (e.g., "14:30", "09:00")
          - Time ranges (e.g., "9 AM to 5 PM", "14:00-17:00", "9-5")
          - Natural language should also be accepted.
          - Do not need to be case sensitive.
          Respond with true or false only.`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to validate time');
      }

      const data = await response.json();
      return data.reply.toLowerCase().includes('true');
    } catch (error) {
      console.error('Error validating time:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const planRecyclingSchedule = async (busyDays, busyHours) => {
    try {
      setIsLoadingSchedule(true);
      const response = await fetch('https://carbonpatrol.top:8081/api/general_reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Instructions: You are a recycling schedule planning expert. Based on the user's busy schedule, suggest the best time for them to handle their recycling consistently every week.

Data to analyze:
Busy Days: ${busyDays}
Busy Hours: ${busyHours}

Please provide a schedule recommendation using this exact format:

# Recycling Schedule Planner
**Your Free Times for Recycling:**

**Monday**: All day
**Tuesday**: Before 12 PM and after 5 PM
**Wednesday**: Before 6 PM and after 10 PM
**Thursday**: Before 6 PM and after 10 PM
**Friday**: Before 12 PM and after 5 PM
**Saturday**: All day
**Sunday**: All day

Draw a line here

**Recommended Slot:**
Saturday, 10:00-11:30 AM

Instructions: The response should follow this format exactly, but adjust the times based on the user's busy schedule. The recommended slot should be during a time when the user is completely free and should be a 1.5 hour window. Use markdown bold syntax (**) for the headings and day names.`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to plan recycling schedule');
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Error planning recycling schedule:', error);
      return `I apologize, but I couldn't plan your recycling schedule at the moment. Please try again later.`;
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  const handleOptionClick = async (option) => {
    setOptionSelected(true);
    setCurrentContext(option.text);
    setConversationHistory([]);
    
    const newMessages = [...messages, { text: option.text, isBot: false }];
    setMessages(newMessages);

    if (option.text === "Plan My Recycling Schedule") {
      setValidatedDays(null);
      setValidatedTime(null);
      setLastSchedule(null);
      
      setMessages([...newMessages, {
        text: "I'll help you plan a consistent recycling schedule!",
        isBot: true
      }]);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "Please tell me which days of the week you are usually busy?",
          isBot: true,
          expectingDays: true
        }]);
      }, 1000);
    } else if (option.text === "Check My Current Recycling Value") {
      try {
        setIsLoading(true);
        setMessages([...newMessages, {
          text: "Please wait while I analyze your recycling data...",
          isBot: true
        }]);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setMessages(prev => [...prev, {
          text: "Calculating recycling values...",
          isBot: true
        }]);

        const valueResponse = await calculateRecyclingValue();
        setLastRecycleValue(valueResponse);
        
        const formattedResponse = formatTripPlan({ summary: valueResponse });
        
        setMessages(prev => [...prev, {
          text: formattedResponse,
          isBot: true
        }, {
          text: "Do you have any other questions about your recycling value? Feel free to ask, or click the 'Options' button below to explore other features!",
          isBot: true
        }]);
      } catch (error) {
        setMessages(prev => [...prev, {
          text: formatTripPlan({ 
            summary: "# Error\n\nI apologize, but I couldn't calculate your recycling value at the moment. Please try again later." 
          }),
          isBot: true
        }]);
      } finally {
        setIsLoading(false);
      }
    } else if (option.text === "Plan My Eco Trip") {
      try {
        setIsLoadingEcoTrip(true);
        setLastTripPlan(null);
        
        // Check current permission status
        if (navigator.permissions && navigator.permissions.query) {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
          
          if (permissionStatus.state === 'granted') {
            setMessages([...newMessages, {
              text: "I see you've already granted location permission. Getting your location... Please wait a moment while I fetch the information.",
              isBot: true
            }]);
          } else {
            setMessages([...newMessages, {
              text: "I'll help you plan an eco-friendly trip! First, I need your location permission. Please allow location access when prompted.",
              isBot: true
            }]);
          }
        }

        const location = await getLocation();
        
        setMessages(prev => [...prev, {
          text: "Great! I've got your location. Please wait a moment while I plan your eco-friendly trip...",
          isBot: true
        }]);
        
        const response = await fetch('https://carbonpatrol.top:8081/api/trip_plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trip plan');
        }

        const tripData = await response.json();
        setLastTripPlan(tripData);
        
        setMessages(prev => [...prev, {
          text: `Here's your eco-friendly trip plan:\n\n${formatTripPlan(tripData)}`,
          isBot: true
        }, {
          text: "Do you have any questions about your eco-friendly trip plan? Feel free to ask, or click the 'Options' button below to explore other features!",
          isBot: true
        }]);
      } catch (error) {
        console.error('Error in handleOptionClick:', error);
        let errorMessage = "Sorry, I couldn't access your location or plan the trip. ";
        if (error.message === 'Location permission denied') {
          errorMessage += "Please enable location permissions in your browser settings.";
        } else {
          errorMessage += "Please make sure you've granted location permissions.";
        }
        setMessages(prev => [...prev, {
          text: errorMessage,
          isBot: true
        }]);
      } finally {
        setIsLoadingEcoTrip(false);
      }
    } else {
      setTimeout(() => {
        setMessages([...newMessages, {
          text: "Thank you for selecting that option! This feature will be available soon.",
          isBot: true
        }, {
          text: "Do you have any other questions about your recycling schedule? Feel free to ask, or click the 'Options' button below to explore other features!",
          isBot: true
        }]);
      }, 1000);
    }
  };

  const handleFollowUpQuestion = async (question) => {
    try {
      setIsLoading(true);

      // Get the last few exchanges from conversation history, limited to 5 for context
      const recentHistory = conversationHistory.slice(-5);
      const historyText = recentHistory.map(exchange => 
        `User: "${exchange.question}"\nAssistant: "${exchange.answer}"`
      ).join('\n');

      const response = await fetch('https://carbonpatrol.top:8081/api/general_reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Context: User is asking about ${currentContext}.
          ${currentContext === "Check My Current Recycling Value" ? `Previous recycling value data: ${lastRecycleValue}` : ''}
          ${currentContext === "Plan My Recycling Schedule" ? `Previous schedule data: ${lastSchedule}` : ''}
          ${currentContext === "Plan My Eco Trip" ? `Previous trip plan: ${lastTripPlan}` : ''}

          ${historyText ? `Previous conversation:\n${historyText}` : ''}
          User's follow-up: "${question}"

          - Do not include any titles or headers.
          - Please provide response like a human that continues the conversation naturally.
          - Keep it concise and under 2 sentences.
          - Reference the previous answer when relevant.
          - If the question is not related to the current context, suggest using the Options button to switch to the relevant feature.`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add this exchange to conversation history
      setConversationHistory(prev => [...prev, {
        question: question,
        answer: data.reply
      }]);

      return formatTripPlan({ summary: data.reply });
    } catch (error) {
      console.error('Error handling follow-up question:', error);
      return formatTripPlan({ 
        summary: "I apologize, but I'm having trouble processing your question right now. Please try again later." 
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userInput = inputMessage.trim();
    setInputMessage('');

    const newMessages = [...messages, { text: userInput, isBot: false }];
    setMessages(newMessages);
    
    const lastBotMessage = messages[messages.length - 1];
    
    if (lastBotMessage.expectingDays) {
      setIsLoading(true);
      const isValidDays = await validateDaysInput(userInput);
      
      if (isValidDays) {
        setValidatedDays(userInput);
        setMessages([...newMessages, {
          text: "Great! Now, what are your typical working or busy hours during these days?",
          isBot: true,
          expectingTime: true
        }]);
      } else {
        setMessages([...newMessages, {
          text: "Sorry, that doesn't seem to be a valid day of the week. Please specify your busy days (e.g. 'Monday to Friday', 'Weekdays', or 'Monday, Wednesday, Friday')",
          isBot: true,
          expectingDays: true
        }]);
      }
      setIsLoading(false);
    } else if (lastBotMessage.expectingTime) {
      setIsLoading(true);
      const isValidTime = await validateTimeInput(userInput);
      
      if (isValidTime) {
        setValidatedTime(userInput);
        setMessages([...newMessages, {
          text: "Thanks! Let me analyze your schedule and suggest the best time for recycling...",
          isBot: true
        }]);
        
        planRecyclingSchedule(validatedDays, userInput).then(schedule => {
          setLastSchedule(schedule);
          setMessages(prev => [...prev, {
            text: formatTripPlan({ summary: schedule }),
            isBot: true
          }, {
            text: "Do you have any questions about your recycling schedule? Feel free to ask, or click the 'Options' button below to explore other features!",
            isBot: true
          }]);
        });
      } else {
        setMessages([...newMessages, {
          text: "Sorry, that doesn't seem to be a valid time. Please specify the times that you are busy (e.g. '9 AM to 5 PM' or '14:00-17:00')",
          isBot: true,
          expectingTime: true
        }]);
      }
      setIsLoading(false);
    } else if (currentContext) {
      setIsLoading(true);
      const response = await handleFollowUpQuestion(userInput);
      setMessages([...newMessages, {
        text: response,
        isBot: true
      }]);
      setIsLoading(false);
    } else {
      setMessages([...newMessages, {
        text: formatTripPlan({ 
          summary: "# No Context Selected\n\nI'm not sure about the context of your question. Please use the Options button below to select a specific feature you'd like to discuss." 
        }),
        isBot: true
      }]);
    }
  };

  const handleScroll = (e) => {
    const chatMessages = e.target;
    setShowScrollTop(chatMessages.scrollTop > 100);
  };

  const scrollToTop = () => {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="chatbot-container">
      <button 
        className={`chat-toggle-button ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
      >
        {isOpen ? (
          <MessageCircleX size={24} />
        ) : (
          <BotMessageSquare size={30} />
        )}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Kitara</h3>
            {(isLoadingEcoTrip || isLoadingRecycleValue || isLoadingSchedule || isValidating || isLoading) && <div className="loading-spinner" />}
            {showScrollTop && (
              <button 
                className="scroll-top-button"
                onClick={scrollToTop}
                aria-label="Scroll to top"
              >
                <span className="arrow-symbol">↑</span>
              </button>
            )}
          </div>

          <div className="chat-messages" onScroll={handleScroll}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.isBot ? 'bot' : 'user'}`}
              >
                {message.text.includes('<h1>') || message.text.includes('<p>') ? (
                  <div 
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  />
                ) : (
                  message.text
                )}
                {message.options && (
                  <div className="message-options">
                    {message.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        className="option-button-chatbot"
                        onClick={() => handleOptionClick(option)}
                      >
                        <span className="option-icon">{option.icon}</span>
                        <span className="option-text">{option.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input-container">
            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={optionSelected ? "Type your message..." : "Please select an option above"}
                className="chat-input"
                disabled={!optionSelected}
              />
              <button 
                type="submit" 
                className="chat-send-button" 
                aria-label="Send message"
                disabled={!optionSelected}
              >
                <Send />
              </button>
            </form>
          </div>
          <div className="options-container">
            <button 
              className="show-options-button" 
              onClick={showOptions}
              disabled={!optionSelected}
            >
              <Menu size={14} />
              Options
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 