import React from 'react';

const PasswordStrengthBar = ({ password }) => {
  const calculateStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (pass.match(/[a-z]+/)) strength += 1;
    if (pass.match(/[A-Z]+/)) strength += 1;
    if (pass.match(/[0-9]+/)) strength += 1;
    if (pass.match(/[$@#&!]+/)) strength += 1;
    return strength;
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-red-400';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-yellow-400';
      case 4:
        return 'bg-green-400';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  const strength = calculateStrength(password);
  const percentage = (strength / 5) * 100;

  return (
    password ? (
      <div className="mt-1">
        <div className="h-1 w-full bg-gray-200 rounded-full">
          <div
            className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor(
              strength
            )}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className={`text-xs mt-1 ${strength > 2 ? 'text-green-600' : 'text-red-500'}`}>
          {getStrengthText(strength)}
        </p>
      </div>
    ) : null
  );
};

export default PasswordStrengthBar; 