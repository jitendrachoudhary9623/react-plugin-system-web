import React from 'react';
import './styles.css';

interface TestPluginProps {
  message?: string;
  backgroundColor?: string;
}

const TestPlugin: React.FC<TestPluginProps> = ({
  message = 'This is a test plugin',
  backgroundColor = '#e3f2fd'
}) => {
  return (
    <div 
      className="test-plugin"
      style={{ backgroundColor }}
    >
      <div className="test-plugin-content">
        <span className="test-plugin-icon">🔌</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

// Plugin registration
export const register = (pluginManager: any) => {
  pluginManager.registerComponent('TestPlugin', TestPlugin);
};

export default TestPlugin;
