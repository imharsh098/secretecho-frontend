import parse from 'html-react-parser';
import './ChatResponse.css';

const ChatResponse = ({ response }) => {
  if (!response) return null;
  
  return (
    <div className="chat-response">
      {parse(response)}
    </div>
  );
};

export default ChatResponse; 