import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        toast.success('Email verified successfully');
        setTimeout(() => navigate('/login'), 2000);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error verifying email');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold">Verifying your email...</h2>
          </>
        ) : (
          <h2 className="text-xl font-semibold">Redirecting to login...</h2>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail; 